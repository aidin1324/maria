import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const globalPairs = [
  ["<div class=\"logosubtitle\"><em>Restaurant</em></div>", "<div class=\"logosubtitle\"><em>Fire Kitchen</em></div>"],
  ["Timeless style meets everyday function in the heart of every Italian home.", "Slow fire, generous tables, and mountain hospitality in the heart of Bishkek."],
  ["hello@nura.com", "booking@nura.kg"],
  ["nura@nura.kg", "booking@nura.kg"],
  ["jane.doe@nura.com", "hello@nura.kg"],
  ["jane.doe@nura.kg", "hello@nura.kg"],
  ["Jane.doe@nura.kg", "hello@nura.kg"],
  ["+0 996 733 0307", "+996 700 330 307"],
  ["Via del Sole 43<br>98239 Roma<br>Italy", "Erkindik Avenue 12<br>Bishkek<br>Kyrgyzstan"],
  ["<div class=\"footertitle\"><em>ADRESS</em></div>", "<div class=\"footertitle\"><em>ADDRESS</em></div>"],
  ["<div class=\"bodylarge textstylebold\">Adress</div>", "<div class=\"bodylarge textstylebold\">Address</div>"],
  ["<div class=\"bodylarge textstylebold\">MAIL</div>", "<div class=\"bodylarge textstylebold\">E-MAIL</div>"],
  ["<div class=\"bodylarge\">Bishkek<br>Kyrgyzstan</div></div></div>", "<div class=\"bodylarge\">Erkindik Avenue 12<br>Bishkek</div></div></div>"],
  ["<div class=\"bodylarge\">Bishkek<br>Kyrgyzstan</div></div>", "<div class=\"bodylarge\">booking@nura.kg</div></div>"],
  ["placeholder=\"2 Persons\"", "placeholder=\"2 Guests\""],
  ["<em>people</em>", "<em>Guests</em>"],
  ["NŪRA Olive", "Mountain Olive Medley"],
  ["NŪRA Tomato Sauce", "Talas Fire Sauce"],
  ["NŪRA Olive Oil", "Alatau Herb Oil"],
  ["NŪRA Pesto", "Green Steppe Pesto"],
  ["NŪRA Pasta", "Silk Ribbon Kesme"],
  ["Artisan Red Wine", "Nura Reserve Red"],
  ["Other Products you might like", "More from the Nura Pantry"],
  ["La Dolce Vita Daily", "The Nura Journal"],
  ["Seasons of Italy", "Seasons on the Steppe"],
  ["Tradition Meets Taste", "Fire Meets Silk Road"],
  ["The Art of Simplicity", "The Craft of Hospitality"],
  ["From Rome, With Love", "From Bishkek, With Fire"],
  [
    "NŪRA brings the soul of Rome to life through refined, seasonal cuisine, hand-selected wines, and a warm, elevated atmosphere. Discover the story and inspiration behind our approach to Italian dining.",
    "NŪRA brings Kyrgyz fire cooking into a contemporary city setting, pairing mountain produce, careful fermentation, and ember-led technique with a calm, elevated room.",
  ],
  [
    "Walking into NŪRA is like stepping into a Tuscan dream. The soft lighting, stone textures, and gentle aroma of herbs and roasted garlic transport guests straight to a countryside villa. But while the ambiance echoes Italy’s pastoral elegance, the culinary experience goes beyond nostalgia—it's elevated, intentional, and rooted in culinary heritage.",
    "Walking into NŪRA feels like entering an ember-lit courtyard after dusk: warm stone, quiet light, dried herbs, and the aroma of broth, smoke, and butter. The room nods to nomad craft without turning it into costume, keeping the experience polished, generous, and distinctly Bishkek.",
  ],
  [
    "Every plate at NŪRA tells a story—from the bustling streets of Trastevere to the vineyards of Lazio. Meet the people and places that shape our menu.",
    "Every plate at NŪRA carries the mood of Bishkek after sunset: mountain produce, ember heat, slow broth, and a style of welcome that turns dinner into an occasion.",
  ],
  [
    "At NŪRA, every detail tells a story—from the texture of handmade pasta to the flicker of candlelight on our terrazza. Rooted in Roman tradition and guided by the seasons, we craft an experience where food, wine, and hospitality come together in perfect harmony. Step inside and savor the essence of Italy.",
    "At NŪRA, every detail is designed to slow the evening down: warm light, hand-finished plates, careful pours, and a menu that translates Kyrgyz products into a refined city ritual.",
  ],
  [
    "We believe the best Italian dishes are rooted in simplicity. Learn how our chefs transform a few humble ingredients into something deeply memorable and truly Roman in spirit.",
    "The strongest dishes at NŪRA begin with restraint. See how broth, smoke, dairy, and herbs become something memorable without losing their clarity.",
  ],
  [
    "Inspired by old family recipes and Roman trattorias, our kitchen blends time-honored traditions with modern refinement. Come behind the scenes of our signature dishes.",
    "Step behind the pass to see how we adapt the Kyrgyz table for a contemporary dining room without losing its warmth or confidence.",
  ],
  [
    "More than just a meal, dining at NŪRA is a celebration of life’s little pleasures—fresh pasta, good wine, and even better company. Step into our world and savor the everyday.",
    "NŪRA is built for the pleasure of staying longer than planned: one more pour, one more plate for the table, and one more reason to keep the night moving slowly.",
  ],
  [
    "Bring a piece of Roma home — discover timeless essentials inspired by Italian tradition.",
    "Take the Nura pantry home with you: ember sauces, mountain herbs, and small-batch staples made for generous tables.",
  ],
  ["Best Products from rome", "Nura Pantry Selection"],
  ["Crafted by hand, Served With love, Eaten with joy", "Raised on the steppe, refined for the city"],
  ["Reservation", "Reservations"],
];

