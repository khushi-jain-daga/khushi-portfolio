"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { products } from "../../../data/portfolio";
import useScrollProgress from "../../../hooks/useScrollProgress";
import { smoothstep } from "../../../lib/motion";
import ProjectPaperCard from "./ProjectPaperCard";
import styles from "./ProjectCylinder.module.css";

const TAU = Math.PI * 2;

function nearestEquivalent(target, current) {
  return target + Math.round((current - target) / TAU) * TAU;
}

export default function ProjectCylinder() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const formationRef = useRef(0);
  const selectedRef = useRef(null);
  const navTimerRef = useRef(null);
  const dragRef = useRef({
    active: false,
    x: 0,
    distance: 0,
    suppressUntil: 0,
  });

  const progress = useScrollProgress(sectionRef);
  const formation = smoothstep(0.02, 0.19, progress);
  const headerReveal = smoothstep(0.08, 0.18, progress);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    formationRef.current = formation;
    scrollProgressRef.current = progress;
  }, [formation, progress]);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    products.forEach((product) => {
      try {
        // Warm the project route without depending on router navigation.
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = `/projects/${product.id}`;
        document.head.appendChild(link);
      } catch {
        // Prefetch is optional; normal navigation still works.
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) {
        window.clearTimeout(navTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let previous = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (now) => {
      const dt = Math.min(now - previous, 40);
      previous = now;

      const stage = stageRef.current;
      if (!stage) {
        raf = requestAnimationFrame(render);
        return;
      }

      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const mobile = width < 680;
      const tablet = width < 1050;

      const firstCard = cardRefs.current.find(Boolean);
      const cardWidth = firstCard?.offsetWidth || (mobile ? 210 : 242);
      const cardHeight = firstCard?.offsetHeight || (mobile ? 310 : 350);

      /*
        X orbit and Z depth are deliberately DIFFERENT.
        The old build used one large radius for both, so the front card
        moved too close to the camera and became huge/cropped.
      */
      const horizontalSafeSpace = Math.max(70, (width - cardWidth * 1.12) / 2 - 28);
      const verticalSafeSpace = Math.max(18, (height - cardHeight * 1.08) / 2 - 64);

      const xRadius = mobile
        ? Math.min(horizontalSafeSpace * 0.72, 118)
        : tablet
          ? Math.min(horizontalSafeSpace * 0.73, 260)
          : Math.min(horizontalSafeSpace * 0.76, 390);

      const zRadius = mobile ? 55 : tablet ? 92 : 126;
      const yAmplitude = mobile
        ? Math.min(verticalSafeSpace, 16)
        : Math.min(verticalSafeSpace, 24);

      const progressNow = scrollProgressRef.current;
      const formationNow = formationRef.current;

      /*
        Keep the cylinder alive whenever it is formed.

        IMPORTANT:
        Do NOT stop at progress 0.99 / 1.00.
        Products are the final page experience, so they must
        continue rotating even when the browser is at the
        bottom of the document.
      */
      if (
        formationNow > 0.9 &&
        !dragRef.current.active &&
        !selectedRef.current &&
        !reduceMotion
      ) {
        targetRotationRef.current += dt * 0.00010;
      }

      rotationRef.current += (targetRotationRef.current - rotationRef.current) * 0.13;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const base = (index / products.length) * TAU;
        const angle = base + rotationRef.current;
        const sine = Math.sin(angle);
        const cosine = Math.cos(angle);
        const depth = (cosine + 1) / 2;

        let x = sine * xRadius * formationNow;
        let y = Math.sin(angle * 1.7 + index * 0.42) * yAmplitude * formationNow;
        let z = cosine * zRadius * formationNow;
        let scale = mobile ? 0.72 + depth * 0.20 : 0.70 + depth * 0.24;
        let opacity = 0.18 + depth * 0.82;
        let blur = (1 - depth) * (mobile ? 0.8 : 1.7);
        let rotateY = -sine * (mobile ? 13 : 27);
        let rotateZ = sine * (mobile ? 0.25 : 0.55);

        const isSelected = selectedRef.current?.id === products[index].id;

        if (selectedRef.current) {
          if (isSelected) {
            x *= 0.04;
            y *= 0.04;
            z = mobile ? 72 : 138;
            scale = mobile ? 0.91 : 0.96;
            opacity = 1;
            blur = 0;
            rotateY *= 0.03;
            rotateZ *= 0.03;
          } else {
            z -= mobile ? 32 : 68;
            scale *= 0.90;
            opacity *= 0.12;
            blur += 2.4;
          }
        }

        card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.filter = `blur(${blur}px)`;
        card.style.zIndex = String(Math.round(1000 + depth * 800 + z));
        card.style.setProperty("--depth", depth.toFixed(3));
      });

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  const openProject = useCallback((product) => {
    if (!product?.id) return;
    if (selectedRef.current) return;
    if (performance.now() < dragRef.current.suppressUntil) return;

    const index = products.findIndex((item) => item.id === product.id);
    if (index < 0) return;

    const base = (index / products.length) * TAU;
    targetRotationRef.current = nearestEquivalent(-base, rotationRef.current);
    selectedRef.current = product;
    setSelected(product);

    if (navTimerRef.current) {
      window.clearTimeout(navTimerRef.current);
    }

    /*
      Use a real browser navigation after the focus animation.
      This avoids the click/router issue in the previous build and makes
      the project route deterministic.
    */
    navTimerRef.current = window.setTimeout(() => {
      window.location.assign(`/projects/${product.id}`);
    }, 460);
  }, []);

  const handlePointerDown = (event) => {
    if (selectedRef.current) return;

    dragRef.current.active = true;
    dragRef.current.x = event.clientX;
    dragRef.current.distance = 0;

    /*
      DO NOT call setPointerCapture here.
      The previous version captured the pointer on the stage and could steal
      the final click from the card button.
    */
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active || selectedRef.current) return;

    const dx = event.clientX - dragRef.current.x;
    dragRef.current.x = event.clientX;
    dragRef.current.distance += Math.abs(dx);
    targetRotationRef.current += dx * 0.0062;
  };

  const endDrag = () => {
    if (!dragRef.current.active) return;

    dragRef.current.active = false;

    if (dragRef.current.distance > 10) {
      dragRef.current.suppressUntil = performance.now() + 180;
    }
  };

  const handleWheel = (event) => {
    if (selectedRef.current) return;
    targetRotationRef.current += (event.deltaY + event.deltaX * 0.72) * 0.00052;
  };

  return (
    <section ref={sectionRef} className={styles.section} id="products">
      <div className={styles.sticky}>
        <header className={styles.cylinderHeader} style={{ opacity: headerReveal }}>
          <span>SELECTED PRODUCTS</span>
          <small>DRAG / SWIPE / SCROLL / OPEN</small>
        </header>

        <div
          ref={stageRef}
          className={styles.cylinderStage}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          onWheel={handleWheel}
        >
          <div className={styles.centerShadow} aria-hidden="true" />

          {products.map((product, index) => (
            <ProjectPaperCard
              key={product.id}
              product={product}
              cardRef={(node) => {
                cardRefs.current[index] = node;
              }}
              onSelect={openProject}
            />
          ))}
        </div>

        <div className={styles.scrollExit} style={{ opacity: selected ? 0 : headerReveal }}>
          CLICK A PRODUCT TO ENTER ITS STORY
        </div>
      </div>
    </section>
  );
}

