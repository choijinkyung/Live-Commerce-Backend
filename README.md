# Live Commerce Backend Mini Project

This project is a **backend-focused mini project** designed to simulate the core architecture of a **global live commerce platform**, inspired by real-world systems like Shoplive.

The focus of this project is **system design and backend architecture**, not video encoding itself.

---

## 🎯 Project Goals

- Design a **real-time live commerce backend**
- Handle **high-frequency, distributed viewer counts**
- Apply **idempotency** to prevent duplicate events
- Build an **event-driven architecture**
- Implement an **asynchronous short-form video pipeline**

---

## ✨ Key Features

### Live Session Domain
- Create and end live sessions
- Clear separation between Live and Short Video domains

### Real-time Viewer Count
- Redis-based viewer counter
- Atomic `INCR / DECR`
- Idempotent join / leave handling
- Server-Sent Events (SSE) for real-time updates

### Event-driven Architecture
- Internal event bus
- Live session end triggers downstream processes
- Loose coupling between domains

### Asynchronous Short-form Video Pipeline
- Short video domain with state machine  
  (`PENDING → PROCESSING → READY / FAILED`)
- BullMQ queue for background processing
- API responds immediately while heavy work is deferred

---

## 🧱 Architecture Overview
Live Session End
↓
Event (live.ended)
↓
Short Video Created (PENDING)
↓
BullMQ Queue (Job Added)
↓
Worker (to be implemented)

---

## 🧠 Design Decisions

### Why Redis for Viewer Count?
- Viewer count changes frequently and must update instantly
- Slight inconsistency is acceptable
- Redis provides atomic operations and high performance in distributed environments

### Why Idempotency?
- Network retries and duplicate requests are inevitable
- Idempotency ensures viewer counts remain accurate

### Why Event-driven Architecture?
- Avoid tight coupling between domains
- Enable scalable and extensible backend workflows

### Why Queue-based Processing?
- Video-related tasks are slow and failure-prone
- Queue allows retry, isolation, and scalability

---

## 🛠 Tech Stack

- Node.js / TypeScript
- Express
- Redis
- BullMQ
- Server-Sent Events (SSE)
- Docker (Redis)

---

## 🚧 Current Status

- [x] Live session domain
- [x] Redis-based viewer count
- [x] Idempotent join / leave handling
- [x] SSE real-time viewer count push
- [x] Event-driven live end handling
- [x] Short video domain
- [x] BullMQ job enqueueing
- [ ] BullMQ worker implementation
- [ ] Retry & failure handling
- [ ] Persistent storage (DB)

---

## 🚀 Next Steps

- Implement BullMQ Worker for short video processing
- Simulate processing delays and failures
- Add retry strategies and status transitions
- Persist data using a database

---

## 📎 Notes

This project intentionally focuses on **backend architecture and system design**, rather than actual video encoding or UI implementation.

---

## 📌 Author

Jinkyung Choi  
Backend / Full-stack Engineer