const filePairs = {
  "index.html": [
    ["<title>NŪRA — Restaurant & Lounge, Bishkek</title>", "<title>NŪRA — Kyrgyz Fire Kitchen & Tea Lounge</title>"],
    [
      `[data-barba="container"] {\n  opacity: 0;\n  transform: translate3d(10rem, -10rem, 0) rotate(-8deg);\n  transform-origin: 50% 0%;\n}`,
      `[data-barba="container"] {\n  opacity: 1;\n  transform: none;\n}`,
    ],
    [
      "A place where modern flavors meet timeless hospitality — crafted plates, signature cocktails, and the kind of atmosphere that turns every evening into a celebration.",
      "A Kyrgyz fire kitchen shaped for long evenings: ember-finished plates, precise pours, house ferments, and a room built for conversation.",
    ],
    [
      "easonal plates, bold flavors, and a menu that blends local taste with a modern edge. From hearty classics to creative twists, every dish is made to be shared and savored. Some flavors feel familiar, others surprise — but all of them bring people together around the table.",
      "mber-fired dishes, clear broths, handmade dough, and bright herb sauces define the Nura table. Familiar Kyrgyz comforts are refined with patience, texture, and a little ceremony.",
    ],
    [
      "e’re a team of food lovers, storytellers, and detail-obsessed dreamers who care deeply about every plate that leaves the kitchen. Behind every dish is a conversation, a memory, a moment worth sharing. We believe in warmth that goes beyond the food, in creating spaces where people slow down, connect, and feel at home.",
      "e build Nura around the Kyrgyz idea of welcome: tea poured first, bread offered warm, and every guest treated like the evening was planned for them. Our kitchen takes local products seriously and gives them the time, heat, and detail they deserve.",
    ],
    ["Bellini<br>Time", "Nomad<br>Pour"],
    ["Every Fridays &amp; Saturdays", "Every Friday &amp; Saturday"],
    ["In our signature Cocktail Lounge", "In the tea lounge &amp; ember bar"],
    ["This weeks Special", "This Week at Nura"],
    ["Ravioli ALLA nonna", "Coal-Fired Lamb Manty"],
    ["Tease special dishes, events, or limited-time items. Ravioli alla Nonna only until Thursday!", "Hand-folded manty with onion broth, browned butter, and black pepper. Served this week while the broth pot lasts."],
    ["Fresh Oysters", "Issyk-Kul Trout"],
    ["Grilled oysters with lemon-basil butter—here for a moment, remembered for a lifetime.", "Cold-smoked trout with dill oil, pickled cucumber, and green apple for a sharp, clean finish."],
    ["Hey Friends!", "From the Chef"],
    ["The seasonal ingredients are at their peak — fresh, vibrant, and bursting with flavor. That means our special menu is back and better than ever! Come hungry, leave inspired.<br>", "Spring herbs, new potatoes, and the first bright dairy of the season have arrived. We built this menu to feel generous, clean, and a little smoky.<br>"],
    ["Order<br>online", "Pantry<br>online"],
    ["Shop signature house-made goods — sauces, spice blends, oils &amp; more. Handpicked, crafted with care, delivered to your door.", "Order the Nura pantry at home: herb oil, pepper sauces, preserved fruit, and kitchen staples we rely on every night."],
    ["<div class=\"buttontext\"><em>View Menu</em></div></div><div class=\"buttontextwrapinner onhover w-variant-91c9e487-8090-9922-7935-0d94450d178c\"><div class=\"buttontext\"><em>View Menu</em></div>", "<div class=\"buttontext\"><em>Reserve Table</em></div></div><div class=\"buttontextwrapinner onhover w-variant-91c9e487-8090-9922-7935-0d94450d178c\"><div class=\"buttontext\"><em>Reserve Table</em></div>"],
    ["<div class=\"bodylarge\">Mon. Tues.Wedn.Thurs</div><div class=\"bodylarge\">06:30 - 22:00</div>", "<div class=\"bodylarge\">Sun - Thu</div><div class=\"bodylarge\">12:00 - 23:00</div>"],
  ],
  "about/index.html": [
    ["<title>About</title>", "<title>About NŪRA</title>"],
    ["<meta content=\"About\" property=\"og:title\">", "<meta content=\"About NŪRA\" property=\"og:title\">"],
    ["<meta content=\"About\" property=\"twitter:title\">", "<meta content=\"About NŪRA\" property=\"twitter:title\">"],
    ["MEET THE TEAM", "MEET NŪRA"],
    [
      "The story starts with tradition, but it does not stay there. Rooted in Roman warmth and shaped by a more current point of view, the restaurant carries that familiar feeling of long tables, shared plates, and recipes that live more in instinct than on paper. You feel it in the room, in the pace of the evening, in the way food, wine, and conversation are all given equal importance.",
      "Nura starts with the Kyrgyz table: tea poured with intention, bread torn to share, and food that carries both memory and precision. We keep the generosity of the dastorkon, then sharpen it with contemporary technique and cleaner plating.",
    ],
    [
      "What began around the table grew into something bigger — not a formal dining ritual, but a place people return to for the atmosphere as much as the food. Seasonal ingredients, classic foundations, and a little more edge in the way everything comes together. Familiar, but never flat. Polished, but never stiff. The kind of place made for settling in, ordering another bottle, and letting the night unfold at its own pace.",
      "What grew from that instinct became a city restaurant for people who want both warmth and craft. Mountain dairy, smoke, herbs, broth, grain, fruit, and careful fire all show up here. The result is polished without feeling distant and memorable without becoming theatrical.",
    ],
    ["Get to know us", "Meet the house"],
    ["Who <br>Are We", "Our <br>People"],
    ["Who Are We", "Our People"],
    ["Maria", "Aizada"],
    ["Manager", "General Manager"],
    ["Carlo", "Emir"],
    ["Sous-Chef", "Head of Fire Kitchen"],
    ["Antonietta", "Nurai"],
    ["Cheffes de Partie", "Pastry Chef"],
    ["Paolo", "Temir"],
    ["Cheffes de Partie.", "Beverage Director"],
    ["Side note", "House Notes"],
    ["Fun Facts", "Steppe Notes"],
    [
      "In Italian tradition, spaghetti is never cut with a knife—twirling only, please! Cutting it is considered a culinary crime by most Nonnas.",
      "A Kyrgyz dastorkon is measured by generosity: the tea is poured before the main course arrives, bread is shared first, and guests are encouraged to linger.",
    ],
    [
      "The average Italian consumes over 25kg of pasta a year—enough to circle the Colosseum more than once! ",
      "Many Nura dishes are built around small-batch products from local makers, which is why some specials disappear the moment the best ingredients do.",
    ],
    ["What we do", "What guides us"],
    [
      "We believe pasta is poetry in edible form. Our philosophy is simple: to create delicious, hearifalt dishes that celebrate the rich củinary heritage of Italy.",
      "We believe hospitality should feel generous, precise, and deeply local. Our philosophy is to take Kyrgyz ingredients seriously and let technique serve flavor, not the other way around.",
    ],
    [
      "We believe pasta is poetry in edible form.Our philosophy is simple: to create delicious, hearifalt dishes that celebrate the rich củinary heritage of Italy.",
      "We work with smoke, broth, cultured dairy, grain, and herbs to make food that feels grounded in place but alive in the present.",
    ],
    ["Games", "Table Game"],
    ["PASTA Game", "NOMAD GRID"],
    ["Simply click the words &nbsp;and show the results in the restaurant. You will get a free pizza", "Find the hidden pantry words and show the completed grid to the host for a complimentary tea pairing."],
  ],
  "menu/index.html": [
    ["<title>Menu</title>", "<title>NŪRA Menu</title>"],
    ["<meta content=\"Menu\" property=\"og:title\">", "<meta content=\"NŪRA Menu\" property=\"og:title\">"],
    ["<meta content=\"Menu\" property=\"twitter:title\">", "<meta content=\"NŪRA Menu\" property=\"twitter:title\">"],
    ["Crafted by hand, Served With love, Eaten with joy", "From broth to ember, every course is cooked with patience"],
    ["Antipasti", "Opening Plates"],
    ["Carpaccio di Zucchine", "Juniper Beet Carpaccio"],
    ["Thinly sliced zucchini marinated in lemon oil, topped with shaved Parmesan and toasted almonds", "Charred beet ribbons with whipped kaymak, apricot vinegar, toasted walnut, and dill ash"],
    ["Melanzane al Forno", "Smoked Eggplant Salsa"],
    ["Baked eggplant with tomato sauce, buffalo mozzarella, and fresh basil", "Silky eggplant with roasted pepper, cultured cream, coriander seed, and warm flatbread"],
    ["Polpette della Nonna<br>", "Coal Lamb Meatballs<br>"],
    ["Homemade meatballs in a rich tomato sauce, finished with Pecorino cheese", "Hand-rolled lamb meatballs glazed in pepper broth with sheep cheese and mountain herbs"],
    ["Fresh from<br>the sea", "Lake &amp;<br>Ember"],
    ["Surf &amp;&nbsp;Turf", "Issyk-Kul &amp;&nbsp;Ember Beef"],
    ["Tender beef fillet paired with grilled king prawns – served with garlic butter, lemon oil, and house-baked focaccia", "Beef tenderloin with smoked trout medallions, fermented butter, green plum glaze, and crisp hearth bread"],
    ["Main Course", "Signature Plates"],
    ["Tagliatelle al Limone<br>", "Kesme with Burnt Butter<br>"],
    ["Fresh tagliatelle with lemon butter, ricotta cheese, and cracked black pepper<br>", "Hand-cut ribbon dough finished with burnt butter, whipped kaymak, charred lemon, and black pepper<br>"],
    ["Brasato di Manzo<br>", "Night-Braised Beef<br>"],
    ["Slow-braised beef in red wine sauce served with creamy rosemary polenta<br>", "Slow braised beef over barley cream with roasted onion, thyme, and glossy lamb jus<br>"],
    ["Risotto ai Frutti di Mare<br>", "Creamed Wheat with Lake Fish<br>"],
    ["Creamy risotto with mussels, shrimp, and calamari in a white wine broth<br>", "Toasted wheat simmered in fish broth with trout, dill oil, mussels, and preserved lemon<br>"],
    ["Menu of the week", "This Week at Nura"],
    ["Sapori d’Estate<br>", "High Meadow Harvest<br>"],
    ["A summer-inspired menu full of fresh, light flavors. Mediterranean ingredients meet classic Italian comfort.<br>", "A bright seasonal set built around herbs, early roots, cultured cream, and clean wood fire.<br>"],
    ["Tradizione Italiana<br>", "Nomad Supper Sequence<br>"],
    ["A weekly rotating selection based on grandma’s favorite recipes. Hearty, traditional, and full of flavor.<br>", "A rotating supper built from broth, grilled dough, and slow meats that honour the Kyrgyz table.<br>"],
    ["Choose your pasta", "Choose your dough"],
    ["Rigatoni", "Kesme ribbons"],
    ["Spagehtti", "Lagman cut"],
    ["Farfalle", "Hearth folds"],
    ["Grilled bread rubbed with garlic and toppedwith sun-kissed tomatoes, basil, and olive oil", "Choose the shape our kitchen pairs with smoked butter, lamb jus, or green herb sauce."],
    ["Aperetivi", "Tea &amp; Aperitif"],
    ["Negroni", "Archa Highball"],
    ["Bitter, bold, and timeless – gin, vermouth rosso, and Campari", "Juniper-forward highball with dry tonic, alpine herbs, and citrus oil"],
    ["Americano<br>", "Black Tea Americano<br>"],
    ["A light and bubbly mix of Campari, sweet vermouth, and soda", "Cold black tea, bitters, vermouth blend, and soda for a dry, fragrant lift"],
    ["Spritz al Rosmarino<br>", "Apricot Fizz<br>"],
    ["White vermouth, rosemary syrup, soda – crisp and herbal", "Apricot aperitif, sparkling wine, and soda with a soft herbal finish"],
    ["Cynar Spritz<br>", "Honey Kumis Cooler<br>"],
    ["Artichoke-based amaro with prosecco and orange zest<br>", "Honey, cultured milk cordial, and sparkling citrus served cold and bright<br>"],
    ["Limoncello Tonic<br>", "Mint Ayran Fizz<br>"],
    ["Sweet Limoncello, tonic water, and fresh mint<br>", "Salted ayran, mint, lime, and tonic for a savory-refreshing finish<br>"],
    ["Dolci", "Sweet Finish"],
    ["Tiramisù Classico", "Honey Chak-Chak Cloud"],
    ["Traditional tiramisu with mascarpone cream, espresso, and dusted cocoa<br>", "Crisp honey pastry with whipped cream, toasted seeds, and mountain flower honey<br>"],
    ["Panna Cotta al Limoncello<br>", "Burnt Milk Custard<br>"],
    ["Silky panna cotta infused with Limoncello and topped with candied lemon peel<br>", "Set cream custard with apricot preserve, caramelized milk, and a pinch of sea salt<br>"],
    ["Cocktails", "Signature Drinks"],
    ["Basilico Gin Fizz", "Smoked Plum Sour"],
    ["Gin, fresh basil, lemon juice, and soda – refreshing with a twist", "Smoked plum, gin, citrus, and foam with a deep fruit finish"],
    ["Amaretto Sour<br>", "Apricot Sary Sour<br>"],
    ["Almond liqueur, lemon juice, and a touch of egg white foam", "Apricot kernel liqueur, lemon, and silky foam with soft nutty depth"],
    ["Citrus Martini<br>", "Steppe Citrus Martini<br>"],
    ["Vodka, triple sec, and citrus peel – sharp and elegant", "Vodka, citrus distillate, and dried tarragon for a clean, lifted martini"],
    ["Peach Negroni<br>", "Cherry Tea Nightcap<br>"],
    ["Classic Negroni with a mellow peach liqueur upgrade<br>", "Cherry-infused bitter blend with black tea and orange peel<br>"],
    ["Espresso Martini<br>", "Coffee &amp; Cardamom Martini<br>"],
    ["Vodka, coffee liqueur, and fresh espresso – bold and creamy", "Espresso, vodka, cardamom, and coffee liqueur shaken until glossy"],
    [">12€<", ">890 сом<"],
    [">4€<", ">420 сом<"],
  ],
  "shop/index.html": [
    ["<title>Shop</title>", "<title>NŪRA Pantry</title>"],
    ["<meta content=\"Shop\" property=\"og:title\">", "<meta content=\"NŪRA Pantry\" property=\"og:title\">"],
    ["<meta content=\"Shop\" property=\"twitter:title\">", "<meta content=\"NŪRA Pantry\" property=\"twitter:title\">"],
    [
      "Timeless style meets everyday function in the heart of our curated collection — where rustic Italian charm blends with practical elegance.",
      "Small-batch pantry staples from the Nura kitchen: bold, practical, and built for generous meals at home.",
    ],
  ],
  "articles/index.html": [
    ["<title>Articles</title>", "<title>NŪRA Journal</title>"],
    ["<meta content=\"Articles\" property=\"og:title\">", "<meta content=\"NŪRA Journal\" property=\"og:title\">"],
    ["<meta content=\"Articles\" property=\"twitter:title\">", "<meta content=\"NŪRA Journal\" property=\"twitter:title\">"],
  ],
  "restaurant/index.html": [
    ["<title>Restaurant</title>", "<title>NŪRA Interior</title>"],
    ["<meta content=\"Restaurant\" property=\"og:title\">", "<meta content=\"NŪRA Interior\" property=\"og:title\">"],
    ["<meta content=\"Restaurant\" property=\"twitter:title\">", "<meta content=\"NŪRA Interior\" property=\"twitter:title\">"],
    ["Inside<br>", "Inside<br>"],
    ["VIEWS<br>", "NŪRA<br>"],
  ],
  "reservation/index.html": [
    ["<title>Reservation</title>", "<title>Reserve at NŪRA</title>"],
    ["<meta content=\"Reservation\" property=\"og:title\">", "<meta content=\"Reserve at NŪRA\" property=\"og:title\">"],
    ["<meta content=\"Reservation\" property=\"twitter:title\">", "<meta content=\"Reserve at NŪRA\" property=\"twitter:title\">"],
    [
      "Reserve your table and experience the warmth of Italian hospitality. Whether it’s a romantic dinner or a gathering with friends, we’ll make sure your time with us is unforgettable. Book easily online and let us take care of the rest.",
      "Reserve your table and settle into an evening of fire-led cooking, quiet service, and a room designed for lingering. Whether it is a date night or a full table of friends, we will pace the night with care.",
    ],
  ],
  "product/artisan-red-wine/index.html": [
    [
      "A refined, full-bodied red wine crafted in small batches. Perfect for pairing with Italian dishes or enjoying on its own. Comes in elegant, minimalistic packaging.",
      "A velvety house red with dark cherry, dried spice, and enough structure for lamb, broth, and charcoal-fired dishes.",
    ],
  ],
  "product/rigatoni-pasta/index.html": [
    ["Authentic Italian rigatoni made from durum wheat semolina. Its ridged texture is perfect for holding sauces, making it a hearty and satisfying choice for any pasta dish.", "Hand-cut ribbon dough inspired by kesme, made for rich broths, browned butter, and slow-cooked lamb ragout."],
  ],
  "product/da-maria-tomato-sauce/index.html": [
    ["Freshly made with tomatoes, arugula, and premium ingredients, this pesto brings bold, herby flavors to your pasta, sandwiches, or dips. Packed in a charming jar for freshness.", "A deep red pepper and tomato simmer brightened with cumin, coriander, and gentle smoke. Spoon it over grilled meat, eggs, or bread."],
  ],
};

