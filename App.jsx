import React, { useState } from 'react';
import { 
  Droplets, 
  Fish, 
  Activity, 
  Waves, 
  Calendar, 
  CheckSquare, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer, 
  Scale, 
  ShieldAlert,
  Info
} from 'lucide-react';

export default function App() {
  // --- GLOBAL TANK STATE ---
  const [tankMode, setTankMode] = useState('Freshwater'); // 'Freshwater' | 'Reef'
  const [tankSize, setTankSize] = useState(30); // gallons
  const [activeTab, setActiveTab] = useState('parameters');

  // --- WATER PARAMETERS STATE ---
  const [parameters, setParameters] = useState({
    pH: 7.2,
    ammonia: 0.0,
    nitrite: 0.0,
    nitrate: 20,
    temp: 78,
    sg: 1.025,
    calcium: 430,
    alkalinity: 8.5,
    magnesium: 1350,
    phosphate: 0.04
  });

  // --- STOCKING STATE ---
  const [stockList, setStockList] = useState([
    { id: 1, name: 'Neon Tetra', count: 6, inchEach: 1.5, minTemp: 72, maxTemp: 78, minPh: 6.0, maxPh: 7.0 },
    { id: 2, name: 'Corydoras Catfish', count: 4, inchEach: 2.0, minTemp: 72, maxTemp: 78, minPh: 6.0, maxPh: 7.5 }
  ]);
  const [selectedSpecies, setSelectedSpecies] = useState('Guppy');

  // Species DB
  const speciesData = {
    'Neon Tetra': { inchEach: 1.5, minTemp: 72, maxTemp: 78, minPh: 6.0, maxPh: 7.0 },
    'Corydoras Catfish': { inchEach: 2.0, minTemp: 72, maxTemp: 78, minPh: 6.0, maxPh: 7.5 },
    'Guppy': { inchEach: 1.5, minTemp: 74, maxTemp: 82, minPh: 7.0, maxPh: 8.5 },
    'Angelfish': { inchEach: 6.0, minTemp: 76, maxTemp: 82, minPh: 6.5, maxPh: 7.5 },
    'Clownfish (Ocellaris)': { inchEach: 3.0, minTemp: 75, maxTemp: 80, minPh: 8.1, maxPh: 8.4 },
    'Blue Tang': { inchEach: 8.0, minTemp: 75, maxTemp: 82, minPh: 8.1, maxPh: 8.4 }
  };

  // --- DIAGNOSTICS & DOSING STATE ---
  const [selectedSymptom, setSelectedSymptom] = useState('white_spots');
  const [medVolume, setMedVolume] = useState(30);

  const diseases = {
    white_spots: {
      name: 'Ich (White Spot Disease)',
      cause: 'Parasitic ciliate (Ichthyophthirius multifiliis)',
      treatment: 'Formalin / Malachite Green or increase temperature to 86°F + aquarium salt.',
      doseRate: 1.0 // mL per 10 gal
    },
    frayed_fins: {
      name: 'Fin Rot',
      cause: 'Bacterial infection (Aeromonas/Pseudomonas) often caused by poor water quality.',
      treatment: 'Antibacterial medication (e.g., KanaPlex) & 30% water change.',
      doseRate: 2.5 // mL per 10 gal
    },
    bloated_scales: {
      name: 'Dropsy / Fluid Retention',
      cause: 'Systemic bacterial infection causing organ failure.',
      treatment: 'Epsom salt baths (1-2 tsp/gal) + Broad-spectrum antibiotics in quarantine tank.',
      doseRate: 5.0
    },
    cotton_patches: {
      name: 'Columnaris / Fungus',
      cause: 'Flavobacterium columnare (bacterial, often mistaken for fungus).',
      treatment: 'Nitrofurazone + Kanamycin combination treatment.',
      doseRate: 2.0
    }
  };

  // --- MAINTENANCE & TASKS STATE ---
  const [tasks, setTasks] = useState([
    { id: 1, title: '20% Water Change & Gravel Vacuum', category: 'Water Change', freq: 'Weekly', completed: false },
    { id: 2, title: 'Test Ammonia & Nitrite Levels', category: 'Testing', freq: 'Weekly', completed: true },
    { id: 3, title: 'Dose 2-Part Alkalinity / Calcium (Reef)', category: 'Dosing', freq: 'Daily', completed: false },
    { id: 4, title: 'Clean Filter Floss & Skimmer Cup', category: 'Filter', freq: 'Bi-Weekly', completed: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // --- COMPUTED VALUES ---
  const totalFishInches = stockList.reduce((acc, curr) => acc + (curr.count * curr.inchEach), 0);
  const stockingPercentage = Math.min(Math.round((totalFishInches / tankSize) * 100), 200);

  const handleParamChange = (param, val) => {
    setParameters(prev => ({ ...prev, [param]: parseFloat(val) }));
  };

  const addStockItem = () => {
    const info = speciesData[selectedSpecies];
    if (!info) return;
    setStockList(prev => [
      ...prev,
      { id: Date.now(), name: selectedSpecies, count: 1, ...info }
    ]);
  };

  const removeStockItem = (id) => {
    setStockList(prev => prev.filter(item => item.id !== id));
  };

  const updateStockCount = (id, delta) => {
    setStockList(prev => prev.map(item => {
      if (item.id === id) {
        const newCount = Math.max(1, item.count + delta);
        return { ...item, count: newCount };
      }
      return item;
    }));
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), title: newTaskTitle, category: 'General', freq: 'Custom', completed: false }
    ]);
    setNewTaskTitle('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER & TANK MODE TOGGLE */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
              <Waves className="w-8 h-8 text-cyan-400" /> AquaAssistant Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1">Aquarium Parameters, Stocking, Diagnostics & Maintenance</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-2 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setTankMode('Freshwater')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tankMode === 'Freshwater' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Freshwater Mode
            </button>
            <button
              onClick={() => setTankMode('Reef')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tankMode === 'Reef' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Saltwater & Reef Mode
            </button>
          </div>
        </header>

        {/* TANK SIZE SLIDER */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Droplets className="text-cyan-400 w-5 h-5" />
            <span className="font-semibold">Active Tank Volume:</span>
            <span className="text-cyan-400 font-bold text-lg">{tankSize} Gallons</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            step="5"
            value={tankSize}
            onChange={(e) => {
              setTankSize(Number(e.target.value));
              setMedVolume(Number(e.target.value));
            }}
            className="w-full md:w-64 accent-cyan-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
