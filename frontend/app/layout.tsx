import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POLY — Agentic Workspace",
  description: "Chat with an autonomous software agent powered by Antigravity.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body style={{ margin: 0 }}>{children}</body></html>;
}
