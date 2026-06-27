export type Project = {
  slug: string;
  title: string;
  period: { start: string; end?: string };
  link: string;
  github?: string;
  description: string;
  skills: string[];
  isExpanded?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "Android Screen Mirroring Platform",
    title: "Android Screen Mirroring Platform",
    period: { start: "06.2026" },
    link: "https://rznish.com/projects/screen-mirroring-platform",
    github: "https://github.com/Rznish-Singh",
    description:
      "Developing a low-latency Android screen mirroring platform without USB debugging or root access, targeting <100 ms end-to-end latency with secure real-time streaming.",
    skills: ["Kotlin", "Java", "C++", "WebRTC", "MediaProjection", "QUIC" ],
    isExpanded: true,
  },
  {
    slug: "Secure Voice & Video Calling Platform",
    title: "Secure Voice & Video Calling Platform",
    period: { start: "01.2026", end: "03.2026" },
    link: "https://rznish.com/projects/secure-voice-video-calling-platform",
    github: "https://github.com/Rznish-Singh",
    description:
      "Developed a real-time browser-based voice and video calling platform using WebRTC with peer-to-peer streaming, encrypted communication, and Socket.IO signaling.",
    skills: ["WebRTC", "JavaScript", "Node.js", "Socket.IO"],
  },
  {
    slug: "RAG-Based AI Document Assistant",
    title: "RAG-Based AI Document Assistant",
    period: { start: "11.2025", end: "12.2025" },
    link: "https://rznish.com/projects/rag-based-ai-document-assistant",
    github: "https://github.com/Rznish-Singh",
    description:
      "Built an AI-powered Retrieval-Augmented Generation (RAG) document assistant supporting Markdown (.md) and text documents with semantic search, context-aware retrieval, and intelligent question answering, achieving over 80% answer accuracy on evaluated documents.",
    skills: ["TypeScript ", "LangChain", "LangGraph", "React", "Next.js"],
  },
  {
    slug: "QR Login System + OTP Authentication ",
    title: "QR Login System + OTP Authentication ",
    period: { start: "05.2023", end: "05.2023" },
    link: "https://rznish.com/projects/qr-login-system-otp-authentication",
    github: "https://github.com/Rznish-Singh/qr-login-system-otp-authentication",
    description:
      "Developed a secure authentication platform supporting QR-code login, SMS OTP verification, JWT-based authorization, real-time login synchronization. ",
    skills: ["JavaScript", "WebSocket", "Twilio", "JWT"],
  },
];
