"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { frames } from "../../../data/portfolio";
import useScrollProgress from "../../../hooks/useScrollProgress";

import {
  clamp,
  smoothstep,
} from "../../../lib/motion";

import styles from "./RoleEvolutionScene.module.css";


const DESIGNER = "DESIGNER";
const FRONTEND = "FRONTEND DEVELOPER";
const FULLSTACK = "FULL STACK DEVELOPER";


const MOUTH_END = 0.335;
const ROLE_TRIGGER = 0.35;
const RESET_POINT = 0.27;


const TYPE_SPEED = 62;
const DELETE_SPEED = 45;

const HOLD_DESIGNER = 650;
const HOLD_FRONTEND = 650;
const HOLD_FINAL = 350;


const sleep = (ms) =>
  new Promise((resolve) =>
    window.setTimeout(resolve, ms)
  );


export default function RoleEvolutionScene() {

  const sectionRef = useRef(null);

  const progress =
    useScrollProgress(sectionRef);


  const [roleText, setRoleText] =
    useState("");

  const [roleStarted, setRoleStarted] =
    useState(false);

  const [roleComplete, setRoleComplete] =
    useState(false);


  const runningRef =
    useRef(false);

  const completedRef =
    useRef(false);

  const runIdRef =
    useRef(0);



  /* =========================================================
     PRELOAD FRAMES
  ========================================================= */

  useEffect(() => {

    frames.forEach((src) => {

      const image = new Image();

      image.src = src;

    });

  }, []);



  /* =========================================================
     BLOCK USER INPUT WHILE AUTOMATIC ROLE SEQUENCE RUNS

     IMPORTANT:
     We prevent wheel/touch.
     We DO NOT change body overflow.
  ========================================================= */

  function blockScrollInput() {

    const preventWheel = (event) => {
      event.preventDefault();
    };


    const preventKeys = (event) => {

      const blocked = [
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        "Home",
        "End",
        " ",
      ];


      if (blocked.includes(event.key)) {
        event.preventDefault();
      }

    };


    window.addEventListener(
      "wheel",
      preventWheel,
      { passive: false }
    );


    window.addEventListener(
      "touchmove",
      preventWheel,
      { passive: false }
    );


    window.addEventListener(
      "keydown",
      preventKeys,
      { passive: false }
    );


    return () => {

      window.removeEventListener(
        "wheel",
        preventWheel
      );

      window.removeEventListener(
        "touchmove",
        preventWheel
      );

      window.removeEventListener(
        "keydown",
        preventKeys
      );

    };

  }



  /* =========================================================
     TYPE
  ========================================================= */

  async function typeRole(
    word,
    runId
  ) {

    for (
      let i = 1;
      i <= word.length;
      i += 1
    ) {

      if (
        runIdRef.current !== runId
      ) {
        return false;
      }


      setRoleText(
        word.slice(0, i)
      );


      await sleep(TYPE_SPEED);

    }


    return true;

  }



  /* =========================================================
     BACKSPACE
  ========================================================= */

  async function deleteRole(
    word,
    runId
  ) {

    for (
      let i = word.length - 1;
      i >= 0;
      i -= 1
    ) {

      if (
        runIdRef.current !== runId
      ) {
        return false;
      }


      setRoleText(
        word.slice(0, i)
      );


      await sleep(
        DELETE_SPEED
      );

    }


    return true;

  }



  /* =========================================================
     AUTOMATIC ROLE SEQUENCE
  ========================================================= */

  useEffect(() => {

    if (
      progress < ROLE_TRIGGER ||
      runningRef.current ||
      completedRef.current
    ) {
      return;
    }


    runningRef.current = true;

    setRoleStarted(true);


    const runId =
      runIdRef.current + 1;

    runIdRef.current =
      runId;


    const releaseInput =
      blockScrollInput();


    async function play() {

      setRoleText("");

      await sleep(180);


      /* DESIGNER */

      if (
        !(await typeRole(
          DESIGNER,
          runId
        ))
      ) {
        releaseInput();
        return;
      }


      await sleep(
        HOLD_DESIGNER
      );


      if (
        !(await deleteRole(
          DESIGNER,
          runId
        ))
      ) {
        releaseInput();
        return;
      }


      await sleep(120);



      /* FRONTEND */

      if (
        !(await typeRole(
          FRONTEND,
          runId
        ))
      ) {
        releaseInput();
        return;
      }


      await sleep(
        HOLD_FRONTEND
      );


      if (
        !(await deleteRole(
          FRONTEND,
          runId
        ))
      ) {
        releaseInput();
        return;
      }


      await sleep(120);



      /* FULL STACK */

      if (
        !(await typeRole(
          FULLSTACK,
          runId
        ))
      ) {
        releaseInput();
        return;
      }


      await sleep(
        HOLD_FINAL
      );


      setRoleText(
        FULLSTACK
      );


      completedRef.current =
        true;

      runningRef.current =
        false;


      setRoleComplete(true);


      /*
        NOW USER CAN SCROLL.

        But the page remains pinned.

        Their scroll becomes CAMERA MOVEMENT.
      */

      releaseInput();

    }


    play();


    return () => {
      releaseInput();
    };

  }, [progress]);



  /* =========================================================
     RESET IF USER RETURNS ABOVE MOUTH WORLD
  ========================================================= */

  useEffect(() => {

    if (
      progress > RESET_POINT ||
      runningRef.current ||
      !completedRef.current
    ) {
      return;
    }


    runIdRef.current += 1;

    runningRef.current =
      false;

    completedRef.current =
      false;


    setRoleText("");

    setRoleStarted(false);

    setRoleComplete(false);

  }, [progress]);



  /* =========================================================
     FRAME 01 → 13
  ========================================================= */

  const frameProgress =
    clamp(
      progress / 0.255
    );


  const currentFrame =
    Math.min(
      frames.length - 1,

      Math.floor(
        frameProgress *
        frames.length
      )
    );



  /* =========================================================
     ENTER MOUTH
  ========================================================= */

  const mouthEnter =
    smoothstep(
      0.22,
      MOUTH_END,
      progress
    );


  const roleWorldOpacity =
    roleStarted
      ? 1
      : smoothstep(
          0.30,
          ROLE_TRIGGER,
          progress
        );



  /* =========================================================
     AFTER ROLE

     THIS IS THE CAMERA PUSH.

     Scroll does not visually move the page downward.

     The sticky viewport remains fixed while these values
     change from the user's scroll.
  ========================================================= */

  const afterRole =
    roleComplete
      ? clamp(
          (
            progress -
            ROLE_TRIGGER
          ) /
          (
            1 -
            ROLE_TRIGGER
          )
        )
      : 0;



  /*
    Short dead-zone.

    Full Stack is allowed to sit perfectly still
    for a moment after automatic typing completes.
  */

  const cameraPush =
    roleComplete
      ? smoothstep(
          0.035,
          0.68,
          afterRole
        )
      : 0;



  /*
    Faster acceleration near the end.

    Gives a real "camera passes through" feeling.
  */

  const deepPush =
    roleComplete
      ? smoothstep(
          0.36,
          0.88,
          afterRole
        )
      : 0;



  /*
    Prompt disappears immediately when
    user starts scrolling.
  */

  const promptOpacity =
    roleComplete
      ? 1 -
        smoothstep(
          0.01,
          0.10,
          afterRole
        )
      : 0;



  /*
    FULL STACK text starts as normal typography
    and grows beyond the viewport.

    The visitor feels like the camera
    is travelling INTO the words.
  */

  const textScale =
    1 +
    cameraPush * 1.6 +
    deepPush * 7.5;


  const textZ =
    cameraPush * 220 +
    deepPush * 760;


  const textBlur =
    deepPush * 7;


  const textOpacity =
    1 -
    smoothstep(
      0.68,
      0.94,
      afterRole
    );



  /*
    Background depth.

    Soft rings expand outward as camera pushes in.
  */

  const depthScale =
    1 +
    cameraPush * 1.4 +
    deepPush * 3.5;



  /*
    The next world should NOT rise from bottom anymore.

    It materialises from INSIDE the zoom.
  */

  const nextWorldReveal =
    roleComplete
      ? smoothstep(
          0.66,
          0.96,
          afterRole
        )
      : 0;



  const nextWorldScale =
    1.16 -
    nextWorldReveal * 0.16;



  return (

    <section
      ref={sectionRef}
      className={
        styles.section
      }
      aria-label="Role evolution"
    >

      <div
        className={
          styles.sticky
        }
      >


        {/* =================================================
            CHARACTER FRAMES
        ================================================= */}

        <img
          src={
            frames[currentFrame] ||
            frames[0]
          }

          alt="Animated character"

          className={
            styles.character
          }

          draggable={false}

          style={{
            transform: `
              scale(
                ${1 +
                  mouthEnter *
                  0.42}
              )

              translate3d(
                0,
                ${-mouthEnter * 3}vh,
                0
              )
            `,

            transformOrigin:
              "50% 61%",
          }}
        />



        {/* =================================================
            MOUTH PORTAL
        ================================================= */}

        <div
          className={
            styles.mouthPortal
          }

          style={{
            transform: `
              translate(-50%, -50%)

              scale(
                ${1 +
                  mouthEnter *
                  55}
              )
            `,

            opacity:
              progress > 0.20
                ? 1
                : 0,
          }}
        />



        {/* =================================================
            ROLE WORLD
        ================================================= */}

        <div
          className={
            styles.roleWorld
          }

          style={{
            opacity:
              roleWorldOpacity,
          }}
        >


          {/* depth rings */}

          <div
            className={
              styles.roleDepth
            }

            style={{
              transform: `
                translate(-50%, -50%)
                scale(${depthScale})
              `,

              opacity:
                0.28 +
                cameraPush * 0.20,
            }}
          />



          {/* ===============================================
              ROLE TEXT

              One persistent editor line.
          =============================================== */}

          <div
            className={
              styles.roleEditor
            }

            style={{
              opacity:
                roleStarted
                  ? textOpacity
                  : 0,

              transform: `
                translate(-50%, -50%)
                translate3d(
                  0,
                  0,
                  ${textZ}px
                )
                scale(${textScale})
              `,

              filter:
                `blur(${textBlur}px)`,
            }}
          >


            <div
              className={
                styles.roleSizer
              }
              aria-hidden="true"
            >
              I AM A FULL STACK DEVELOPER|
            </div>


            <div
              className={
                styles.roleLine
              }
            >

              <span>
                {"I AM A "}
              </span>

              <strong>
                {roleText}
              </strong>

              <i
                className={
                  styles.cursor
                }
              >
                |
              </i>

            </div>

          </div>



          {/* ===============================================
              BOTTOM SCROLL PROMPT
          =============================================== */}

          <div
            className={
              styles.scrollPrompt
            }

            style={{
              opacity:
                promptOpacity,

              transform: `
                translateX(-50%)
                translateY(
                  ${cameraPush * 10}px
                )
              `,
            }}
          >

            <span>
              scroll to see how she thinks
            </span>

            <b>
              ↓
            </b>

          </div>

        </div>



        {/* =================================================
            NEXT WORLD

            No slide-up.

            It appears as though we have passed
            through the Full Stack screen.
        ================================================= */}

        {roleComplete && (

          <div
            className={
              styles.nextSceneCurtain
            }

            style={{
              opacity:
                nextWorldReveal,

              transform: `
                scale(
                  ${nextWorldScale}
                )
              `,
            }}
          />

        )}

      </div>

    </section>

  );
}

