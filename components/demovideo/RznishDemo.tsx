"use client";

import { useState, useEffect, useRef } from "react";

// Animated demo of the rznish docs "Ask AI" chatbot.
// Same browser layout + cursor pattern as HeroDemo. Purely visual (aria-hidden).

const ANSWER =
  "rznish is a Computer Science and Engineering student graduating in June 2026. He is a full-stack developer who specializes in web development with the Next.js ecosystem, Android development using Kotlin and Jetpack Compose, and AI/ML integration. Beyond his engineering work, he runs a professional photography business, where he focuses on concert, travel, and studio photography. You can think of him as a hybrid creator who blends high-end technical architecture with creative visual work.";

const QUESTION_2 = "who is rznish";

const ANSWER_2 =
  "rznish is the developer and creative behind this site. He is a Computer Science and Engineering student expected to graduate in June 2026. He spends most of his time building full-stack web applications and Android apps, while also managing his photography business, rznishstudio.\n\nHis technical work spans a wide range: he's built everything from his own portfolio site using Next.js and Supabase to complex systems like SecureChat, an encrypted messaging app. He is also currently focused on migrating his RAG application, Papeer, from Streamlit to a more robust FastAPI and React architecture.";

type Msg = { role: "you" | "ai"; text: string };

const SUGGESTIONS = [
  "What is rznish ?",
  "How does rznish chatbot work?",
  "How can I customize rznish chatbot?",
  "How do I deploy rznish chatbot?",
];

