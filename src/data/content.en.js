/* ============================================================
   Portfolio content (English) — every word, number and link on the
   site. Components import it through ./portfolioData.js, which swaps
   in the Arabic text from ./content.ar.js when Arabic is chosen.
   Facts come from the CV (cv-reseume.psd); headlines use the
   "confident + playful" voice. Image paths starting with "images/"
   live in /public; project images are keys into src/assets/projects
   (see projectImages.js).
   ============================================================ */

export const site = {
  name: "Ahmad Abdullah",
  firstName: "Ahmad",
  lastName: "Abdullah",
  role: "Graphic & Web Designer",
  studio: "Design Dynamo",
  email: "official.ahmedabdullah@gmail.com",
  phone: "+966 59 808 1132",
  phoneHref: "tel:+966598081132",
  location: "Riyadh, KSA",
  availability: "Open for projects · 2026",
  // Paste your own profile link here, e.g. "https://www.fiverr.com/your-username".
  fiverrUrl: "https://www.fiverr.com/",
  // TODO: swap for the real profile urls
  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Behance", href: "https://www.behance.net/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
  logo: "images/logo.svg",
  portrait: "images/ahmad-portrait.jpeg",
  aboutPhoto: "images/ahmad-abdullah.jpg",
};

/* ---------- Pages ---------------------------------------------- */

// Each page is a "document" in the workspace; each has a tool with a
// Photoshop shortcut that jumps to it (press V, H, P, T or I).
export const pages = [
  { label: "Home", to: "/", file: "home.psd", tool: "move", key: "V" },
  { label: "Work", to: "/work", file: "work.psd", tool: "hand", key: "H" },
  { label: "Services", to: "/services", file: "services.psd", tool: "pen", key: "P" },
  { label: "About", to: "/about", file: "about.psd", tool: "type", key: "T" },
  { label: "Contact", to: "/contact", file: "contact.psd", tool: "eyedropper", key: "I" },
];

/* ---------- Services ------------------------------------------ */

const defaultCta = {
  title: ["Let's put", "it in motion"],
  text: "Tell me what you are selling and when it needs to be live. You will get a plan, a price and a date back — usually within a day, always from me.",
};

const defaultOtherNote =
  "Most projects touch more than one of these — branding usually leads to print, and print usually leads to a website.";

const relatedWork = { label: "See related work", to: "/work" };

