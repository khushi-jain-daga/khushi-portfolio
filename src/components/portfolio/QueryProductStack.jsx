"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./QueryProductStack.module.css";

const featuredIds=["examon","teamspace","batch-manager","academic-planner","shaktii","dpp-converter","qampus","banking-api"];
const problems=[
  {from:"STUDENT · 09:14",quote:"I keep missing important courses, tests and updates.",need:"Everything in one reliable place."},
  {from:"TEAM · 11:42",quote:"Our conversations, tasks and files are scattered everywhere.",need:"One shared space that remembers."},
  {from:"FACULTY · 16:08",quote:"Creating every practice sheet manually takes hours.",need:"Turn raw questions into ready DPPs."},
];
const queryById={
  examon:"How might students find courses, tests and updates in one place?",
  teamspace:"How might a team keep conversations, tasks and files together?",
  "batch-manager":"How might the team manage a complete batch from setup to export in one workspace?",
  "academic-planner":"How might academic teams create study plans and faculty schedules without repeated manual work?",
  shaktii:"How might security teams turn raw logs into useful findings, threat context and response steps?",
  "dpp-converter":"How might faculty turn raw questions into formatted practice sheets?",
  qampus:"How might students discover what matters around their campus?",
  "banking-api":"How might a backend keep banking operations simple, validated and testable?",
};
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));

function circularOffset(index,active,length){
  let difference=index-active;
  const half=Math.floor(length/2);
  if(difference < -half) difference += length;
  if(difference > half) difference -= length;
  return difference;
}

function cardPosition(offset){
  const direction=offset<0?-1:1;
  const depth=Math.abs(offset);

  if(depth===0){
    return {x:0,scale:1,opacity:1,z:30,filter:"none"};
  }
  if(depth===1){
    return {x:direction*23,scale:.86,opacity:1,z:20,filter:"brightness(.67) saturate(.72)"};
  }
  if(depth===2){
    return {x:direction*39,scale:.72,opacity:.92,z:10,filter:"brightness(.48) saturate(.58)"};
  }
  return {x:direction*55,scale:.58,opacity:0,z:1,filter:"brightness(.42) saturate(.5)"};
}

