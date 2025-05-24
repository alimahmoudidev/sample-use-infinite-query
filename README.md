# ♾️ React Infinite Scroll Sample (with TanStack Query)

🎯 A simple yet powerful **Infinite Scroll** implementation using **React** and **TanStack Query (`@tanstack/react-query`)**.  
This project demonstrates how to load and paginate product data as the user scrolls, offering a seamless infinite experience.

---

## 🔧 Project Structure

### 🖥️ Frontend
- **React 19 + Vite** for lightning-fast development
- **Tailwind CSS** for styling (optional but recommended)
- **TanStack Query (React Query)** to manage API state and caching
- **Intersection Observer API** for detecting scroll boundaries

### 🛠️ Backend
- **Express.js** REST API
- **SQLite (via better-sqlite3)** as lightweight database engine
- Pagination implemented with `?page=1&limit=12` query params

---

## 📦 Dependencies

### Frontend

| Library                 | Purpose                            |
|------------------------|------------------------------------|
| `@tanstack/react-query`| Data fetching and infinite scroll  |
| `react` + `react-dom`  | UI rendering                       |
| `vite`                 | Fast dev/build setup               |

### Backend

| Library         | Purpose                |
|----------------|------------------------|
| `express`       | API server             |
| `better-sqlite3`| SQLite database engine |
| `cors`, `dotenv`| Misc. utils            |

---

## 🚀 Getting Started

Follow these steps to get the project up and running:

1. **Clone the repository**

   ```bash
   git clone https://github.com/alimahmoudidev/sample-use-infinite-query.git
   cd infinite-scroll-sample
