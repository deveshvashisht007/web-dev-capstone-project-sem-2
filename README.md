# ✈️ TripWise — Smart Travel Planner (React)

> **B.Tech First Year Capstone Project**  
> Built with React 18 + Vite + React Router v6

---

## 🚀 How to Run

```bash
# 1. Open this folder in VS Code terminal
cd tripwise-react

# 2. Install dependencies (only once)
npm install

# 3. Start development server
npm run dev

# 4. Open in Chrome
http://localhost:5173
```

---

## 🏗 Build for Production (GitHub Pages)

```bash
npm run build
```
Upload the `dist/` folder to GitHub and enable Pages.

---

## 📁 Project Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Router setup
├── index.css                 # Global styles
├── context/
│   └── TripContext.jsx       # Global state (React Context)
├── components/
│   ├── Sidebar.jsx
│   ├── TripCard.jsx
│   ├── Modal.jsx
│   └── AddTripModal.jsx
└── pages/
    ├── Dashboard.jsx
    ├── Trips.jsx
    ├── Itinerary.jsx
    ├── Expenses.jsx
    ├── Weather.jsx
    └── About.jsx
```

---

## 🛠 Tech Stack

- **React 18** — Component-based UI
- **Vite** — Fast dev server & bundler
- **React Router v6** — Client-side routing
- **React Context API** — Global state management
- **localStorage** — Data persistence (no backend needed)
- **CSS3** — Custom properties, Grid, Flexbox

---

## 👨‍💻 B.Tech First Year — Key Concepts Used

| Concept | Where Used |
|---|---|
| JSX | All components |
| useState | Forms, filters, modals |
| useEffect | Seeding initial data |
| useContext | Global trip/expense state |
| React Router | Page navigation |
| Props | TripCard, Modal components |
| Array methods (map, filter) | Rendering lists |
| localStorage API | Data persistence |
