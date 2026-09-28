// Everything on the page lives here. Sources: Praveen's LinkedIn
// (linkedin.com/in/praveens2) and praveen-the-dev.vercel.app, Sep 2026.
//
// Images: there are no app screenshots yet. Drop real ones into
// /public/work (e.g. 1170x2532 PNGs) and point `screen` at
// "/work/reevo.png". Picsum URLs are stand-ins.

export const site = {
  name: "Praveen Singh",
  role: "Senior React Native Engineer",
  email: "praveen.codeit@gmail.com",
  github: "https://github.com/praveens2",
  linkedin: "https://www.linkedin.com/in/praveens2/",
  resume: "/Praveen_Singh_Resume.pdf",
  vcard: "/praveen-singh.vcf",
  location: "Noida, India",
  description:
    "Praveen Singh is a Senior React Native Engineer with 5+ years shipping high-performance Android and iOS apps across fintech, edtech and telecom.",
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
  screens: {
    front: "https://picsum.photos/seed/praveen-hero-front/390/844",
    back: "https://picsum.photos/seed/praveen-hero-back/390/844",
  },
};

export type Metric = { label: string; before: string; after: string; change: string };

export type Project = {
  name: string;
  company: string;
  domain: string;
  summary: string;
  platforms: string;
  stack: string[];
  year: string;
  screen: string;
  metrics?: Metric[];
  href?: string;
};

export const projects: Project[] = [
  {
    name: "upGrad Learning",
    company: "upGrad",
    domain: "Edtech",
    summary:
      "The learning app for upGrad's global learner base. Adaptive-bitrate course video through native Swift and Kotlin modules, offline downloads with encrypted storage, and CodePush for fixes without a store release.",
    platforms: "iOS and Android",
    stack: ["React Native", "TypeScript", "Brightcove SDK", "Fastlane"],
    year: "2025",
    screen: "https://picsum.photos/seed/upgrad-learning/390/844",
    metrics: [
      { label: "Cold start (p50)", before: "2.9s", after: "1.8s", change: "−38%" },
      { label: "Release cycle", before: "5 days", after: "3 days", change: "−40%" },
    ],
  },
  {
    name: "Reevo",
    company: "Gojoko Technologies",
    domain: "Fintech",
    summary:
      "A credit card app for a UK fintech: card management, transactions and payments, with Visa 3-D Secure, biometric sign-in and hardening against the OWASP Mobile Top 10.",
    platforms: "iOS and Android",
    stack: ["React Native", "GraphQL", "Apollo", "Biometrics"],
    year: "2024",
    screen: "https://picsum.photos/seed/reevo-card/390/844",
    metrics: [
      { label: "API response", before: "~850ms", after: "~595ms", change: "−30%" },
      { label: "Frame drops", before: "9.2%", after: "3.8%", change: "−58%" },
    ],
  },
  {
    name: "Delightree",
    company: "Delightree",
    domain: "Operations",
    summary:
      "Franchise operations for 150+ brands. Offline-first audits with photo capture and queued sync, AI-powered SOP search, and checklists moved to FlashList to kill scroll jank.",
    platforms: "iOS and Android",
    stack: ["React Native", "TypeScript", "FlashList", "Crashlytics"],
    year: "2026",
    screen: "https://picsum.photos/seed/delightree-ops/390/844",
  },
  {
    name: "Invia Telecom",
    company: "Invia",
    domain: "Telecom",
    summary:
      "An enterprise telecom app for real-time usage, billing and alert monitoring, built to security compliance on a tight timeline.",
    platforms: "iOS and Android",
    stack: ["React Native", "TypeScript", "TanStack Query"],
    year: "2025",
    screen: "https://picsum.photos/seed/invia-telecom/390/844",
    metrics: [
      { label: "Widget refresh", before: "3.2s", after: "1.9s", change: "−41%" },
      { label: "Stale-data tickets", before: "100%", after: "62%", change: "−38%" },
    ],
  },
  {
    name: "NFC, IoT and Commerce",
    company: "WebMobril Technologies",
    domain: "IoT and Commerce",
    summary:
      "8 to 10 production apps for clients: Stripe checkout with saved cards and refunds, NFC authentication through custom Kotlin modules, and BLE apps that control connected hardware in real time.",
    platforms: "iOS and Android",
    stack: ["React Native", "Stripe", "NFC", "BLE"],
    year: "2023",
    screen: "https://picsum.photos/seed/webmobril-iot/390/844",
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