export const services = [
  {
    slug: "logo-design",
    title: "Logo Design",
    short: "Memorable logos for modern brands.",
    icon: "pen",
    group: "Branding",
    heading: ["Logo", "Design"],
    lead: "A logo worth keeping is a shape you could draw from memory. I design marks that hold up at 16 pixels in a browser tab and at three metres across a shopfront, then hand over every version you are ever going to need.",
    promise: "Two routes presented, unlimited revisions on the chosen one.",
    image: "images/brand-identity-sample.jpg",
    caption: "Marks drawn to a grid, proofed on uncoated stock",
    secondary: relatedWork,
    deliverables: [
      ["Primary logo", "The main lockup, drawn to a grid and spaced by hand rather than typed out in whatever font was to hand."],
      ["Responsive set", "Stacked, horizontal and icon-only variants for the places where width runs out — favicons, app tiles, embroidery."],
      ["One-colour & reversed", "Solid black, solid white and knockout versions that survive vinyl cutting, stamps and faxes."],
      ["File pack", "SVG, PDF, EPS, PNG and JPG. Vector first; raster only where it is unavoidable."],
      ["Usage note", "Clear space, minimum size and the three things not to do with it, on a single page."],
    ],
    steps: [
      ["Discovery", "A short questionnaire plus whatever already exists — old files, signage, the way customers describe you."],
      ["Direction", "Two routes taken to a real mock-up on a card, a screen and a door before anything gets refined."],
      ["Craft", "The chosen route redrawn on a grid, optically corrected, and tested down to favicon size."],
      ["Handover", "Every file, the fonts, and a one-page note — with thirty days of questions afterwards."],
    ],
    related: ["product-labeling", "flyer-creation", "poster-design", "social-media-covers"],
  },
  {
    slug: "product-labeling",
    title: "Product Labeling",
    short: "Packaging labels that attract attention.",
    icon: "box",
    group: "Print & Packaging",
    heading: ["Product", "Labeling"],
    lead: "On a shelf the label is the product. I design labels that read from two metres away, stay legal at six centimetres, and still look like the brand when the printer adds a 3mm bleed.",
    promise: "Works across the full range, not just the hero SKU.",
    image: "images/print-design-sample.jpg",
    caption: "Shelf tests on the real stock, not on a screen",
    secondary: relatedWork,
    deliverables: [
      ["Front-of-pack layout", "Hierarchy built around the one claim that actually sells, with the brand mark placed to be found instantly."],
      ["Dieline & artwork", "Working to your printer's dieline with correct bleed, safe zones and overprint set up."],
      ["Mandatory panel", "Ingredients, nutrition, barcodes, batch and expiry laid out clearly and within the legal block size."],
      ["Range system", "A colour and layout code so the next six flavours extend without starting over."],
      ["Press-ready files", "PDF/X-1a with outlined type, plus the layered source file for the next run."],
    ],
    steps: [
      ["Discovery", "Product, shelf context, printer and dieline confirmed before a single mark is placed."],
      ["Direction", "Two layout directions shown on a photographed shelf, not floating on a white rectangle."],
      ["Craft", "Copy fitted, mandatory panel checked, and the whole range mocked up together."],
      ["Handover", "Press-ready artwork sent direct to your printer, with a proof signed off by you."],
    ],
    related: ["logo-design", "flyer-creation", "poster-design", "social-media-covers"],
  },
  {
    slug: "flyer-creation",
    title: "Flyer Creation",
    footerLabel: "Flyer & Poster",
    short: "Eye-catching flyers for promotions.",
    icon: "file",
    group: "Print & Social",
    heading: ["Flyer", "Creation"],
    lead: "A flyer has about two seconds to stop someone mid-stride. I build it around a single message, one strong image and a call to action you can find without hunting for it.",
    promise: "Designed for the hand, not just the screen.",
    image: "images/print-design-sample.jpg",
    caption: "Folded, stacked and handed over — A5 and DL",
    secondary: relatedWork,
    deliverables: [
      ["Single-sided A5 / DL", "The hit piece. One message, one image, one thing to do next."],
      ["Double-sided layout", "Detail on the back — schedule, pricing, map — kept as easy to scan as the front."],
      ["Print-ready PDF", "CMYK, 3mm bleed, crop marks, outlined type, ready for any print shop."],
      ["Editable source", "The working file, so a date or a price can change without a redesign."],
      ["Digital twin", "A screen version sized for email and stories, exported from the same artwork."],
    ],
    steps: [
      ["Discovery", "The offer, the audience and where the flyer will actually be handed out."],
      ["Direction", "Two concepts, both proofed at real size — a flyer never reads the same scaled down."],
      ["Craft", "Copy cut to the length the layout can carry, imagery licensed and colour-matched."],
      ["Handover", "Press-ready PDF, source file, and a screen export for the same campaign."],
    ],
    related: ["logo-design", "product-labeling", "poster-design", "social-media-covers"],
  },
  {
    slug: "poster-design",
    title: "Poster Design",
    short: "Creative posters with a strong message.",
    icon: "frame",
    group: "Print & Social",
    heading: ["Poster", "Design"],
    lead: "A poster is a public statement with a fixed amount of space. I use scale, contrast and one uncompromising idea so it still lands from across the street and rewards a closer look.",
    promise: "Read at ten metres, then at thirty centimetres.",
    image: "images/print-design-sample.jpg",
    caption: "Pinned proof — A2 and A1, screen and offset",
    secondary: relatedWork,
    deliverables: [
      ["Concept-led layout", "One idea, executed at full strength, rather than five ideas fighting for the corner."],
      ["Type at scale", "Headline set and kerned for viewing distance, not just for the artboard."],
      ["Size variants", "A1, A2 and A3 — plus a crop that survives being re-framed for socials."],
      ["Colour-managed proof", "CMYK with a soft proof against the paper you are printing on."],
      ["Production files", "Bleed, crop marks and outlined type; large-format specs on request."],
    ],
    steps: [
      ["Discovery", "Where it hangs, how far away it is read, and how long it stays up."],
      ["Direction", "Sketches at thumbnail size — if it does not work small, it will not work at A1."],
      ["Craft", "Typography built, image treated, and a full-size proof pinned to the wall."],
      ["Handover", "Signed-off artwork in every size the campaign needs."],
    ],
    related: ["logo-design", "product-labeling", "flyer-creation", "social-media-covers", "canvas-wall-decals"],
  },
  {
    slug: "social-media-covers",
    title: "Social Media Covers",
    short: "Professional visuals for social platforms.",
    icon: "share",
    group: "Print & Social",
    heading: ["Social Media", "Covers"],
    lead: "Cover art is the only real estate most brands get for free. I design profiles, banners and post templates that look deliberate on a phone, survive every crop, and stay on brand when someone else posts at eleven at night.",
    promise: "Built so the system survives the person who inherits it.",
    image: "images/print-design-sample.jpg",
    caption: "Every crop checked against a real device frame",
    secondary: relatedWork,
    deliverables: [
      ["Profile & cover set", "Facebook, X, LinkedIn and YouTube — each built to its own safe area rather than resized from one file."],
      ["Highlight & avatar art", "Small circular and square marks that stay legible at 40 pixels."],
      ["Post templates", "Three to five editable layouts for quotes, announcements and offers."],
      ["Story frames", "9:16 layouts with safe zones kept clear of the clock and the reply bar."],
      ["Handover", "A short guide plus the source files, so the team can keep posting consistently."],
    ],
    steps: [
      ["Discovery", "Platforms, posting cadence and whoever will actually be making the posts."],
      ["Direction", "Two visual routes, mocked up on a real feed rather than a flat artboard."],
      ["Craft", "Templates built with locked margins and a simple type and colour system."],
      ["Handover", "Exports, editable files and a one-page guide for the person posting."],
    ],
    related: ["logo-design", "product-labeling", "flyer-creation", "poster-design"],
  },
  {
    slug: "infographics",
    title: "Infographics",
    short: "Complex information made simple.",
    icon: "chart",
    group: "Data & Story",
    heading: ["Infographics"],
    lead: "Most infographics fail because they start as decoration. I start by finding the one sentence the data is trying to say, then build the chart, the flow or the diagram that proves it.",
    promise: "One sentence first, then the chart that proves it.",
    image: "images/infographics-sample.jpg",
    caption: "Charts proofed on paper before they go to screen",
    secondary: relatedWork,
    deliverables: [
      ["Structure first", "An outline of what the reader should know in five seconds, thirty seconds and five minutes."],
      ["Charts & diagrams", "Bar, line, flow and comparison graphics drawn to the actual numbers — no decorative 3D."],
      ["Icon set", "A small custom icon family drawn to one grid so the whole sheet feels of a piece."],
      ["Print & screen sizes", "A2 sheet, presentation slide and a long-scroll web version from one source."],
      ["Data table", "The underlying numbers kept in a tidy spreadsheet so the next update is quick."],
    ],
    steps: [
      ["Discovery", "The raw data, the audience, and the single decision the graphic should help them make."],
      ["Direction", "A wireframe of the reading order, checked with someone outside the project."],
      ["Craft", "Charts drawn to real values, icons drawn to one grid, hierarchy tuned."],
      ["Handover", "Vector artwork, editable chart files and exports in every size required."],
    ],
    related: ["logo-design", "product-labeling", "flyer-creation", "poster-design"],
  },
  {
    slug: "ui-ux-design",
    title: "UI / UX Design",
    short: "Simple and enjoyable digital experiences.",
    icon: "layout",
    group: "Digital",
    heading: ["UI /", "UX Design"],
    lead: "Good interface design is mostly decisions about what to remove. I map the route a real person takes through a product, then design the screens so nothing on it gets in their way.",
    promise: "Designed around the task, measured after launch.",
    image: "images/ui-web-design-sample.jpg",
    caption: "Flows first, then screens, then the component library",
    secondary: relatedWork,
    deliverables: [
      ["Flow & wireframes", "The critical path drawn end to end in grey boxes before any colour is chosen."],
      ["High-fidelity screens", "Every state designed — empty, loading, error, success — not just the happy path."],
      ["Component library", "Buttons, fields, cards and tokens with the spacing and type scale documented."],
      ["Prototype", "A clickable link your team can put in front of five users this week."],
      ["Developer handover", "Specs, assets and measurements, in whatever tool your developers already use."],
    ],
    steps: [
      ["Discovery", "Goals, analytics and five minutes with someone who actually uses the thing."],
      ["Direction", "Wireframes of the core flow, tested before any visual design begins."],
      ["Craft", "Interface design, component system and a clickable prototype."],
      ["Handover", "Handover with specs, plus a review once the first screens are built."],
    ],
    related: ["logo-design", "product-labeling", "flyer-creation", "poster-design"],
  },
  {
    slug: "web-design",
    title: "Web Design",
    short: "Responsive websites built for your brand.",
    icon: "code",
    group: "Digital",
    heading: ["Web", "Design"],
    lead: "I design and build responsive websites in plain HTML, CSS and JavaScript — no framework debt, no plugin to keep alive. Fast on a mid-range phone, easy for you to edit, and honest about what your business does.",
    promise: "HTML, CSS, JavaScript — fast on a mid-range phone.",
    image: "images/ui-web-design-sample.jpg",
    caption: "Built to the grid, tested at 360px and 2560px",
    secondary: relatedWork,
    deliverables: [
      ["Sitemap & content plan", "Pages, purpose and the words, agreed before the first section is designed."],
      ["Responsive design", "Every breakpoint designed deliberately — not the desktop layout squeezed until it fits."],
      ["Front-end build", "Semantic HTML, modern CSS and a little JavaScript. No page-builder bloat."],
      ["Speed & SEO basics", "Compressed images, lazy loading, meta tags, structured data and a sitemap."],
      ["Launch support", "Deployment, domain and analytics set up — plus a short guide to making edits."],
    ],
    steps: [
      ["Discovery", "Objectives, audience, the pages you have and the ones you are missing."],
      ["Direction", "Sitemap and wireframes, then one designed page to lock the direction."],
      ["Craft", "The full design, then the build — tested across screen sizes as it goes."],
      ["Handover", "Deployed, measured, and handed over with a guide for future edits."],
    ],
    related: ["logo-design", "product-labeling", "flyer-creation", "poster-design"],
  },
  {
    slug: "brand-identity",
    title: "Brand Identity",
    short: "A full visual language, not just a logo.",
    icon: "spark",
    group: "Branding",
    inMenu: false,
    heading: ["Brand", "Identity"],
    lead: "A brand identity is the whole visual language — the mark, the type, the colour, the rules — so a business looks like itself everywhere it turns up. I build systems a small team can actually run without me standing over them.",
    promise: "One system across print, screen and packaging.",
    image: "images/brand-identity-sample.jpg",
    caption: "Stationery, guidelines and the kit that follows",
    secondary: relatedWork,
    deliverables: [
      ["Logo suite", "Primary mark, secondary lockup, app icon and a one-colour version for stamps and embroidery."],
      ["Colour & type", "Print and screen palettes with contrast-checked pairings, and a type scale you can paste into a deck."],
      ["Stationery", "Business card, letterhead, envelope and email signature, set up at press-ready bleed."],
      ["Guidelines", "A short, readable PDF: clear space, minimum sizes, misuse, and how the parts sit together."],
      ["Social kit", "Profile marks, cover art and three post templates sized for every major platform."],
    ],
    steps: [
      ["Discovery", "What exists already, who you are competing with, and what customers say about you."],
      ["Direction", "Two directions, each shown as a whole world rather than a lone logo on white."],
      ["Craft", "The chosen route expanded across the full kit and checked in print and on screen."],
      ["Handover", "Files, fonts and guidelines delivered, with thirty days of questions afterwards."],
    ],
    related: ["logo-design", "product-labeling", "flyer-creation", "poster-design"],
  },
  {
    slug: "canvas-wall-decals",
    title: "Canvas & Wall Decals",
    short: "Canvas art and wall decals made to fit your space.",
    icon: "canvas",
    group: "Print & Decor",
    isNew: true,
    heading: ["Canvas &", "Wall Decals"],
    lead: "Art that lives on a wall, not on a screen. I design canvas prints and vinyl wall decals around the real room — its size, its light and the people in it — so every piece looks made for that wall, because it was.",
    promise: "Measured to the wall, made for the room.",
    image: "images/canvas-wall-decals-sample.jpg",
    caption: "Room proof — gallery-wrap canvas and a matte vinyl decal",
    secondary: { label: "See the pieces", to: "/services/canvas-wall-decals#pieces" },
    deliverables: [
      ["Artwork sized to your wall", "Built from real measurements, so it sits right above the sofa, the bed or the reception desk."],
      ["Canvas-ready files", "High-resolution artwork with gallery-wrap bleed, colour-managed for canvas stock."],
      ["Decal cut files", "Clean vector cut paths split into colour layers — SVG, AI and PDF, easy to weed."],
      ["Room mock-ups", "The design shown on a photo of your own wall before anything is printed."],
      ["Print & install guide", "Sizes, materials and an application sheet your printer and installer can follow."],
    ],
    steps: [
      ["Discovery", "Wall size, room, light and viewing distance — plus a photo of the space."],
      ["Direction", "A moodboard and two design routes, mocked up on your wall so you can compare."],
      ["Craft", "Final artwork built at full size, colour-proofed and prepared for canvas or vinyl."],
      ["Handover", "Print-ready files, cut paths and install notes, ready for your printer."],
    ],
    cta: {
      title: ["Let's dress", "your walls"],
      text: "Send a photo of the wall and its size. You will get a plan, a price and a date back — usually within a day, always from me.",
    },
    otherNote:
      "A finished wall often starts with a brand or a poster — and usually leads to matching print and social.",
    related: ["poster-design", "brand-identity", "product-labeling", "social-media-covers"],
    piecesNote:
      "Canvas prints and wall decals for homes, cafés and kids' rooms — each one designed around the wall it lives on.",
    pieces: [
      {
        title: "Statement Canvas",
        tile: ["Statement", "Canvas"],
        sub: "Living room · gallery-wrap canvas",
        image: "images/canvas-print-card.jpg",
        alt: "Large geometric canvas print above a linen sofa",
        subject: "Canvas print project",
      },
      {
        title: "Café Wall Decal",
        tile: ["Café", "Mural"],
        sub: "Matte vinyl · cut to the wall",
        image: "images/wall-decal-card.jpg",
        alt: "Geometric vinyl wall decal mural in a café",
        subject: "Wall decal project",
      },
      {
        title: "Canvas Triptych",
        tile: ["Canvas", "Triptych"],
        sub: "Bedroom · three-panel set",
        image: "images/canvas-triptych-card.jpg",
        alt: "Three-panel canvas set above a bed",
        subject: "Canvas triptych project",
      },
      {
        title: "Kids' Room Decals",
        tile: ["Kids'", "Room"],
        sub: "Removable vinyl · nursery",
        image: "images/kids-wall-decal-card.jpg",
        alt: "Playful wall decals in a children's room",
        subject: "Kids room wall decals",
      },
    ],
  },
].map((service, index, all) => ({
  cta: defaultCta,
  otherNote: defaultOtherNote,
  inMenu: true,
  ...service,
  number: String(index + 1).padStart(2, "0"),
  total: String(all.length).padStart(2, "0"),
}));

