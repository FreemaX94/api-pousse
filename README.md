# API Pousse

This repository contains both the backend API and the React frontend for the **Pousse** project.
The backend is a Node.js/Express server and the frontend is built with Vite + React.

## Install dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Running tests

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Build and start

### Frontend build
Build the React app:
```bash
cd frontend
npm run build
```
This outputs the compiled files in `frontend/dist`. The script `deploy.sh` can be used to automatically copy this build into `backend/public`.

### Starting the backend
```bash
cd backend
npm start
```
Use `npm run dev` to start in development mode with automatic reload.
The backend serves the content of `backend/public` so after building the frontend you only need to start the backend to serve the complete application.
