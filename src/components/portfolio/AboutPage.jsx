"use client";

import styles from "./AboutPage.module.css";

export default function AboutPage(){
  return <main className={styles.page}>
    <nav className={styles.nav}><a href="/">Khushi :)</a><a href="/">CLOSE ABOUT ×</a></nav>
    <section className={styles.hero}>
      <div className={styles.copy}><span>THE PERSON BEHIND THE PRODUCTS</span><h1>Designer’s eye.<br/>Developer’s hands.<br/><em>Product mind.</em></h1><p>I’m Khushi Jain. I moved from graphic design into frontend and full-stack product work without losing the curiosity that made me a designer.</p></div>
      <figure><img src="/khushi-pink-blazer.png" alt="Khushi Jain"/><figcaption>YES, THIS IS THE ONE PORTRAIT :)</figcaption></figure>
    </section>
    <section className={styles.story}>
      <header><span>HOW I GOT HERE / 01</span><h2>Not a straight line.<br/><em>A useful one.</em></h2></header>
      <div className={styles.timeline}>
        <article><small>THEN</small><strong>I made ideas visible.</strong><p>Graphic design taught me hierarchy, taste and how people read before they think.</p></article><span>→</span>
        <article><small>THE TURN</small><strong>I wanted the work to move.</strong><p>Frontend turned static decisions into interactions, systems and real user moments.</p></article><span>→</span>
        <article><small>NOW</small><strong>I make the whole thing useful.</strong><p>I shape the problem, interface, logic and shipped product—not just the surface.</p></article>
      </div>
    </section>
    <section className={styles.values}>
      <div><span>WHAT I BRING / 02</span><h2>One mind.<br/>Many tools.</h2></div>
      <ul><li><b>01</b><span>Product thinking</span><small>Find the problem underneath the request.</small></li><li><b>02</b><span>Full-stack building</span><small>Move from interface to working system.</small></li><li><b>03</b><span>Design judgment</span><small>Make complexity feel deliberate.</small></li><li><b>04</b><span>AI workflows</span><small>Use new tools to reduce repetitive work.</small></li></ul>
    </section>
    <footer className={styles.footer}><span>ENOUGH ABOUT ME.</span><h2>Let’s talk about<br/><em>what we can build.</em></h2><div><a href="mailto:kjain282004@gmail.com">EMAIL ME ↗</a><a href="/">BACK TO WORK ↗</a></div></footer>
  </main>;
}