export const servicesIntro = {
  title: ["What I", "make"],
  note: "Ten ways I work with clients — from a single mark to a full site. Every one of them ends with files you own, on the date we agreed.",
};

export const workProcess = {
  note: "The same four steps whether it is one logo or a twenty-page site. You always know which step you are on.",
  steps: [
    ["Discovery", "Goals, audience and constraints written down before anything is drawn, so the brief cannot drift."],
    ["Direction", "Two routes, shown honestly — including the one I would not pick — so the choice is yours."],
    ["Craft", "The chosen route built out properly: type, colour, imagery and every state it needs."],
    ["Handover", "Source files, exports and a short guide, plus thirty days of questions afterwards."],
  ],
};


/* ---------- Home ---------------------------------------------- */

export const hero = {
  eyebrow: "Ahmad Abdullah · Graphic & Web Designer",
  // the middle word gets the selection box
  headline: ["Designs that", "refuse", "to be scrolled past."],
  lede: "Four years of logos, labels, posters and websites — built in Photoshop, Illustrator and code, for brands that want people to stop and look.",
  primary: { label: "Start a project", to: "/contact" },
  secondary: { label: "See the work", to: "/work" },
};

export const ticker = [
  "Logo design",
  "Brand identity",
  "Product labeling",
  "Flyers & posters",
  "Social media covers",
  "Infographics",
  "Canvas & wall decals",
  "UI / UX",
  "Responsive websites",
];