export function RznishChatDemo() {
  const [reducedMotion, setReducedMotion] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  const [cursor, setCursor] = useState({ x: 560, y: 330 });
  const [isClicking, setIsClicking] = useState(false);
  const [ripple, setRipple] = useState({ x: 0, y: 0, key: 0 });
  const [askHover, setAskHover] = useState(false);
  const [askPress, setAskPress] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [sugHover, setSugHover] = useState(false);
  const [sugVisible, setSugVisible] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [typed, setTyped] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [caption, setCaption] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLDivElement>(null);
  const sugRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLElement>(null);
  const msgsRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view as the answer streams
  useEffect(() => {
    const el = msgsRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  // Center of an element, relative to the content box
  const centerOf = (el: HTMLElement | null, dx?: number) => {
    const content = contentRef.current;
    if (!el || !content) return { x: 300, y: 200 };
    const a = el.getBoundingClientRect();
    const b = content.getBoundingClientRect();
    return { x: a.left - b.left + (dx ?? a.width / 2), y: a.top - b.top + a.height / 2 };
  };

  useEffect(() => {
    let cancelled = false;

    const resetState = () => {
      const w = contentRef.current?.clientWidth ?? 800;
      const h = contentRef.current?.clientHeight ?? 440;
      setCursor({ x: w * 0.6, y: h * 0.75 });
      setIsClicking(false);
      setAskHover(false);
      setAskPress(false);
      setChatOpen(false);
      setSugHover(false);
      setSugVisible(true);
      setMessages([]);
      setThinking(false);
      setTyped("");
      setInputFocus(false);
      setCaption("Every page has a built-in assistant");
    };

    const click = async (p: { x: number; y: number }) => {
      setRipple((r) => ({ x: p.x, y: p.y, key: r.key + 1 }));
      setIsClicking(true);
      await delay(140);
      setIsClicking(false);
    };

    const runAnimation = async () => {
      resetState();
      await delay(1200);
      if (cancelled) return;

      // Move to "Ask AI"
      const askPos = centerOf(askRef.current);
      setCursor(askPos);
      setCaption("Click “Ask AI” in the navbar");
      await delay(1000);
      if (cancelled) return;
      setAskHover(true);
      await delay(350);
      if (cancelled) return;
      setAskPress(true);
      await click(askPos);
      setAskPress(false);
      setChatOpen(true);
      await delay(900);
      if (cancelled) return;

      // Click first suggestion
      const sugPos = centerOf(sugRef.current, 40);
      setCursor(sugPos);
      setCaption("Pick a suggested question, or type your own");
      await delay(1000);
      if (cancelled) return;
      setSugHover(true);
      await delay(350);
      if (cancelled) return;
      await click(sugPos);
      setSugVisible(false);
      setMessages([{ role: "you", text: SUGGESTIONS[0] }]);
      await delay(400);
      if (cancelled) return;

      // Thinking → stream answer
      const streamAnswer = async (text: string, speed: number) => {
        setThinking(true);
        await delay(1300);
        if (cancelled) return;
        setThinking(false);
        setMessages((m) => [...m, { role: "ai", text: "" }]);
        const words = text.split(" ");
        let out = "";
        for (let i = 0; i < words.length; i++) {
          if (cancelled) return;
          out += (i ? " " : "") + words[i];
          const snapshot = out;
          setMessages((m) => {
            const c = m.slice();
            c[c.length - 1] = { role: "ai", text: snapshot };
            return c;
          });
          await delay(speed);
        }
      };

      setCaption("Streaming a grounded answer from Gemini…");
      await streamAnswer(ANSWER, 45);
      if (cancelled) return;
      setCaption("Answers come straight from your docs");
      await delay(1800);
      if (cancelled) return;

      // Click the input and type a follow-up
      const inPos = centerOf(inputRef.current, 90);
      setCursor(inPos);
      setCaption("Or type your own question");
      await delay(1000);
      if (cancelled) return;
      await click(inPos);
      setInputFocus(true);
      await delay(500);
      if (cancelled) return;

      const q = QUESTION_2 + " ";
      for (let i = 1; i <= q.length; i++) {
        if (cancelled) return;
        setTyped(q.slice(0, i));
        await delay(75);
      }
      await delay(600);
      if (cancelled) return;

      // Send
      const sendPos = centerOf(sendRef.current);
      setCursor(sendPos);
      await delay(900);
      if (cancelled) return;
      await click(sendPos);
      setTyped("");
      setInputFocus(false);
      setMessages((m) => [...m, { role: "you", text: QUESTION_2 }]);
      await delay(400);
      if (cancelled) return;

      setCaption("Ask follow-ups — the chat keeps context");
      await streamAnswer(ANSWER_2, 45);
      if (cancelled) return;
      await delay(3000);
      if (cancelled) return;

      // Close chat
      const closePos = centerOf(closeRef.current);
      setCursor(closePos);
      await delay(900);
      if (cancelled) return;
      await click(closePos);
      setChatOpen(false);
      await delay(1500);
    };

    if (reducedMotion) {
      resetState();
      setChatOpen(true);
      setSugVisible(false);
      setMessages([
        { role: "you", text: SUGGESTIONS[0] },
        { role: "ai", text: ANSWER },
      ]);
      return;
    }
    if (!pageVisible) return;

    const loop = async () => {
      while (!cancelled) await runAnimation();
    };
    void loop();
    return () => {
      cancelled = true;
    };
  }, [reducedMotion, pageVisible]);

  return (
    <div className="rz-wrap">
      <style suppressHydrationWarning>{css}</style>

      <div aria-hidden="true" className="rz-browser">
        {/* Browser chrome — same layout as HeroDemo */}
        <div className="rz-bar">
          <div className="rz-dot red" />
          <div className="rz-dot yellow" />
          <div className="rz-dot green" />
          <div className="rz-url">localhost:3000</div>
        </div>

        <div className="rz-content" ref={contentRef}>
          {/* Navbar */}
          <div className="rz-nav">
            <div>
              <span className="rz-avatar" />
              <b>rznish</b>
              <span className="rz-sl">/</span>
              <span className="rz-lt">AI assistant</span>
              <span className="rz-sl">/</span>Docs
            </div>
            <div className="rz-nav-r">
              <div className="rz-search">Search…</div>
              <div ref={askRef} className={`rz-ask ${askHover ? "hov" : ""} ${askPress ? "press" : ""}`}>
                💬 Ask AI
              </div>
              <div className="rz-ic" />
            </div>
          </div>

          {/* Decorative vines — swap for your <img> tags if you like */}
          {[
            { left: 60, h: 110 },
            { left: 120, h: 170 },
            { left: 190, h: 230 },
            { right: 70, h: 150 },
            { right: 140, h: 210 },
            { right: 200, h: 100 },
          ].map((v, i) => (
            <div key={i} className="rz-vine" style={{ left: v.left, right: v.right, height: v.h }}>
              <div className="rz-fl" />
            </div>
          ))}
          <div className="rz-leaf" />

          {/* Hero */}
          <div className="rz-hero">
            <h1>rznish</h1>
            <p>A personal AI chatbot built with Next.js and the AI SDK. Talks directly to Google Gemini — no gateway in between.</p>
            <div className="rz-btns">
              <div className="rz-b1">Get Started →</div>
              <div className="rz-b2">💬 Try It Out →</div>
            </div>
          </div>

          <div className="rz-cards">
            <div className="rz-card"><i /><b>Free AI Chat UI</b><span>A clean, customizable frontend for AI-powered conversations.</span></div>
            <div className="rz-card"><i /><b>Auth book</b><span>A collection of guides and examples for implementing auth.</span></div>
            <div className="rz-card"><i /><b>Ask AI</b><span>Built-in assistant answers questions right from the page.</span></div>
          </div>

          {/* Overlay + chat panel */}
          <div className={`rz-dim ${chatOpen ? "on" : ""}`} />
          <div className={`rz-chat ${chatOpen ? "on" : ""}`}>
            <div className="rz-ch">
              <span>Chat</span>
              <span className="rz-icons">
                ❐ 🗑 <span ref={closeRef}>✕</span>
              </span>
            </div>

            <div className="rz-msgs" ref={msgsRef}>
              {messages.map((m, i) =>
                m.role === "you" ? (
                  <div key={i} className="rz-you">
                    <small>You</small>
                    {m.text}
                  </div>
                ) : (
                  <div key={i} className="rz-ai">
                    <small>Ask AI</small>
                    {m.text}
                  </div>
                )
              )}
              {thinking && <div className="rz-think">Thinking…</div>}
            </div>

            <div className="rz-sug" style={{ opacity: sugVisible ? 1 : 0 }}>
              {SUGGESTIONS.map((s, i) => (
                <div key={s} ref={i === 0 ? sugRef : undefined} className={i === 0 && sugHover ? "hov" : ""}>
                  {s}
                </div>
              ))}
            </div>
            <div className="rz-tip">Tip: You can open and close chat with ⌘ I</div>
            <div ref={inputRef} className={`rz-inp ${inputFocus || typed ? "focus" : ""}`}>
              {typed ? (
                <span className="rz-typed">
                  {typed}
                  <span className="rz-caret" />
                </span>
              ) : inputFocus ? (
                <span className="rz-caret" />
              ) : (
                <span className="rz-ph">What would you like to know?</span>
              )}
              <em>{typed.length} / 1000</em>
              <u ref={sendRef} className={typed ? "on" : ""}>↑</u>
            </div>
          </div>

          {/* Click ripple */}
          <div key={ripple.key} className={`rz-ripple ${ripple.key ? "go" : ""}`} style={{ left: ripple.x, top: ripple.y }} />

          {/* Cursor */}
          <div className={`rz-cursor ${isClicking ? "click" : ""}`} style={{ left: cursor.x, top: cursor.y }}>
            <svg height="24" width="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd" transform="translate(10 7)">
                <path d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z" fill="#fff" />
                <path d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z" fill="#000" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <p className="rz-cap" aria-live="polite">{caption}</p>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const css = `
.rz-wrap{position:relative;width:100%;margin:1.5rem 0 2rem}
.rz-browser{background:#F6F5F4;border-radius:12px;overflow:hidden;color:#111;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.08)}
.rz-bar{display:flex;align-items:center;gap:6px;padding:10px 12px;background:#fff;border-bottom:1px solid rgba(0,0,0,.06)}
.rz-dot{width:8px;height:8px;border-radius:50%}
.rz-dot.red{background:#ff5f57}.rz-dot.yellow{background:#febc2e}.rz-dot.green{background:#28c840}
.rz-url{flex:1;margin-left:8px;padding:4px 10px;background:rgba(0,0,0,.04);border-radius:6px;font-size:10px;color:rgba(0,0,0,.4)}
.rz-content{position:relative;height:440px;overflow:hidden;background:#fff}

.rz-nav{position:absolute;top:0;left:0;right:0;height:36px;border-bottom:1px solid rgba(0,0,0,.08);display:flex;align-items:center;justify-content:space-between;padding:0 16px;font-size:11px;background:#fff;z-index:3}
.rz-nav b{font-weight:600}.rz-sl{color:#bbb;margin:0 6px}.rz-lt{color:#aaa}
.rz-nav-r{display:flex;align-items:center;gap:8px}
.rz-search{border:1px solid rgba(0,0,0,.1);border-radius:7px;padding:4px 10px;width:150px;color:#888;font-size:10px;background:#fafafa}
.rz-ask{border:1px solid rgba(0,0,0,.12);border-radius:7px;padding:4px 10px;font-weight:600;font-size:10px;background:#fff;transition:background .15s,transform .1s}
.rz-ask.hov{background:#f0f0ee}.rz-ask.press{transform:scale(.94)}
.rz-ic{width:12px;height:12px;border-radius:50%;border:1.5px solid #333}
.rz-avatar{width:16px;height:16px;border-radius:50%;background:#111;margin-right:6px;display:inline-block;vertical-align:middle}

.rz-hero{position:absolute;top:36px;left:0;right:0;bottom:0;text-align:center;padding-top:62px}
.rz-hero h1{margin:0;font-size:52px;letter-spacing:-2px;font-weight:800}
.rz-hero p{margin:14px auto 0;max-width:340px;color:#777;font-size:12px;line-height:1.7}
.rz-btns{display:flex;gap:8px;justify-content:center;margin-top:16px}
.rz-b1{background:#111;color:#fff;border-radius:20px;padding:8px 16px;font-size:11px;font-weight:600}
.rz-b2{border:1px solid rgba(0,0,0,.12);border-radius:20px;padding:8px 16px;font-size:11px;background:#fafafa}
.rz-cards{position:absolute;left:50%;transform:translateX(-50%);bottom:-30px;width:56%;display:flex;gap:8px}
.rz-card{flex:1;border:1px solid rgba(0,0,0,.1);border-radius:12px;padding:10px;background:#fff;height:120px;text-align:left}
.rz-card i{display:block;width:16px;height:16px;border-radius:5px;background:#eee;margin-bottom:12px}
.rz-card b{font-size:10px;display:block;margin-bottom:4px}
.rz-card span{font-size:9px;color:#888;line-height:1.4;display:block}

.rz-vine{position:absolute;top:36px;width:2px;background:#5c8a3a;z-index:1}
.rz-vine:before{content:"";position:absolute;left:-3px;bottom:-4px;width:8px;height:8px;border-radius:50%;background:#4a7a2a}
.rz-fl{position:absolute;width:14px;height:20px;background:#f4a3c4;clip-path:polygon(30% 0,70% 0,100% 100%,0 100%);border-radius:4px;left:-6px;bottom:6px}
.rz-leaf{position:absolute;left:-30px;bottom:-40px;width:110px;height:160px;background:#8db32a;border-radius:0 100% 0 100%;transform:rotate(-8deg);z-index:1}

.rz-dim{position:absolute;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(3px);opacity:0;pointer-events:none;transition:opacity .3s;z-index:10}
.rz-dim.on{opacity:1}
.rz-chat{position:absolute;top:0;right:0;bottom:0;width:36%;min-width:260px;background:#fff;border-left:1px solid rgba(0,0,0,.08);transform:translateX(100%);transition:transform .45s cubic-bezier(.19,1,.22,1);z-index:20;display:flex;flex-direction:column;font-size:11px}
.rz-chat.on{transform:none}
.rz-ch{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid rgba(0,0,0,.08);font-weight:600;font-size:13px}
.rz-icons{font-size:11px;letter-spacing:6px;font-weight:400;color:#444}
.rz-msgs{flex:1;overflow:hidden;min-height:0;padding:12px 14px;display:flex;flex-direction:column;gap:10px}
.rz-you{align-self:flex-end;background:#eef5ff;border-radius:8px;padding:7px 10px;max-width:90%;animation:rz-in .3s ease-out}
@keyframes rz-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.rz-you small{display:block;color:#2563eb;font-size:9px;margin-bottom:2px}
.rz-think{color:#888;padding:0 2px}
.rz-ai{white-space:pre-wrap;background:#f4f4f4;border-radius:8px;padding:8px 10px;line-height:1.6;color:#222}
.rz-ai small{display:block;color:#888;font-size:9px;margin-bottom:3px}
.rz-sug{padding:6px 14px;border-top:1px solid rgba(0,0,0,.08);display:flex;flex-direction:column;gap:6px;color:#2563eb;transition:opacity .2s}
.rz-sug .hov{text-decoration:underline}
.rz-tip{padding:6px 14px;color:#888;font-size:9px}
.rz-inp{margin:0 14px 12px;border:1px solid rgba(0,0,0,.12);border-radius:8px;height:56px;padding:8px;color:#999;position:relative;transition:border-color .2s}
.rz-inp.focus{border-color:rgba(0,0,0,.35)}
.rz-typed{color:#111}
.rz-caret{display:inline-block;width:1px;height:12px;background:#111;vertical-align:-2px;margin-left:1px;animation:rz-blink 1s steps(1) infinite}
@keyframes rz-blink{50%{opacity:0}}
.rz-inp em{position:absolute;left:8px;bottom:6px;font-style:normal;font-size:9px}
.rz-inp u{position:absolute;right:6px;bottom:6px;width:20px;height:20px;border-radius:50%;background:#888;color:#fff;font-size:12px;line-height:20px;text-align:center;text-decoration:none;transition:background .2s}
.rz-inp u.on{background:#111}

.rz-cursor{position:absolute;z-index:100;pointer-events:none;transition:left .8s cubic-bezier(.4,0,.2,1),top .8s cubic-bezier(.4,0,.2,1)}
.rz-cursor svg{display:block;margin:-10px 0 0 -10px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3));transition:transform .1s}
.rz-cursor.click svg{transform:scale(.85)}
.rz-ripple{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;border:2px solid #3b82f6;opacity:0;z-index:99;pointer-events:none}
.rz-ripple.go{animation:rz-rp .5s ease-out}
@keyframes rz-rp{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}
.rz-cap{margin-top:16px;text-align:center;font-size:13px;color:rgba(0,0,0,.5);min-height:20px}

@media (max-width:640px){
  .rz-content{height:360px}
  .rz-search{display:none}
  .rz-hero h1{font-size:38px}
  .rz-cards{display:none}
  .rz-chat{width:75%}
}
`;