import type { WindowKind } from "../types/workspace";

export const WINDOW_TITLES: Record<WindowKind, string> = {
  about: "About",
  projects: "Projects",
  contact: "Contact",
};

export type AboutTab = "profile" | "journey" | "interests" | "socials";

export type TabButton = {
  id: AboutTab;
  label: string;
};

export const ABOUT_TABS: TabButton[] = [
  { id: "profile", label: "Profile" },
  { id: "journey", label: "Journey" },
  { id: "interests", label: "Interests" },
  { id: "socials", label: "Socials" },
];

export const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yasin-walum",
    key: "linkedin",
  },
  { label: "GitHub", href: "https://github.com/wyasyn", key: "github" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@yasin-walum",
    key: "youtube",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/yasin_walum",
    key: "instagram",
  },
] as const;

export type SocialKey = (typeof SOCIAL_LINKS)[number]["key"];

export type CaseStudy = {
  title: string;
  client: string;
  problem: string;
  whatIDid: string;
  stack: string[];
  results: string[];
  thumbnailUrl?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Plant Disease Detection and Treatment Guide",
    client: "Agritech Product",
    problem:
      "Farmers needed faster disease diagnosis in the field and clear treatment steps without waiting for experts.",
    whatIDid:
      "I built a mobile-first workflow for taking leaf photos, getting model predictions, and presenting practical treatment recommendations in simple language.",
    stack: [
      "React Native",
      "FastAPI",
      "TensorFlow",
      "Hugging Face",
      "Docker",
      "PostgreSQL",
    ],
    results: [
      "Cut diagnosis workflow from hours to minutes in pilot usage.",
      "Improved recommendation clarity with explainable confidence states.",
      "Enabled offline-safe session capture and sync for unstable networks.",
    ],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Skin Condition Detector + Cosmetic Recommendation Engine",
    client: "Aurora Organics",
    problem:
      "The team needed a trusted digital flow to analyze skin conditions and suggest safe product combinations by profile.",
    whatIDid:
      "I designed and implemented the frontend experience, structured medical-style input flows, and connected inference APIs to generate user-friendly recommendations.",
    stack: [
      "Next.js",
      "FastAPI",
      "Hugging Face",
      "Google Cloud Run",
      "TypeScript",
    ],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555820585-c5ae44394b79?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    liveUrl: "https://auroraorganics.com",
    results: [
      "Raised completion rate through a guided step-by-step assessment UI.",
      "Reduced time to deliver recommendation from manual review to near real-time.",
      "Created reusable UI primitives for future wellness product flows.",
    ],
  },
  {
    title: "Face Recognition Attendance Management System",
    client: "Education and Workforce Teams",
    problem:
      "Manual attendance tracking was slow, inaccurate, and difficult to audit across multiple sessions and locations.",
    whatIDid:
      "I built an end-to-end attendance dashboard with identity verification states, live logs, and role-based reporting for teachers and administrators.",
    stack: ["Django", "Next.js", "Google Cloud Run", "OpenCV", "Cloud SQL"],
    githubUrl:
      "https://github.com/yasinwalum/attendance-management-face-recognition",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=640&q=80",
    results: [
      "Reduced attendance reconciliation errors with automated capture flows.",
      "Provided real-time monitoring and searchable attendance history.",
      "Improved accountability with audit-ready attendance exports.",
    ],
  },
];

export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || "yasinwalum@gmail.com";
export const CONTACT_PHONE_DISPLAY =
  import.meta.env.VITE_CONTACT_PHONE_DISPLAY || "+256 700 000000";
export const CONTACT_WHATSAPP =
  import.meta.env.VITE_CONTACT_WHATSAPP || "256700000000";
export const CONTACT_LOCATION_LABEL =
  import.meta.env.VITE_CONTACT_LOCATION_LABEL || "Kampala, Uganda";
export const CONTACT_LOCATION_QUERY =
  import.meta.env.VITE_CONTACT_LOCATION_QUERY || "Kampala, Uganda";
export const CONTACT_FORM_ENDPOINT =
  import.meta.env.VITE_CONTACT_FORM_ENDPOINT ||
  `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const whatsappDigits = CONTACT_WHATSAPP.replace(/[^\d]/g, "");

export const CONTACT_MAILTO_LINK = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_WHATSAPP_LINK = whatsappDigits
  ? `https://wa.me/${whatsappDigits}`
  : "#";
export const CONTACT_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_LOCATION_QUERY)}`;
