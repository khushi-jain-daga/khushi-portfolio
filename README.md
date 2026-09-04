# Khushi Jain Daga — Product & Full-Stack Portfolio

🌐 **Live Portfolio:** https://khushi-jain-daga-portfolio.vercel.app/

I build products around real problems — from production education platforms and internal team tools to workflow automation and AI-assisted applications.

This repository contains my personal portfolio. The portfolio is designed as a visual introduction to my work, while the links below give a faster technical view of the projects I discuss in interviews and Loom walkthroughs.

## Quick Links

- **Live Portfolio:** https://khushi-jain-daga-portfolio.vercel.app/
- **GitHub:** https://github.com/khushi-jain-daga
- **Examon Education:** https://www.examoneducation.com/
- **TeamSpace:** https://teamspace-v7.vercel.app/
- **Image Upscaler:** https://examon-image-upscaler.vercel.app/

## Featured Projects

| Project | What it solves | Stack / Engineering | Demo | Source |
|---|---|---|---|---|
| **Examon Education** | A production learning platform for engineering and government-exam students, with student experiences, admin workflows, tests, DPPs, rank predictors, resources and analytics. | Next.js, React, TypeScript, Firebase, Firestore, Storage, analytics and server-side application logic. | [Live Product](https://www.examoneducation.com/) | Private production repository |
| **TeamSpace** | Brings internal communication, files, tasks, content workflows and team operations into one workspace. | Next.js, TypeScript, Firebase Auth, Firestore, Firebase Admin, Google Workspace / Drive integrations, PWA. | [Live App](https://teamspace-v7.vercel.app/) | Private internal repository |
| **Qampus** | A mobile campus-intelligence application with classroom information, campus discovery and a grounded AI assistant. | React Native, Expo, TypeScript, FastAPI, local knowledge and server-side Gemini integration. | Mobile / Expo demo | [Repository](https://github.com/khushi-jain-daga/qampus-app) |
| **Batch Management System** | Reduces repeated manual work while managing batches, faculty, subjects, schedules and related education operations. | Internal full-stack operations workflow connected to the Examon ecosystem. | Internal product demo | Private / internal |
| **Examon DPP Converter** | Converts raw education content into structured, branded English/Hindi/bilingual DPP output. | Electron, Node.js, Express, document parsing and PDF generation. | Local desktop / web workflow | [Repository](https://github.com/khushi-jain-daga/Examon-DPP-Converter) |
| **Image Upscaler** | Speeds up image enhancement work for everyday creative assets. | Web-based image processing and product UI. | [Live Tool](https://examon-image-upscaler.vercel.app/) | [Repository](https://github.com/khushi-jain-daga/examon-image-upscaler) |

## What I Focus On

- Building complete products, not only isolated UI screens
- Turning repeated manual workflows into software tools
- Keeping frontend, API/server logic and reusable code separated as projects grow
- Authentication, role-based access, file handling and real-time data
- Using analytics and real user behaviour to improve production products
- Keeping secrets and privileged AI calls on the server side
- Using deterministic logic and local knowledge where an LLM is not required
- Small, meaningful commits for features, fixes and architecture changes

## Project Architecture — Short View

### Examon Education

```text
Students / Visitors
        |
        v
Next.js + React UI
        |
        +--> Courses / Batches / Tests / DPPs / Resources
        +--> Authentication / Student Flows
        +--> Rank Predictors / Product Utilities
        +--> Admin & Operations
        |
        v
API / Server Logic
        |
        v
Firebase / Firestore / Storage / Analytics
```

### TeamSpace

```text
Employees
    |
    v
Authentication
    |
    v
Role & Access Layer
    |
    v
Next.js Application
    |
    +--> Personal / Group Chat
    +--> Files
    +--> Tasks / Content Workflows
    +--> Calendar / Notifications
    |
    v
Firestore / Firebase Admin / Google Workspace & Drive
```

### Qampus AI

```text
Expo / React Native App
          |
          | student query
          v
      FastAPI Backend
       /          \
      /            \
Local Knowledge   Gemini
& Rules            (server-side key)
      \            /
       \          /
         Response
```

The mobile client does not need the Gemini provider key. Known campus questions can also use grounded local data instead of depending completely on an LLM.

### DPP Converter

```text
DOCX / PDF / TXT / HTML / Pasted Content
                    |
                    v
             Question Parser
                    |
                    v
          Structured DPP Data
                    |
                    v
           Branded A4 Layout
                    |
                    v
            HTML / PDF Output
```

## Portfolio Tech

This portfolio is built with:

- Next.js 15
- React 19
- TypeScript
- GSAP

## Run the Portfolio Locally

```bash
git clone https://github.com/khushi-jain-daga/khushi-portfolio.git
cd khushi-portfolio
npm install
npm run dev
```

For a production check:

```bash
npm run verify
npm run build
```

## Notes for Reviewers

Some of my strongest projects are production or internal tools, so their source repositories are intentionally private. I can walk through the architecture, code structure, engineering decisions, commits and real product behaviour during an interview or Loom walkthrough.

For Examon Education, I can also demonstrate the admin side and real Google Analytics / user-interaction data to show how the product is used after deployment.

---

**Khushi Jain Daga**  
Full-Stack Developer · Product Builder · Exploring Reliable AI Systems
