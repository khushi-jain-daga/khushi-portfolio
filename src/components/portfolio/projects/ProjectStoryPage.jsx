import Link from "next/link";
import styles from "./ProjectStoryPage.module.css";

const details = {
  examon: { stack:["Next.js","Firebase","SEO","Analytics","Design system"], impact:["Live education platform","Courses + tests + resources","Production ownership"], decisions:["Unify fragmented learning journeys","Make discovery faster across exams","Design for continuous content operations"] },
  teamspace: { stack:["Next.js","Firebase","Realtime data","Product UX"], impact:["Shared team workspace","Communication + execution","End-to-end product build"], decisions:["Keep conversations close to work","Reduce context switching","Make ownership visible"] },
  qampus: { stack:["React Native","Expo","FastAPI","Gemini","Local knowledge"], impact:["Campus discovery","AI-assisted student help","Secure server-side AI flow"], decisions:["Keep provider keys off the client","Use local knowledge for known questions","Keep AI optional rather than mandatory"] },
  upscaler: { stack:["Next.js","AI workflow","Image processing","Vercel"], impact:["Live utility","Faster creative workflow","Focused single-purpose UX"], decisions:["Remove unnecessary controls","Make before/after obvious","Optimise for repeat use"] },
  "dpp-converter": { stack:["Electron","Node.js","Express","Document parsing","PDF generation"], impact:["Manual work reduced","Repeatable bilingual output","Education operations"], decisions:["Preserve question structure","Validate before export","Make the workflow reusable"] },
  "study-notes": { stack:["Generative AI","Prompt systems","Document pipeline","Validation"], impact:["Structured notes","Reusable content","Human-review workflow"], decisions:["Separate generation from validation","Preserve subject hierarchy","Design for editable output"] },
  "rank-predictor": { stack:["Data logic","Frontend","Product UX","Visualisation"], impact:["Score context","Clear estimates","Student decision support"], decisions:["Explain the estimate","Reduce input friction","Show useful context, not only a rank"] },
  "academic-planner": { stack:["Browser app","Scheduling logic","localStorage","CSV export","PDF / print workflows"], impact:["Study-plan generation","Faculty workload planning","Rolling batch support"], decisions:["Model faculty-subject relationships first","Keep weekend changes explicit","Make plans exportable for operations"] },
  "batch-manager": { stack:["Node.js","Server-backed web app","JSON data store","Document parsing","AI adapters"], impact:["One workspace per batch","40+ batch operations","Batch-to-publish workflow"], decisions:["Keep the batch as the main data unit","Make AI optional with useful fallbacks","Keep every output versioned and exportable"] },
};

export default function ProjectStoryPage({ product, nextProduct }) {
  const info = details[product.id] || { stack:["Product thinking","Design","Development"], impact:["Useful workflow","Clear experience","Shipped product"], decisions:["Find the friction","Structure the journey","Build the useful version"] };
  const backToWork=`/?project=${encodeURIComponent(product.id)}#work`;
  return (
    <main className={styles.page}>
      <header className={styles.nav}><Link href={backToWork}>← ALL WORK</Link><span>{product.index} / {product.category}</span><a href="mailto:kjain282004@gmail.com">LET’S TALK ↗</a></header>

      <section className={styles.hero}>
        <div className={styles.heroNumber}>{product.index}</div>
        <div className={styles.heroCopy}><small>PROJECT CASE FILE</small><h1>{product.title}</h1><p>{product.short}</p><div className={styles.heroLinks}>{product.live&&<a href={product.live} target="_blank" rel="noreferrer">VIEW LIVE ↗</a>}{product.github&&<a href={product.github} target="_blank" rel="noreferrer">SOURCE ↗</a>}</div></div>
        <div className={styles.heroStage}><div className={styles.windowBar}><i/><i/><i/><span>{product.category}</span></div>{product.cover?<img src={product.cover} alt={`${product.title} interface`}/>:<div className={styles.generated}><small>INPUT</small><strong>{product.visualCode}</strong><small>OUTPUT</small></div>}<span className={styles.tape}>BUILT BY KHUSHI</span></div>
        <div className={styles.heroThread} aria-hidden="true"><i/><i/><i/></div>
      </section>

      <section className={styles.brief}>
        <article className={styles.problemCard}><span>01 / THE MESS</span><h2>{product.problem}</h2><div className={styles.scribble}>This is where the thread starts ↘</div></article>
        <div className={styles.arrowCard}><span>UNDERSTAND</span><b>→</b><span>STRUCTURE</span><b>→</b><span>BUILD</span></div>
        <article className={styles.solutionCard}><span>02 / THE SHIFT</span><h2>{product.built}</h2><div className={styles.stamp}>PROBLEM<br/>→ PRODUCT</div></article>
      </section>

      <section className={styles.blueprint}>
        <header><small>03 / PRODUCT BLUEPRINT</small><h2>How the solution<br/><em>holds together.</em></h2></header>
        <div className={styles.flow}>{info.decisions.map((decision,index)=><div key={decision}><span>0{index+1}</span><strong>{decision}</strong>{index<info.decisions.length-1&&<i>→</i>}</div>)}</div>
        <div className={styles.evidenceGrid}><article><small>TOOLS & SYSTEMS</small><div>{info.stack.map(item=><span key={item}>{item}</span>)}</div></article><article><small>WHAT THIS PROVES</small><ul>{info.impact.map(item=><li key={item}>{item}</li>)}</ul></article><article className={styles.ownership}><small>MY OWNERSHIP</small><strong>{product.role}</strong></article></div>
      </section>

      <section className={styles.gallerySection}>
        <header><small>04 / SHIPPED SCREENS</small><h2>Not a mock-up.<br/><em>A working product.</em></h2></header>
        {product.gallery?.length?<div className={styles.gallery}>{product.gallery.map((image,index)=><figure key={image} className={styles[`shot${index+1}`]}><figcaption><span>{String(index+1).padStart(2,"0")}</span><small>{index===0?"OVERVIEW":"PRODUCT DETAIL"}</small></figcaption><img src={image} alt={`${product.title} screen ${index+1}`} loading={index===0?"eager":"lazy"}/></figure>)}</div>:<div className={styles.noGallery}><span>WORKFLOW</span><strong>{product.visualCode}</strong><div><i>INPUT</i><b>→</b><i>LOGIC</i><b>→</b><i>OUTPUT</i></div></div>}
      </section>

      <section className={styles.takeaway}><span>05 / TAKEAWAY</span><blockquote>“The best product work makes a complicated system feel quietly obvious.”</blockquote><p>This project reflects how I work: understand the real friction, organise the system, and carry the idea through to something people can use.</p><div className={styles.links}>{product.live&&<a href={product.live} target="_blank" rel="noreferrer">OPEN PRODUCT ↗</a>}{product.github&&<a href={product.github} target="_blank" rel="noreferrer">VIEW GITHUB ↗</a>}</div></section>

      <footer className={styles.footer}><Link href={backToWork}>← BACK TO WORK</Link>{nextProduct&&<Link href={`/projects/${nextProduct.id}`} className={styles.next}><span>NEXT CASE FILE</span><strong>{nextProduct.title}</strong><i>→</i></Link>}</footer>
    </main>
  );
}