const productSpecificPairs = [
  ["A savory jar of premium olives selected for aperitivo hour and layered with bright citrus and herbs.", "Whole green olives preserved with coriander seed, citrus peel, and wild mountain oregano."],
  ["Cold-pressed extra virgin olive oil with a smooth finish and elegant peppery lift.", "A finishing oil infused with dill, tarragon, and gentle garlic for grilled vegetables and warm bread."],
  ["Fresh basil pesto blended into a bright green pantry staple for pasta, toast, and roasted vegetables.", "A vivid herb sauce of dill, parsley, pumpkin seed, and cultured cheese for noodles, trout, and potatoes."],
  ["Deep ruby wine with soft tannin and a warm, berry-led finish, chosen to pair with slow meats and open-fire dishes.", "A velvety house red with dark cherry, dried spice, and enough grip for lamb, broth, and char."],
];

const newsBodyRegexReplacements = [
  {
    file: /^news\/.+\/index\.html$/,
    regex: /NŪRA brings Kyrgyz fire cooking into a contemporary city setting, pairing mountain produce, careful fermentation, and ember-led technique with a calm, elevated room\./g,
    value: "NŪRA cooks with the rhythm of a Bishkek evening: broth reducing slowly, embers held steady, bread warming at the edge of the fire, and a room that encourages people to stay for one more round of tea.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /“Italian food is not just about recipes—it’s about emotion, memory, and time\. At NŪRA, we honor that spirit every day\.”<br>— Executive Chef Luca Marinelli/g,
    value: "“We cook to create calm, not noise. Smoke, broth, acid, and time do most of the work.”<br>— Executive Chef Aibek Sadykov",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /At the heart of our menu is a philosophy of <em>stagionalità<\/em>—seasonality\. Much like the farmers and home cooks of Tuscany, we build our dishes around the freshest produce, harvested at its peak\. Our menus shift slightly with the seasons, but you’ll always find:/g,
    value: "At the heart of our menu is a respect for seasonality. We build around what Kyrgyz growers, herders, fishers, and foragers can offer at their absolute best, so the menu changes as the air and markets change. You will often find:",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Heirloom tomatoes from local farms in our caprese and sauces/g,
    value: "early tomatoes and peppers folded into slow ember sauces",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Forest mushrooms and truffle oil in autumnal risottos/g,
    value: "wild mushrooms and browned butter in autumn grain dishes",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Fresh-caught Mediterranean sea bass served simply with olive oil and lemon/g,
    value: "cold-water trout served with dill oil, preserved lemon, and char",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Every ingredient is treated with respect\. We don’t mask or overwhelm—we enhance\./g,
    value: "Every ingredient is treated with precision. We season to reveal, not to hide.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Pappardelle al Cinghiale<\/strong> – Hand-cut wide pasta with wild boar ragu, simmered for hours in Chianti and herbs/g,
    value: "Coal-Fired Lamb Manty</strong> – Hand-folded dumplings with onion broth, browned butter, and black pepper",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Bistecca Fiorentina<\/strong> – A 40oz Tuscan-style porterhouse, grilled over wood coals and carved tableside/g,
    value: "Issyk-Kul Trout on Embers</strong> – Cold-water trout brushed with dill oil, grilled over wood coals, and finished with pickled apple",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Crespelle alla Fiorentina<\/strong> – Spinach and ricotta-stuffed crêpes in a delicate béchamel and San Marzano tomato sauce/g,
    value: "Kesme with Burnt Butter</strong> – Hand-cut ribbon dough finished with whipped kaymak, charred lemon, and browned butter",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Our wine cellar is a carefully curated collection of Italian gems, featuring both legendary vineyards and small, biodynamic producers\. Our sommelier is passionate about pairing each course with a pour that enhances its depth and character\./g,
    value: "Our beverage program is built around calm, thoughtful pairings: structured reds for lamb, bright whites for fish, and tea service that can carry a full meal with quiet confidence.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /“Wine is how Italy speaks\. Each glass tells a story of the soil, the family who made it, and the hands that harvested the grapes\.”<br>— Sommelier Giulia Mancini/g,
    value: "“A pairing should sharpen the plate, not compete with it. We pour to extend the dish, not overshadow it.”<br>— Beverage Director Temir Abdyldaev",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Guests can opt for a classic wine pairing or explore regional flights featuring varietals from Tuscany, Piedmont, and Puglia\./g,
    value: "Guests can choose between curated wine pours, zero-proof pairings, and tea flights built from black tea, herbs, and fruit preserves.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Hospitality, the Italian Way/g,
    value: "Hospitality, the Nura Way",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Dining at NŪRA isn’t rushed\. Tables aren’t turned\. Every guest is invited to stay, savor, and enjoy the simple luxury of time\. Our staff is trained not just in service, but in warmth—because the Italian way is not just about what’s on the plate, but how it’s shared\./g,
    value: "Dining at NŪRA is never rushed. Guests are invited to stay, share, and let the evening unfold naturally. Service here is measured by timing, warmth, and the feeling that the table belongs to you for the night.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Authenticity Without Pretense<\/strong> – Honest food made with elegance\./g,
    value: "Depth Without Noise</strong> – Food that tastes complete, not overworked.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /An Atmosphere That Feels Like Home<\/strong> – Cozy, elevated, welcoming\./g,
    value: "A Room Worth Staying In</strong> – Warm, composed, and quietly confident.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /A Commitment to Craft<\/strong> – From pasta to pastry, everything is made with care\./g,
    value: "A Serious Pantry</strong> – Broths, doughs, ferments, and sauces made with patience.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Local, Seasonal Ingredients<\/strong> – We support nearby farmers and purveyors\./g,
    value: "Seasonal Ingredients<\/strong> – We cook to the market, not to a static script.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /A Celebration of Italian Culture<\/strong> – Not just food—an experience\./g,
    value: "A Clear Point of View<\/strong> – Distinctly Kyrgyz, polished for a modern dining room.",
  },
  {
    file: /^news\/.+\/index\.html$/,
    regex: /Whether you’re Italian-born or a first-time explorer of roman cuisine, NŪRA is a place to celebrate life, one delicious moment at a time\./g,
    value: "Whether you arrive for a quick dinner or a long celebration, NŪRA is built to leave you slower, warmer, and ready for one more course.",
  },
];

