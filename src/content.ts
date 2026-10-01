// Everything on the page lives here. Sources: Praveen's LinkedIn
// (linkedin.com/in/praveens2) and praveen-the-dev.vercel.app, Sep 2026.
//
// Images: upGrad, Delightree and kookooVoice use their store listings (see
// `apps`). Reevo and Invia have nothing public, so they get a drawn
// `placeholder`; real screenshots can replace it via `screen` (drop them in
// /public/work). The hero phones use Praveen's own screenshots (/public/hero).

export const site = {
  name: "Praveen Singh",
  // The live domain. Canonical URLs, the sitemap and structured data are
  // built from it (see src/lib/seo.ts). Must match the primary domain in
  // Vercel, which redirects the bare domain to www.
  url: "https://www.praveensingh.co.in",
  role: "Senior React Native Engineer",
  email: "praveen.codeit@gmail.com",
  github: "https://github.com/psingh2907",
  linkedin: "https://www.linkedin.com/in/praveens2/",
  resume: "/Praveen_Singh_Senior_React_Native_Developer.pdf",
  vcard: "/praveen-singh.vcf",
  // 512px square crop. The share image and contact card use their own copies
  // (src/assets/og/photo.png, src/assets/vcard/photo.jpg); update all three together.
  photo: "/praveen.webp",
  location: "Noida, India",
  description:
    "Praveen Singh is a Senior React Native Engineer with 5+ years shipping high-performance Android and iOS apps across fintech, edtech and telecom.",
  // "Developer" is how most people search for the role, so the page title
  // and search snippets use it; the rest of the site says "Engineer".
  searchTitle: "Praveen Singh, Senior React Native Developer (iOS and Android)",
  // Bump when the content changes; the sitemap reports it to search engines.
  updated: "2026-09-30",
};

// Shown in the hero phone's Dynamic Island and the desktop notification.
export const availability = {
  short: "Open to work",
  notification:
    "Open to Senior React Native and mobile roles, and can join immediately. Remote, hybrid or on-site. Want to talk?",
};

export const hero = {
  headline: "I build apps that stay fast in production.",
  subtext:
    "I'm Praveen Singh, a Senior React Native engineer with 5+ years shipping scalable Android and iOS apps across fintech, edtech and telecom, from architecture to App Store.",
  // Praveen's own screenshots, with names and profile pictures blurred. Front
  // is shown in an iPhone frame, back in an Android one (see hero.tsx).
  screens: {
    front: { src: "/hero/upgrad-iphone.webp", alt: "upGrad app home screen: ongoing programs and course progress" },
    back: { src: "/hero/delightree-android.webp", alt: "Delightree app home screen: announcements and franchise locations" },
  },
};

export type Metric = { label: string; before: string; after: string; change: string };

/** `src` is the full 900px image; `thumb` a 300px copy for the card strip. */
export type Screenshot = { src: string; thumb: string; alt: string; width: number; height: number };

// A live store listing. Screenshots are the listing's own marketing images
// (caption and device frame included), saved to /public/work so a store
// update can't break them.
export type StoreApp = {
  name: string;
  icon: string;
  category: string;
  ios?: string;
  android?: string;
  /** The app's public store rating. Leave out when there are too few ratings to mean much. */
  rating?: { value: string; count: string; store: string };
  screenshots: Screenshot[];
};