export const statement = {
  text: "I make the kind of work people stop for — then make sure it actually works. Three years deep in logos, labels, flyers, posters, social covers and infographics, one more building responsive websites in HTML, CSS and JavaScript.",
  metrics: [
    { value: 4, suffix: "+", label: "Years of design work" },
    { value: 50, suffix: "%", label: "Lift in a client's brand awareness" },
    { value: 25, suffix: "%", label: "More people at an event, from flyers and posters" },
    { value: 20, suffix: "%", label: "More online conversions after a rebuild" },
  ],
};

// sideways-panning service frames on the home page
export const serviceFrames = [
  { title: "Logo & Brand", text: "Marks you could draw from memory, and the system that keeps them consistent.", tags: ["Logo", "Identity", "Guidelines"], to: "/services/brand-identity", color: "#1a1814", file: "brand.ai" },
  { title: "Print & Packaging", text: "Labels that read from two metres, flyers built for two seconds.", tags: ["Labels", "Flyers", "Posters"], to: "/services/product-labeling", color: "#7c1034", file: "print.psd" },
  { title: "Social & Infographics", text: "Covers that survive every crop; data that makes one point first.", tags: ["Covers", "Templates", "Charts"], to: "/services/social-media-covers", color: "#0b5c9e", file: "social.psd" },
  { title: "Web & UI", text: "Responsive sites in HTML, CSS and JavaScript — fast on a mid-range phone.", tags: ["UI / UX", "Web design", "Build"], to: "/services/web-design", color: "#2b2b2e", file: "web.html" },
  { title: "Canvas & Wall Decals", text: "Art measured to the wall it lives on, mocked up in your room first.", tags: ["Canvas", "Vinyl", "Mock-ups"], to: "/services/canvas-wall-decals", color: "#5b4636", file: "decor.psd" },
];

