"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDiwali } from "./DiwaliProvider";
import { celebrate } from "./effects";
import { MarigoldDefs } from "./Marigold";
import MarigoldGarland from "./MarigoldGarland";
import FairyLights from "./FairyLights";
import HangingDecor from "./HangingDecor";
import InteractiveDiyas from "./InteractiveDiyas";
import FxCanvas from "./FxCanvas";

/** Everything visual lives here. Mounted only while Diwali mode is active; unmounting removes every loop and listener. */
export default function DiwaliLayer() {
  const { resetKey, reducedMotion } = useDiwali();
  const [greet, setGreet] = useState(true);

  useEffect(() => {
    setGreet(true);
    if (resetKey === 0 && !reducedMotion) celebrate();
    const t = window.setTimeout(() => setGreet(false), 9000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return createPortal(
    <>
      <MarigoldDefs />
      <div aria-hidden="true" className="dw-sky" />
      <FxCanvas />
      <MarigoldGarland />
      <FairyLights />
      <HangingDecor />

      {/* <div className="dw-greet-wrap">
        <div className={`dw-greet-in text-center transition-opacity duration-1000 ${greet ? "opacity-100" : "opacity-0"}`} role="status">
          <h2 className="font-serif text-3xl italic text-amber-200 drop-shadow-[0_0_24px_rgba(255,154,46,.55)] sm:text-5xl">Happy Diwali ✨</h2>
          <p className="mx-auto mt-2 max-w-md text-amber-50/90">May your world shine with light, joy, and new beginnings.</p>
        </div>
      </div> */}

      {/* <InteractiveDiyas key={resetKey} /> */}
    </>,
    document.body,
  );
}