export type Project = {
  /** URL of the case study page, /work/<slug>. Changing it breaks inbound links. */
  slug: string;
  name: string;
  company: string;
  domain: string;
  summary: string;
  platforms: string;
  stack: string[];
  year: string;
  /** Phone-frame screenshot, for projects without store listings. */
  screen?: string;
  /** Store listings. When present, the card shows these instead of `screen`. */
  apps?: StoreApp[];
  /**
   * For a product that no longer exists as built: shown as a "Retired"
   * badge plus this note. Don't link a store listing that now shows
   * someone else's app.
   */
  retired?: string;
  /**
   * Drawn when there is nothing real to show: a wireframe screen in a phone
   * (a credit card app or a usage dashboard), tagged "Illustration".
   * `caption` is what screen readers hear. Never a mock screenshot.
   */
  placeholder?: { kind: "card" | "dashboard"; caption: string };
  /** Context shown under the summary, without the "Retired" badge. */
  note?: string;
  /** What was built, for work that can't be shown app by app (e.g. agency clients). */
  capabilities?: { icon: "payments" | "nfc" | "ble"; title: string; body: string }[];
  metrics?: Metric[];
  href?: string;
  /**
   * The case study page's opening: the problem the app had to solve. What
   * was built comes from `summary`, the matching `experience` entry and
   * `capabilities`, so keep this to the brief and don't repeat them.
   */
  challenge: string;
};

const shots = (app: string, width: number, height: number, alts: string[]): Screenshot[] =>
  alts.map((alt, i) => ({
    src: `/work/${app}/${i + 1}.webp`,
    thumb: `/work/${app}/${i + 1}-thumb.webp`,
    alt,
    width,
    height,
  }));

