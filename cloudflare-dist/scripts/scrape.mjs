import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputRoot = projectRoot;
const siteRoot = new URL("https://damaria-roma.webflow.io/");

const pageQueue = [siteRoot.href];
const visitedPages = new Set();
const downloadedAssets = new Map();

const htmlExtensions = new Set([".html", ".htm"]);
const assetSelectors = [
  ["img", "src"],
  ["img", "srcset"],
  ["source", "src"],
  ["source", "srcset"],
  ["script", "src"],
  ["link", "href"],
  ["video", "src"],
  ["audio", "src"],
];

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function isHttpUrl(value) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function hasFileExtension(pathname) {
  return path.extname(pathname) !== "";
}

function normalizePagePath(url) {
  const pathname = url.pathname;
  if (pathname === "/") {
    return "/index.html";
  }

  if (pathname.endsWith("/")) {
    return `${pathname}index.html`;
  }

  if (hasFileExtension(pathname)) {
    return pathname;
  }

  return `${pathname}/index.html`;
}

function normalizeAssetPath(url, contentType = "") {
  const safeHost = url.host.replace(/[^a-zA-Z0-9.-]/g, "_");
  const pathname = url.pathname;
  const extFromPath = path.extname(pathname);
  const extFromType = contentType.includes("css")
    ? ".css"
    : contentType.includes("javascript")
      ? ".js"
      : contentType.includes("json")
        ? ".json"
        : contentType.includes("svg")
          ? ".svg"
          : contentType.includes("png")
            ? ".png"
            : contentType.includes("jpeg")
              ? ".jpg"
              : contentType.includes("webp")
                ? ".webp"
                : contentType.includes("woff2")
                  ? ".woff2"
                  : contentType.includes("woff")
                    ? ".woff"
                    : contentType.includes("ttf")
                      ? ".ttf"
                      : contentType.includes("gif")
                        ? ".gif"
                        : contentType.includes("mp4")
                          ? ".mp4"
                          : "";

  let localPath = pathname;
  if (localPath.endsWith("/")) {
    localPath += "index";
  }
  if (!path.extname(localPath) && extFromType) {
    localPath += extFromType;
  }
  if (!path.extname(localPath)) {
    localPath += ".bin";
  }

  const querySuffix = url.search
    ? `__${url.search.slice(1).replace(/[^a-zA-Z0-9.-]+/g, "_")}`
    : "";

  if (querySuffix) {
    const ext = path.extname(localPath);
    localPath = `${localPath.slice(0, -ext.length)}${querySuffix}${ext}`;
  }

  if (url.host === siteRoot.host && htmlExtensions.has(extFromPath)) {
    return localPath;
  }

  return path.posix.join("/assets", safeHost, localPath);
}

function publicUrlToFilePath(publicPath) {
  return path.join(outputRoot, publicPath.replace(/^\/+/, ""));
}

function isSameSitePage(url) {
  return url.host === siteRoot.host && !hasFileExtension(url.pathname);
}

function toAbsoluteUrl(rawValue, baseUrl) {
  if (!rawValue || rawValue.startsWith("data:") || rawValue.startsWith("blob:")) {
    return null;
  }

  if (rawValue.startsWith("#") || rawValue.startsWith("mailto:") || rawValue.startsWith("tel:") || rawValue.startsWith("javascript:")) {
    return null;
  }

  try {
    return new URL(rawValue, baseUrl);
  } catch {
    return null;
  }
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return {
    contentType: response.headers.get("content-type") || "",
    body: await response.text(),
  };
}

async function fetchBinary(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return {
    contentType: response.headers.get("content-type") || "",
    body: Buffer.from(await response.arrayBuffer()),
  };
}

