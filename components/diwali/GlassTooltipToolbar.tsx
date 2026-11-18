'use client';

import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type ToolbarItem = {
  id: string;
  icon: ReactNode;
  label: string;
  /** shortcut hints shown in the tooltip, e.g. ['L'] */
  keys?: string[];
  /** present = toggle button (aria-pressed), absent = plain action button */
  pressed?: boolean;
  onSelect: () => void;
};

interface Props {
  items: ToolbarItem[];
  tooltipDelay?: number;
  label?: string;
}

function Row({ item }: { item: ToolbarItem }) {
  return (
    <>
      <span>{item.label}</span>
      {item.keys && item.keys.length > 0 && (
        <span className="dw-keys">
          {item.keys.map((k, i) => (
            <span key={i} className="dw-key">{k}</span>
          ))}
        </span>
      )}
    </>
  );
}

/**
 * Your TooltipVerticalNavbar, adapted: same clip-path sliding tooltip, now with
 * liquid-glass surfaces, a glass lens that slides between icons, toggle states,
 * keyboard focus support and touch-safe behaviour.
 */
export function GlassTooltipToolbar({ items, tooltipDelay = 300, label = 'Toolbar' }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [coords, setCoords] = useState({ clipPath: '', translateY: 0 });
  const [isEntering, setIsEntering] = useState(true);

  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const calculatePosition = (index: number) => {
    const activeLabel = measureRefs.current[index];
    const activeIcon = buttonRefs.current[index];
    if (!activeLabel || !activeIcon) return null;

    const labelTop = activeLabel.offsetTop;
    const labelHeight = activeLabel.offsetHeight;
    const labelCenter = labelTop + labelHeight / 2;
    const iconCenter = activeIcon.offsetTop + activeIcon.offsetHeight / 2;
    const totalHeight = measureRefs.current.reduce((acc, el) => acc + (el?.offsetHeight || 0), 0);

    const cTop = (labelTop / totalHeight) * 100;
    const cBottom = 100 - ((labelTop + labelHeight) / totalHeight) * 100;
    return { clipPath: `inset(${cTop}% 0 ${cBottom}% 0 round 8px)`, translateY: iconCenter - labelCenter };
  };

  const handleEnter = (index: number) => {
    setHovered(index);
    const next = calculatePosition(index);
    if (!next) return;
    if (activeIndex === null) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsEntering(true);
      timeoutRef.current = setTimeout(() => { setCoords(next); setActiveIndex(index); }, tooltipDelay);
    } else {
      setCoords(next);
      setActiveIndex(index);
    }
  };

  const handleLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(null);
    setActiveIndex(null);
    setCoords({ clipPath: '', translateY: 0 });
    setIsEntering(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="dw-toolbar" data-dw-ui>
        <div className="dw-toolbar-inner" onPointerLeave={handleLeave}>
          <AnimatePresence>
            {activeIndex !== null && coords.clipPath !== '' && (
              <motion.div
                className="dw-tip-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="dw-glass-tip"
                  animate={{ clipPath: coords.clipPath, y: coords.translateY }}
                  transition={{ type: 'spring', bounce: 0, duration: isEntering ? 0 : 0.4 }}
                  onUpdate={() => { if (isEntering) setIsEntering(false); }}
                >
                  {items.map((item) => (
                    <div key={`real-${item.id}`} className="dw-row"><Row item={item} /></div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="dw-glass dw-pill" role="toolbar" aria-orientation="vertical" aria-label={label}>
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                ref={(el) => { buttonRefs.current[index] = el; }}
                className="dw-btn"
                aria-label={item.label}
                aria-pressed={item.pressed}
                aria-keyshortcuts={item.keys?.[0]}
                onClick={item.onSelect}
                // pen/mouse only: on touch screens a tap should act, not leave a tooltip stuck open
                onPointerEnter={(e) => { if (e.pointerType !== 'touch') handleEnter(index); }}
                onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) handleEnter(index); }}
                onBlur={handleLeave}
              >
                {hovered === index && (
                  <motion.span
                    layoutId="dw-lens"
                    className="dw-lens"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="dw-ico">{item.icon}</span>
              </button>
            ))}
          </div>

          {/* hidden twin of the tooltip rows, used only to measure heights */}
          <div className="dw-measure" aria-hidden="true">
            {items.map((item, index) => (
              <div key={`measure-${item.id}`} ref={(el) => { measureRefs.current[index] = el; }} className="dw-row">
                <Row item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