export const projects: Project[] = [
  {
    slug: "upgrad",
    name: "upGrad Learning",
    company: "upGrad",
    domain: "Edtech",
    summary:
      "The learning app for upGrad's global learner base. Adaptive-bitrate course video through native Swift and Kotlin modules, offline downloads with encrypted storage, and CodePush for fixes without a store release.",
    challenge:
      "upGrad's learners watch long course videos on every kind of phone and network, often offline, and a bug in a learning app can't wait days for store review.",
    platforms: "iOS and Android",
    stack: ["React Native", "TypeScript", "Brightcove SDK", "Fastlane"],
    year: "2025",
    apps: [
      {
        name: "upGrad",
        icon: "/work/upgrad/icon.webp",
        category: "Education",
        ios: "https://apps.apple.com/in/app/upgrad/id1191301447",
        android: "https://play.google.com/store/apps/details?id=com.upgrad.student",
        rating: { value: "4.6", count: "8.2K", store: "App Store" },
        screenshots: shots("upgrad", 900, 1948, [
          "Explore: programs from top universities",
          "Plan: a calendar of events and deadlines",
          "Learn: an AI-powered course module",
          "Engage: chat with industry experts",
        ]),
      },
      {
        name: "upGrad Living",
        icon: "/work/upgrad-living/icon.webp",
        category: "Student housing",
        ios: "https://apps.apple.com/in/app/upgrad-living/id6448984912",
        android: "https://play.google.com/store/apps/details?id=com.upgrad.living",
        screenshots: shots("upgrad-living", 900, 1600, [
          "Quick log-in for residents",
          "Today's meal menu",
          "Services and amenities",
        ]),
      },
    ],
    metrics: [
      { label: "Cold start (p50)", before: "2.9s", after: "1.8s", change: "−38%" },
      { label: "Release cycle", before: "5 days", after: "3 days", change: "−40%" },
    ],
  },
  {
    slug: "reevo",
    name: "Reevo",
    company: "Gojoko Technologies",
    domain: "Fintech",
    summary:
      "A credit card app for a UK fintech: card management, transactions and payments, with Visa 3-D Secure, biometric sign-in and hardening against the OWASP Mobile Top 10.",
    challenge:
      "A UK credit card had to handle card management, transactions and payments with the security a regulated card product needs, and stay smooth on everyday phones.",
    platforms: "iOS and Android",
    stack: ["React Native", "GraphQL", "Apollo", "Biometrics"],
    year: "2024",
    // The Play listing (com.reevomoney) now hosts a different loans app,
    // so it's deliberately not linked.
    retired: "The card product has since been retired. Numbers are from its production builds.",
    placeholder: { kind: "card", caption: "a credit card app: card, balance, transactions and payments" },
    metrics: [
      { label: "API response", before: "~850ms", after: "~595ms", change: "−30%" },
      { label: "Frame drops", before: "9.2%", after: "3.8%", change: "−58%" },
    ],
  },
  {
    slug: "delightree",
    name: "Delightree",
    company: "Delightree",
    domain: "Operations",
    summary:
      "Franchise operations for 150+ brands. Offline-first audits with photo capture and queued sync, AI-powered SOP search, and checklists moved to FlashList to kill scroll jank.",
    challenge:
      "Franchise teams run audits and checklists in stores and kitchens with patchy signal, across 150+ brands with different roles, locations and permissions.",
    platforms: "iOS and Android",
    stack: ["React Native", "TypeScript", "FlashList", "Crashlytics"],
    year: "2026",
    apps: [
      {
        name: "Delightree",
        icon: "/work/delightree/icon.webp",
        category: "Productivity",
        ios: "https://apps.apple.com/in/app/delightree/id1505988671",
        android: "https://play.google.com/store/apps/details?id=com.delightree",
        screenshots: shots("delightree", 900, 1600, [
          "Home: today's tasks, trainings and SOPs",
          "Task details with step-by-step checklist",
          "Team chat",
          "Milestone-based training documents",
          "Training video player",
          "An in-app knowledge check",
        ]),
      },
    ],
  },
  {
    slug: "invia-telecom",
    name: "Invia Telecom",
    company: "Invia",
    domain: "Telecom",
    summary:
      "An enterprise telecom app for real-time usage, billing and alert monitoring, built to security compliance on a tight timeline.",
    challenge:
      "Enterprise customers needed real-time usage, billing and alerts on their phones, to security compliance and on a tight timeline.",
    platforms: "iOS and Android",
    stack: ["React Native", "TypeScript", "TanStack Query"],
    year: "2025",
    placeholder: { kind: "dashboard", caption: "usage, billing and alerts" },
    note: "Enterprise app distributed privately, so it isn't on public app stores.",
    metrics: [
      { label: "Widget refresh", before: "3.2s", after: "1.9s", change: "−41%" },
      { label: "Stale-data tickets", before: "100%", after: "62%", change: "−38%" },
    ],
  },
  {
    slug: "client-apps",
    name: "Client apps: payments, NFC and BLE",
    company: "WebMobril Technologies",
    domain: "IoT and Commerce",
    summary:
      "8 to 10 production apps for agency clients across e-commerce, NFC and IoT, most of them needing native code alongside React Native.",
    challenge:
      "Agency clients across e-commerce, NFC and IoT each needed a production app, and most of them needed native code that React Native doesn't ship with.",
    platforms: "iOS and Android",
    stack: ["React Native", "Kotlin", "Stripe", "NFC", "BLE"],
    year: "2021 to 2023",
    capabilities: [
      { icon: "payments", title: "Payments", body: "Stripe checkout with saved cards and refunds." },
      { icon: "nfc", title: "NFC", body: "Tag-based authentication through a custom Kotlin module." },
      { icon: "ble", title: "BLE", body: "Real-time control of connected hardware, like the kookooVoice toy." },
    ],
    note: "Built for agency clients, who own and publish the apps, so most aren't linked here.",
    apps: [
      {
        name: "kookooVoice",
        icon: "/work/kookoo/icon.webp",
        category: "Talking toy over BLE",
        android: "https://play.google.com/store/apps/details?id=com.kookoovoicetoy",
        screenshots: shots("kookoo", 900, 1915, [
          "Home: connect the toy, record and play stories",
          "Welcome and sign-in",
          "Menu: community, tutorials and shop",
          "Sign-up with parental consent",
        ]),
      },
    ],
  },
];

export type Job = {
  company: string;
  title: string;
  start: string;
  end: string;
  place: string;
  points: string[];
};