async function listHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "cloudflare-dist" || entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

function applyPairs(content, pairs) {
  let next = content;
  for (const [from, to] of pairs) {
    next = next.replaceAll(from, to);
  }
  return next;
}

function applyRegexes(relativePath, content) {
  let next = content;
  for (const { file, regex, value } of newsBodyRegexReplacements) {
    if (file.test(relativePath)) {
      next = next.replace(regex, value);
    }
  }
  return next;
}

function rewriteAboutGameBlock(content) {
  const gameRegex = /<div class="gamewrap">[\s\S]*?<\/div><\/div><\/div><\/div><\/div><\/div><\/div><\/div><div class="section">/;
  const replacement = `<div class="gamewrap"><div class="gamewrapline"><div class="squarewrap"><div class="square"></div><div>K</div></div><div class="squarewrap"><div class="square"></div><div>U</div></div><div class="squarewrap"><div class="square"></div><div>R</div></div><div class="squarewrap"><div class="square"></div><div>U</div></div><div class="squarewrap"><div class="square"></div><div>T</div></div><div class="squarewrap"><div class="square"></div><div>C</div></div><div class="squarewrap"><div class="square"></div><div>H</div></div><div class="squarewrap"><div class="square"></div><div>I</div></div></div><div class="gamewrapline"><div class="squarewrap"><div class="square"></div><div>K</div></div><div class="squarewrap"><div class="square"></div><div>A</div></div><div class="squarewrap"><div class="square"></div><div>Y</div></div><div class="squarewrap"><div class="square"></div><div>M</div></div><div class="squarewrap"><div class="square"></div><div>A</div></div><div class="squarewrap"><div class="square"></div><div>K</div></div><div class="squarewrap"><div class="square"></div><div>T</div></div><div class="squarewrap"><div class="square"></div><div>E</div></div></div><div class="gamewrapline"><div class="squarewrap"><div class="square"></div><div>S</div></div><div class="squarewrap"><div class="square"></div><div>H</div></div><div class="squarewrap"><div class="square"></div><div>O</div></div><div class="squarewrap"><div class="square"></div><div>R</div></div><div class="squarewrap"><div class="square"></div><div>P</div></div><div class="squarewrap"><div class="square"></div><div>O</div></div><div class="squarewrap"><div class="square"></div><div>D</div></div><div class="squarewrap"><div class="square"></div><div>Y</div></div></div><div class="gamewrapline"><div class="squarewrap"><div class="square"></div><div>B</div></div><div class="squarewrap"><div class="square"></div><div>O</div></div><div class="squarewrap"><div class="square"></div><div>R</div></div><div class="squarewrap"><div class="square"></div><div>S</div></div><div class="squarewrap"><div class="square"></div><div>O</div></div><div class="squarewrap"><div class="square"></div><div>K</div></div><div class="squarewrap"><div class="square"></div><div>C</div></div><div class="squarewrap"><div class="square"></div><div>H</div></div></div><div class="gamewrapline"><div class="squarewrap"><div class="square"></div><div>A</div></div><div class="squarewrap"><div class="square"></div><div>L</div></div><div class="squarewrap"><div class="square"></div><div>M</div></div><div class="squarewrap"><div class="square"></div><div>A</div></div><div class="squarewrap"><div class="square"></div><div>J</div></div><div class="squarewrap"><div class="square"></div><div>A</div></div><div class="squarewrap"><div class="square"></div><div>M</div></div><div class="squarewrap"><div class="square"></div><div>B</div></div></div><div class="gamewrapline"><div class="squarewrap"><div class="square"></div><div>A</div></div><div class="squarewrap"><div class="square"></div><div>R</div></div><div class="squarewrap"><div class="square"></div><div>C</div></div><div class="squarewrap"><div class="square"></div><div>H</div></div><div class="squarewrap"><div class="square"></div><div>A</div></div><div class="squarewrap"><div class="square"></div><div>T</div></div><div class="squarewrap"><div class="square"></div><div>E</div></div><div class="squarewrap"><div class="square"></div><div>A</div></div></div><div class="gamewrapline"><div class="squarewrap"><div class="square"></div><div>N</div></div><div class="squarewrap"><div class="square"></div><div>O</div></div><div class="squarewrap"><div class="square"></div><div>M</div></div><div class="squarewrap"><div class="square"></div><div>A</div></div><div class="squarewrap"><div class="square"></div><div>D</div></div><div class="squarewrap"><div class="square"></div><div>B</div></div><div class="squarewrap"><div class="square"></div><div>R</div></div><div class="squarewrap"><div class="square"></div><div>O</div></div></div><div class="gamewrapline strokebottom"><div class="squarewrap"><div class="square"></div><div>Y</div></div><div class="squarewrap"><div class="square"></div><div>U</div></div><div class="squarewrap"><div class="square"></div><div>R</div></div><div class="squarewrap"><div class="square"></div><div>T</div></div><div class="squarewrap"><div class="square"></div><div>F</div></div><div class="squarewrap"><div class="square"></div><div>I</div></div><div class="squarewrap"><div class="square"></div><div>R</div></div><div class="squarewrap"><div class="square"></div><div>E</div></div></div></div></div></div></div></div></div></div></div><div class="section">`;
  return content.replace(gameRegex, replacement);
}

async function main() {
  const htmlFiles = await listHtmlFiles(repoRoot);

  for (const filePath of htmlFiles) {
    const relativePath = path.relative(repoRoot, filePath);
    let content = await fs.readFile(filePath, "utf8");

    content = applyPairs(content, globalPairs);

    if (filePairs[relativePath]) {
      content = applyPairs(content, filePairs[relativePath]);
    }

    if (relativePath === "about/index.html") {
      content = rewriteAboutGameBlock(content);
    }

    if (relativePath.startsWith("product/")) {
      content = applyPairs(content, productSpecificPairs);
    }

    content = applyRegexes(relativePath, content);

    await fs.writeFile(filePath, content, "utf8");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
