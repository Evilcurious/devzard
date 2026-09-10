import {
  Server,
  LayoutTemplate,
  Sparkles,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

export type Product = {
  slug: string;
  icon: LucideIcon;
  name: string;
  tagline: string;
  desc: string;
  longDesc: string;
  price: string;
  unit: string;
  gradient: string;
  accent: string;
  popular: boolean;
  features: { title: string; desc: string }[];
  benefits: string[];
  faqs: { q: string; a: string }[];
  stats: { value: string; label: string }[];
  plans: { name: string; price: string; features: string[]; highlight?: boolean }[];
};

export const products: Product[] = [
  {
    slug: "servers",
    icon: Server,
    name: "Blazing Servers",
    tagline: "High-performance hosting & dedicated servers",
    desc: "NVMe-powered shared, VPS and dedicated servers with global edge caching, free SSL and 24/7 human support.",
    longDesc:
      "Whether you're launching a small blog or a high-traffic SaaS, our server infrastructure is engineered for speed, reliability and peace of mind. NVMe SSD storage, 99.9% uptime SLA, free SSL & CDN, daily backups and a real human support team — all in one plan.",
    price: "$4.99",
    unit: "/mo",
    gradient: "from-brand-500 to-cyan-400",
    accent: "bg-brand-50 text-brand-700",
    popular: false,
    features: [
      { title: "NVMe SSD storage", desc: "Up to 10× faster than traditional SSDs for snappier page loads." },
      { title: "Free SSL & CDN", desc: "Wildcard SSL and global CDN included on every plan." },
      { title: "DDoS protection", desc: "Always-on multi-layer DDoS mitigation up to 1.5 Tbps." },
      { title: "Daily backups", desc: "Automatic daily backups with 1-click restore." },
      { title: "24/7 human support", desc: "Real engineers, not bots — average response under 12 minutes." },
      { title: "Global data centers", desc: "Pick from 12 regions across NA, EU, Asia and Oceania." },
    ],
    benefits: [
      "99.9% uptime SLA",
      "Free migration assistance",
      "30-day money-back guarantee",
      "Auto-scaling on traffic spikes",
      "Per-second billing on hourly plans",
    ],
    faqs: [
      { q: "Can I upgrade my plan later?", a: "Yes — upgrades are instant and you only pay the prorated difference. Downgrades take effect at the next billing cycle." },
      { q: "Do you offer free migration?", a: "Yes! Our team migrates your sites, databases and email for free with zero downtime." },
      { q: "Is there a money-back guarantee?", a: "30 days, no questions asked. Cancel anytime." },
    ],
    stats: [
      { value: "99.99%", label: "Avg. uptime" },
      { value: "12", label: "Global regions" },
      { value: "<12min", label: "Support response" },
      { value: "8,500+", label: "Sites hosted" },
    ],
    plans: [
      { name: "Starter", price: "$4.99/mo", features: ["1 website", "10 GB NVMe SSD", "100 GB bandwidth", "Free SSL & CDN", "Daily backups"] },
      { name: "Pro", price: "$12.99/mo", features: ["Unlimited websites", "50 GB NVMe SSD", "Unmetered bandwidth", "Free SSL & CDN", "Priority support"], highlight: true },
      { name: "Business", price: "$29.99/mo", features: ["Unlimited sites", "200 GB NVMe SSD", "Unmetered bandwidth", "Dedicated IP", "White-glove migration"] },
      { name: "Dedicated", price: "$129/mo", features: ["Dedicated CPU & RAM", "1 TB NVMe SSD", "Full root access", "Custom configurations", "Phone support"] },
    ],
  },
  {
    slug: "templates",
    icon: LayoutTemplate,
    name: "Website Templates",
    tagline: "Premium, ready-to-launch templates",
    desc: "Hand-crafted, conversion-focused templates for every industry — drop-in ready in hours, not weeks.",
    longDesc:
      "Skip the blank canvas. Our template library is built by senior designers and developers, optimized for conversions, mobile-first, and easy to customize. Each template ships with Figma source, full documentation and 1-click install on WordPress, Webflow or Shopify.",
    price: "$29",
    unit: "one-time",
    gradient: "from-sky-500 to-brand-600",
    accent: "bg-sky-50 text-sky-700",
    popular: true,
    features: [
      { title: "50+ hand-crafted designs", desc: "Modern, conversion-tested designs for SaaS, agencies, e-com and more." },
      { title: "Fully responsive", desc: "Pixel-perfect on every breakpoint — mobile, tablet, desktop, 4K." },
      { title: "Figma source included", desc: "Edit, customize and hand off to your team with full Figma files." },
      { title: "1-click install", desc: "Drop-in ready for WordPress, Webflow, Shopify, Framer and Next.js." },
      { title: "Free lifetime updates", desc: "Buy once, get every future version and improvement — forever." },
    ],
    benefits: [
      "Launch in hours, not weeks",
      "No design skills required",
      "Production-grade code",
      "SEO-optimized out of the box",
      "Conversion-tested layouts",
    ],
    faqs: [
      { q: "Do I need coding skills?", a: "No — every template is built for no-code platforms. We also offer a free install service." },
      { q: "Can I use one template on multiple sites?", a: "Yes — the standard license covers unlimited personal and client projects." },
      { q: "What if I don't like it?", a: "30-day money-back guarantee, no questions asked." },
    ],
    stats: [
      { value: "50+", label: "Templates" },
      { value: "12k+", label: "Downloads" },
      { value: "4.9★", label: "Avg. rating" },
      { value: "Lifetime", label: "Free updates" },
    ],
    plans: [
      { name: "Single", price: "$29", features: ["1 template", "All source files", "Lifetime updates", "Email support"] },
      { name: "Bundle", price: "$99", features: ["5 templates of choice", "All source files", "Lifetime updates", "Priority support"], highlight: true },
      { name: "Unlimited", price: "$199", features: ["Every template, ever", "New releases included", "Commercial license", "Slack support"] },
    ],
  },
  {
    slug: "brand-kits",
    icon: Sparkles,
    name: "Brand Kits",
    tagline: "Logos, banners & thumbnails that pop",
    desc: "All-in-one brand kits with logos, channel art, thumbnails and brand guidelines — ready in 5 days.",
    longDesc:
      "Get a complete brand identity without the agency price tag. Each kit is crafted by senior designers, includes logos in every format, channel banners, CTR-optimized thumbnails and a brand guidelines PDF. Perfect for creators, startups, and small businesses.",
    price: "$49",
    unit: "per kit",
    gradient: "from-violet-500 to-brand-400",
    accent: "bg-violet-50 text-violet-700",
    popular: false,
    features: [
      { title: "Logo suite", desc: "Primary, secondary, icon and monochrome variants in SVG, PNG and PDF." },
      { title: "Channel art & banners", desc: "Safe-area-aware banners for YouTube, Twitter, LinkedIn and Twitch." },
      { title: "10 CTR-optimized thumbnails", desc: "Custom-designed thumbnails engineered for click-through." },
      { title: "Brand guidelines PDF", desc: "Logo usage, color palette, typography, voice & tone." },
      { title: "2 revision rounds", desc: "Iterate with us until you love it." },
    ],
    benefits: [
      "5-day turnaround",
      "All source files (Figma, AI, PSD)",
      "Commercial license",
      "Free re-export in any size",
      "Unlimited internal use",
    ],
    faqs: [
      { q: "How long does delivery take?", a: "Standard turnaround is 5 business days. Rush delivery is 48 hours for an additional fee." },
      { q: "Can I add more thumbnails?", a: "Yes — extra thumbnails are $7 each or $49 for a 10-pack add-on." },
      { q: "Do I get editable source files?", a: "Yes — Figma, Adobe Illustrator and Photoshop files are included on every kit." },
    ],
    stats: [
      { value: "5 days", label: "Turnaround" },
      { value: "850+", label: "Kits delivered" },
      { value: "+47%", label: "Avg. CTR lift" },
      { value: "100%", label: "Source files" },
    ],
    plans: [
      { name: "Starter Kit", price: "$49", features: ["Logo suite (3 variants)", "5 thumbnails", "Color & type guide"] },
      { name: "Creator Kit", price: "$99", features: ["Logo suite (5 variants)", "10 thumbnails", "Channel art", "Brand guidelines PDF"], highlight: true },
      { name: "Pro Kit", price: "$199", features: ["Full brand identity", "25 thumbnails", "Animated intro/outro", "Source files", "Brand guidelines"] },
    ],
  },
  {
    slug: "ai-suite",
    icon: BrainCircuit,
    name: "AI Marketing Suite",
    tagline: "Automation that works while you sleep",
    desc: "AI content generation, chatbots, predictive analytics and smart A/B testing — all in one dashboard.",
    longDesc:
      "A complete AI marketing platform built for SMBs. Generate on-brand content, deploy smart chatbots, predict churn, and run automated A/B tests across your email, ads and site — all from a single dashboard that integrates with the tools you already use.",
    price: "$19",
    unit: "/mo",
    gradient: "from-cyan-400 to-teal-400",
    accent: "bg-cyan-50 text-cyan-700",
    popular: false,
    features: [
      { title: "AI content generator", desc: "Blog posts, social copy, ad headlines, and email sequences on-brand." },
      { title: "Smart chatbots", desc: "GPT-powered support and sales agents trained on your knowledge base." },
      { title: "Predictive analytics", desc: "Churn and LTV models that tell you who's about to buy — or leave." },
      { title: "Auto A/B testing", desc: "Continuously optimize subject lines, CTAs, and landing pages." },
      { title: "40+ integrations", desc: "Connects to HubSpot, Salesforce, Shopify, Klaviyo, and many more." },
    ],
    benefits: [
      "Save 20+ hours/week",
      "Always-on AI support agents",
      "Hyper-personalized outreach",
      "Predictive lead scoring",
      "No engineering required",
    ],
    faqs: [
      { q: "Is my data private?", a: "Yes. We never train on your data, and enterprise plans offer private model deployments." },
      { q: "Do I need technical skills?", a: "No. Our visual dashboards and one-click integrations make it easy for non-technical teams." },
      { q: "Can I cancel anytime?", a: "Yes — month-to-month, no contracts, prorated refunds on annual plans." },
    ],
    stats: [
      { value: "20+", label: "Hours saved / week" },
      { value: "+340%", label: "Reply rate lift" },
      { value: "85%", label: "Tasks automated" },
      { value: "40+", label: "Integrations" },
    ],
    plans: [
      { name: "Starter", price: "$19/mo", features: ["AI content (10k words/mo)", "1 chatbot", "Email support"] },
      { name: "Growth", price: "$49/mo", features: ["AI content (50k words/mo)", "5 chatbots", "Predictive analytics", "Priority support"], highlight: true },
      { name: "Scale", price: "$149/mo", features: ["Unlimited AI content", "Unlimited chatbots", "Custom models", "Dedicated success manager"] },
    ],
  },
];

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