export const experience: Job[] = [
  {
    company: "Delightree",
    title: "Senior React Native Developer",
    start: "Mar 2026",
    end: "Aug 2026",
    place: "Remote",
    points: [
      "Built offline-first audit and checklist flows with media capture and queued sync.",
      "Shipped AI-powered SOP search with role, location and permission-based access.",
      "Automated Play Store and App Store releases with Fastlane, GitHub Actions and OTA updates.",
    ],
  },
  {
    company: "upGrad",
    title: "Software Developer II (React Native)",
    start: "Jan 2025",
    end: "Feb 2026",
    place: "Noida, hybrid",
    points: [
      "Architected and scaled the learning app for Android and iOS.",
      "Bridged Brightcove video through native Swift and Kotlin modules.",
      "Cut release cycle time by 40% with Fastlane and GitHub Actions.",
    ],
  },
  {
    company: "Invia",
    title: "Software Developer L2",
    start: "Nov 2024",
    end: "Jan 2025",
    place: "Noida",
    points: ["Built an enterprise telecom app for real-time usage, billing and alerts."],
  },
  {
    company: "Gojoko Technologies",
    title: "React Native Developer",
    start: "Aug 2023",
    end: "Sep 2024",
    place: "Noida, on-site",
    points: [
      "Built the Reevo credit card app for a UK fintech.",
      "Integrated Visa APIs and 3-D Secure; sped up APIs 30% with Apollo caching.",
    ],
  },
  {
    company: "WebMobril Technologies",
    title: "React Native Developer",
    start: "Sep 2021",
    end: "Aug 2023",
    place: "Noida",
    points: ["Delivered 8 to 10 production apps across e-commerce, NFC and IoT."],
  },
];

export const education = {
  school: "Priyadarshini Bhagwati College of Engineering, Nagpur",
  degree: "B.E., Computer Science and Engineering",
  years: "2013 to 2017",
};

export const certifications = [
  { name: "React, 87th percentile", issuer: "TestGorilla", date: "Aug 2026" },
  { name: "React Native, 84th percentile", issuer: "TestGorilla", date: "Aug 2026" },
  { name: "Generative AI Foundations", issuer: "upGrad", date: "May 2025" },
  { name: "Certified React Native, Basic", issuer: "Cutshort", date: "Sep 2024" },
];

// LinkedIn recommendations, quoted as written. Two are excerpts (marked
// with an ellipsis); ask Praveen before editing the wording.
export const recommendations = [
  {
    name: "Praveen Tripathi",
    role: "Engineering Manager, ex-upGrad",
    relation: "Managed Praveen directly",
    quote:
      "I had the opportunity to work with Praveen Singh on multiple projects, and he consistently demonstrated a strong work ethic and excellent development skills. His working style is structured, proactive, and focused on delivering quality results. Praveen has solid experience in React Native, JavaScript, and TypeScript, and he handles complex features with confidence. … I highly recommend Praveen for any mobile development role where ownership, quality, and reliability are important.",
  },
  {
    name: "Kapish Singh",
    role: "Full-Stack Engineer",
    relation: "Reported to Praveen",
    quote: "…although he is humble for everyone if the problem is given to praveen it's already been solved",
  },
  {
    name: "Sandeep Tiwari",
    role: "Senior React Native Developer",
    relation: "Same team",
    quote:
      "Praveen has very good skills set in terms of logic in javascript and react native. He is good to resolve any issue in coding. …",
  },
];

// Engineering approach, shown as a Reminders list.
export const process = [
  {
    title: "Architecture",
    body: "Domain-driven module boundaries, local-first sync for unstable networks, and typed API contracts with normalised errors.",
  },
  {
    title: "Performance",
    body: "Release-mode FPS and render profiling, startup instrumentation with regression alerts, list virtualisation and deferred rendering.",
  },
  {
    title: "Native when it matters",
    body: "Swift and Kotlin modules for video, NFC and BLE, plus React Native version upgrades and New Architecture adoption.",
  },
  {
    title: "Delivery pipeline",
    body: "Fastlane lanes for repeatable releases, GitHub Actions quality gates, and OTA updates for fixes that can't wait for review.",
  },
  {
    title: "Production",
    body: "Crashlytics, Sentry and Datadog watching every release, and rollback-first playbooks so a bad build is a non-event.",
  },
];

