"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setReply("");
    try {
      const base = process.env.NEXT_PUBLIC_AGENT_URL || "http://localhost:8000";
      const res = await fetch(`${base}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.body) throw new Error("No response stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setReply((r) => r + text.replace(/^data: /gm, "").replace(/\n\n/g, "\n"));
      }
    } catch (err) {
      setReply(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#08090b", color: "#f5f5f5", fontFamily: "Inter, system-ui", padding: 32 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
          <strong style={{ fontSize: 24 }}>POLY</strong>
          <span style={{ opacity: 0.5 }}>AGENTIC WORKSPACE</span>
        </header>
        <section style={{ border: "1px solid #24262b", borderRadius: 20, padding: 24, background: "#0e1013" }}>
          <div style={{ minHeight: 420 }}>
            <div style={{ opacity: 0.5, marginBottom: 16 }}>POLY Agent</div>
            {reply ? <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: 1.7 }}>{reply}</pre> : <p style={{ opacity: 0.55 }}>Ask POLY to inspect, build, debug, or modify your project.</p>}
          </div>
          <form onSubmit={send} style={{ display: "flex", gap: 12 }}>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell POLY what to do..." style={{ flex: 1, padding: "16px 18px", borderRadius: 12, border: "1px solid #292c32", background: "#08090b", color: "white", outline: "none" }} />
            <button disabled={loading} style={{ padding: "0 22px", borderRadius: 12, border: 0, background: "white", color: "black", fontWeight: 700 }}>{loading ? "Running" : "Run"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
