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
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  const [beads, setBeads] = useState<Bead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('stone');
  const [selectedBead, setSelectedBead] = useState<Bead | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Initialize Fabric.js Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Розраховуємо адаптивний розмір canvas
    const updateCanvasSize = () => {
      const isMobile = window.innerWidth < 768;
      const containerWidth = canvasRef.current?.parentElement?.clientWidth || 800;
      
      if (isMobile) {
        // На мобільних: ширина контейнера мінус padding, висота пропорційна
        const width = Math.min(containerWidth - 32, window.innerWidth - 32);
        const height = Math.min(width * 0.75, 400);
        setCanvasSize({ width, height });
      } else {
        // На десктопі: стандартний розмір або адаптивний
        const width = Math.min(containerWidth - 32, 800);
        const height = Math.min(width * 0.75, 600);
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const canvas = new Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#1a1a1a',
      selection: false,
    });

    fabricCanvasRef.current = canvas;

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.dispose();
    };
  }, [canvasSize.width, canvasSize.height]);

  const drawNecklaceArc = useCallback(async (canvas: Canvas) => {
    canvas.clear();
    canvas.backgroundColor = '#1a1a1a';

    const canvasWidth = canvas.width || 800;
    const canvasHeight = canvas.height || 600;
    const centerX = canvasWidth / 2;
    const centerY = Math.min(150, canvasHeight * 0.25); // Top of semicircle (neck level)

    // Sort threads by length (shortest first - closest to neck)
    const sortedThreads = [...threads].sort((a, b) => a.length_cm - b.length_cm);
    
    // Адаптивний радіус: на мобільних менший, на десктопі стандартний
    const isMobile = canvasWidth < 600;
    const scaleFactor = isMobile ? canvasWidth / 800 : 1;
    const minRadius = 150 * scaleFactor;
    const maxRadius = 300 * scaleFactor;

    // Draw multiple thread arcs in semicircle
    for (const [sortedIndex, thread] of sortedThreads.entries()) {
      // Знаходимо оригінальний індекс нитки
      const originalIndex = threads.findIndex(t => t.thread_number === thread.thread_number);
      const isSelected = originalIndex === selectedThreadIndex;
      
      // Розраховуємо радіус на основі довжини нитки
      // Найкоротша нитка (20см) - найменший радіус (найближче до шиї)
      // Найдовша нитка (80см) - найбільший радіус (найдальше від шиї)
      const threadRadius = minRadius + ((thread.length_cm - 20) / 60) * (maxRadius - minRadius);
      
      // Кут розташування нитки в полукрузі (від -90° до 90°)
      const totalThreads = sortedThreads.length;
      const angleStep = 180 / (totalThreads + 1);
      const angle = (sortedIndex + 1) * angleStep - 90; // -90° to +90°
      
      const x = Math.cos(angle * Math.PI / 180) * threadRadius;
      const y = Math.sin(angle * Math.PI / 180) * threadRadius;

      // Draw thread as semicircle arc
      // Використовуємо Circle з правильним розташуванням для полукруга
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

        // Calculate position on semicircle arc
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

      // Draw clasp if set (on first thread by number)
      if (clasp && thread.thread_number === 1) {
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
      alert(t.constructor.loginRequired);
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
          name: `${t.constructor.title} ${new Date().toLocaleDateString()}`,
          necklace_data: necklaceData,
        }),
      });

      if (res.ok) {
        alert(t.constructor.saveSuccess);
      } else {
        alert(t.constructor.saveError);
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert(t.constructor.saveError);
    }
  };

  const handleRequestQuote = () => {
    // Check if necklace has beads
    const hasBeads = threads.some(t => t.beads.length > 0);
    if (!hasBeads) {
      alert(t.constructor.addBeadsFirst);
      return;
    }

    if (!clasp) {
      alert(t.constructor.selectClasp);
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
              <span className="font-inter">{t.constructor.home}</span>
            </Link>
            <h1 className="font-cinzel text-xl md:text-2xl text-ivory">{t.constructor.title}</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button 
              variant="secondary" 
              onClick={handleSaveConfiguration}
              className="hidden md:flex"
            >
              <Save className="w-4 h-4 mr-2" />
              {t.constructor.save}
            </Button>
            <Button 
              onClick={handleRequestQuote}
              className="text-xs md:text-base px-2 md:px-4 py-1 md:py-2"
            >
              <Send className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">{t.constructor.quoteRequest}</span>
              <span className="sm:hidden">{t.constructor.send}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Mobile hamburger button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden fixed top-24 left-4 z-50 p-3 bg-oxblood text-white rounded-sm hover:bg-oxblood/80 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? '✕' : '☰'}
          </button>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Beads Selection */}
            <div className={`col-span-12 md:col-span-3 bg-footer-black rounded-sm p-4 overflow-y-auto fixed md:static top-20 md:top-auto left-0 z-40 w-80 md:w-auto h-[calc(100vh-5rem)] md:max-h-[calc(100vh-8rem)] transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
              {/* Close button for mobile */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-cinzel text-xl text-ivory">{t.constructor.beads}</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden p-2 text-ivory hover:text-oxblood transition-colors"
                  aria-label="Close sidebar"
                >
                  ✕
                </button>
              </div>

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
                  {t.constructor.stone}
                </button>
                <button
                  onClick={() => setSelectedCategory('hardware')}
                  className={`px-4 py-2 rounded-sm transition-colors text-left ${
                    selectedCategory === 'hardware'
                      ? 'bg-oxblood text-ivory'
                      : 'bg-deep-black text-sage hover:bg-deep-black/70'
                  }`}
                >
                  {t.constructor.hardware}
                </button>
                <button
                  onClick={() => setSelectedCategory('extra')}
                  className={`px-4 py-2 rounded-sm transition-colors text-left ${
                    selectedCategory === 'extra'
                      ? 'bg-oxblood text-ivory'
                      : 'bg-deep-black text-sage hover:bg-deep-black/70'
                  }`}
                >
                  {t.constructor.extra}
                </button>
              </div>

              {/* Beads Grid */}
              <div className="grid grid-cols-2 gap-3">
                {loading ? (
                  <p className="col-span-2 text-sage/70 text-center py-4">{t.constructor.loading}</p>
                ) : filteredBeads.length === 0 ? (
                  <p className="col-span-2 text-sage/70 text-center py-4">{t.constructor.noBeads}</p>
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
                      <p className="text-xs text-sage/70">{bead.size_mm} mm</p>
                    </button>
                  ))
                )}
              </div>

              {/* Clasp Selection */}
              <div className="mt-6 pt-6 border-t border-sage/20">
                <h3 className="font-cinzel text-lg text-ivory mb-3">{t.constructor.clasp}</h3>
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
            <div className="col-span-12 md:col-span-6 bg-footer-black rounded-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-cinzel text-xl text-ivory">{t.constructor.visualEditor}</h2>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-deep-black text-sage hover:bg-sage/20 rounded-sm transition-colors"
                    title={t.constructor.instruction2}
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-ivory px-3">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-deep-black text-sage hover:bg-sage/20 rounded-sm transition-colors"
                    title={t.constructor.instruction2}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRotateSelectedBead}
                    className="p-2 bg-deep-black text-sage hover:bg-sage/20 rounded-sm transition-colors ml-2"
                    title={t.constructor.instruction3}
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRemoveLastBead}
                    className="p-2 bg-deep-black text-oxblood hover:bg-oxblood/20 rounded-sm transition-colors"
                    title={t.constructor.deleteThread}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className="bg-deep-black rounded-sm overflow-hidden w-full">
                <canvas 
                  ref={canvasRef} 
                  className="w-full max-w-full h-auto"
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>

              {/* Thread Info */}
              <div className="mt-4 bg-sage/5 p-3 rounded-sm">
                <p className="text-sm text-sage/70">
                  {t.constructor.thread} {selectedThreadIndex + 1} {t.constructor.threadOf} {threadCount} | {t.constructor.beads} {t.constructor.beadsOnThread}: {threads[selectedThreadIndex]?.beads.length || 0}
                </p>
              </div>
            </div>

            {/* Right Panel - Settings */}
            <div className="col-span-12 md:col-span-3 bg-footer-black rounded-sm p-4">
              <h2 className="font-cinzel text-xl text-ivory mb-4">{t.constructor.settings}</h2>

              {/* Thread Count */}
              <div className="mb-6">
                <label className="block text-sm text-ivory mb-2">{t.constructor.threadCount}</label>
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
                <p className="text-xs text-sage/50 mt-1">{t.constructor.maxThreads}</p>
              </div>

              {/* Current Thread Length */}
              {threads[selectedThreadIndex] && (
                <div className="mb-6">
                  <label className="block text-sm text-ivory mb-2">
                    {t.constructor.threadLength}: {threads[selectedThreadIndex].length_cm} cm
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="5"
                    value={threads[selectedThreadIndex].length_cm}
                    onChange={(e) => {
                      const newLength = parseInt(e.target.value);
                      const updatedThreads = [...threads];
                      updatedThreads[selectedThreadIndex].length_cm = newLength;
                      setThreads(updatedThreads);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-sage/50 mt-1">
                    <span>20 cm</span>
                    <span>80 cm</span>
                  </div>
                </div>
              )}

              {/* Thread Selector */}
              <div className="mb-6">
                <label className="block text-sm text-ivory mb-2">{t.constructor.activeThread}</label>
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
                      {t.constructor.thread} {thread.thread_number} ({thread.length_cm}см, {thread.beads.length} {t.constructor.beads})
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-sage/5 p-3 rounded-sm">
                <h3 className="text-sm font-medium text-ivory mb-2">{t.constructor.instruction}</h3>
                <ul className="text-xs text-sage/70 space-y-1">
                  <li>• {t.constructor.instruction1}</li>
                  <li>• {t.constructor.instruction2}</li>
                  <li>• {t.constructor.instruction3}</li>
                  <li>• {t.constructor.instruction4}</li>
                  <li>• {t.constructor.instruction5}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