// Keys must match exports from the `simple-icons` package.
export const stack = [
  { icon: "siReact", label: "React Native" },
  { icon: "siTypescript", label: "TypeScript" },
  { icon: "siJavascript", label: "JavaScript" },
  { icon: "siGraphql", label: "GraphQL" },
  { icon: "siApollographql", label: "Apollo" },
  { icon: "siRedux", label: "Redux Toolkit" },
  { icon: "siMobx", label: "MobX" },
  { icon: "siReactquery", label: "TanStack Query" },
  { icon: "siSwift", label: "Swift" },
  { icon: "siKotlin", label: "Kotlin" },
  { icon: "siFastlane", label: "Fastlane" },
  { icon: "siGithubactions", label: "GitHub Actions" },
  { icon: "siFirebase", label: "Firebase" },
  { icon: "siSentry", label: "Sentry" },
  { icon: "siDatadog", label: "Datadog" },
  { icon: "siStripe", label: "Stripe" },
  { icon: "siJest", label: "Jest" },
  { icon: "siXcode", label: "Xcode" },
  { icon: "siAndroidstudio", label: "Android Studio" },
  { icon: "siGit", label: "Git" },
] as const;

export const about = {
  initials: "PS",
  // Tap it seven times, like on Android.
  build: "PSRN.170601.005",
  statement:
    "I enjoy the hard parts of mobile: React Native upgrades and New Architecture migrations, native integrations, production memory leaks, and lists that have to scroll smoothly on a cheap Android phone. I build apps that stay scalable, reliable and fast long after launch.",
  facts: [
    { label: "Experience", value: "5+ years, Android and iOS" },
    { label: "Focus", value: "Architecture, performance, CI/CD" },
    { label: "Based in", value: "Noida, India" },
    { label: "Education", value: "B.E. Computer Science, 2017" },
    { label: "Open to", value: "Senior React Native and mobile roles, consulting" },
    { label: "Joining", value: "Immediately. Remote, hybrid or on-site" },
  ],
};

// Straight answers to what recruiters and AI search tools ask, shown in the
// FAQ window and published as FAQPage structured data. Each answer stands on
// its own (it may be quoted without the question), so it names Praveen.
export const faq = [
  {
    question: "Who is Praveen Singh?",
    answer:
      "Praveen Singh is a Senior React Native engineer based in Noida, India, with 5+ years building Android and iOS apps. He has shipped apps for upGrad, Delightree, Gojoko Technologies (the Reevo credit card), Invia and agency clients at WebMobril Technologies.",
  },
  {
    question: "Is Praveen Singh available to hire?",
    answer:
      "Yes. Praveen is open to Senior React Native and mobile roles and to consulting, and can join immediately. He works remote, hybrid or on-site from Noida (Delhi NCR).",
  },
  {
    question: "Which apps has Praveen Singh built?",
    answer:
      "Praveen worked on the upGrad learning app (rated 4.6 on the App Store from 8.2K ratings), upGrad Living, Delightree's franchise operations app, the Reevo credit card app for a UK fintech, an enterprise telecom app for Invia, and 8 to 10 agency apps including kookooVoice, a talking toy controlled over Bluetooth.",
  },
  {
    question: "Does Praveen write native iOS and Android code?",
    answer:
      "Yes. Alongside React Native and TypeScript, Praveen writes Swift and Kotlin modules: Brightcove video playback at upGrad, NFC tag authentication and Bluetooth Low Energy device control for agency clients. He also handles React Native upgrades and New Architecture adoption.",
  },
  {
    question: "What results has Praveen delivered?",
    answer:
      "At upGrad, Praveen cut median cold start from 2.9s to 1.8s and the release cycle from 5 days to 3. On the Reevo credit card app, API responses got about 30% faster with Apollo caching and frame drops fell from 9.2% to 3.8%.",
  },
  {
    question: "How do I contact Praveen Singh?",
    answer:
      "Email praveen.codeit@gmail.com or message Praveen on LinkedIn at linkedin.com/in/praveens2. He replies within 24 hours.",
  },
];
