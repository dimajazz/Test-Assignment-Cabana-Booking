# 🏨 Cabana Booking Backend API

A lightweight `Node.js` + `TypeScript` backend providing REST endpoints for cabana reservation, map retrieval, and validation logic.  
The backend is fully tested with Jest and follows a clean modular architecture.

---

## 📦 Installation

From the project root (recommended):

```sh
npm install
```

Or directly inside the backend workspace:
```sh
npm install
```

---

## 🚀 Running the Server

```sh
npm start
```

The server starts at:
```
http://localhost:8085
```

---

## 🧪 Testing

Run all tests:
```sh
npm test
```

Run in watch mode:
```sh
npm run test:watch
```

Run coverage:
```sh
npm run test:coverage
```

---

## 📜 Commands

| **Command**           | **Description**                         |
| --------------------- | --------------------------------------- |
| npm start             | Starts the backend server using ts-node |
| npm test              | Runs Jest test suite                    |
| npm run test:watch    | Runs Jest in watch mode                 |
| npm run test:coverage | Generates Jest coverage report          |

---

## 🧰 Tech Stack

- Node.js
- TypeScript
- Jest
- Supertest
- ts-node
- Modular service architecture

---

## 📡 API Endpoints

`GET /api/map`
Returns the resort grid and cabana list.

`POST /api/reserve`
Creates a reservation with validation and conflict detection.

---

## 🏗️ Architecture Notes

- Stateless HTTP server
- In‑memory store for cabanas
- Clear separation of concerns (store, utils, exceptions, server)
- Fully covered by Jest tests

---

## 📄 License

This project is licensed under the **Creative Commons Attribution–NonCommercial–NoDerivatives 4.0 International License (CC BY‑NC‑ND 4.0)**.

You may share the unmodified project for **non‑commercial** purposes with proper attribution.  
Commercial use, modification, and redistribution of modified versions are **not permitted**.

```
https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
```