function collectCssUrls(content) {
  const urls = [];
  const regex = /url\((['"]?)(.*?)\1\)/g;
  let match;
  while ((match = regex.exec(content))) {
    urls.push(match[2]);
  }
  return urls;
}

async function downloadAsset(url) {
  const cacheKey = url.href;
  if (downloadedAssets.has(cacheKey)) {
    return downloadedAssets.get(cacheKey);
  }

  const { contentType, body } = await fetchBinary(url.href);
  let publicPath = normalizeAssetPath(url, contentType);

  if (contentType.includes("text/css")) {
    const cssText = body.toString("utf8");
    const rewrittenCss = await rewriteCss(cssText, url);
    publicPath = normalizeAssetPath(url, "text/css");
    const filePath = publicUrlToFilePath(publicPath);
    await ensureDir(filePath);
    await fs.writeFile(filePath, rewrittenCss, "utf8");
    downloadedAssets.set(cacheKey, publicPath);
    return publicPath;
  }

  if (contentType.includes("javascript") || publicPath.endsWith(".js")) {
    const scriptText = body.toString("utf8");
    const chunkHashes = new Set([
      ...[...scriptText.matchAll(/:"([a-f0-9]{16})"/g)].map((match) => match[1]),
      ...[...scriptText.matchAll(/damaria-roma\.achunk\.([a-z0-9]+)\.js/g)].map((match) => match[1]),
    ]);

    for (const hash of chunkHashes) {
      await downloadAsset(new URL(`damaria-roma.achunk.${hash}.js`, url));
    }

    const filePath = publicUrlToFilePath(publicPath);
    await ensureDir(filePath);
    await fs.writeFile(filePath, scriptText, "utf8");
    downloadedAssets.set(cacheKey, publicPath);
    return publicPath;
  }

  const filePath = publicUrlToFilePath(publicPath);
  await ensureDir(filePath);
  await fs.writeFile(filePath, body);
  downloadedAssets.set(cacheKey, publicPath);
  return publicPath;
}

async function rewriteCss(cssText, baseUrl) {
  let rewritten = cssText;
  const urls = collectCssUrls(cssText);

  for (const rawValue of urls) {
    const assetUrl = toAbsoluteUrl(rawValue, baseUrl);
    if (!assetUrl) {
      continue;
    }

    const localPath = await downloadAsset(assetUrl);
    const escapedRaw = rawValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rewritten = rewritten.replace(new RegExp(`url\\((['"]?)${escapedRaw}\\1\\)`, "g"), `url("${localPath}")`);
  }

  return rewritten;
}

async function rewriteHtml(html, pageUrl) {
  const $ = cheerio.load(html, { decodeEntities: false });

  $("script").each((_, element) => {
    const src = $(element).attr("src") || "";
    const inlineContent = $(element).html() || "";

    if (src.includes("ajax.googleapis.com/ajax/libs/webfont")) {
      $(element).remove();
      return;
    }

    if (inlineContent.includes("WebFont.load(") || src.includes("pageloader.js")) {
      $(element).remove();
    }
  });

  for (const [selector, attribute] of assetSelectors) {
    $(selector).each((_, element) => {
      const value = $(element).attr(attribute);
      if (!value) {
        return;
      }

      $(element).attr(`data-pending-${attribute}`, value);
    });
  }

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    const absoluteUrl = toAbsoluteUrl(href, pageUrl);

    if (!absoluteUrl) {
      return;
    }

    if (absoluteUrl.host === siteRoot.host) {
      if (isSameSitePage(absoluteUrl)) {
        pageQueue.push(absoluteUrl.href);
      }

      const linkPath = hasFileExtension(absoluteUrl.pathname) ? absoluteUrl.pathname : absoluteUrl.pathname === "/" ? "/" : absoluteUrl.pathname.replace(/\/$/, "");
      const normalizedLink = absoluteUrl.search ? `${linkPath}${absoluteUrl.search}` : linkPath;
      $(element).attr("href", normalizedLink || "/");
    }
  });

  for (const [selector, attribute] of assetSelectors) {
    const elements = $(`${selector}[data-pending-${attribute}]`).toArray();
    for (const element of elements) {
      const originalValue = $(element).attr(`data-pending-${attribute}`);
      $(element).removeAttr(`data-pending-${attribute}`);

      if (!originalValue) {
        continue;
      }

      if (attribute === "srcset") {
        const parts = originalValue
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean);

        const rewrittenParts = [];
        for (const part of parts) {
          const [assetRef, descriptor] = part.split(/\s+/, 2);
          const absoluteUrl = toAbsoluteUrl(assetRef, pageUrl);
          if (!absoluteUrl) {
            rewrittenParts.push(part);
            continue;
          }

          const localPath = await downloadAsset(absoluteUrl);
          rewrittenParts.push(descriptor ? `${localPath} ${descriptor}` : localPath);
        }

        $(element).attr(attribute, rewrittenParts.join(", "));
        continue;
      }

      const absoluteUrl = toAbsoluteUrl(originalValue, pageUrl);
      if (!absoluteUrl) {
        continue;
      }

      const rel = ($(element).attr("rel") || "").toLowerCase();
      if (selector === "link" && (rel.includes("preconnect") || rel.includes("dns-prefetch"))) {
        $(element).remove();
        continue;
      }

      const localPath = await downloadAsset(absoluteUrl);
      $(element).attr(attribute, localPath);
      $(element).removeAttr("integrity");
      $(element).removeAttr("crossorigin");
    }
  }

  const styleNodes = $("style").toArray();
  for (const node of styleNodes) {
    const content = $(node).html();
    if (content) {
      $(node).html(await rewriteCss(content, pageUrl));
    }
  }

  const styledElements = $("[style]").toArray();
  for (const element of styledElements) {
    const styleValue = $(element).attr("style");
    if (styleValue) {
      $(element).attr("style", await rewriteCss(styleValue, pageUrl));
    }
  }

  return $.html();
}

async function savePage(url) {
  const normalizedPath = normalizePagePath(new URL(url));
  const filePath = publicUrlToFilePath(normalizedPath);
  const { body } = await fetchText(url);
  const rewritten = await rewriteHtml(body, url);
  await ensureDir(filePath);
  await fs.writeFile(filePath, rewritten, "utf8");
}

async function main() {
  while (pageQueue.length > 0) {
    const pageUrl = pageQueue.shift();
    if (!pageUrl || visitedPages.has(pageUrl)) {
      continue;
    }

    visitedPages.add(pageUrl);
    await savePage(pageUrl);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
