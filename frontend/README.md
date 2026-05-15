# 🏝️ Cabana Booking Frontend

A modern `TypeScript` + `Vite` frontend application for browsing the resort map, selecting cabanas, and submitting reservations.  
The UI is fully modular, testable, and covered with Vitest + Testing Library.  
This project is part of the **Resort Map** monorepo.

---

## 📦 Installation

From the project root (recommended):

```sh
npm install
```

Or install only frontend dependencies:
```sh
npm install
```

---

## 🚀 Development

Start the development server:
```sh
npm run dev
```

The app will be available at:
```
http://localhost:5173
```

---

## 🧪 Testing

Run all tests:
```sh
npm test
```

Open the Vitest UI:
```sh
npm run test:ui
```

Generate coverage:
```sh
npm run test:coverage
```

---

## 📜 Commands

| **Command**           | **Description**                |
| --------------------- | ------------------------------ |
| npm run dev           | Starts Vite development server |
| npm run build         | Builds production bundle       |
| npm run preview       | Serves built app locally       |
| npm test              | Runs Vitest test suite         |
| npm run test:ui       | Opens Vitest UI dashboard      |
| npm run test:coverage | Generates coverage report      |
| npm start             | Alias for vite                 |

---

## 🧰 Tech Stack

- Vite — lightning‑fast dev server and bundler
- TypeScript — typed, maintainable code
- Vitest — unit testing
- Testing Library — DOM interaction testing
- JSDOM — browser‑like environment for tests
- CSS Modules — scoped component styling

---

## 🏗️ Architecture Notes

- Modular UI — each feature lives in its own folder
- Controller pattern — booking flow is orchestrated by bookingController
- Store pattern — cabana state is managed by cabanaStore
- Pure functions — parsing, validation, and helpers are isolated and testable
- DOM‑driven UI — no frameworks, just clean TypeScript and DOM APIs
- Full test coverage — all logic is covered by Vitest

---

## 📄 License

This project is licensed under the **Creative Commons Attribution–NonCommercial–NoDerivatives 4.0 International License (CC BY‑NC‑ND 4.0)**.

You may share the unmodified project for **non‑commercial** purposes with proper attribution.  
Commercial use, modification, and redistribution of modified versions are **not permitted**.

```
https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
```
