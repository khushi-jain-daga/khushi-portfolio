"use client";

import { useEffect, useRef, useState } from "react";
import { products } from "../../data/portfolio";
import styles from "./TactilePortfolio.module.css";
import QueryProductStack from "./QueryProductStack";

export default function TactilePortfolio() {
  const [progress, setProgress] = useState(0);
  const worldRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? window.scrollY / max : 0;
      setProgress(next);
      worldRef.current?.style.setProperty("--scroll", next.toFixed(4));
    };
    const point = (event) => {
      worldRef.current?.style.setProperty("--mx", `${(event.clientX / window.innerWidth - .5).toFixed(3)}`);
      worldRef.current?.style.setProperty("--my", `${(event.clientY / window.innerHeight - .5).toFixed(3)}`);
    };
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.setAttribute("data-visible", "true");
    }), { threshold: .14 });
    document.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("pointermove", point, { passive: true });
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("pointermove", point); observer.disconnect(); };
  }, []);

  return (
    <main className={styles.world} ref={worldRef}>
      <div className={styles.progress} style={{ transform: `scaleX(${progress})` }} />
      <nav className={styles.nav}>
        <a className={styles.signature} href="#top">Khushi :)</a>
        <div><a href="#work">Work</a><a href="/about">About</a><a href="#contact">Connect</a></div>
      </nav>

      <section id="top" className={styles.hero}>
        <div className={styles.stamp}>FULL-STACK<br />PRODUCT BUILDER</div>
        <p className={styles.coordinates}>JAIPUR, INDIA · OPEN TO WORK</p>
        <h1 aria-label="Portfolio">{"PORTFOLI".split("").map((letter, index) => <span className={styles.rollingLetter} style={{ "--i": index }} key={`${letter}-${index}`}>{letter}</span>)}<span className={styles.faceO}><img src="/khushi-portfolio-o-trimmed.png" alt="Khushi Jain" /></span></h1>
        <div className={styles.heroStatement}><p>People bring me</p><strong>messy problems.</strong><p>I design the clarity<br />and build the product.</p></div>
        <a className={styles.scrollCue} href="#work">SCROLL TO ENTER <span>↓</span></a>
        <span className={styles.scribble}>one mind / many tools</span><div className={styles.runningTape}><span>DESIGN THE CLARITY ✦ BUILD THE SYSTEM ✦ SHIP THE PRODUCT ✦&nbsp;</span><span>DESIGN THE CLARITY ✦ BUILD THE SYSTEM ✦ SHIP THE PRODUCT ✦&nbsp;</span></div>
      </section>

      <QueryProductStack products={products} />

      <section id="contact" className={styles.contact}>
        <div className={styles.contactSticker}>DROP YOUR<br/>MESS HERE ↓</div><div className={styles.contactMessage}><i/><i/><i/><strong>“Can you build this?”</strong><span>YES — LET’S FIND OUT.</span></div>
        <span>BRING THE NEXT QUERY / 04</span><h2>Have a messy problem?<br />Let’s make it <em>useful.</em></h2><p>Available for full-stack/product opportunities and selected freelance projects.</p>
        <div className={styles.contactLinks}><a href="mailto:kjain282004@gmail.com">EMAIL ME ↗</a><a href="https://www.linkedin.com/in/khushi-jain-daga/" target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href="https://github.com/khushi-jain-daga" target="_blank" rel="noreferrer">GITHUB ↗</a></div>
        <a className={styles.aboutReveal} href="/about"><small>ONE LAST QUERY</small><strong>Who is Khushi?</strong><span>OPEN THE HIDDEN ABOUT PAGE →</span></a>
        <div className={styles.homeFooter}><span>KHUSHI JAIN · 2026</span><a href="#top">BACK TO TOP ↑</a></div>
      </section>
    </main>
  );
}