// the Design Dynamo mark, built step by step on the home page
export const logoBuild = [
  { title: "Grid", text: "A 12 × 12 grid on a square, split down the middle." },
  { title: "Two circles", text: "Two circles of the same size, mirrored. Where they overlap, the waist of the DD appears." },
  { title: "Counters", text: "Two teardrop counters drawn as Bézier curves — one drawn, one mirrored." },
  { title: "Colour", text: "Burgundy on cream by day, lime on black by night." },
];

/* ---------- Skills, CV ----------------------------------------- */

// the CV's professional summary, word for word
export const aboutIntro = {
  title: "Designer first. Developer when it helps.",
  summary:
    "Creative and technically skilled Graphic and Web Designer with 4 years of professional experience, including 3 years focused on graphic design and 1 year in web design. My expertise spans logo creation, product labeling, flyers, posters, social media covers and infographics, combined with a solid foundation in web technologies including JavaScript, CSS and HTML. I am dedicated to delivering visually compelling and functional designs that meet client needs and enhance user experiences.",
};

export const skills = {
  // shown as Photoshop layers: the value is the layer's opacity
  layers: [
    { name: "Logo design", value: 95, color: "#ff5b2e" },
    { name: "Brand identity", value: 90, color: "#7c1034" },
    { name: "Infographics", value: 92, color: "#00a3e0" },
    { name: "Print & packaging", value: 88, color: "#e4007c" },
    { name: "UI / UX", value: 85, color: "#31a8ff" },
    { name: "HTML / CSS / JS", value: 82, color: "#ffe600" },
  ],
  software: [
    { id: "ps", label: "Ps", name: "Photoshop", bg: "#001e36", fg: "#31a8ff" },
    { id: "ai", label: "Ai", name: "Illustrator", bg: "#330000", fg: "#ff9a00" },
    { id: "fg", label: "Fg", name: "Figma", bg: "#1e1e1e", fg: "#a259ff" },
  ],
  attributes: [
    { icon: "spark", title: "Highly creative", text: "A strong passion for visual storytelling and design innovation." },
    { icon: "target", title: "Problem solver", text: "A meticulous approach to both design and development." },
    { icon: "chat", title: "Clear communicator", text: "A team player committed to client-centric solutions and meeting deadlines." },
  ],
  languages: [
    { name: "English", level: "Professional working proficiency" },
    { name: "Urdu", level: "Native or bilingual proficiency" },
  ],
};

export const achievements = [
  "Designed a logo and branding package that increased client brand awareness by 50%.",
  "Developed a product labeling system that improved product visibility and customer satisfaction.",
  "Created a series of engaging flyers and posters that resulted in a 25% increase in event attendance.",
  "Built and optimized a website that enhanced user experience and resulted in a 20% increase in online conversions.",
];

