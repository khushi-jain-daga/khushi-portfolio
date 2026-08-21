import styles from "./ProjectCylinder.module.css";

export default function ProjectPaperCard({ product, cardRef, onSelect }) {
  return (
    <button
      ref={cardRef}
      type="button"
      data-project-card="true"
      data-project-id={product.id}
      className={styles.paperCard}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(product);
      }}
      aria-label={`Open ${product.title} project story`}
    >
      <span className={styles.paperTopline}>
        <span>{product.index}</span>
        <span>{product.category}</span>
      </span>

      <strong>{product.title}</strong>
      <span className={styles.paperSummary}>{product.short}</span>

      <span className={styles.paperVisual}>
        {product.cover ? (
          <img
            src={product.cover}
            alt={`${product.title} preview`}
            loading="lazy"
            draggable={false}
          />
        ) : (
          <span className={styles.codeVisual}>
            <i>PROBLEM</i>
            <b>{product.visualCode}</b>
            <i>PRODUCT</i>
          </span>
        )}
      </span>

      <span className={styles.paperFooter}>
        <span>PRODUCT / {product.index}</span>
        <span>ENTER PROJECT</span>
      </span>
    </button>
  );
}
