"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

export default function QueryProductStack({products}){
  const router=useRouter();
  const ref=useRef(null);
  const [progress,setProgress]=useState(0);
  const [phase,setPhase]=useState("idle");
  const [activeProject,setActiveProject]=useState(0);
  const storyStarted=useRef(false);
  const [deckPaused,setDeckPaused]=useState(false);
  const hoverLock=useRef(null);
  const hoverUnlockTimer=useRef(null);
  const resumeTimer=useRef(null);
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
      const next=clamp(-rect.top/travel);
      setProgress(next);
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
  const pauseDeck=()=>{
    if(resumeTimer.current)window.clearTimeout(resumeTimer.current);
    setDeckPaused(true);
  };
  const resumeDeck=()=>{
    hoverLock.current=null;
    if(resumeTimer.current)window.clearTimeout(resumeTimer.current);
    resumeTimer.current=window.setTimeout(()=>setDeckPaused(false),1200);
  };
  const focusCard=(index,id)=>{
    pauseDeck();
    if(hoverLock.current===null){
      hoverLock.current=id;
      setActiveProject(index);
      hoverUnlockTimer.current=window.setTimeout(()=>{
        hoverLock.current=null;
      },850);
    }
  };

  useEffect(()=>()=>{
    if(resumeTimer.current)window.clearTimeout(resumeTimer.current);
    if(hoverUnlockTimer.current)window.clearTimeout(hoverUnlockTimer.current);
  },[]);

  useEffect(()=>{
    if(!fullProducts||featured.length<2||deckPaused)return;
    const timer=window.setTimeout(()=>{
      setActiveProject(index=>(index+1)%featured.length);
    },4200);
    return()=>window.clearTimeout(timer);
  },[fullProducts,featured.length,activeProject,deckPaused]);

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
        {featured.map((product,index)=><div key={product.id} style={{"--burst-index":index}}><span>{String(index+1).padStart(2,"0")}</span><strong>{product.title}</strong><small>REAL PRODUCT</small></div>)}
      </div>

      <div className={`${styles.projectWall} ${fullProducts?styles.showProjectWall:""} ${phase==="moving"?styles.moveProjectWall:""}`}>
        <header><span>THE MESS BECOMES A PRODUCT / 02</span><h2>Problems become<em> working products.</em></h2></header>
        <div className={styles.projectGrid} onPointerEnter={pauseDeck} onPointerLeave={resumeDeck}>
          {featured.map((product,index)=>{
          const gallery=product.id==="qampus"?[product.gallery?.[3],product.gallery?.[1],product.gallery?.[2]].filter(Boolean):(product.gallery||[]).slice(0,3);
          const forward=(index-activeProject+featured.length)%featured.length;
          const offset=forward>featured.length/2?forward-featured.length:forward;
          const depth=Math.abs(offset);
          const isActive=index===activeProject;
          return <article
            key={product.id}
            className={`${styles.wallCard} ${isActive?styles.wallCardActive:""}`}
            tabIndex={depth<=2?0:-1}
            aria-label={`${product.title}${isActive?", open case study":", bring to centre"}`}
            onPointerEnter={()=>focusCard(index,product.id)}
            onClick={()=>{
              pauseDeck();
              if(isActive||hoverLock.current===product.id)router.push(`/projects/${product.id}`);
              else setActiveProject(index);
            }}
            onKeyDown={event=>{
              if(event.key!=="Enter"&&event.key!==" ")return;
              event.preventDefault();
              pauseDeck();
              if(isActive)router.push(`/projects/${product.id}`);
              else setActiveProject(index);
            }}
            style={{"--wall-index":index,"--card-z":featured.length-depth,"--card-opacity":depth>2?0:1,"--card-pointer":depth>2?"none":"auto","--card-transform":`translate3d(calc(-50% + ${offset*24}vw), 0, ${-depth*190}px) rotateY(${offset===0?0:offset>0?-10:10}deg) scale(${1-depth*.075})`}}
          >
            <div className={styles.wallImage}>
              <div className={`${styles.productCover} ${styles[`cover_${product.id.replaceAll("-","_")}`]}`}>
                <span className={styles.coverLabel}>{product.category}</span>
                {gallery.length?<div className={styles.deviceComposition}>
                  {gallery.map((image,index)=><figure key={image} className={styles[`device${index+1}`]}><div className={styles.browserBar}><i/><i/><i/></div><div className={styles.screen}><Image src={image} alt={`${product.title} interface view ${index+1}`} fill sizes="(max-width: 820px) 72vw, 520px"/></div></figure>)}
                </div>:<div className={styles.generatedCover}>{product.visualCode}</div>}
                <strong>{product.title}</strong>
              </div>
            </div>
            <div className={styles.wallCopy}>
              <div className={styles.productMeta}><span>{String(index+1).padStart(2,"0")} / {product.category}</span><i>{product.role}</i></div>
              <h3>{product.title}</h3><p>{queryById[product.id]}</p>
              <div className={styles.cardActions}>
                <Link href={`/projects/${product.id}`} onClick={event=>event.stopPropagation()}>READ CASE STUDY <span>↗</span></Link>
                {product.live&&<a href={product.live} target="_blank" rel="noreferrer" onClick={event=>event.stopPropagation()}>LIVE PRODUCT <span>↗</span></a>}
                {!product.live&&product.github&&<a href={product.github} target="_blank" rel="noreferrer" onClick={event=>event.stopPropagation()}>VIEW SOURCE <span>↗</span></a>}
              </div>
            </div>
          </article>;
        })}
        </div>
        <div className={styles.projectControls} onPointerEnter={pauseDeck} onPointerLeave={resumeDeck}><button type="button" aria-label="Previous project" onClick={()=>{pauseDeck();hoverLock.current="controls";setActiveProject(index=>(index-1+featured.length)%featured.length);}}>←</button><div>{featured.map((product,index)=><button type="button" key={product.id} aria-label={`Show ${product.title}`} className={index===activeProject?styles.activeDot:""} onClick={()=>{pauseDeck();hoverLock.current="controls";setActiveProject(index);}}/>)}</div><button type="button" aria-label="Next project" onClick={()=>{pauseDeck();hoverLock.current="controls";setActiveProject(index=>(index+1)%featured.length);}}>→</button></div>
      </div>

      <p className={styles.scrollHint}>{fullProducts?"USE READ CASE STUDY, LIVE PRODUCT OR SOURCE TO OPEN A PROJECT ↗":"KEEP SCROLLING — WATCH THE TRANSFORMATION ↓"}</p>
    </div>
  </section>;
}
