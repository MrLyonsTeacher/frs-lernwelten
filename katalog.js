// FRS Lernwelten – Katalog aller Lernwelten.
// Hier steht, welche Klasseninseln, Bereiche und Themen es gibt.
// Neues Thema: Eintrag bei der passenden Klasse unter "themen" ergänzen (Claude übernimmt das normalerweise).
//
// Thema:  id (kurz, ohne Bindestrich/Punkt), kat (Bereich), titel, untertitel, pfad (ab Hauptordner), icon, max (Höchstpunktzahl)
//   grp:"test" = Testvorbereitung: eigener Abschnitt unter den Flaggen-Spielen, KEINE Flaggen, nicht im Ergebnis-Code (siehe englisch/welt.html)
// Material (Sport/Sonstiges): id, titel, info, pfad, stationen, stationenMax

const FRS = {
  name: "FRS Lernwelten",

  // Bereiche auf den Englisch-Inseln
  kategorien: {
    grammar:    { name:"Grammar",          de:"Grammatik",             icon:"🏰", ort:"Grammar Castle" },
    vocabulary: { name:"Vocabulary",       de:"Wortschatz",            icon:"🌳", ort:"Word Woods" },
    reading:    { name:"Reading",          de:"Lesen",                 icon:"📖", ort:"Reading Lighthouse" },
    listening:  { name:"Listening",        de:"Hören",                 icon:"🎧", ort:"Echo Falls" },
    writing:    { name:"Writing",          de:"Schreiben",             icon:"✏️", ort:"Pencil Peak" },
    speaking:   { name:"Speaking",         de:"Sprechen",              icon:"🎤", ort:"Speakers’ Stage" },
    country:    { name:"Country & people", de:"Land & Leute",          icon:"⚓", ort:"Culture Harbour" },
    exam:       { name:"Exam Prep",        de:"Prüfungsvorbereitung",  icon:"🏆", ort:"Exam Summit" },
    lesson:     { name:"Lesson Path",      de:"Lernpfad",              icon:"🧭", ort:"Lava Trail", nurFreigabe:true }   // geführte Stunden (z. B. Vertretung): nur sichtbar, wenn per 🔑-Freigabe geöffnet
  },
  // Zurzeit aktive Bereiche (weitere wie Reading, Listening … lassen sich später wieder einschalten)
  grundBereiche: ["grammar","vocabulary","country"],

  // Welt je Klasse (3D-Klötzchenwelt in lernwelt/welten/<file>.js)
  welten: {
    5:  { file:"feuer",  name:"Fire Island",   icon:"🔥", theme:"feuer" },
    6:  { file:"wasser", name:"Water World",  icon:"🌊", theme:"wasser" },
    7:  { file:"stein",  name:"Dwarven Caves",  icon:"⛏️", theme:"stein" },
    8:  { file:"himmel", name:"Sky Empire",   icon:"☁️", theme:"himmel" },
    9:  { file:"wald",   name:"Woodlands", icon:"🌿", theme:"wald" },
    10: { file:"eis",    name:"Ice Citadel",    icon:"❄️", theme:"eis" }
  },

  englisch: {
    klassen: [
      { k:5,  id:"e5",  themen:[
        { id:"be5", kat:"grammar", titel:"Volcano Hello", untertitel:"to be: am, is, are", pfad:"englisch/klasse5/to-be.html", icon:"👋", max:50 },
        { id:"imp5", kat:"grammar", titel:"Lava Lab Rules", untertitel:"Imperative", pfad:"englisch/klasse5/imperative.html", icon:"🧪", max:41 },
        { id:"spr5", kat:"grammar", titel:"Dragon Days", untertitel:"Simple present · word order", pfad:"englisch/klasse5/simple-present.html", icon:"🐉", max:54 },
        { id:"spq5", kat:"grammar", titel:"Dragon Questions", untertitel:"don’t, doesn’t, Do, Does", pfad:"englisch/klasse5/dont-doesnt.html", icon:"🔥", max:44 },
        { id:"past5", kat:"grammar", titel:"Time Travel Volcano", untertitel:"Simple past · was/were", pfad:"englisch/klasse5/simple-past.html", icon:"⏳", max:59 },
        { id:"pastq5", kat:"grammar", titel:"Ember Detectives", untertitel:"Simple past: didn’t, Did …?", pfad:"englisch/klasse5/simple-past-negatives.html", icon:"🔎", max:56 },
        { id:"word5", kat:"grammar", titel:"The Word Forge", untertitel:"Plurals, ’s, a/an, I–me–my", pfad:"englisch/klasse5/word-workshop.html", icon:"⚒️", max:46 },
        { id:"vin5", kat:"vocabulary", titel:"Intro Course Words", untertitel:"Numbers, animals, days, months, school, body", pfad:"englisch/klasse5/intro-words.html", icon:"🌋", max:185 },
        { id:"dia5", kat:"vocabulary", titel:"Intro Course Dialogues", untertitel:"Hello, how are you? · Can I …, please?", pfad:"englisch/klasse5/classroom-dialogues.html", icon:"💬", max:69 },
        { id:"vu1", kat:"vocabulary", titel:"Unit 1 Words", untertitel:"Family, colours, my room", pfad:"englisch/klasse5/words-unit1.html", icon:"🏠", max:49 },
        { id:"vu2", kat:"vocabulary", titel:"Unit 2 Words", untertitel:"School things, subjects, days", pfad:"englisch/klasse5/words-unit2.html", icon:"🎒", max:49 },
        { id:"vu3", kat:"vocabulary", titel:"Unit 3 Words", untertitel:"Animals, time, free time", pfad:"englisch/klasse5/words-unit3.html", icon:"🐒", max:49 },
        { id:"vu4", kat:"vocabulary", titel:"Unit 4 Words", untertitel:"Months, birthdays, food, shopping", pfad:"englisch/klasse5/words-unit4.html", icon:"🎂", max:47 },
        { id:"v5t0", kat:"vocabulary", titel:"Vocab Trainer: Welcome", untertitel:"Mock Test", grp:"test", pfad:"englisch/klasse5/vokabeltrainer.html?u=0", icon:"👋", max:40 },
        { id:"v5t1", kat:"vocabulary", titel:"Vocab Trainer: Unit 1", untertitel:"I’m from Greenwich · Mock Test", grp:"test", pfad:"englisch/klasse5/vokabeltrainer.html?u=1", icon:"🏠", max:40 },
        { id:"v5t2", kat:"vocabulary", titel:"Vocab Trainer: Unit 2", untertitel:"This is my school · Mock Test", grp:"test", pfad:"englisch/klasse5/vokabeltrainer.html?u=2", icon:"🎒", max:40 },
        { id:"v5t3", kat:"vocabulary", titel:"Vocab Trainer: Unit 3", untertitel:"My free time · Mock Test", grp:"test", pfad:"englisch/klasse5/vokabeltrainer.html?u=3", icon:"🦒", max:40 },
        { id:"v5t4", kat:"vocabulary", titel:"Vocab Trainer: Unit 4", untertitel:"Let’s celebrate! · Mock Test", grp:"test", pfad:"englisch/klasse5/vokabeltrainer.html?u=4", icon:"🎂", max:40 },
        { id:"v5t5", kat:"vocabulary", titel:"Vocab Trainer: Unit 5", untertitel:"Where I live · Mock Test", grp:"test", pfad:"englisch/klasse5/vokabeltrainer.html?u=5", icon:"🚆", max:40 },
        { id:"v5t6", kat:"vocabulary", titel:"Vocab Trainer: Unit 6", untertitel:"A trip to the country · Mock Test", grp:"test", pfad:"englisch/klasse5/vokabeltrainer.html?u=6", icon:"🚜", max:40 },
        { id:"v5t7", kat:"vocabulary", titel:"Vocab Trainer: Irregular verbs", untertitel:"Past forms · Mock Test", grp:"test", pfad:"englisch/klasse5/vokabeltrainer.html?u=7", icon:"🔀", max:32 },
        { id:"v5t8", kat:"vocabulary", titel:"Vocab Trainer: Classroom phrases", untertitel:"Useful phrases · Mock Test", grp:"test", pfad:"englisch/klasse5/vokabeltrainer.html?u=8", icon:"🗣️", max:40 },
        { id:"gre5", kat:"country", titel:"Hello Greenwich!", untertitel:"Greenwich, London & the UK", pfad:"englisch/klasse5/greenwich-london.html", icon:"🕰️", max:29 },
        { id:"sch5", kat:"country", titel:"School in England", untertitel:"Uniforms, tutor groups, school days", pfad:"englisch/klasse5/school-in-england.html", icon:"👔", max:38 },
        { id:"fest5", kat:"country", titel:"Special Days in Britain", untertitel:"Halloween, Bonfire Night, Christmas", pfad:"englisch/klasse5/special-days.html", icon:"🎃", max:39 },
        { id:"pf5u1", kat:"lesson", titel:"Unit 1: Let’s start!", untertitel:"Zoom in & Way in · book p. 10–13", pfad:"englisch/klasse5/lernpfad-unit1.html", icon:"🧭", max:158 },
        { id:"shop5", kat:"country", titel:"At the Corner Shop", untertitel:"Money, food & shopping", pfad:"englisch/klasse5/corner-shop.html", icon:"💷", max:42 }
      ] },
      { k:6,  id:"e6",  themen:[
        { id:"sp6",  kat:"grammar",    titel:"Time Travel Agency",       untertitel:"Simple past: statements",           pfad:"englisch/klasse6/simple-past.html",          icon:"⏰", max:59 },
        { id:"spn6", kat:"grammar",    titel:"Shipwreck Detectives",     untertitel:"Simple past: was/were, didn’t, Did …?", pfad:"englisch/klasse6/shipwreck-detectives.html", icon:"🔎", max:56 },
        { id:"adv6", kat:"grammar",    titel:"Reef Describers",          untertitel:"Adjectives & adverbs",              pfad:"englisch/klasse6/reef-describers.html",      icon:"🐠", max:77 },
        { id:"pos6", kat:"grammar",    titel:"Lost & Found Beach",       untertitel:"Possessive pronouns: my / mine …",  pfad:"englisch/klasse6/lost-and-found.html",       icon:"🧳", max:78 },
        { id:"pg6",  kat:"grammar",    titel:"Reef Live Cam",            untertitel:"Present progressive",               pfad:"englisch/klasse6/reef-live-cam.html",        icon:"📹", max:61 },
        { id:"pp6",  kat:"grammar",    titel:"Treasure Collectors",      untertitel:"Present perfect",                   pfad:"englisch/klasse6/treasure-collectors.html",  icon:"💎", max:60 },
        { id:"wf6",  kat:"grammar",    titel:"Ocean Oracle",             untertitel:"will-future",                       pfad:"englisch/klasse6/ocean-oracle.html",         icon:"🔮", max:47 },
        { id:"gt6",  kat:"grammar",    titel:"Dive Plans",               untertitel:"going to-future",                   pfad:"englisch/klasse6/dive-plans.html",           icon:"🤿", max:40 },
        { id:"ov5", kat:"vocabulary", titel:"Orange Line 1 · Unit 5", untertitel:"Where I live: town, transport, past forms", pfad:"englisch/klasse6/words-ol1-unit5.html", icon:"🏙️", max:68 },
        { id:"ov6", kat:"vocabulary", titel:"Orange Line 1 · Unit 6", untertitel:"A trip to the country: farm, clothes, weather", pfad:"englisch/klasse6/words-ol1-unit6.html", icon:"🚜", max:65 },
        { id:"o21", kat:"vocabulary", titel:"Orange Line 2 · Unit 1", untertitel:"Friends: holidays, feelings, past forms", pfad:"englisch/klasse6/words-ol2-unit1.html", icon:"🎒", max:64 },
      { id:"o22", kat:"vocabulary", titel:"Orange Line 2 · Unit 2", untertitel:"Stars: jobs, household, health, present perfect", pfad:"englisch/klasse6/words-ol2-unit2.html", icon:"⭐", max:59 },
      { id:"o23", kat:"vocabulary", titel:"Orange Line 2 · Unit 3", untertitel:"London life: sights, clothes, comparing", pfad:"englisch/klasse6/words-ol2-unit3.html", icon:"🎡", max:61 },
      { id:"o24", kat:"vocabulary", titel:"Orange Line 2 · Unit 4", untertitel:"Food and drink: meals, things for meals, ordering", pfad:"englisch/klasse6/words-ol2-unit4.html", icon:"🍽️", max:67 },
      { id:"o25", kat:"vocabulary", titel:"Orange Line 2 · Unit 5", untertitel:"In the news: media, chat language, prepositions", pfad:"englisch/klasse6/words-ol2-unit5.html", icon:"📰", max:57 },
      { id:"vt6",  kat:"vocabulary", titel:"Word Reef: Town & Travel", untertitel:"Places, transport, directions",     pfad:"englisch/klasse6/word-reef-town.html",       icon:"🚌", max:58 },
        { id:"vl6",  kat:"vocabulary", titel:"Word Reef: Everyday Life", untertitel:"Free time, clothes, weather, feelings", pfad:"englisch/klasse6/word-reef-life.html",   icon:"🎒", max:59 },
        { id:"wp6", kat:"vocabulary", titel:"Word Power: Word Families", untertitel:"un-, -ful, -less, -ly · opposites", pfad:"englisch/klasse6/word-power.html", icon:"🧬", max:63 },
        { id:"v6t1", kat:"vocabulary", titel:"Vocab Trainer: Unit 1", untertitel:"Friends · Mock Test", grp:"test", pfad:"englisch/klasse6/vokabeltrainer.html?u=1", icon:"🤝", max:50 },
        { id:"v6t2", kat:"vocabulary", titel:"Vocab Trainer: Unit 2", untertitel:"Stars! · Mock Test", grp:"test", pfad:"englisch/klasse6/vokabeltrainer.html?u=2", icon:"⭐", max:50 },
        { id:"v6t3", kat:"vocabulary", titel:"Vocab Trainer: Unit 3", untertitel:"London life · Mock Test", grp:"test", pfad:"englisch/klasse6/vokabeltrainer.html?u=3", icon:"🎡", max:50 },
        { id:"v6t4", kat:"vocabulary", titel:"Vocab Trainer: Unit 4", untertitel:"Food and drink · Mock Test", grp:"test", pfad:"englisch/klasse6/vokabeltrainer.html?u=4", icon:"🍽️", max:50 },
        { id:"v6t5", kat:"vocabulary", titel:"Vocab Trainer: Unit 5", untertitel:"In the news · Mock Test", grp:"test", pfad:"englisch/klasse6/vokabeltrainer.html?u=5", icon:"📰", max:50 },
        { id:"v6ti", kat:"vocabulary", titel:"Irregular Verbs", untertitel:"Past forms · Mock Test", grp:"test", pfad:"englisch/klasse6/vokabeltrainer.html?u=irr", icon:"🔀", max:50 },
        { id:"lon6", kat:"country",    titel:"London Explorer",          untertitel:"Sights, the Tube & history",        pfad:"englisch/klasse6/london-explorer.html",      icon:"🎡", max:50 },
        { id:"fd6",  kat:"country",    titel:"The Galley Café",          untertitel:"Food & drink",                      pfad:"englisch/klasse6/food-and-drink.html",       icon:"🍟", max:54 }
      ]},
      { k:7,  id:"e7",  themen:[
        { id:"adv7", kat:"grammar", titel:"The Gem Polishers", untertitel:"Adjectives & adverbs", pfad:"englisch/klasse7/adjectives-adverbs.html", icon:"⛏️", max:55 },
        { id:"pp7", kat:"grammar", titel:"Cave Rescue", untertitel:"Present perfect & simple past", pfad:"englisch/klasse7/present-perfect.html", icon:"🚑", max:45 },
        { id:"rel7", kat:"grammar", titel:"The Inventors’ Hall", untertitel:"Relative clauses: who, which, that", pfad:"englisch/klasse7/relative-clauses.html", icon:"⚙️", max:41 },
        { id:"ger7", kat:"grammar", titel:"Holiday Hall", untertitel:"The gerund (-ing form)", pfad:"englisch/klasse7/gerund.html", icon:"🏕️", max:46 },
        { id:"if7", kat:"grammar", titel:"The Crystal of Wishes", untertitel:"will-future · if-clauses I & II", pfad:"englisch/klasse7/if-clauses.html", icon:"🔮", max:48 },
        { id:"cmp7", kat:"grammar", titel:"The Dwarven Market", untertitel:"Comparison of adjectives · some & any", pfad:"englisch/klasse7/comparison.html", icon:"⚖️", max:50 },
        { id:"pres7", kat:"grammar", titel:"Host Family Hideout", untertitel:"Simple present vs present progressive · mine, yours …", pfad:"englisch/klasse7/present-tenses.html", icon:"🏡", max:39 },
        { id:"mod7", kat:"grammar", titel:"The Mine Railway", untertitel:"Modal verbs: can, must, mustn’t, needn’t, may, should", pfad:"englisch/klasse7/modals.html", icon:"🚂", max:37 },
        { id:"vtown7", kat:"vocabulary", titel:"Words: Town, Shops & Directions", untertitel:"Unit 1 & 4: York, shops, shopping", pfad:"englisch/klasse7/words-town-shopping.html", icon:"🏘️", max:48 },
        { id:"vhealth7", kat:"vocabulary", titel:"Words: Sport, Health & Feelings", untertitel:"Unit 2 & 4: activities, injuries, feelings, advice", pfad:"englisch/klasse7/words-sport-health-feelings.html", icon:"🩹", max:47 },
        { id:"vtrav7", kat:"vocabulary", titel:"Words: Travel, Holidays & Inventions", untertitel:"Unit 3 & 5: holidays, materials, travel, public transport", pfad:"englisch/klasse7/words-travel-inventions.html", icon:"🧳", max:48 },
        { id:"wp7", kat:"vocabulary", titel:"Word Power: Word Families", untertitel:"Verb · noun · adjective · opposites", pfad:"englisch/klasse7/word-power.html", icon:"🧬", max:58 },
        { id:"bi7", kat:"country", titel:"Discover the British Isles", untertitel:"Countries, history & culture", pfad:"englisch/klasse7/british-isles.html", icon:"🧭", max:79 },
        { id:"life7", kat:"country", titel:"Travel Smart: UK & Ireland", untertitel:"Money, miles, meals & more", pfad:"englisch/klasse7/travel-smart.html", icon:"🧳", max:41 }
      ] },
      { k:8,  id:"e8",  themen:[
        { id:"sp8", kat:"grammar", titel:"Yesterday in New York", untertitel:"Simple past: statements, negatives, questions", pfad:"englisch/klasse8/simple-past8.html", icon:"🕰️", max:166 },
        { id:"past8", kat:"grammar", titel:"Ellis Island Archive", untertitel:"Past perfect", pfad:"englisch/klasse8/ellis-island-archive.html", icon:"🗽", max:47 },
        { id:"mod8", kat:"grammar", titel:"High School Rules", untertitel:"Modals & substitutes", pfad:"englisch/klasse8/high-school-rules.html", icon:"🏫", max:47 },
        { id:"if8", kat:"grammar", titel:"Road Trip: What If …?", untertitel:"If-clauses I & II", pfad:"englisch/klasse8/what-if.html", icon:"🛣️", max:42 },
        { id:"who8", kat:"grammar", titel:"Who’s Who in New York?", untertitel:"Questions · who", pfad:"englisch/klasse8/whos-who.html", icon:"❓", max:49 },
        { id:"pres8", kat:"grammar", titel:"California Trends", untertitel:"Present tenses · since/for", pfad:"englisch/klasse8/california-trends.html", icon:"📱", max:46 },
        { id:"pass8", kat:"grammar", titel:"Made in the USA", untertitel:"Passive voice", pfad:"englisch/klasse8/made-in-the-usa.html", icon:"🏭", max:48 },
        { id:"rep8", kat:"grammar", titel:"The Southern Reporter", untertitel:"Reported speech", pfad:"englisch/klasse8/southern-reporter.html", icon:"📰", max:40 },
        { id:"adj8", kat:"grammar", titel:"Mall of America", untertitel:"Adjectives & adverbs · one/ones", pfad:"englisch/klasse8/mall-of-america.html", icon:"🛍️", max:45 },
        { id:"vcity8", kat:"vocabulary", titel:"Words: Big City & New Life", untertitel:"City, immigration, travel", pfad:"englisch/klasse8/words-big-city.html", icon:"🏙️", max:72 },
        { id:"vschool8", kat:"vocabulary", titel:"Words: School, Jobs & Weather", untertitel:"High school, jobs, storms", pfad:"englisch/klasse8/words-school-jobs.html", icon:"🎒", max:71 },
        { id:"vtrend8", kat:"vocabulary", titel:"Words: Trends & Opinions", untertitel:"Small talk, opinions, culture", pfad:"englisch/klasse8/words-trends-opinions.html", icon:"💬", max:68 },
        { id:"vne8", kat:"vocabulary", titel:"Words: Northeast & Thanksgiving", untertitel:"Thanksgiving, Amish life, devices, mystery", pfad:"englisch/klasse8/words-northeast.html", icon:"🦃", max:56 },
        { id:"vcal8", kat:"vocabulary", titel:"Words: California & Gold Rush", untertitel:"Golden Gate, tourist ads, Gold Rush", pfad:"englisch/klasse8/words-california.html", icon:"🌴", max:62 },
        { id:"vsouth8", kat:"vocabulary", titel:"Words: Southern Life & Civil Rights", untertitel:"Nationalities, fried chicken, civil rights", pfad:"englisch/klasse8/words-southern.html", icon:"🎷", max:64 },
        { id:"wp8", kat:"vocabulary", titel:"Word Power: Synonyms & Word Families", untertitel:"Same meaning · opposites · noun endings", pfad:"englisch/klasse8/word-power.html", icon:"🧬", max:58 },
        { id:"vtr1", kat:"vocabulary", titel:"Vocab Trainer: Unit 1", untertitel:"New York & immigration · Mock Test", grp:"test", pfad:"englisch/klasse8/vokabeltrainer.html?u=1", icon:"🗽", max:50 },
        { id:"vtr2", kat:"vocabulary", titel:"Vocab Trainer: Unit 2", untertitel:"Teens in the Midwest · Mock Test", grp:"test", pfad:"englisch/klasse8/vokabeltrainer.html?u=2", icon:"🌽", max:50 },
        { id:"vtr3", kat:"vocabulary", titel:"Vocab Trainer: Unit 3", untertitel:"In the Northeast · Mock Test", grp:"test", pfad:"englisch/klasse8/vokabeltrainer.html?u=3", icon:"🦃", max:50 },
        { id:"vtr4", kat:"vocabulary", titel:"Vocab Trainer: Unit 4", untertitel:"California dreams · Mock Test", grp:"test", pfad:"englisch/klasse8/vokabeltrainer.html?u=4", icon:"🌴", max:50 },
        { id:"vtr5", kat:"vocabulary", titel:"Vocab Trainer: Unit 5", untertitel:"Southern Life · Mock Test", grp:"test", pfad:"englisch/klasse8/vokabeltrainer.html?u=5", icon:"🎷", max:50 },
        { id:"vtri", kat:"vocabulary", titel:"Irregular Verbs", untertitel:"Past forms · Mock Test", grp:"test", pfad:"englisch/klasse8/vokabeltrainer.html?u=irr", icon:"🔀", max:50 },
        { id:"states8", kat:"country", titel:"50 States Challenge", untertitel:"States, capitals, regions", pfad:"englisch/klasse8/fifty-states.html", icon:"🇺🇸", max:48 },
        { id:"nyc8", kat:"country", titel:"Gateway NYC", untertitel:"Sights & immigration", pfad:"englisch/klasse8/gateway-nyc.html", icon:"🗽", max:39 },
        { id:"mid8", kat:"country", titel:"Teens in the Midwest", untertitel:"High school & tornado alley", pfad:"englisch/klasse8/teens-midwest.html", icon:"🌽", max:40 },
        { id:"ne8", kat:"country", titel:"The Northeast & Thanksgiving", untertitel:"Mayflower & independence", pfad:"englisch/klasse8/northeast-thanksgiving.html", icon:"🦃", max:36 },
        { id:"cal8", kat:"country", titel:"California Dreams", untertitel:"Gold Rush & the West", pfad:"englisch/klasse8/california-dreams.html", icon:"🌴", max:35 },
        { id:"south8", kat:"country", titel:"Southern Life", untertitel:"Food, music & civil rights", pfad:"englisch/klasse8/southern-life.html", icon:"🎷", max:38 }
      ] },
      { k:9,  id:"e9",  themen:[
        { id:"mod9", kat:"grammar", titel:"Respect the Rock", untertitel:"Modals in the past & future · substitutes", pfad:"englisch/klasse9/modals-past.html", icon:"🪨", max:43 },
        { id:"cmp9", kat:"grammar", titel:"The Elves’ Job Fair", untertitel:"Comparison of adjectives & adverbs", pfad:"englisch/klasse9/comparison.html", icon:"💼", max:46 },
        { id:"rel9", kat:"grammar", titel:"Caribbean Tales", untertitel:"Relative clauses · contact clauses · whose, where", pfad:"englisch/klasse9/relative-clauses.html", icon:"🏝️", max:44 },
        { id:"prog9", kat:"grammar", titel:"When the Storm Came", untertitel:"Past progressive · when & while", pfad:"englisch/klasse9/past-progressive.html", icon:"🌀", max:45 },
        { id:"ppf9", kat:"grammar", titel:"Woodland Detectives", untertitel:"Past perfect", pfad:"englisch/klasse9/past-perfect.html", icon:"🔍", max:42 },
        { id:"pass9", kat:"grammar", titel:"Ranger Station", untertitel:"The passive in different tenses", pfad:"englisch/klasse9/passive.html", icon:"🦏", max:48 },
        { id:"rep9", kat:"grammar", titel:"Whispering Trees", untertitel:"Reported speech: statements, questions, commands", pfad:"englisch/klasse9/reported-speech.html", icon:"💬", max:40 },
        { id:"fut9", kat:"grammar", titel:"Green Future", untertitel:"will-future vs going to-future", pfad:"englisch/klasse9/future.html", icon:"🌱", max:40 },
        { id:"vaus9", kat:"vocabulary", titel:"Words: Respect, Jobs & Nature Down Under", untertitel:"Unit 1: respect, jobs & qualities, environment", pfad:"englisch/klasse9/words-australia.html", icon:"🦘", max:47 },
        { id:"vcar9", kat:"vocabulary", titel:"Words: Holidays & Values", untertitel:"Unit 2: holiday words, standards & values, weather", pfad:"englisch/klasse9/words-caribbean.html", icon:"🌴", max:46 },
        { id:"vsa9", kat:"vocabulary", titel:"Words: Society, Landscapes & Nature", untertitel:"Unit 3: social differences, landscapes, nature", pfad:"englisch/klasse9/words-south-africa.html", icon:"🦓", max:46 },
        { id:"vhk9", kat:"vocabulary", titel:"Words: Shopping, Environment & Media", untertitel:"Unit 4: buying & selling, environment, media", pfad:"englisch/klasse9/words-hong-kong.html", icon:"🏙️", max:46 },
        { id:"wp9", kat:"vocabulary", titel:"Word Power: Prefixes & Word Families", untertitel:"im-, in-, il-, ir- · noun, adjective, adverb · synonyms", pfad:"englisch/klasse9/word-power.html", icon:"🧬", max:60 },
        { id:"emp9", kat:"country", titel:"Rise and Fall of the British Empire", untertitel:"History, colonies & the Commonwealth", pfad:"englisch/klasse9/british-empire.html", icon:"🌍", max:55 },
        { id:"aus9", kat:"country", titel:"G’day, Australia!", untertitel:"Outback, reef, wildlife & Aussie English", pfad:"englisch/klasse9/australia.html", icon:"🦘", max:41 },
        { id:"car9", kat:"country", titel:"Island Vibes: The Caribbean", untertitel:"Jamaica, history, music & hurricanes", pfad:"englisch/klasse9/caribbean.html", icon:"🌴", max:35 },
        { id:"sa9", kat:"country", titel:"The Rainbow Nation", untertitel:"South Africa: apartheid, Mandela & a nation of many languages", pfad:"englisch/klasse9/south-africa.html", icon:"🇿🇦", max:38 },
        { id:"hk9", kat:"country", titel:"Hong Kong: Where East Meets West", untertitel:"History, city life, festivals & food", pfad:"englisch/klasse9/hong-kong.html", icon:"🏙️", max:40 },
        { id:"acc9", kat:"country", titel:"Accent Detective", untertitel:"Listen to English around the world", pfad:"englisch/klasse9/accent-detective.html", icon:"🎧", max:34 }
      ] },
      { k:10, id:"e10",  themen:[
        { id:"pres10", kat:"grammar", titel:"The Frozen Arena", untertitel:"Simple present vs present progressive (revision)", pfad:"englisch/klasse10/present-tenses.html", icon:"🏒", max:43 },
        { id:"pp10", kat:"grammar", titel:"The Pipeline Protest", untertitel:"Present perfect simple & progressive · since/for", pfad:"englisch/klasse10/present-perfect.html", icon:"🛢️", max:49 },
        { id:"if10", kat:"grammar", titel:"The Ice Oracle", untertitel:"If-clauses type I & II (revision) · unless", pfad:"englisch/klasse10/if-clauses.html", icon:"🔮", max:38 },
        { id:"pass10", kat:"grammar", titel:"The Crystal Factory", untertitel:"The passive (revision): all tenses, by-agent, being done", pfad:"englisch/klasse10/passive.html", icon:"🏭", max:44 },
        { id:"past10", kat:"grammar", titel:"Frozen Memories", untertitel:"Past tenses (revision): simple past, past progressive, past perfect, present perfect", pfad:"englisch/klasse10/past-tenses.html", icon:"🧊", max:46 },
        { id:"ifc10", kat:"grammar", titel:"If Only …", untertitel:"If-clauses type III · all three types", pfad:"englisch/klasse10/if-clauses-3.html", icon:"🌋", max:38 },
        { id:"vcan10", kat:"vocabulary", titel:"Words: Sport, Energy & Strong Feelings", untertitel:"Unit 1: talking about sport, giving reasons, energy, protest", pfad:"englisch/klasse10/words-canada.html", icon:"🍁", max:47 },
        { id:"vind10", kat:"vocabulary", titel:"Words: Work, Volunteering & Production", untertitel:"Unit 2: at work, formal emails, production", pfad:"englisch/klasse10/words-india.html", icon:"🪷", max:41 },
        { id:"vnz10", kat:"vocabulary", titel:"Words: Relationships, Advice & Emergencies", untertitel:"Unit 3: relationships, giving advice, emergencies", pfad:"englisch/klasse10/words-new-zealand.html", icon:"🥝", max:44 },
        { id:"wp10", kat:"vocabulary", titel:"Word Power: Word Formation & Register", untertitel:"Formal words · synonyms · word formation", pfad:"englisch/klasse10/word-power.html", icon:"🧬", max:59 },
        { id:"can10", kat:"country", titel:"True North: Canada", untertitel:"Land, people, history & the Arctic", pfad:"englisch/klasse10/canada.html", icon:"🍁", max:41 },
        { id:"ind10", kat:"country", titel:"Incredible India", untertitel:"History, Gandhi, languages, food & festivals", pfad:"englisch/klasse10/india.html", icon:"🪷", max:35 },
        { id:"nz10", kat:"country", titel:"Aotearoa New Zealand", untertitel:"Māori culture, history, nature & the Kiwi way of life", pfad:"englisch/klasse10/new-zealand.html", icon:"🥝", max:38 },
        { id:"acc10", kat:"country", titel:"Accent Detective: World Englishes", untertitel:"Ten accents from around the world", pfad:"englisch/klasse10/accent-detective.html", icon:"🎧", max:47 }
      ] }
    ]
  },

  // Sport-Klassenwelten (gemalte Welten, sport/klasseN.html). Freigabe-Schlüssel = 100 + Klasse.
  // orte = Orte der Welt (gleiche ids wie in der Welt-Datei!), offen = ohne Freigabe sichtbar. Lernwelten: Material mit welt:N und Thema-id.
  sport: { welten: [
    { k:8, name:"Camp Start", pfad:"sport/klasse8.html", bild:"sport/welt8/vorschau.jpg", info:"Klasse 8 · Profil Sport",
      orte:[ {id:"feuer", name:"Lagerfeuer", icon:"🔥", e:"T1 Was ist Sport?", offen:true}, {id:"spielfeld", name:"Schiri-Turm", icon:"🧑‍⚖️", e:"T5 Spielregeln & Fairness", offen:true, themen:["bb2"]},
             {id:"wiese", name:"Sonnen-Wiese", icon:"🌅", e:"T3 Aufwärmen & Stretching", offen:true}, {id:"muehle", name:"Muskel-Mühle", icon:"⚙️", e:"T4 Muskeln & Gegenspieler", offen:true},
             {id:"parcours", name:"Abenteuer-Parcours", icon:"🧗", e:"T2 Motorische Fähigkeiten", offen:true}, {id:"leuchtturm", name:"Leuchtturm der Gefühle", icon:"🗼", e:"T6 Fair Play & Emotionen", offen:true},
             {id:"huette", name:"Logbuch-Hütte", icon:"📖", e:"T7 Reflexion & Portfolio", offen:true} ] },
    { k:9, name:"Athletopolis", pfad:"sport/klasse9.html", bild:"sport/welt9/vorschau.jpg", info:"Klasse 9 · Profil Sport",
      orte:[ {id:"herz", name:"Herz-Kraftwerk", icon:"❤️", e:"E1 Herz-Kreislauf & Energie", offen:true, themen:["hz9"]}, {id:"werft", name:"Skelett-Werft", icon:"🦴", e:"E2 Knochen & Gelenke", offen:true, themen:["kn9","ge9"]},
             {id:"stadion", name:"Flutlicht-Stadion", icon:"🏟️", e:"E2 Sportverletzungen & Ursachen", offen:true, themen:["vl9"]}, {id:"bergwacht", name:"Bergwacht-Station", icon:"🚁", e:"E2 Erste Hilfe & Vorbeugen", offen:true, themen:["eh9"]},
             {id:"muskel", name:"Muskel-Fitnesscenter", icon:"🏋️", e:"E3 Training & Fitness", offen:true, themen:["tr9"]}, {id:"markt", name:"Markthalle", icon:"🍎", e:"E4 Ernährung", offen:true, themen:["er9"]},
             {id:"labor", name:"Doping-Labor", icon:"🧪", e:"E5 Doping", offen:true, themen:["do9"]}, {id:"gehirn", name:"Gehirn-Arena", icon:"🧠", e:"E6 Emotionen, Fair Play & Sinn", offen:true, themen:["em9"]} ] }
  ]},

  // Fächer ohne Inseln: einfache Liste
  listen: [
    { id:"sport", name:"Sport", icon:"🏀", materialien:[
      { id:"bb2", welt:8, titel:"Basketball-Lernwelt: Regeln & Fairness", info:"Profil Sport Kl. 8 · Schiri-Turm (T5) · 8 Spiele", pfad:"sport/basketball.html",
        stationen:["Memory","Shot Clock","Schiri","Fair Play","Maße","Zeitreise","NBA/FIBA","Sneaker"], stationenMax:[8,16,16,10,10,7,12,8] },
      { id:"hz9", welt:9, titel:"Herz-Lernwelt: Herz, Kreislauf, Pulskurve & Ausdauer", info:"Profil Sport Kl. 9 · Herz-Kraftwerk (E1, AB 01–02) · 5 Infokarten-Stapel inkl. Merk-Reime · 14 Spiele", pfad:"sport/herz.html",
        stationen:["Kreislauf","Rot/Blau","Herz-Quiz","Zonen","Energiewege","Lückentext","Puls-Kette","Rechner","Memory","Ruhepuls","Zahlen","Reime","Wahr/Falsch","Profi"], stationenMax:[12,10,8,10,12,5,5,8,8,8,10,6,12,9] },
      { id:"kn9", welt:9, titel:"Knochen-Lernwelt: Skelett, Aufbau & starke Knochen", info:"Profil Sport Kl. 9 · Skelett-Werft, Röntgen-Klinik (E2) · 4 Infokarten-Stapel inkl. Merk-Reime · 13 Spiele", pfad:"sport/knochen.html",
        stationen:["Röntgen-Scan","Wer leuchtet?","Reime","Memory","Sortierer","Labor","Labor-Quiz","Zahlen","Wahr/Falsch","Booster","Sani","Heilung","Profi"], stationenMax:[14,10,11,8,13,14,10,12,11,12,14,6,9] },
      { id:"ge9", welt:9, titel:"Gelenke-Lernwelt: Gelenke, Bänder, Sehnen & Knorpel", info:"Profil Sport Kl. 9 · Skelett-Werft, Robo-Werkstatt (E2) · 3 Infokarten-Stapel inkl. Merk-Reime · 12 Spiele", pfad:"sport/gelenke.html",
        stationen:["Labor","Scanner","Reime","Memory","Lager","Knie","Band/Sehne","Quiz","Analyse","Wahr/Falsch","Zahlen","Profi"], stationenMax:[16,8,6,8,12,16,12,10,14,10,8,8] },
      { id:"vl9", welt:9, titel:"Verletzungs-Lernwelt: Sportverletzungen & ihre Ursachen", info:"Profil Sport Kl. 9 · Flutlicht-Stadion (E2) · 3 Infokarten-Stapel inkl. Merk-Reime · 10 Spiele", pfad:"sport/verletzungen.html",
        stationen:["Tatort","Was ist das?","Akut/Überlastung","Memory","Innen/Außen","Detektiv","Reime","Wahr/Falsch","Zahlen","Profi"], stationenMax:[8,10,12,7,12,14,6,10,8,8] },
      { id:"eh9", welt:9, titel:"Erste-Hilfe-Lernwelt: Erste Hilfe & Vorbeugen", info:"Profil Sport Kl. 9 · Bergwacht-Station (E2) · 5 Infokarten-Stapel inkl. Merk-Reime · 12 Spiele", pfad:"sport/erstehilfe.html",
        stationen:["Rettungskette","Notruf","PECH","Einsatz","Blitz-Check","112?","Memory","Vorbeugen","Reime","Wahr/Falsch","Zahlen","Profi"], stationenMax:[5,5,4,10,12,10,7,12,6,10,10,8] },
      { id:"tr9", welt:9, titel:"Trainings-Lernwelt: Training, Superkompensation & Trainingsplan", info:"Profil Sport Kl. 9 · Muskel-Fitnesscenter (E3, AB 10–13 & 19) · 5 Infokarten-Stapel inkl. Merk-Reime · 16 Spiele", pfad:"sport/training.html",
        stationen:["Training?","Test","Fair","Kurve","Timing","Erholung","Stellschrauben","Prinzipien","Methoden","Memory","SMART","Rechnen","Ursachen","Reime","Wahr/Falsch","Profi"], stationenMax:[10,9,11,9,8,8,10,10,12,8,7,7,7,7,11,9] },
      { id:"er9", welt:9, titel:"Ernährungs-Lernwelt: Energie, Nährstoffe, Trinken & Timing", info:"Profil Sport Kl. 9 · Markthalle (E4, AB 14–18) · 6 Infokarten-Stapel inkl. Merk-Reime · 16 Spiele", pfad:"sport/ernaehrung.html",
        stationen:["Umsatz","Ranking","Etikett","Memory","Sortierer","Pyramide","Zucker","Wasser","Trinken","Timing","Magen","Coach","Protokoll","Reime","Wahr/Falsch","Profi"], stationenMax:[12,5,6,8,14,14,10,6,7,10,10,7,7,6,11,9] },
      { id:"do9", welt:9, titel:"Doping-Lernwelt: Doping, Risiken, Kontrollen & Debatte", info:"Profil Sport Kl. 9 · Doping-Labor (E5, AB 20–23) · 5 Infokarten-Stapel inkl. Merk-Reime · 15 Spiele", pfad:"sport/doping.html",
        stationen:["Definition","Doping?","WADA/NADA","Motive","Risiko","Memory","EPO","Fallakte","Kontrolle","Ampel","Wahr/Falsch","Pro/Contra","Treppe","Reime","Profi"], stationenMax:[6,12,10,8,10,8,6,14,6,10,11,10,5,6,9] },
      { id:"em9", welt:9, titel:"Gehirn-Arena-Lernwelt: Fair Play, Emotionen, Sinn & Gesellschaft", info:"Profil Sport Kl. 9 · Gehirn-Arena (E6, AB 26–29 & 32) · 6 Infokarten-Stapel inkl. Merk-Reime · 15 Spiele", pfad:"sport/gehirn.html",
        stationen:["Merkmale","Fairness","Werte","Gefühle","U-Kurve","Aufregung","Strategien","Selbstgespräch","Mut","Sinn","Gesellschaft","Memory","Reime","Wahr/Falsch","Profi"], stationenMax:[7,12,6,8,9,8,8,12,5,12,8,8,6,10,8] }
    ]},
    { id:"escape", name:"Escape Rooms", icon:"🗝️", materialien:[
      // raum:true = Escape Room mit Karte (bild, farbe, chips); sonst Werkzeug/Vorschau in der Liste darunter
      { id:"esc-vulkan", raum:true, titel:"Der Vulkan", info:"Der Vulkan bebt: Gemeinsam durch die Kammern bis zum Kern und den Ausbruch stoppen.", pfad:"escape/vulkan.html",
        bild:"escape/vorschau-vulkan.jpg", farbe:"#D9472F", chips:["👥 1–6","⏱️ 35 / 70 Min.","🔢 Zahlen & Codes","3D"] },
      { id:"esc-woodlands", raum:true, titel:"Finlorién", info:"Im Elbenwald schwindet das Licht: Runensteine lösen und den Weltenbaum wecken.", pfad:"escape/woodlands.html",
        bild:"escape/vorschau-woodlands.jpg", farbe:"#1F9E7A", chips:["👥 1–6","⏱️ 35 / 70 Min.","👂 Team & Sinne","2D"] },
      { id:"esc-wrack", raum:true, titel:"Das Wrack", info:"Tief unter den Wellen: Raum für Raum durch die Schott-Türen bis zur Schatzkammer.", pfad:"escape/wrack.html",
        bild:"escape/vorschau-wrack.jpg", farbe:"#1689B5", chips:["👥 1–6","⏱️ 35 / 70 Min.","🧭 Sehen & Raum"] },
      { id:"esc-bibliothek", raum:true, titel:"Die Bibliothek der Tinte", info:"In der Himmelsbibliothek versiegt die Tinte: Durch die Säle bis zum Buch der Bücher.", pfad:"escape/bibliothek.html",
        bild:"escape/vorschau-bibliothek.jpg", farbe:"#C9A23A", chips:["👥 1–6","⏱️ 35 / 70 Min.","🧠 Logik & Detektiv"], neu:"Testlauf" },
      { id:"esc-azaroth", raum:true, titel:"Die Hallen von Azaroth", info:"Tief im Berg erwacht ein Drache: Felsbrocken schieben, Loren lenken, den Runenschlüssel schmieden und am Drachen vorbeischleichen.", pfad:"escape/azaroth.html",
        bild:"escape/vorschau-azaroth.jpg", farbe:"#E0812E", chips:["👥 1–6","⏱️ 35 / 70 Min.","🧭 Sehen & Raum","2D"], neu:"Neu" },
      { id:"esc-schwarm", raum:true, titel:"Der Schwarm", info:"Flucht durchs Sonnensystem: per Lichtsprung von Planet zu Planet bis zum uralten Sprungtor.", pfad:"escape/schwarm.html",
        bild:"escape/vorschau-schwarm.jpg", farbe:"#3A7BFF", chips:["👥 1–6","⏱️ 35 / 70 Min.","🔢 Zahlen & Codes","🪐 Planeten"], neu:"Neu" },
      { id:"esc-test", titel:"iPad-Verbindungstest", info:"Vor der Stunde: prüft Grafik, Ton und die Live-Verbindung zwischen den iPads", pfad:"escape/test.html", icon:"📶" },
      { id:"esc-wrack-vorschau", titel:"Das Wrack (3D-Vorschau)", info:"Erste 3D-Vorschau des versunkenen Schiffs, noch ohne Rätsel", pfad:"escape/wrack-preview.html", icon:"🧪" }
    ]},

    { id:"sonstiges", name:"Sonstiges", icon:"🧩", materialien:[] }
  ]
};