// Experience & education as Photoshop's History panel, oldest first
export const history = [
  {
    id: "matric",
    action: "Open",
    icon: "file",
    title: "Matric in Science",
    place: "The Future Science Academy, Gujranwala",
    when: "2019 — 2020",
    points: ["Where it started: science, numbers and a lot of drawing in the margins."],
  },
  {
    id: "ics",
    action: "New layer",
    icon: "layers",
    title: "ICS — Statistics",
    place: "The Informatics · Intermediate",
    when: "Intermediate",
    points: ["Computer science and statistics — the reason my infographics start from the data."],
  },
  {
    id: "graphic",
    action: "Brush tool",
    icon: "pen",
    title: "Graphic Designer",
    place: "Freelance",
    when: "Aug 2021 — Present",
    points: [
      "Crafted distinctive logos and brand identities that captured the essence of clients' businesses and enhanced brand recognition.",
      "Designed and produced product labels, flyers, posters and social media covers, effectively communicating key messages and driving engagement.",
      "Developed informative and visually engaging infographics to present data and concepts clearly.",
      "Collaborated closely with clients to understand their vision and provided creative solutions that met their objectives and deadlines.",
    ],
  },
  {
    id: "web",
    action: "Type tool",
    icon: "code",
    title: "Web Designer",
    place: "Freelance",
    when: "Jun 2023 — Present",
    points: [
      "Designed and developed responsive websites using HTML, CSS and JavaScript, ensuring optimal performance across devices and browsers.",
      "Created visually appealing and functional UI designs, incorporating client feedback and conducting usability tests to refine web interfaces.",
      "Worked collaboratively with developers and stakeholders to deliver high-quality web solutions that met project goals and timelines.",
    ],
  },
  {
    id: "now",
    action: "Snapshot",
    icon: "camera",
    title: "Right now",
    place: "Open for freelance — remote, worldwide",
    when: "2026",
    points: ["Taking on branding, print and web projects. The next history state could be yours."],
  },
];

/* ---------- Process (chat thread) ------------------------------ */

// Illustrative — shows how a project runs. Not a real client chat.
export const chat = [
  { day: "Day 1" },
  { from: "you", time: "10:02", text: "hey! need a logo + labels for my new tea brand 🍵" },
  { from: "me", time: "10:04", text: "love it. send whatever you've got — napkin sketches count." },
  { from: "you", time: "10:31", text: "brief's in. probably too much detail", file: "brief.pdf" },
  { day: "Day 2" },
  { from: "me", time: "15:10", text: "never too much. two routes ready 👀", file: "logo-routes.png" },
  { from: "you", time: "15:22", text: "route B. obviously." },
  { day: "Day 4" },
  { from: "me", time: "11:00", text: "final files + print-ready labels are in your inbox ✨", file: "tea-brand-final.zip" },
];

/* ---------- Reviews -------------------------------------------- */
// Client reviews are live data, not stored here: clients submit them on the
// site, you approve them in Supabase. See src/lib/reviews.js.

/* ---------- Pricing -------------------------------------------- */

export const packages = {
  note: "One monthly plan, billed through Fiverr. Slide to the amount of design you need — switch or cancel any time.",
  plans: [
    {
      tier: "Basic",
      name: "Starter",
      min: 79,
      max: 199,
      description: "For small businesses that need a steady flow of fresh, on-brand designs.",
      features: ["Up to 8 designs a month", "Social posts, covers & flyers", "Logo touch-ups & resizes", "2 revision rounds per design", "3–4 day delivery", "Print-ready PDF, PNG & JPG files"],
    },
    {
      tier: "Standard",
      name: "Growth",
      min: 199,
      max: 499,
      popular: true,
      description: "For growing brands that need print, social and packaging handled every month.",
      features: ["Up to 20 designs a month", "Labels, posters, infographics & social kits", "1 canvas or wall decal artwork a month", "Brand kit — logo files, colours & fonts", "3 revision rounds · 48-hour delivery", "Editable source files (AI, PSD, Figma)"],
    },
    {
      tier: "Premium",
      name: "Pro",
      min: 499,
      max: 999,
      description: "For businesses that want one designer for everything — brand, print and web.",
      features: ["Up to 40 designs a month", "Full brand identity & guidelines", "UI / UX + 1 responsive web page a month", "Canvas & wall decal collections", "Unlimited revisions · 24-hour priority", "Monthly design call & priority support"],
    },
  ],
};

/* ---------- Work ----------------------------------------------- */

// Folders in media-source/projects (lower-cased after `npm run images`).
export const archiveCategories = [
  { id: "logo-branding", title: "Logo & Branding" },
  { id: "codesparkwork", title: "CodeSpark Solutions" },
  { id: "canvas-design", title: "Canvas Design" },
  { id: "custom-wall-decals", title: "Wall Decals" },
  { id: "recent-projects", title: "Poster Collections" },
  { id: "my-prduct-post-practice-work", title: "Product Posts" },
  { id: "illustration", title: "Illustration" },
];

// Display titles for images whose file names are typos or unclear.
// Key = path below media-source/projects, lower-cased, without extension.
export const imageTitles = {
  "codesparkwork/code-spark-logo": "CodeSpark logo",
  "codesparkwork/business-card": "CodeSpark business card",
  "codesparkwork/code-spark-broushre-outsid-back": "CodeSpark brochure — outside",
  "codesparkwork/code-spark-broushre-inside-front": "CodeSpark brochure — inside",
};

/* Case studies, built from the archive.
   DRAFT COPY: the brief / approach / outcome text below is a starting
   point written from the images — correct it with the real story, and
   never add results that didn't happen. */