export default function QueryProductStack({products}){
  const ref=useRef(null);
  const [progress,setProgress]=useState(0);
  const [phase,setPhase]=useState("idle");
  const [activeProject,setActiveProject]=useState(0);
  const storyStarted=useRef(false);
  const deckHovered=useRef(false);
  const autoPauseUntil=useRef(0);
  const restoringWork=useRef(false);
  const featured=useMemo(()=>featuredIds.map(id=>products.find(p=>p.id===id)).filter(Boolean),[products]);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const returnedProject=params.get("project");
    if(window.location.hash!=="#work"&&!returnedProject)return;

    restoringWork.current=true;
    storyStarted.current=true;
    setPhase("moving");
    const returnedIndex=featured.findIndex(product=>product.id===returnedProject);
    if(returnedIndex>=0)setActiveProject(returnedIndex);

    const restore=window.requestAnimationFrame(()=>{
      ref.current?.scrollIntoView({block:"start"});
      window.history.replaceState(null,"","/#work");
    });
    const release=window.setTimeout(()=>{restoringWork.current=false;},700);
    return()=>{window.cancelAnimationFrame(restore);window.clearTimeout(release);};
  },[featured]);

  useEffect(()=>{
    const update=()=>{
      if(!ref.current)return;
      const rect=ref.current.getBoundingClientRect();
      const travel=Math.max(1,ref.current.offsetHeight-window.innerHeight);
      setProgress(clamp(-rect.top/travel));
    };
    update();
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
  },[]);

  useEffect(()=>{
    if(restoringWork.current)return;
    if(progress<.1){storyStarted.current=false;setPhase("idle");return;}
    if(storyStarted.current)return;
    storyStarted.current=true;
    setPhase("intake");
    const processingTimer=window.setTimeout(()=>setPhase("processing"),1400);
    const clarityTimer=window.setTimeout(()=>setPhase("clarity"),2400);
    const previewTimer=window.setTimeout(()=>setPhase("preview"),4400);
    const productsTimer=window.setTimeout(()=>setPhase("products"),5400);
    const movingTimer=window.setTimeout(()=>setPhase("moving"),6400);
    return()=>{
      window.clearTimeout(processingTimer);
      window.clearTimeout(clarityTimer);
      window.clearTimeout(previewTimer);
      window.clearTimeout(productsTimer);
      window.clearTimeout(movingTimer);
    };
  },[progress>=.1]);

  const fullProducts=phase==="products"||phase==="moving";
  const isReady=phase==="clarity"||phase==="preview"||fullProducts;

  const pauseAutoDeck=(milliseconds=10000)=>{
    autoPauseUntil.current=Date.now()+milliseconds;
  };

  const selectProject=(index)=>{
    pauseAutoDeck();
    setActiveProject(index);
  };

  const nextProject=()=>{
    pauseAutoDeck();
    setActiveProject(index=>(index+1)%featured.length);
  };

  const previousProject=()=>{
    pauseAutoDeck();
    setActiveProject(index=>(index-1+featured.length)%featured.length);
  };

  useEffect(()=>{
    if(!fullProducts||featured.length<2)return;
    const timer=window.setInterval(()=>{
      if(document.hidden||deckHovered.current||Date.now()<autoPauseUntil.current)return;
      setActiveProject(index=>(index+1)%featured.length);
    },4000);
    return()=>window.clearInterval(timer);
  },[fullProducts,featured.length]);

  return <section id="work" ref={ref} className={styles.section}>
    <style>{`
      .${styles.projectGrid} > .${styles.wallCard} {
        animation: none !important;
      }
      .${styles.projectWall}.${styles.moveProjectWall} .${styles.projectGrid} > .${styles.wallCard}:hover,
      .${styles.projectGrid} > .${styles.wallCard}.${styles.wallCardActive}:hover,
      .${styles.projectGrid} > .${styles.wallCard}:not(.${styles.wallCardActive}):hover {
        transform: var(--stable-card-transform) !important;
      }
      .${styles.projectGrid} > .${styles.wallCard}:not(.${styles.wallCardActive}) {
        pointer-events: auto;
      }
    `}</style>

    <div className={`${styles.sticky} ${styles[`phase_${phase}`]}`}>
      <header className={styles.intro}>
        <span>PEOPLE DON’T ARRIVE WITH PRODUCT SPECS / 01</span>
        <h2>They arrive with<br/><em>something that hurts.</em></h2>
        <p>I listen for the problem underneath the request.</p>
      </header>

      <div className={styles.problemCards}>
        {problems.map((problem,index)=><article key={problem.from} style={{"--card-index":index,"--start-r":`${(index-1)*1.8}deg`,"--bundle-x":`${(1-index)*31}vw`}}>
          <small>{problem.from}</small><strong>“{problem.quote}”</strong><span>WHAT THEY ACTUALLY NEED</span><p>{problem.need}</p><i>↓</i>
        </article>)}
      </div>

      <div className={styles.inputRoutes} aria-hidden="true"><i/><i/><i/></div>

      <div className={`${styles.brainStage} ${isReady?styles.brainReady:styles.brainThinking} ${phase==="preview"?styles.brainPreview:""}`}>
        <div className={styles.intakePort}><span>MESSY INPUTS</span><i>↓</i></div>
        <div className={styles.brainVisual}>
          <Image className={styles.thinkingBrain} src="/khushi-brain-thinking.png" alt="Khushi thinking through messy problems" fill sizes="(max-width: 820px) 82vw, 560px" priority={false}/>
          <Image className={styles.ideaBrain} src="/khushi-brain-idea.png" alt="Khushi finding clarity and a product idea" fill sizes="(max-width: 820px) 82vw, 560px" priority={false}/>
        </div>
        <div className={styles.brainCopy}>
          <small>{isReady?"OK — CLARITY FOUND":"INSIDE KHUSHI’S HEAD"}</small>
          <strong>{isReady?<>Products <em>ready.</em></>:<>Processing<span className={styles.dots}>...</span></>}</strong>
          <div className={styles.processingTrack}><i/><span>{isReady?"REAL PROBLEMS → WORKING PRODUCTS":"LISTENING · UNTANGLING · SHAPING · BUILDING"}</span></div>
        </div>
      </div>

      <div className={styles.outputRoutes} aria-hidden="true"><i/><i/><i/><i/></div>

      <div className={`${styles.productBurst} ${phase==="preview"?styles.showBurst:""}`}>
        {featured.map((product,index)=><div key={product.id} style={{"--burst-index":index}}><span>{String(index+1).padStart(2,"0")}</span><strong>{product.title}</strong><small>REAL PRODUCT</small></div>)}
      </div>

      <div className={`${styles.projectWall} ${fullProducts?styles.showProjectWall:""} ${phase==="moving"?styles.moveProjectWall:""}`}>
        <header><span>THE MESS BECOMES A PRODUCT / 02</span><h2>Problems become<em> working products.</em></h2></header>

        <div
          className={styles.projectGrid}
          onPointerEnter={()=>{deckHovered.current=true;}}
          onPointerLeave={()=>{deckHovered.current=false;}}
          onFocusCapture={()=>{deckHovered.current=true;}}
          onBlurCapture={()=>{deckHovered.current=false;}}
        >
          {featured.map((product,index)=>{
            const gallery=product.id==="qampus"?[product.gallery?.[3],product.gallery?.[1],product.gallery?.[2]].filter(Boolean):(product.gallery||[]).slice(0,3);
            const offset=circularOffset(index,activeProject,featured.length);
            const position=cardPosition(offset);
            const depth=Math.abs(offset);
            const isActive=index===activeProject;
            const stableTransform=`translateX(calc(-50% + ${position.x}vw)) scale(${position.scale})`;

            return <article
              key={product.id}
              className={`${styles.wallCard} ${isActive?styles.wallCardActive:""}`}
              onClick={()=>{if(!isActive)selectProject(index);else pauseAutoDeck();}}
              onPointerDown={()=>pauseAutoDeck()}
              style={{
                "--wall-index":index,
                "--stable-card-transform":stableTransform,
                transform:stableTransform,
                opacity:position.opacity,
                zIndex:position.z,
                filter:position.filter,
                pointerEvents:depth<=2?"auto":"none",
                transition:"transform 700ms cubic-bezier(.22,1,.36,1), opacity 340ms ease, filter 340ms ease, box-shadow 340ms ease",
                willChange:"transform, opacity",
              }}
            >
              <div className={styles.wallImage}>
                <div className={`${styles.productCover} ${styles[`cover_${product.id.replaceAll("-","_")}`]}`}>
                  <span className={styles.coverLabel}>{product.category}</span>
                  {gallery.length?<div className={styles.deviceComposition}>
                    {gallery.map((image,imageIndex)=><figure key={image} className={styles[`device${imageIndex+1}`]}><div className={styles.browserBar}><i/><i/><i/></div><div className={styles.screen}><Image src={image} alt={`${product.title} interface view ${imageIndex+1}`} fill sizes="(max-width: 820px) 72vw, 520px"/></div></figure>)}
                  </div>:<div className={styles.generatedCover}>{product.visualCode}</div>}
                  <strong>{product.title}</strong>
                </div>
              </div>

              <div className={styles.wallCopy}>
                <div className={styles.productMeta}><span>{String(index+1).padStart(2,"0")} / {product.category}</span><i>{product.role}</i></div>
                <h3>{product.title}</h3><p>{queryById[product.id]}</p>
                <div className={styles.cardActions}>
                  <Link href={`/projects/${product.id}`} onPointerDown={event=>event.stopPropagation()} onClick={event=>event.stopPropagation()}>READ CASE STUDY <span>↗</span></Link>
                  {product.live&&<a href={product.live} target="_blank" rel="noreferrer" onPointerDown={event=>event.stopPropagation()} onClick={event=>event.stopPropagation()}>LIVE PRODUCT <span>↗</span></a>}
                  {!product.live&&product.github&&<a href={product.github} target="_blank" rel="noreferrer" onPointerDown={event=>event.stopPropagation()} onClick={event=>event.stopPropagation()}>VIEW SOURCE <span>↗</span></a>}
                </div>
              </div>
            </article>;
          })}
        </div>

        <div className={styles.projectControls}>
          <button type="button" aria-label="Previous project" onClick={previousProject}>←</button>
          <div>{featured.map((product,index)=><button type="button" key={product.id} aria-label={`Show ${product.title}`} className={index===activeProject?styles.activeDot:""} onClick={()=>selectProject(index)}/>)}</div>
          <button type="button" aria-label="Next project" onClick={nextProject}>→</button>
        </div>
      </div>

      <p className={styles.scrollHint}>{fullProducts?"CLICK A SIDE CARD OR USE THE ARROWS TO BROWSE ↗":"KEEP SCROLLING — WATCH THE TRANSFORMATION ↓"}</p>
    </div>
  </section>;
}
