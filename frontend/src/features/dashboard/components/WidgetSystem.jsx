// Système de Widgets Personnalisables Ultra Premium 🎨
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Squares2X2Icon,
  PlusIcon,
  XMarkIcon,
  Cog6ToothIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  EyeIcon,
  EyeSlashIcon,
  PaintBrushIcon,
  ChartBarIcon,
  ClockIcon,
  CalendarIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  MapIcon,
  CurrencyEuroIcon,
  UsersIcon,
  DocumentTextIcon,
  SparklesIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Widget de graphique personnalisable
const ChartWidget = ({ data, type = 'line', title, color }) => {
  const chartData = {
    labels: data?.labels || ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    datasets: [{
      label: title,
      data: data?.values || [65, 72, 68, 85, 92],
      borderColor: color || 'rgb(147, 51, 234)',
      backgroundColor: color ? `${color}20` : 'rgba(147, 51, 234, 0.1)',
      tension: 0.4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  const ChartComponent = {
    line: Line,
    bar: Bar,
    doughnut: Doughnut,
    radar: Radar
  }[type] || Line;

  return (
    <div className="h-full p-4">
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <div className="h-48">
        <ChartComponent data={chartData} options={options} />
      </div>
    </div>
  );
};

// Widget horloge temps réel
const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <ClockIcon className="w-12 h-12 text-purple-400" />
      </motion.div>
      <div className="text-center">
        <p className="text-4xl font-bold text-white">
          {time.toLocaleTimeString('fr-FR')}
        </p>
        <p className="text-gray-400 mt-2">
          {time.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
};

// Widget calendrier
const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());
  
  return (
    <div className="h-full p-4">
      <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
        <CalendarIcon className="w-5 h-5" />
        <span>Calendrier</span>
      </h3>
      <div className="calendar-widget-custom">
        <Calendar
          onChange={setDate}
          value={date}
          locale="fr-FR"
        />
      </div>
    </div>
  );
};

// Widget de notifications
const NotificationsWidget = ({ notifications = [] }) => {
  return (
    <div className="h-full p-4">
      <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
        <BellIcon className="w-5 h-5" />
        <span>Notifications</span>
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-2 bg-white/5 rounded-lg border border-white/10"
            >
              <p className="text-sm text-white">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Aucune notification</p>
        )}
      </div>
    </div>
  );
};

// Widget météo (simulé)
const WeatherWidget = () => {
  const [weather] = useState({
    temp: 22,
    condition: 'Ensoleillé',
    icon: '☀️',
    location: 'Paris'
  });

  return (
    <div className="h-full p-4 flex flex-col items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-6xl mb-4"
      >
        {weather.icon}
      </motion.div>
      <p className="text-3xl font-bold text-white">{weather.temp}°C</p>
      <p className="text-gray-400">{weather.condition}</p>
      <p className="text-sm text-gray-500 mt-2">📍 {weather.location}</p>
    </div>
  );
};

