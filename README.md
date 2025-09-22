# Map Task Frontend

This is the frontend for the Map Task application. It is built with **React**, **TypeScript**, and **MobX** for state management. The frontend interacts with the backend API to manage polygons and map objects and display them on a map.

## ✨ Features

- 🗺️ Display interactive map with polygons and objects
- ✏️ Add, edit, and delete polygons and map objects
- 📋 Panels to manage map data
- ⏳ Loading states and error handling
- ⌨️ Keyboard shortcuts for drawing tools

---

## 🛠️ Tech Stack

- **Framework:** React 18+
- **Language:** TypeScript
- **State Management:** MobX
- **Styling:** Tailwind CSS
- **Package Manager:** npm/yarn

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/frontend.git
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Access the application:** Open your browser and navigate to `http://localhost:3000`

> **Note:** Make sure the backend API is running and accessible (default: `https://localhost:7115`)

---

## ⚙️ Configuration

- **API Endpoint:** Configure the backend API URL in your environment variables or configuration files
- **Default Port:** `3000`
- **Backend URL:** `https://localhost:7115` (ensure backend is running)

---

## 📁 Project Structure

```
src/
├── components/          # UI and map components
│   ├── Map/            # Map-related components
│   ├── UI/             # Reusable UI components
├── contexts/           # MobX stores and providers
│   ├── MapStore.ts     # Map state management
│   └── PolygonStore
│   └── ObjectStore
├── services/           # API calls and types
│   ├── BaseService.ts  # API client
│   ├── PolygonService.ts  # API client
│   ├── ObjectService.ts  # API client
│   └── types.ts        # TypeScript interfaces
├── utils/              # Utility functions
├── strings/            # String constants used across the app
├── App.tsx             # Main app entry point
└── index.tsx           # React DOM render


## 📄 License

This project is licensed under the [MIT License](LICENSE).