export const caseStudies = [
  {
    slug: "codespark-solutions",
    client: "CodeSpark Solutions",
    title: "One spark, from logo to print.",
    category: "Brand identity, print & social",
    tags: ["Logo", "Business card", "Tri-fold brochure", "Social posts", "Course launch"],
    tools: ["Illustrator", "Photoshop"],
    accent: "#2a5bd7",
    cover: "codesparkwork/code-spark-logo",
    // the brand pieces, shown large before the gallery of posts
    features: [
      { key: "codesparkwork/code-spark-logo", caption: "Logo — construction, colour variations and concept" },
      { key: "codesparkwork/business-card", caption: "Business card — front, and a back styled as a code editor" },
      { key: "codesparkwork/code-spark-broushre-outsid-back", caption: "Tri-fold brochure — outside: about, contact and cover" },
      { key: "codesparkwork/code-spark-broushre-inside-front", caption: "Tri-fold brochure — inside: services, process and training" },
    ],
    folder: "codesparkwork",
    summary: "The CodeSpark Solutions identity — a logo of coding brackets and a lightning-bolt S — carried onto a business card, a tri-fold brochure and a campaign of course, countdown and hiring posts.",
    brief: "A software house running courses (Flutter, AI, graphic design) and hiring needed a mark that says code and speed, print pieces to hand out, and a stream of posts that still looks like one brand.",
    approach: "The icon is built from coding brackets, and the S in CODESPARK is a lightning bolt — fast, powerful, pointing forward. The business card's back reads like a code editor; the brochure keeps the blue angles and lays out services, process and training programmes. The same blue gradient carries into every post: oversized numerals for countdowns, bold module titles for courses, one footer throughout.",
    outcome: "A logo system with construction grid and colour variations, a business card, a tri-fold brochure (outside and inside), and the social campaign: countdowns, course modules, service posts and hiring announcements.",
  },
  {
    slug: "zeemahdi",
    client: "zeeMahdi",
    title: "A friendly mark that works everywhere it lands",
    category: "Logo & applications",
    tags: ["Logo", "Icon", "Merch", "Signage"],
    tools: ["Illustrator", "Photoshop"],
    accent: "#f5c400",
    cover: "logo-branding/02/a-logo",
    images: ["logo-branding/02/a-logo"],
    summary: "A rounded, character-led logo tested on caps, signage, patterns and screens.",
    brief: "A personal brand that needed a mark with personality — recognisable as a tiny avatar and big on a wall.",
    approach: "A soft, rounded icon in a single bold yellow, paired with a clean wordmark, then stress-tested across merch, signage and dark and light backgrounds.",
    outcome: "A logo system with icon, wordmark and real-world mock-ups showing it in use.",
  },
  {
    slug: "canvas-collection",
    client: "Canvas collection",
    title: "Cool pets, a golden deer, and the walls they live on",
    category: "Canvas design",
    tags: ["Canvas", "Illustration", "Room mock-ups"],
    tools: ["Photoshop", "Illustrator"],
    accent: "#2c5d6e",
    cover: "canvas-design/02/mockup",
    folder: "canvas-design",
    compare: {
      before: "canvas-design/02/deer-canvas-design",
      after: "canvas-design/02/mockup",
      labels: ["Artwork", "On the wall"],
    },
    summary: "A pop-art pet triptych and a gold-and-teal deer canvas, each shown in a real room before anything is printed.",
    brief: "Canvas art only works if it suits the room. Each piece had to be designed with the wall, the furniture and the light in mind.",
    approach: "Bold flat illustration with paper texture for the pets; layered gold, marble and teal for the deer. Every piece is mocked up in an interior to check scale and colour.",
    outcome: "Print-ready canvas artwork plus room mock-ups for both collections.",
  },
  {
    slug: "boho-wall-decals",
    client: "Wall decal series",
    title: "Botanical shapes, measured to the wall",
    category: "Wall decals",
    tags: ["Vinyl decals", "Boho", "Illustration"],
    tools: ["Illustrator"],
    accent: "#c46a2c",
    cover: "custom-wall-decals/03",
    folder: "custom-wall-decals",
    summary: "A boho set of leaves, arches and suns in earthy tones — designed as clean vector shapes ready for cutting.",
    brief: "Decals have to be beautiful and cuttable: every shape needs to survive a vinyl plotter and a nervous first application.",
    approach: "Simple silhouettes, a warm limited palette and shapes that separate cleanly into colour layers.",
    outcome: "A series of decal designs with cut-ready vector files.",
  },
];

/* ---------- Contact -------------------------------------------- */

export const contact = {
  lead: "Tell me what you're making, who it's for and when it needs to be live. You'll get a plan, a price and a date back — usually within a day, always from me.",
  channels: [
    { key: "Email", value: site.email, note: "Fastest. Usually answered the same day.", href: `mailto:${site.email}`, copy: site.email },
    { key: "Phone / WhatsApp", value: site.phone, note: "Calls and messages, KSA working hours.", href: site.phoneHref, copy: site.phone },
    { key: "Location", value: site.location, note: "Based in Riyadh, with clients in every time zone." },
    { key: "Fiverr", value: "Monthly plans", note: "Order a design subscription directly.", href: site.fiverrUrl, external: true },
  ],
  needs: ["Logo", "Brand identity", "Labels & packaging", "Flyers & posters", "Social media", "Infographics", "Canvas & decals", "Website / UI"],
  budgets: ["Under $200", "$200 – $500", "$500 – $1,000", "$1,000+"],
  timelines: ["This week", "This month", "Flexible"],
};

