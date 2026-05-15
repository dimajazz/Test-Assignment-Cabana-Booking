# 🏝️ Resort Map — Cabana Booking (Monorepo)

A full‑stack monorepo containing both the **backend API** and **frontend UI** for a fictional resort cabana‑booking system.  
The project demonstrates clean architecture, modular design, TypeScript everywhere, and complete test coverage across both workspaces.

This repository contains two workspaces:

- **backend/** — Node.js + TypeScript + Jest API server  
- **frontend/** — Vite + TypeScript + Vitest client application  

---

## 📦 Installation

Install all dependencies for the entire monorepo:

```sh
npm install
```

Or use the bootstrap script:

```sh
npm run bootstrap
```

This will:
1. Install all workspace dependencies
2. Start backend and frontend in parallel

---

## 🚀 Running the Project

Start backend + frontend together:
```sh
npm start
```

Start only backend:
```sh
npm run start:backend
```

Start only frontend:
```sh
npm run start:frontend
```

---

## 🧪 Testing

Run all tests (backend + frontend):
```sh
npm test
```

Run full coverage:
```sh
npm run test:coverage
```

---

## 📜 Commands

| **Command**            | **Description**                                   |
| ---------------------- | ------------------------------------------------- |
| npm start              | Starts backend + frontend concurrently            |
| npm run start:backend  | Starts backend server only                        |
| npm run start:frontend | Starts frontend dev server only                   |
| npm test               | Runs backend + frontend test suites               |
| npm run test:coverage  | Runs coverage for both workspaces                 |
| npm run bootstrap      | Installs all dependencies and starts both servers |

---

## 🧰 Tech Stack

**Backend**
- Node.js
- TypeScript
- Jest
- Supertest
- ts-node

**Frontend**
- Vite
- TypeScript
- Vitest
- Testing Library
- JSDOM
- CSS Modules

**Monorepo**
- npm Workspaces
- Shared tooling
- Unified scripts

---

## 🏗️ Development Workflow

1. Clone the repository
2. Run npm install
3. Start both servers with npm start
4. Develop backend and frontend independently or together
5. Run tests with npm test
6. Generate coverage with npm run test:coverage

The monorepo structure ensures both apps stay in sync while remaining fully isolated.

---

## 📄 License

This project is licensed under the **Creative Commons Attribution–NonCommercial–NoDerivatives 4.0 International License (CC BY‑NC‑ND 4.0)**.

You may share the unmodified project for **non‑commercial** purposes with proper attribution.  
Commercial use, modification, and redistribution of modified versions are **not permitted**.

```
https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
```
