import { useEffect } from "react";
import styles from "./ProjectCylinder.module.css";

export default function ProjectDetail({ product, open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!product) return null;

  return (
    <div
      className={`${styles.detailBackdrop} ${open ? styles.detailBackdropOpen : ""}`}
      aria-hidden={!open}
    >
      <article className={`${styles.detailPaper} ${open ? styles.detailPaperOpen : ""}`}>
        <button type="button" className={styles.detailClose} onClick={onClose}>
          CLOSE ×
        </button>

        <header className={styles.detailHeader}>
          <span>{product.index} / {product.category}</span>
          <h2>{product.title}</h2>
        </header>

        <div className={styles.detailFacts}>
          <section>
            <small>PROBLEM</small>
            <p>{product.problem}</p>
          </section>
          <section>
            <small>WHAT I BUILT</small>
            <p>{product.built}</p>
          </section>
          <section>
            <small>ROLE</small>
            <p>{product.role}</p>
          </section>
        </div>

        <div className={styles.detailVisuals}>
          {product.gallery?.length ? (
            product.gallery.slice(0, 4).map((image, index) => (
              <figure key={image} className={index === 0 ? styles.detailHeroVisual : ""}>
                <img
                  src={image}
                  alt={`${product.title} screen ${index + 1}`}
                  loading="lazy"
                />
              </figure>
            ))
          ) : (
            <div className={styles.detailCodeVisual}>
              <span>INPUT</span>
              <strong>{product.visualCode}</strong>
              <span>OUTPUT</span>
            </div>
          )}
        </div>

        {(product.live || product.github) && (
          <footer className={styles.detailLinks}>
            {product.live && (
              <a href={product.live} target="_blank" rel="noreferrer">
                VIEW LIVE ↗
              </a>
            )}
            {product.github && (
              <a href={product.github} target="_blank" rel="noreferrer">
                GITHUB ↗
              </a>
            )}
          </footer>
        )}
      </article>
    </div>
  );
}