/* ---------- Legal ---------------------------------------------- */

export const legal = {
  updated: "October 2026",
  sections: [
    {
      id: "privacy",
      title: "Privacy Policy",
      paragraphs: [
        `This site is run by ${site.name} (${site.studio}), based in Riyadh, Kingdom of Saudi Arabia. It does not run analytics, advertising cookies or account systems.`,
        "When you send a brief, your browser sends it to this site's own server — no mail app opens and no third-party form service sees it. The server stores what you typed (your name, email, what you need, budget, timing, message and the language you used) in a private database that only I can read, and emails me a copy so I can reply. To stop spam it also keeps a one-way scrambled code made from your connection's IP address; the address itself is not stored and the code cannot be turned back into it.",
        "I keep a brief for as long as it takes to answer it and, where a project follows, for the length of that project and the record-keeping period my accounts require. Briefs that don't lead to a project are deleted once they're no longer needed.",
        "Reviews you leave are stored in the same private database: your name, the optional role, service, project and photo, your rating and your words. Nothing is published until I approve it, and I'll remove a review on request.",
        "The site is hosted by Vercel and the database by Supabase; emails about new briefs are sent through Resend. These services process the data only to run the site, and their servers may be outside Saudi Arabia. Search on this site runs entirely in your browser — what you type into it is never sent anywhere.",
        `Your details are never sold, rented or handed to anyone for marketing. You can ask what I hold about you, ask me to correct it, or ask me to delete it — write to ${site.email} and I will confirm when it is done.`,
      ],
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      paragraphs: [
        "Sending a brief through this site is an enquiry, not an order: a project starts only once you have accepted a written quote. The site is available in English and Arabic; both say the same thing, and if anything reads differently, ask me and I'll clarify in writing.",
        "Quotes are valid for thirty days and cover the deliverables listed in them. Work starts on receipt of the agreed deposit. Two rounds of revisions are included on each deliverable; further rounds are billed at the hourly rate agreed up front.",
      ],
      list: [
        "Final artwork is released once the balance is settled.",
        "Source files and their usage rights transfer to you on final payment.",
        "Third-party assets — fonts, stock imagery, licences — stay under their own terms.",
        "Dates depend on feedback arriving within the turnaround we agree at kickoff.",
      ],
    },
    {
      id: "cookies",
      title: "Cookie Policy",
      paragraphs: [
        "There are no cookies on this site. Your browser stores four small preferences locally — English or Arabic, light or dark theme, sound on or off, and whether you have already seen the intro animation. They never leave your device; no profile is built and nothing tracks you across sites.",
      ],
    },
  ],
};

/* ---------- Footer --------------------------------------------- */

export const footer = {
  headline: ["Got an idea", "worth printing?"],
  links: [
    { label: "Work", to: "/work" },
    { label: "Services", to: "/services" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Pricing", to: "/services#pricing" },
  ],
  legal: [
    { label: "Privacy", to: "/legal#privacy" },
    { label: "Terms", to: "/legal#terms" },
    { label: "Cookies", to: "/legal#cookies" },
  ],
};

/* ---------- Search ----------------------------------------------- */

// Quick answers the search shows for questions people actually type
// ("where is he based", "price", "how fast"). `terms` are extra words to
// match; `to` is where the result opens.
export const searchFacts = [
  { title: "Based in Riyadh, KSA", text: "Working with clients in Saudi Arabia and worldwide, remotely.", terms: "location address city country saudi arabia riyadh ksa where based", to: "/contact" },
  { title: "4+ years of design experience", text: "3 years in graphic design, 1 in web design — freelance since August 2021.", terms: "experience years how long since career", to: "/about" },
  { title: "Replies within a day", text: "Send a brief or an email — the answer comes from me, usually the same day.", terms: "response time how fast reply turnaround quick", to: "/contact" },
  { title: "Monthly plans from $79", text: "Starter $79–199, Growth $199–499, Pro $499–999 a month, ordered through Fiverr.", terms: "price pricing cost rates budget how much fee plans subscription fiverr", to: "/services#pricing" },
  { title: "Photoshop, Illustrator, Figma, CorelDRAW", text: "Plus HTML, CSS and JavaScript for websites.", terms: "tools software apps programs adobe ps ai figma corel code html css javascript", to: "/about#skills" },
  { title: "English and Urdu", text: "Professional English, native Urdu — and this site in Arabic.", terms: "languages speak english urdu arabic", to: "/about#skills" },
  { title: "Open for projects · 2026", text: "Taking on branding, print and web work now.", terms: "available availability hire freelance open now", to: "/contact" },
  { title: "Phone / WhatsApp +966 59 808 1132", text: "Calls and messages in KSA working hours.", terms: "phone whatsapp call number mobile contact", to: "/contact" },
  { title: "Email official.ahmedabdullah@gmail.com", text: "The fastest way to reach me.", terms: "email mail gmail contact write", to: "/contact" },
];
