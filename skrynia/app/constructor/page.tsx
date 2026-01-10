'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, Circle, Image } from 'fabric';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Save,
  Trash2,
  Send,
  Plus,
  Minus,
  Home
} from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface Bead {
  id: number;
  name: string;
  image_url: string;
  category: 'stone' | 'hardware' | 'extra';
  subcategory?: string;
  size_mm: number;
  color?: string;
  price_netto: number;
  price_brutto: number;
  is_active: boolean;
}

interface PlacedBead {
  bead_id: number;
  position: number;
  rotation: number;
  fabricObject?: Image;
}

interface NecklaceThread {
  thread_number: number;
  length_cm: number;
  beads: PlacedBead[];
}

export default function NecklaceConstructor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  const [beads, setBeads] = useState<Bead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('stone');
  const [selectedBead, setSelectedBead] = useState<Bead | null>(null);

  // Necklace configuration
  const [threadCount, setThreadCount] = useState(1);
  const [threadLength, setThreadLength] = useState(50); // cm
  const [threads, setThreads] = useState<NecklaceThread[]>([
    { thread_number: 1, length_cm: 50, beads: [] }
  ]);
  const [clasp, setClasp] = useState<{ bead_id: number } | null>(null);

  // Canvas controls
  const [zoom, setZoom] = useState(1);
  const [selectedThreadIndex, setSelectedThreadIndex] = useState(0);

  // Initialize Fabric.js Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#1a1a1a',
      selection: false,
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  const drawNecklaceArc = useCallback(async (canvas: Canvas) => {
    canvas.clear();
    canvas.backgroundColor = '#1a1a1a';

    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;

    // Calculate arc radius based on thread length
    // Realistic formula: circumference-based radius
    const arcRadius = (threadLength * 10 * zoom) / (Math.PI * 0.6); // Convert cm to pixels

    // Draw multiple thread arcs
    for (const [threadIndex, thread] of threads.entries()) {
      const threadRadius = arcRadius - threadIndex * 30; // Offset for multiple threads
      const isSelected = threadIndex === selectedThreadIndex;

      // Draw thread arc (jewelry string)
      const arc = new Circle({
        left: centerX - threadRadius,
        top: centerY - threadRadius / 2,
        radius: threadRadius,
        startAngle: 0,
        endAngle: Math.PI,
        stroke: isSelected ? '#c19a6b' : '#4a4a4a',
        strokeWidth: 2,
        fill: 'transparent',
        selectable: false,
        evented: false,
      });

      canvas.add(arc);

      // Draw beads on the arc
      for (const [beadIndex, placedBead] of thread.beads.entries()) {
        const bead = beads.find(b => b.id === placedBead.bead_id);
        if (!bead) continue;

        // Calculate position on arc
        const totalBeads = thread.beads.length;
        const angleStep = Math.PI / (totalBeads + 1);
        const angle = angleStep * (beadIndex + 1);

        const beadX = centerX + threadRadius * Math.cos(Math.PI - angle);
        const beadY = centerY + threadRadius * Math.sin(Math.PI - angle);

        // Load and place bead image (fabric.js v7 uses Promise)
        try {
          const img = await Image.fromURL(bead.image_url, { crossOrigin: 'anonymous' });
          if (!img) continue;

          // Auto-scale based on size_mm (realistic scaling)
          const scaleFactor = (bead.size_mm / 10) * zoom * 0.8;

          img.set({
            left: beadX,
            top: beadY,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            angle: placedBead.rotation,
            originX: 'center',
            originY: 'center',
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockMovementX: false,
            lockMovementY: false,
          });

          // Add rotation and delete controls
          img.on('selected', () => {
            setSelectedBead(bead);
          });

          canvas.add(img);
          placedBead.fabricObject = img;
        } catch (error) {
          console.error('Failed to load bead image:', error);
        }
      }

      // Draw clasp if set
      if (clasp && threadIndex === 0) {
        const claspBead = beads.find(b => b.id === clasp.bead_id);
        if (claspBead) {
          try {
            const img = await Image.fromURL(claspBead.image_url, { crossOrigin: 'anonymous' });
            if (img) {
              const scaleFactor = (claspBead.size_mm / 10) * zoom;
              img.set({
                left: centerX,
                top: centerY + threadRadius / 2 + 40,
                scaleX: scaleFactor,
                scaleY: scaleFactor,
                originX: 'center',
                originY: 'center',
                selectable: true,
              });

              canvas.add(img);
            }
          } catch (error) {
            console.error('Failed to load clasp image:', error);
          }
        }
      }
    }

    canvas.renderAll();
  }, [threads, zoom, threadLength, beads, selectedThreadIndex, clasp]);

  const fetchBeads = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiEndpoint('/api/v1/beads'));
      if (res.ok) {
        const data = await res.json();
        setBeads(data.filter((b: Bead) => b.is_active));
      }
    } catch (error) {
      console.error('Failed to fetch beads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch beads from API
  useEffect(() => {
    fetchBeads();
  }, []);

  // Redraw when threads change
  useEffect(() => {
    if (fabricCanvasRef.current) {
      drawNecklaceArc(fabricCanvasRef.current).catch(console.error);
    }
  }, [drawNecklaceArc]);

  const handleAddBeadToThread = (bead: Bead) => {
    const updatedThreads = [...threads];
    const currentThread = updatedThreads[selectedThreadIndex];

    const newBead: PlacedBead = {
      bead_id: bead.id,
      position: currentThread.beads.length,
      rotation: 0,
    };

    currentThread.beads.push(newBead);
    setThreads(updatedThreads);
  };

  const handleRemoveLastBead = () => {
    const updatedThreads = [...threads];
    const currentThread = updatedThreads[selectedThreadIndex];

    if (currentThread.beads.length > 0) {
      currentThread.beads.pop();
      setThreads(updatedThreads);
    }
  };

  const handleRotateSelectedBead = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 45);
      canvas.renderAll();

      // Update rotation in state
      const updatedThreads = [...threads];
      const currentThread = updatedThreads[selectedThreadIndex];
      const beadIndex = currentThread.beads.findIndex(
        b => b.fabricObject === activeObject
      );
      if (beadIndex !== -1) {
        currentThread.beads[beadIndex].rotation = activeObject.angle || 0;
        setThreads(updatedThreads);
      }
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.2, 3);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.2, 0.5);
    setZoom(newZoom);
  };

  const handleAddThread = () => {
    if (threadCount < 5) {
      const newCount = threadCount + 1;
      setThreadCount(newCount);
      setThreads([
        ...threads,
        { thread_number: newCount, length_cm: threadLength, beads: [] }
      ]);
    }
  };

  const handleRemoveThread = () => {
    if (threadCount > 1) {
      const newCount = threadCount - 1;
      setThreadCount(newCount);
      setThreads(threads.slice(0, -1));
    }
  };

  const handleSaveConfiguration = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      alert('Будь ласка, увійдіть в систему для збереження конфігурації');
      return;
    }

    const necklaceData = {
      threads: threads.map(t => ({
        thread_number: t.thread_number,
        length_cm: t.length_cm,
        beads: t.beads.map(b => ({
          bead_id: b.bead_id,
          position: b.position,
        }))
      })),
      clasp: clasp,
    };

    try {
      const res = await fetch(getApiEndpoint('/api/v1/necklaces'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `Намисто ${new Date().toLocaleDateString('uk-UA')}`,
          necklace_data: necklaceData,
        }),
      });

      if (res.ok) {
        alert('Конфігурацію збережено!');
      } else {
        alert('Помилка збереження. Перевірте авторизацію.');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Помилка збереження конфігурації');
    }
  };

  const handleRequestQuote = () => {
    // Check if necklace has beads
    const hasBeads = threads.some(t => t.beads.length > 0);
    if (!hasBeads) {
      alert('Додайте бусини до намиста перед відправкою запиту!');
      return;
    }

    if (!clasp) {
      alert('Будь ласка, виберіть застібку!');
      return;
    }

    // Navigate to quote request form
    const necklaceData = {
      threads: threads.map(t => ({
        thread_number: t.thread_number,
        length_cm: t.length_cm,
        beads: t.beads.map(b => ({
          bead_id: b.bead_id,
          position: b.position,
        }))
      })),
      clasp: clasp,
    };

    localStorage.setItem('pending_necklace_data', JSON.stringify(necklaceData));
    window.location.href = '/constructor/quote';
  };

  const filteredBeads = beads.filter(b => b.category === selectedCategory);

  return (
    <div className="min-h-screen bg-deep-black">
      {/* Header */}
      <header className="bg-footer-black border-b border-sage/20 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-ivory hover:text-sage transition-colors">
              <Home className="w-5 h-5" />
              <span className="font-inter">Головна</span>
            </Link>
            <h1 className="font-cinzel text-2xl text-ivory">Конструктор Намиста</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleSaveConfiguration}>
              <Save className="w-4 h-4 mr-2" />
              Зберегти
            </Button>
            <Button onClick={handleRequestQuote}>
              <Send className="w-4 h-4 mr-2" />
              Запит на Прорахунок
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Beads Selection */}
            <div className="col-span-3 bg-footer-black rounded-sm p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h2 className="font-cinzel text-xl text-ivory mb-4">Бусини</h2>

              {/* Category Tabs */}
              <div className="flex flex-col gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory('stone')}
                  className={`px-4 py-2 rounded-sm transition-colors text-left ${
                    selectedCategory === 'stone'
                      ? 'bg-oxblood text-ivory'
                      : 'bg-deep-black text-sage hover:bg-deep-black/70'
                  }`}
                >
                  Камінь
                </button>
                <button
                  onClick={() => setSelectedCategory('hardware')}
                  className={`px-4 py-2 rounded-sm transition-colors text-left ${
                    selectedCategory === 'hardware'
                      ? 'bg-oxblood text-ivory'
                      : 'bg-deep-black text-sage hover:bg-deep-black/70'
                  }`}
                >
                  Фурнітура
                </button>
                <button
                  onClick={() => setSelectedCategory('extra')}
                  className={`px-4 py-2 rounded-sm transition-colors text-left ${
                    selectedCategory === 'extra'
                      ? 'bg-oxblood text-ivory'
                      : 'bg-deep-black text-sage hover:bg-deep-black/70'
                  }`}
                >
                  Додатково
                </button>
              </div>

              {/* Beads Grid */}
              <div className="grid grid-cols-2 gap-3">
                {loading ? (
                  <p className="col-span-2 text-sage/70 text-center py-4">Завантаження...</p>
                ) : filteredBeads.length === 0 ? (
                  <p className="col-span-2 text-sage/70 text-center py-4">Бусини не знайдено</p>
                ) : (
                  filteredBeads.map((bead) => (
                    <button
                      key={bead.id}
                      onClick={() => handleAddBeadToThread(bead)}
                      className="bg-deep-black p-3 rounded-sm hover:bg-sage/10 transition-colors border border-sage/20 hover:border-sage"
                    >
                      <img
                        src={bead.image_url}
                        alt={bead.name}
                        className="w-full h-20 object-contain mb-2"
                      />
                      <p className="text-xs text-ivory truncate">{bead.name}</p>
                      <p className="text-xs text-sage/70">{bead.size_mm} мм</p>
                    </button>
                  ))
                )}
              </div>

              {/* Clasp Selection */}
              <div className="mt-6 pt-6 border-t border-sage/20">
                <h3 className="font-cinzel text-lg text-ivory mb-3">Застібка</h3>
                <div className="grid grid-cols-2 gap-3">
                  {beads
                    .filter(b => b.category === 'hardware' && b.subcategory?.toLowerCase().includes('застібка'))
                    .map((bead) => (
                      <button
                        key={bead.id}
                        onClick={() => setClasp({ bead_id: bead.id })}
                        className={`bg-deep-black p-3 rounded-sm transition-colors border ${
                          clasp?.bead_id === bead.id
                            ? 'border-oxblood bg-oxblood/10'
                            : 'border-sage/20 hover:border-sage'
                        }`}
                      >
                        <img
                          src={bead.image_url}
                          alt={bead.name}
                          className="w-full h-16 object-contain mb-2"
                        />
                        <p className="text-xs text-ivory truncate">{bead.name}</p>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Center - Canvas */}
            <div className="col-span-6 bg-footer-black rounded-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-cinzel text-xl text-ivory">Візуальний Редактор</h2>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-deep-black text-sage hover:bg-sage/20 rounded-sm transition-colors"
                    title="Віддалити"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-ivory px-3">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-deep-black text-sage hover:bg-sage/20 rounded-sm transition-colors"
                    title="Приблизити"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRotateSelectedBead}
                    className="p-2 bg-deep-black text-sage hover:bg-sage/20 rounded-sm transition-colors ml-2"
                    title="Повернути вибрану бусину"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRemoveLastBead}
                    className="p-2 bg-deep-black text-oxblood hover:bg-oxblood/20 rounded-sm transition-colors"
                    title="Видалити останню бусину"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className="bg-deep-black rounded-sm overflow-hidden">
                <canvas ref={canvasRef} />
              </div>

              {/* Thread Info */}
              <div className="mt-4 bg-sage/5 p-3 rounded-sm">
                <p className="text-sm text-sage/70">
                  Нитка {selectedThreadIndex + 1} з {threadCount} | Бусин на нитці: {threads[selectedThreadIndex]?.beads.length || 0}
                </p>
              </div>
            </div>

            {/* Right Panel - Settings */}
            <div className="col-span-3 bg-footer-black rounded-sm p-4">
              <h2 className="font-cinzel text-xl text-ivory mb-4">Налаштування</h2>

              {/* Thread Count */}
              <div className="mb-6">
                <label className="block text-sm text-ivory mb-2">Кількість ниток</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRemoveThread}
                    disabled={threadCount <= 1}
                    className="p-2 bg-deep-black text-sage hover:bg-sage/20 rounded-sm transition-colors disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center text-2xl font-bold text-ivory">
                    {threadCount}
                  </span>
                  <button
                    onClick={handleAddThread}
                    disabled={threadCount >= 5}
                    className="p-2 bg-deep-black text-sage hover:bg-sage/20 rounded-sm transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-sage/50 mt-1">Максимум: 5 ниток</p>
              </div>

              {/* Thread Length */}
              <div className="mb-6">
                <label className="block text-sm text-ivory mb-2">
                  Довжина нитки: {threadLength} см
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={threadLength}
                  onChange={(e) => {
                    const newLength = parseInt(e.target.value);
                    setThreadLength(newLength);
                    const updatedThreads = threads.map(t => ({
                      ...t,
                      length_cm: newLength
                    }));
                    setThreads(updatedThreads);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-sage/50 mt-1">
                  <span>20 см</span>
                  <span>80 см</span>
                </div>
              </div>

              {/* Thread Selector */}
              <div className="mb-6">
                <label className="block text-sm text-ivory mb-2">Активна нитка</label>
                <div className="flex flex-col gap-2">
                  {threads.map((thread, index) => (
                    <button
                      key={thread.thread_number}
                      onClick={() => setSelectedThreadIndex(index)}
                      className={`px-4 py-2 rounded-sm transition-colors text-left ${
                        selectedThreadIndex === index
                          ? 'bg-oxblood text-ivory'
                          : 'bg-deep-black text-sage hover:bg-deep-black/70'
                      }`}
                    >
                      Нитка {thread.thread_number} ({thread.beads.length} бусин)
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-sage/5 p-3 rounded-sm">
                <h3 className="text-sm font-medium text-ivory mb-2">Інструкція:</h3>
                <ul className="text-xs text-sage/70 space-y-1">
                  <li>• Клацніть на бусину зліва, щоб додати її</li>
                  <li>• Використовуйте Zoom для приближення</li>
                  <li>• Клацніть на бусину та натисніть Rotate</li>
                  <li>• Оберіть застібку внизу панелі</li>
                  <li>• Збережіть або надішліть запит</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
