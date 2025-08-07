// frontend/src/pages/Evenements.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  TagIcon,               // AJOUT
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import api, { handleApiError } from "../../../api/axios";
import axios from 'axios';
import FormulaireMain from "../../../shared/components/FormulaireMain.jsx";
import FormulaireStock from "../../inventory/components/FormulaireStock.jsx";
import EntreeInventaires from "../../inventory/components/EntreeInventaires.jsx";
import EntreeInventairesForm from "../../inventory/components/EntreeInventairesForm.jsx";
import StockViewer from "../../inventory/components/StockViewer.jsx";
import StockViewerDrawer from "../../inventory/components/StockViewerDrawer.jsx";
import Modal from "../../../shared/components/Modal.jsx";

export default function Evenements() {
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState({}); // State pour stocker les images Base64
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // AJOUT : états pour stock global, tags, et toggle affichage
  const [stock, setStock] = useState([]);
  const [tags, setTags] = useState([]);
  const [showStocksDetails, setShowStocksDetails] = useState(false);

  // Ref pour scroller vers les détails
  const stocksRef = useRef(null);

  // Fetch des événements + images
  useEffect(() => {
    const from = new Date().toISOString();
    api.get(`/events?from=${encodeURIComponent(from)}`, {
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(response => {
        const eventsData = response.data;
        const list = Array.isArray(eventsData)
          ? eventsData
          : Array.isArray(eventsData?.data)
          ? eventsData.data
          : [];
        setEvents(list);
        // Pour chaque événement, récupérer l'image si itemCode est dans description
        list.forEach(ev => {
          if (ev.description) {
            api.get(`/nieuwkoop-proxy/items/${ev.description}/image`, {
              responseType: 'blob'
            })
              .then(response => {
                const blob = response.data;
                const url = URL.createObjectURL(blob);
                setImages(prev => ({ ...prev, [ev.id]: url }));
              })
              .catch(err => console.error(`Erreur image ${ev.description}:`, err));
          }
        });
      })
      .catch(err => {
        console.error("Erreur fetch events:", err);
        const errorInfo = handleApiError(err);
        console.error("Détails erreur:", errorInfo.message);
      });
  }, []);

  // AJOUT : fetch global stock et tags
  useEffect(() => {
    const headers = {
      Accept: "application/json",
      Authorization: `Basic ${window.btoa("Seeds127040:4F8C608F51")}`,
    };

    axios.get("https://customerapi.nieuwkoop-europe.com/stock", { headers })
      .then(response => {
        setStock(response.data);
      })
      .catch(err => console.error("Erreur fetch stock:", err));

    axios.get("https://customerapi.nieuwkoop-europe.com/tags", { headers })
      .then(response => {
        setTags(response.data);
      })
      .catch(err => console.error("Erreur fetch tags:", err));
  }, []);

  // Scroll automatique vers les détails quand on l'affiche
  useEffect(() => {
    if (showStocksDetails && stocksRef.current) {
      stocksRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showStocksDetails]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-[#f5f0e8] text-gray-800 font-sans dark:bg-[#121212] dark:text-gray-200 transition-colors duration-300">
        {/* Toggle mobile menu */}
        <button aria-label="Toggle menu" className="absolute z-50 md:hidden top-4 left-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
        {/* Toggle dark mode */}
        <button aria-label="Toggle dark mode" className="absolute z-50 top-4 right-4"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed z-40 top-0 left-0 h-full w-64 bg-[#e9e3d5] dark:bg-[#1e1e1e] p-6 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:block`}
        >
          <h1 className="text-2xl font-bold tracking-wide">POUSSE</h1>
          <nav className="mt-8 space-y-4">
            <a
              href="#plannings"
              className="flex items-center gap-2 hover:text-green-700 dark:hover:text-green-300"
            >
              <CalendarDaysIcon className="w-5 h-5" /> Plannings
            </a>
            <a
              href="#formulaires"
              className="flex items-center gap-2 hover:text-green-700 dark:hover:text-green-300"
            >
              <ClipboardDocumentListIcon className="w-5 h-5" /> Formulaires
            </a>
            <a
              href="#inventaire"
              className="flex items-center gap-2 hover:text-green-700 dark:hover:text-green-300"
            >
              <ArchiveBoxIcon className="w-5 h-5" /> Entrée Inventaire
            </a>
            <a
              onClick={() => setShowStocksDetails(v => !v)}
              className="flex items-center gap-2 cursor-pointer hover:text-green-700 dark:hover:text-green-300"
            >
              <Squares2X2Icon className="w-5 h-5" /> Stocks
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 mt-12 space-y-16 sm:p-8 md:mt-0">
          {/* Plannings Section */}
          <motion.section
            id="plannings"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-3xl font-bold text-green-800 dark:text-green-400">
                <CalendarDaysIcon className="w-6 h-6" /> Plannings
              </h2>
              <button
                onClick={() => setDrawerOpen(true)}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                📋 Détails
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="p-4 bg-white rounded-lg shadow xl:col-span-2 dark:bg-gray-800">
                <iframe
                  title="Google Agenda POUSSE"
                  src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                    import.meta.env.VITE_GOOGLE_CALENDAR_ID
                  )}&ctz=Europe%2FParis`}
                  style={{ border: 0 }}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  className="rounded"
                />
              </div>
              <div className="bg-[#f8f9fa] dark:bg-gray-900 rounded-lg p-4 shadow space-y-2">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                  📌 Événements à venir
                </h3>
                <ul className="space-y-3 text-sm">
                  {events.map(ev => (
                    <li
                      key={ev.id}
                      className="flex items-center gap-2 pb-2 border-b dark:border-gray-700"
                    >
                      {images[ev.id] && (
                        <img
                          src={images[ev.id]}
                          alt={ev.summary}
                          className="w-12 h-12 rounded-md"
                        />
                      )}
                      <div>
                        <strong>{ev.summary}</strong> —{" "}
                        {new Date(
                          ev.start.dateTime || ev.start.date
                        ).toLocaleString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Formulaires Section */}
          <motion.section
            id="formulaires"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="flex items-center gap-2 text-3xl font-bold text-green-800 dark:text-green-400">
              <ClipboardDocumentListIcon className="w-6 h-6" /> Formulaires
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <FormulaireMain />
              </div>
              <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <FormulaireStock />
              </div>
            </div>
          </motion.section>

          {/* Entrée Inventaire Section */}
          <motion.section
            id="inventaire"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="flex items-center gap-2 text-3xl font-bold text-green-800 dark:text-green-400">
              <ArchiveBoxIcon className="w-6 h-6" /> Entrée Inventaire
            </h2>
            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
              <EntreeInventairesForm />
            </div>
            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
              <EntreeInventaires />
            </div>
          </motion.section>

          {/* Stocks Section */}
          <motion.section
            id="stocks"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="flex items-center gap-2 text-3xl font-bold text-green-800 dark:text-green-400">
              <Squares2X2Icon className="w-6 h-6" /> Stocks
            </h2>
            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
              <StockViewer />
            </div>
          </motion.section>
        </main>

        {/* Drawer & Modal */}
        {drawerOpen && (
        <div data-testid="StockViewerDrawer">
          <StockViewerDrawer onClose={() => setDrawerOpen(false)} />
        </div>
      )}
        <Modal />

        {/* AJOUT : Section Stock global & Tags (affichée au clic) */}
        {showStocksDetails && (
          <div ref={stocksRef}>
            <motion.section
              id="stock-global"
              className="p-6 space-y-6 bg-white dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="flex items-center gap-2 text-3xl font-bold">
                <Bars3Icon className="w-6 h-6" /> Stock global
              </h2>
              <ul className="pl-6 list-disc">
                {stock.map(item => (
                  <li key={item.id}>
                    {item.Itemcode || item.code}: {item.Quantity || item.quantity}
                  </li>
                ))}
              </ul>
            </motion.section>

            <motion.section
              id="tags"
              className="p-6 space-y-6 bg-white dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="flex items-center gap-2 text-3xl font-bold">
                <TagIcon className="w-6 h-6" /> Tags disponibles
              </h2>
              <ul className="pl-6 list-disc">
                {tags.map(tag => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </motion.section>
          </div>
        )}
      </div>
    </div>
  );
}
