// frontend/src/pages/Evenements.jsx
import React, { useState, useEffect } from "react";
import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import FormulaireMain from "../components/FormulaireMain.jsx";
import FormulaireStock from "../components/FormulaireStock.jsx";
import EntreeInventaires from "../components/EntreeInventaires.jsx";
import EntreeInventairesForm from "../components/EntreeInventairesForm.jsx";
import StockViewer from "../components/StockViewer.jsx";
import StockViewerDrawer from "../components/StockViewerDrawer.jsx";
import Modal from "../components/Modal.jsx";

export default function Evenements() {
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState({}); // State pour stocker les images Base64
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const from = new Date().toISOString();
    fetch(`/api/events?from=${encodeURIComponent(from)}`, {
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(eventsData => {
        setEvents(eventsData);
        // Pour chaque événement, récupérer l'image si itemCode est dans description
        eventsData.forEach(ev => {
          if (ev.description) {
            fetch(
              `https://customerapi.nieuwkoop-europe.com/items/${ev.description}/image`,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Basic ${window.btoa(
                    "Seeds127040:4F8C608F51"
                  )}`,
                },
              }
            )
              .then(resImg => {
                if (!resImg.ok) throw new Error(`Image HTTP ${resImg.status}`);
                return resImg.json();
              })
              .then(img => {
                setImages(prev => ({ ...prev, [ev.id]: `data:image/png;base64,${img.Image}` }));
              })
              .catch(err => console.error(`Erreur fetch image ${ev.description}:`, err));
          }
        });
      })
      .catch(err => console.error("Erreur fetch events:", err));
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-[#f5f0e8] text-gray-800 font-sans dark:bg-[#121212] dark:text-gray-200 transition-colors duration-300">
        {/* Toggle mobile menu */}
        <button
          className="md:hidden absolute top-4 left-4 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
        {/* Toggle dark mode */}
        <button
          className="absolute top-4 right-4 z-50"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6" />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed z-40 top-0 left-0 h-full w-64 bg-[#e9e3d5] dark:bg-[#1e1e1e] p-6 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:block`}
        >
          <h1 className="text-2xl font-bold tracking-wide">POUSSE</h1>
          <nav className="mt-8 space-y-4">
            <a href="#plannings" className="flex items-center gap-2 hover:text-green-700 dark:hover:text-green-300">
              <CalendarDaysIcon className="w-5 h-5" /> Plannings
            </a>
            <a href="#formulaires" className="flex items-center gap-2 hover:text-green-700 dark:hover:text-green-300">
              <ClipboardDocumentListIcon className="w-5 h-5" /> Formulaires
            </a>
            <a href="#inventaire" className="flex items-center gap-2 hover:text-green-700 dark:hover:text-green-300">
              <ArchiveBoxIcon className="w-5 h-5" /> Entrée Inventaire
            </a>
            <a href="#stocks" className="flex items-center gap-2 hover:text-green-700 dark:hover:text-green-300">
              <Squares2X2Icon className="w-5 h-5" /> Stocks
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 sm:p-8 space-y-16 mt-12 md:mt-0">
          {/* Plannings Section */}
          <motion.section id="plannings" className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
                <CalendarDaysIcon className="w-6 h-6" /> Plannings
              </h2>
              <button onClick={() => setDrawerOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                📋 Détails
              </button>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <iframe
                  title="Google Agenda POUSSE"
                  src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(import.meta.env.VITE_GOOGLE_CALENDAR_ID)}&ctz=Europe%2FParis`}
                  style={{ border: 0 }}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  className="rounded"
                />
              </div>
              <div className="bg-[#f8f9fa] dark:bg-gray-900 rounded-lg p-4 shadow space-y-2">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">📌 Événements à venir</h3>
                <ul className="text-sm space-y-3">
                  {events.map(ev => (
                    <li key={ev.id} className="border-b pb-2 dark:border-gray-700 flex items-center gap-2">
                      {images[ev.id] && <img src={images[ev.id]} alt={ev.summary} className="w-12 h-12 rounded-md" />}
                      <div>
                        <strong>{ev.summary}</strong> —{' '}
                        {new Date(ev.start.dateTime || ev.start.date).toLocaleString('fr-FR', {
                          weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Formulaires Section */}
          <motion.section id="formulaires" className="space-y-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-6 h-6" /> Formulaires
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <FormulaireMain />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <FormulaireStock />
              </div>
            </div>
          </motion.section>

          {/* Entrée Inventaire Section */}
          <motion.section id="inventaire" className="space-y-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
              <ArchiveBoxIcon className="w-6 h-6" /> Entrée Inventaire
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <EntreeInventairesForm />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <EntreeInventaires />
            </div>
          </motion.section>

          {/* Stocks Section */}
          <motion.section id="stocks" className="space-y-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
              <Squares2X2Icon className="w-6 h-6" /> Stocks
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <StockViewer />
            </div>
          </motion.section>

        </main>

        {/* Drawer & Modal */}
        {drawerOpen && <StockViewerDrawer onClose={() => setDrawerOpen(false)} />}
        <Modal />
      </div>
    </div>
  );
}