// Hilfsfunktionen
// Grundbereiche + Zusatzbereiche (z. B. Lernpfad), sobald die Klasse dort Themen hat
FRS.bereicheFuer = k => { const c = FRS.englisch.klassen.find(x => x.k === +k), extra = Object.keys(FRS.kategorien).filter(b => !FRS.grundBereiche.includes(b) && FRS.kategorien[b].nurFreigabe && c && c.themen.some(t => t.kat === b)); return FRS.grundBereiche.concat(extra); };
FRS.welt = k => FRS.welten[+k];
FRS.klasse = k => FRS.englisch.klassen.find(x => x.k === +k);
FRS.find = id => {
  for(const c of FRS.englisch.klassen){
    if(c.id === id){
      const bereiche = FRS.bereicheFuer(c.k);
      const themen = bereiche.flatMap(b => c.themen.filter(t => t.kat === b && t.grp !== "test"));   // Testvorbereitung (grp:"test") hat keine Flaggen und steht nicht im Ergebnis-Code
      return { typ:"insel", id, k:c.k, titel:`Englisch · Klasse ${c.k}`, themen, bereiche };
    }
  }
  for(const l of FRS.listen) for(const m of l.materialien) if(m.id === id) return Object.assign({ typ:"material", fach:l.name }, m);
  return null;
};
// Für ältere Seiten, die noch MATERIALIEN erwarten
const MATERIALIEN = FRS.listen.flatMap(l => l.materialien.map(m => Object.assign({ bereich:l.name }, m)));
