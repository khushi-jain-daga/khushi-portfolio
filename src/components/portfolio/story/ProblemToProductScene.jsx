"use client";

import { useRef } from "react";
import { clientMessages, products } from "../../../data/portfolio";
import useScrollProgress from "../../../hooks/useScrollProgress";
import { lerp, phaseOpacity, smoothstep } from "../../../lib/motion";
import ClientMessage from "./ClientMessage";
import styles from "./ProblemToProductScene.module.css";

const fragments = [
  { label: "?", x: -26, y: -19, tx: -10, ty: -8, rotate: -12, kind: "mark" },
  { label: "USER", x: 26, y: -22, tx: 0, ty: -12, rotate: 5, kind: "node" },
  { label: "→", x: -33, y: 7, tx: -14, ty: 5, rotate: 8, kind: "mark" },
  { label: "UI", x: 31, y: 11, tx: 12, ty: 4, rotate: -5, kind: "box" },
  { label: "{ }", x: -18, y: 27, tx: -5, ty: 14, rotate: 9, kind: "code" },
  { label: "FLOW", x: 18, y: 29, tx: 10, ty: 14, rotate: -7, kind: "node" },
  { label: "â–±", x: 2, y: -31, tx: 0, ty: 0, rotate: 10, kind: "window" },
];

const morphProducts = [
  { productId: "examon", messageIndex: 1, start: 0.775, sx: -24, sy: -9, ex: -25, ey: 4, rotate: -6 },
  { productId: "teamspace", messageIndex: 3, start: 0.815, sx: 22, sy: -6, ex: 0, ey: -2, rotate: 3 },
  { productId: "qampus", messageIndex: 5, start: 0.855, sx: 2, sy: 24, ex: 25, ey: 5, rotate: 6 },
];

