"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./QueryProductStack.module.css";

const featuredIds=["examon","teamspace","dpp-converter","qampus"];
const problems=[
  {from:"STUDENT · 09:14",quote:"I keep missing important courses, tests and updates.",need:"Everything in one reliable place."},
  {from:"TEAM · 11:42",quote:"Our conversations, tasks and files are scattered everywhere.",need:"One shared space that remembers."},
  {from:"FACULTY · 16:08",quote:"Creating every practice sheet manually takes hours.",need:"Turn raw questions into ready DPPs."},
];
const queryById={
  examon:"How might students find courses, tests and updates in one place?",
  teamspace:"How might a team keep conversations, tasks and files together?",
  "dpp-converter":"How might faculty turn raw questions into formatted practice sheets?",
  qampus:"How might students discover what matters around their campus?",
};
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));

export default function QueryProductStack({products}){
  const ref=useRef(null);
  const [progress,setProgress]=useState(0);
  const [phase,setPhase]=useState("idle");
  const [activeProject,setActiveProject]=useState(0);
  const [dragX,setDragX]=useState(0);
  const [deckPaused,setDeckPaused]=useState(false);
  const storyStarted=useRef(false);
  const dragStart=useRef(null);
  const didDrag=useRef(false);
  const autoPauseUntil=useRef(0);
  const featured=useMemo(()=>featuredIds.map(id=>products.find(p=>p.id===id)).filter(Boolean),[products]);

  useEffect(()=>{
    const update=()=>{
      if(!ref.current)return;
      const rect=ref.current.getBoundingClientRect();
      const travel=Math.max(1,ref.current.offsetHeight-window.innerHeight);
      const next=clamp(-rect.top/travel);
      setProgress(next);
    };
    update();
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
  },[]);

  useEffect(()=>{
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
  const pauseAutoDeck=()=>{autoPauseUntil.current=Date.now()+4500;};

  useEffect(()=>{
    if(phase!=="moving"||featured.length<2)return;
    const timer=window.setInterval(()=>{
      if(deckPaused||Date.now()<autoPauseUntil.current||dragStart.current!==null)return;
      setActiveProject(index=>(index+1)%featured.length);
    },4000);
    return()=>window.clearInterval(timer);
  },[phase,featured.length,deckPaused]);

  const finishDrag=()=>{
    if(dragStart.current===null)return;
    if(Math.abs(dragX)>8)pauseAutoDeck();
    if(dragX<-55)setActiveProject(index=>(index+1)%featured.length);
    if(dragX>55)setActiveProject(index=>(index-1+featured.length)%featured.length);
    dragStart.current=null;
    setDragX(0);
  };

  return <section id="work" ref={ref} className={styles.section}>
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
        {featured.map((product,index)=><div key={product.id} style={{"--burst-index":index}}><span>0{index+1}</span><strong>{product.title}</strong><small>REAL PRODUCT</small></div>)}
      </div>

      <div className={`${styles.projectWall} ${fullProducts?styles.showProjectWall:""} ${phase==="moving"?styles.moveProjectWall:""}`}>
        <header><span>THE MESS BECOMES A PRODUCT / 02</span><h2>Problems become<em> working products.</em></h2></header>
        <div className={styles.projectGrid} onMouseEnter={()=>setDeckPaused(true)} onMouseLeave={()=>setDeckPaused(false)} onPointerDown={event=>{dragStart.current=event.clientX;didDrag.current=false;event.currentTarget.setPointerCapture(event.pointerId);}} onPointerMove={event=>{if(dragStart.current!==null){const distance=event.clientX-dragStart.current;if(Math.abs(distance)>8)didDrag.current=true;setDragX(distance);}}} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
          {featured.map((product,index)=>{
          const cover=product.gallery?.[0];
          let offset=index-activeProject;
          const half=featured.length/2;
          if(offset>half)offset-=featured.length;
          if(offset<-half)offset+=featured.length;
          const depth=Math.abs(offset);
          const isActive=index===activeProject;
          return <article key={product.id} onClick={()=>{if(!didDrag.current&&!isActive){pauseAutoDeck();setActiveProject(index);}didDrag.current=false;}} className={`${styles.wallCard} ${isActive?styles.wallCardActive:""}`} style={{"--wall-index":index,"--card-z":featured.length-depth,"--card-opacity":depth>2?0:1,"--card-transform":`translateX(calc(-50% + ${offset*25}vw + ${dragX}px)) translateZ(${-depth*210}px) rotateY(${offset===0?0:offset>0?-12:12}deg) scale(${1-depth*.08})`}} aria-hidden={!isActive}>
            <div className={styles.wallImage}>
              <div className={styles.browserBar}><i/><i/><i/><span>{product.live?new URL(product.live).hostname:"khushi.build / product"}</span></div>
              <div className={styles.screen}>{cover?<Image src={cover} alt={`${product.title} product interface`} fill sizes="(max-width: 820px) 78vw, 620px"/>:<div>{product.visualCode}</div>}</div>
            </div>
            <div className={styles.wallCopy}>
              <div className={styles.productMeta}><span>0{index+1} / {product.category}</span><i>{product.role}</i></div>
              <h3>{product.title}</h3><p>{queryById[product.id]}</p>
              <div className={styles.cardActions}>
                <Link href={`/projects/${product.id}`} tabIndex={isActive?0:-1}>READ CASE STUDY <span>↗</span></Link>
                {product.live&&<a href={product.live} target="_blank" rel="noreferrer" tabIndex={isActive?0:-1}>LIVE PRODUCT <span>↗</span></a>}
              </div>
            </div>
          </article>;
        })}
        </div>
        <div className={styles.projectControls}><button type="button" aria-label="Previous project" onClick={()=>{pauseAutoDeck();setActiveProject(index=>(index-1+featured.length)%featured.length);}}>←</button><div>{featured.map((product,index)=><button type="button" key={product.id} aria-label={`Show ${product.title}`} className={index===activeProject?styles.activeDot:""} onClick={()=>{pauseAutoDeck();setActiveProject(index);}}/>)}</div><span className={`${styles.autoProgress} ${deckPaused?styles.autoProgressPaused:""}`} key={activeProject}/><button type="button" aria-label="Next project" onClick={()=>{pauseAutoDeck();setActiveProject(index=>(index+1)%featured.length);}}>→</button></div>
      </div>

      <p className={styles.scrollHint}>{fullProducts?"SELECT A PRODUCT TO READ THE FULL STORY ↗":"KEEP SCROLLING — WATCH THE TRANSFORMATION ↓"}</p>
    </div>
  </section>;
}