// Widget de chat IA
const AIChatWidget = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Bonjour ! Comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', text: input }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: 'Je traite votre demande...' 
        }]);
      }, 1000);
      setInput('');
    }
  };

  return (
    <div className="h-full p-4 flex flex-col">
      <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
        <ChatBubbleLeftIcon className="w-5 h-5" />
        <span>Assistant IA</span>
      </h3>
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.role === 'ai' 
                ? 'bg-purple-600/20 text-purple-200' 
                : 'bg-blue-600/20 text-blue-200 ml-auto'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 
                     text-white text-sm placeholder-gray-400"
          placeholder="Tapez votre message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

// Widget de map interactive
const MapWidget = () => {
  return (
    <div className="h-full p-4 relative">
      <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
        <MapIcon className="w-5 h-5" />
        <span>Carte des interventions</span>
      </h3>
      <div className="h-48 bg-gradient-to-br from-blue-900/30 to-green-900/30 rounded-lg 
                      flex items-center justify-center relative overflow-hidden">
        {/* Points animés sur la carte */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-red-500 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}
        <p className="text-gray-400">5 interventions en cours</p>
      </div>
    </div>
  );
};

// Configuration de widget individuel
const WidgetConfig = ({ widget, onUpdate, onClose }) => {
  const [config, setConfig] = useState(widget.config || {});

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 z-20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Configuration</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-gray-400 text-sm">Titre</label>
          <input
            type="text"
            value={config.title || widget.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 
                       text-white text-sm mt-1"
          />
        </div>
        
        <div>
          <label className="text-gray-400 text-sm">Couleur</label>
          <div className="flex space-x-2 mt-1">
            {['purple', 'blue', 'green', 'red', 'yellow'].map(color => (
              <button
                key={color}
                onClick={() => setConfig({ ...config, color })}
                className={`w-8 h-8 rounded-lg bg-${color}-600 
                           ${config.color === color ? 'ring-2 ring-white' : ''}`}
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={() => onUpdate({ ...widget, config })}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Appliquer
        </button>
      </div>
    </motion.div>
  );
};

// Composant Widget individuel
const Widget = ({ widget, onRemove, onConfig, isDragging }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderWidget = () => {
    switch (widget.type) {
      case 'chart':
        return <ChartWidget {...widget.props} />;
      case 'clock':
        return <ClockWidget />;
      case 'calendar':
        return <CalendarWidget />;
      case 'notifications':
        return <NotificationsWidget {...widget.props} />;
      case 'weather':
        return <WeatherWidget />;
      case 'ai-chat':
        return <AIChatWidget />;
      case 'map':
        return <MapWidget />;
      default:
        return <div className="p-4 text-gray-400">Widget non reconnu</div>;
    }
  };

  return (
    <motion.div
      layout
      className={`relative bg-gray-900/50 backdrop-blur-xl rounded-2xl 
                 border border-purple-500/30 overflow-hidden
                 ${isDragging ? 'opacity-50' : ''}
                 ${isFullscreen ? 'fixed inset-4 z-50' : ''}
                 ${widget.size === 'small' ? 'col-span-1' : ''}
                 ${widget.size === 'medium' ? 'col-span-2' : ''}
                 ${widget.size === 'large' ? 'col-span-3' : ''}`}
    >
      {/* Barre d'outils du widget */}
      <div className="absolute top-2 right-2 flex space-x-1 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1 bg-white/10 rounded-lg hover:bg-white/20"
        >
          {isFullscreen ? 
            <ArrowsPointingInIcon className="w-4 h-4 text-white" /> :
            <ArrowsPointingOutIcon className="w-4 h-4 text-white" />
          }
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowConfig(!showConfig)}
          className="p-1 bg-white/10 rounded-lg hover:bg-white/20"
        >
          <Cog6ToothIcon className="w-4 h-4 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => onRemove(widget.id)}
          className="p-1 bg-red-500/20 rounded-lg hover:bg-red-500/30"
        >
          <XMarkIcon className="w-4 h-4 text-red-400" />
        </motion.button>
      </div>

      {/* Contenu du widget */}
      {renderWidget()}

      {/* Configuration du widget */}
      <AnimatePresence>
        {showConfig && (
          <WidgetConfig
            widget={widget}
            onUpdate={(updated) => {
              onConfig(updated);
              setShowConfig(false);
            }}
            onClose={() => setShowConfig(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Catalogue de widgets disponibles
const WidgetCatalog = ({ onAdd, onClose }) => {
  const availableWidgets = [
    { type: 'chart', title: 'Graphique', icon: ChartBarIcon, size: 'medium' },
    { type: 'clock', title: 'Horloge', icon: ClockIcon, size: 'small' },
    { type: 'calendar', title: 'Calendrier', icon: CalendarIcon, size: 'medium' },
    { type: 'notifications', title: 'Notifications', icon: BellIcon, size: 'small' },
    { type: 'weather', title: 'Météo', icon: SunIcon, size: 'small' },
    { type: 'ai-chat', title: 'Chat IA', icon: ChatBubbleLeftIcon, size: 'medium' },
    { type: 'map', title: 'Carte', icon: MapIcon, size: 'large' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 
                   max-w-4xl w-full max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Squares2X2Icon className="w-8 h-8 text-purple-400" />
          <span>Catalogue de Widgets</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableWidgets.map((widget) => {
            const Icon = widget.icon;
            return (
              <motion.button
                key={widget.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAdd(widget)}
                className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 
                         rounded-xl border border-purple-500/30 hover:border-purple-400/50
                         flex flex-col items-center space-y-3 transition-all"
              >
                <Icon className="w-12 h-12 text-purple-400" />
                <span className="text-white font-semibold">{widget.title}</span>
                <span className="text-xs text-gray-400">Taille: {widget.size}</span>
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );
};

// Système principal de widgets
const WidgetSystem = () => {
  const [widgets, setWidgets] = useState([
    { id: '1', type: 'chart', title: 'Revenus', size: 'medium', props: {} },
    { id: '2', type: 'clock', title: 'Horloge', size: 'small', props: {} },
    { id: '3', type: 'notifications', title: 'Notifications', size: 'small', props: { 
      notifications: [
        { message: 'Nouveau client ajouté', time: 'Il y a 5 min' },
        { message: 'Facture payée', time: 'Il y a 1h' }
      ]
    }}
  ]);
  const [showCatalog, setShowCatalog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const addWidget = (widget) => {
    const newWidget = {
      ...widget,
      id: Date.now().toString(),
      props: {}
    };
    setWidgets([...widgets, newWidget]);
    setShowCatalog(false);
  };

  const removeWidget = (id) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const updateWidget = (updatedWidget) => {
    setWidgets(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
  };

  return (
    <div className="p-6">
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <SparklesIcon className="w-8 h-8 text-purple-400" />
          <span>Dashboard Personnalisé</span>
        </h2>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2
                       ${editMode 
                         ? 'bg-purple-600 text-white' 
                         : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          >
            <PaintBrushIcon className="w-5 h-5" />
            <span>{editMode ? 'Terminer' : 'Modifier'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCatalog(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 
                     text-white rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Ajouter Widget</span>
          </motion.button>
        </div>
      </div>

      {/* Grille de widgets */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {widgets.map((widget, index) => (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id}
                  index={index}
                  isDragDisabled={!editMode}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                    >
                      <Widget
                        widget={widget}
                        onRemove={removeWidget}
                        onConfig={updateWidget}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Message si aucun widget */}
      {widgets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 text-gray-400"
        >
          <Squares2X2Icon className="w-16 h-16 mb-4" />
          <p className="text-lg">Aucun widget configuré</p>
          <button
            onClick={() => setShowCatalog(true)}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Ajouter votre premier widget
          </button>
        </motion.div>
      )}

      {/* Catalogue de widgets */}
      <AnimatePresence>
        {showCatalog && (
          <WidgetCatalog
            onAdd={addWidget}
            onClose={() => setShowCatalog(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WidgetSystem;