export default function ProblemToProductScene() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const progress = useScrollProgress(sectionRef);

  const rise = smoothstep(0.00, 0.075, progress);
  const pressure = smoothstep(0.30, 0.50, progress);
  const problemGirlOpacity = 1 - smoothstep(0.49, 0.59, progress);
  const ideaGirlOpacity = smoothstep(0.50, 0.60, progress) * (1 - smoothstep(0.79, 0.88, progress));
  const thoughtOpacity = phaseOpacity(progress, 0.40, 0.76, 0.07);
  const chaos = smoothstep(0.42, 0.61, progress);
  const snap = smoothstep(0.66, 0.735, progress);
  const clickPulse = phaseOpacity(progress, 0.69, 0.765, 0.018);
  const productsForm = smoothstep(0.76, 0.93, progress);
  const pullBack = smoothstep(0.91, 1, progress);

  const handlePointerMove = (event) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 14;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 10;
    stage.style.setProperty("--pointer-x", `${x}px`);
    stage.style.setProperty("--pointer-y", `${y}px`);
  };

  const handlePointerLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--pointer-x", "0px");
    stage.style.setProperty("--pointer-y", "0px");
  };

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Problems become products">
      <div
        ref={stageRef}
        className={styles.sticky}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={styles.editorialGrid} />
        <span className={styles.registrationA}>+</span>
        <span className={styles.registrationB}>+</span>

        <div
          className={styles.problemCharacter}
          style={{
            opacity: problemGirlOpacity,
            transform: `translate3d(-50%, calc(-50% + ${(1 - rise) * 40}vh), 0) scale(${0.86 + rise * 0.04 - pressure * 0.015})`,
          }}
        >
          <img src="/character/problem-girl.png" alt="Character receiving client problems" draggable={false} />
        </div>

        <div
          className={styles.ideaCharacter}
          style={{
            opacity: ideaGirlOpacity,
            transform: `translate3d(-50%, -50%, 0) scale(${0.84 + snap * 0.04})`,
          }}
        >
          <img src="/character/idea-girl.png" alt="Character finding the solution" draggable={false} />
        </div>

        <div className={styles.messageCloud}>
          {clientMessages.map((message, index) => (
            <ClientMessage
              key={message.id}
              message={message}
              progress={progress}
              index={index}
            />
          ))}
        </div>

        <div
          className={styles.pressureHalo}
          style={{
            opacity: pressure * (1 - smoothstep(0.58, 0.68, progress)),
            transform: `translate(-50%, -50%) scale(${0.72 + pressure * 0.3})`,
          }}
          aria-hidden="true"
        />

        <div
          className={styles.thoughtCloud}
          style={{
            opacity: thoughtOpacity,
            transform: `translate3d(var(--pointer-x), var(--pointer-y), 0)`,
          }}
        >
          {fragments.map((fragment, index) => {
            const x = lerp(fragment.x, fragment.tx, snap);
            const y = lerp(fragment.y, fragment.ty, snap);
            const rotate = lerp(fragment.rotate, 0, snap);
            const wobble = (1 - snap) * Math.sin(progress * 22 + index * 1.4) * 2.4;
            const scale = lerp(0.82 + chaos * 0.22, 0.70, snap);

            return (
              <div
                key={`${fragment.label}-${index}`}
                className={`${styles.thoughtFragment} ${styles[`fragment_${fragment.kind}`]}`}
                style={{
                  opacity: fragment.kind === "mark" ? 1 - snap * 0.72 : 1,
                  transform: `translate3d(calc(-50% + ${x + wobble}vw), calc(-50% + ${y}vh), 0) rotate(${rotate}deg) scale(${scale})`,
                }}
              >
                {fragment.label}
              </div>
            );
          })}

          <svg className={styles.connectionSketch} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M23 32 C39 17, 59 28, 73 42" style={{ strokeDashoffset: `${130 - snap * 130}` }} />
            <path d="M27 68 C44 77, 58 58, 72 63" style={{ strokeDashoffset: `${130 - snap * 130}` }} />
            <path d="M50 26 C43 46, 59 55, 50 74" style={{ strokeDashoffset: `${130 - snap * 130}` }} />
          </svg>
        </div>

        <div
          className={styles.solutionClick}
          style={{
            opacity: clickPulse,
            transform: `translate(-50%, -50%) scale(${0.68 + clickPulse * 0.48})`,
          }}
          aria-hidden="true"
        >
          <span />
          <small>got it.</small>
        </div>

        <div
          className={styles.microCopy}
          style={{ opacity: phaseOpacity(progress, 0.70, 0.81, 0.025) }}
        >
          you bring the problem.
        </div>

        <div
          className={`${styles.microCopy} ${styles.microCopySecond}`}
          style={{ opacity: phaseOpacity(progress, 0.79, 0.91, 0.028) }}
        >
          I turn it into a product.
        </div>

        <div
          className={styles.morphWorld}
          style={{
            opacity: smoothstep(0.74, 0.79, progress),
            transform: `translate3d(-50%, -50%, 0) scale(${lerp(1, 0.74, pullBack)})`,
          }}
        >
          {morphProducts.map((seed, index) => {
            const product = products.find((item) => item.id === seed.productId);
            const message = clientMessages[seed.messageIndex];
            const morph = smoothstep(seed.start, seed.start + 0.10, progress);
            const settle = smoothstep(seed.start + 0.075, seed.start + 0.15, progress);
            const x = lerp(seed.sx, seed.ex, settle);
            const y = lerp(seed.sy, seed.ey, settle);
            const rotate = lerp(seed.rotate, index === 1 ? 0 : seed.rotate * 0.35, settle);
            const scale = lerp(index === 1 ? 0.58 : 0.42, index === 1 ? 0.93 : 0.64, morph);

            return (
              <div
                key={seed.productId}
                className={`${styles.morphCard} ${index === 1 ? styles.morphCardHero : ""}`}
                style={{
                  zIndex: 50 + (index === 1 ? 10 : index),
                  transform: `translate3d(calc(-50% + ${x}vw), calc(-50% + ${y}vh), ${index === 1 ? 80 : -10}px) rotate(${rotate}deg) scale(${scale})`,
                }}
              >
                <div className={styles.morphMessage} style={{ opacity: 1 - morph }}>
                  <span />
                  {message?.text}
                </div>

                <div className={styles.morphProduct} style={{ opacity: morph }}>
                  <div className={styles.morphProductTop}>
                    <i /><i /><i />
                    <small>{product?.title}</small>
                  </div>
                  {product?.cover ? (
                    <img src={product.cover} alt={`${product.title} product`} draggable={false} />
                  ) : (
                    <div className={styles.morphCode}>{product?.visualCode}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={styles.pullbackHint}
          style={{
            opacity: smoothstep(0.95, 0.995, progress),
            transform: `translate3d(-50%, ${lerp(12, 0, pullBack)}px, 0)`,
          }}
        >
          more problems. more products.
        </div>
      </div>
    </section>
  );
}

