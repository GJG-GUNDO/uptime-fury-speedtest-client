import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, RotateCcw, ArrowDown, ArrowUp, Activity, 
  CheckCircle, AlertTriangle, Layers, Table, ChevronDown, ChevronUp,
  Wifi, Shield, Zap, Github, Menu, Gamepad2, Tv, Video
} from 'lucide-react';
import SpeedTest from '@cloudflare/speedtest';

// ==========================================
// HELPERS & UTILS
// ==========================================

const calculatePercentile = (data, percentile) => {
  if (!data || data.length === 0) return 0;
  const sorted = data.map(d => d.bps).sort((a, b) => a - b);
  const index = Math.ceil(percentile / 100 * sorted.length) - 1;
  return sorted[index] / 1e6; 
};

const formatBytes = (bytes) => {
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} kB`;
    return `${bytes} B`;
};

const getScoreColor = (score) => {
  if (!score) return 'text-slate-500';
  if (score >= 80) return 'text-emerald-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-red-500';
};

// ==========================================
// UI COMPONENTS
// ==========================================

const Navbar = () => (
  <nav className="w-full border-b border-white/10 bg-[#0b1121]/80 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Activity className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          UPTIME FURY<span className="text-slate-500 font-light"> SPEED RUNNER</span>
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">

        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="w-full border-t border-white/10 bg-[#020617] mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 text-sm">
          &copy; 2023-25 UPTIME FURY SpeedRunner Analytics. Powered by Cloudflare Edge.
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/GJG-GUNDO/uptime-fury-speedtest-client" target='_blank' rel="noreferrer" className="text-slate-500 hover:text-white transition-colors"><Github size={18}/></a>
          <div className="flex items-center gap-2 text-xs text-slate-600 border border-white/5 px-3 py-1 rounded-full">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             Systems Operational
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const Card = ({ children, className = "" }) => (
  <div className={`relative overflow-hidden bg-[#0b1121] border border-[#1e293b] rounded-xl shadow-2xl p-5 ${className}`}>
    {children}
  </div>
);

// ==========================================
// MAIN APPLICATION
// ==========================================

export default function SpeedTestApp() {
  const [status, setStatus] = useState('idle'); 
  const [phase, setPhase] = useState(''); 
  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  const [liveSpeed, setLiveSpeed] = useState(0); 
  const [chartData, setChartData] = useState([]);
  
  const [results, setResults] = useState({
    rawDownload: [],
    rawUpload: [],
    unloadedLatency: 0,
    unloadedJitter: 0,
    downLoadedLatency: 0,
    downLoadedJitter: 0,
    upLoadedLatency: 0,
    upLoadedJitter: 0,
    packetLoss: 0,
    scores: null
  });

  const engineRef = useRef(null);
  const canvasRef = useRef(null);

  // --- TEST ENGINE ---
  const startTest = () => {
    if (engineRef.current) engineRef.current.restart();
    setStatus('running');
    setChartData([]);
    setResults({
        rawDownload: [], rawUpload: [],
        unloadedLatency: 0, unloadedJitter: 0,
        downLoadedLatency: 0, downLoadedJitter: 0,
        upLoadedLatency: 0, upLoadedJitter: 0,
        packetLoss: 0, scores: null
    });

    const engine = new SpeedTest({
      autoStart: true,
      measurements: [
          { type: 'latency', numPackets: 30 },
          { type: 'download', bytes: 1e5, count: 10 },
          { type: 'download', bytes: 1e6, count: 10 },
          { type: 'download', bytes: 1e7, count: 10 },
          { type: 'download', bytes: 2.5e7, count: 10 }, 
          { type: 'download', bytes: 1e8, count: 10 }, 
          { type: 'upload', bytes: 1e5, count: 10 },
          { type: 'upload', bytes: 1e6, count: 10 },
          { type: 'upload', bytes: 1e7, count: 10 }, 
          { type: 'upload', bytes: 2.5e7, count: 10 },
          { type: 'upload', bytes: 5e7, count: 10 },
      ],
    });

    engineRef.current = engine;

    engine.onResultsChange = ({ type }) => {
        if (type === 'latency') {
            setPhase('latency');
            setProgress(5); 
        }
        if (type === 'download') {
            setPhase('download');
            const pts = engine.results.getDownloadBandwidthPoints();
            if(pts.length) {
                const val = pts[pts.length - 1].bps / 1e6;
                setLiveSpeed(val);
                setChartData(p => [...p, { val, type: 'download' }].slice(-60));
                setProgress(10 + (pts.length / 50) * 45); 
            }
        }
        if (type === 'upload') {
            setPhase('upload');
            const pts = engine.results.getUploadBandwidthPoints();
            if(pts.length) {
                const val = pts[pts.length - 1].bps / 1e6;
                setLiveSpeed(val);
                setChartData(p => [...p, { val, type: 'upload' }].slice(-60));
                setProgress(55 + (pts.length / 50) * 45);
            }
        }
    };

    engine.onFinish = (final) => {
        setProgress(100);
        setStatus('completed');
        const rawPL = final.getPacketLoss();
        
        setResults({
            rawDownload: final.getDownloadBandwidthPoints(),
            rawUpload: final.getUploadBandwidthPoints(),
            unloadedLatency: final.getUnloadedLatency(),
            unloadedJitter: final.getUnloadedJitter(),
            downLoadedLatency: final.getDownLoadedLatency(),
            downLoadedJitter: final.getDownLoadedJitter(),
            upLoadedLatency: final.getUpLoadedLatency(),
            upLoadedJitter: final.getUpLoadedJitter(),
            packetLoss: (typeof rawPL === 'number' && !isNaN(rawPL)) ? rawPL : 0,
            scores: final.getScores()
        });
    };

    engine.play();
  };

  // --- CANVAS RENDERER ---
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || chartData.length === 0) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0, 0, w, h);

    const max = Math.max(...chartData.map(d => d.val)) * 1.2;
    const step = w / (chartData.length - 1);

    // Area
    ctx.beginPath();
    chartData.forEach((p, i) => {
        const x = i * step;
        const y = h - (p.val / max) * h;
        if (i===0) ctx.moveTo(x, h);
        ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    const color = chartData[chartData.length-1].type === 'upload' ? '168, 85, 247' : '6, 182, 212';
    grad.addColorStop(0, `rgba(${color}, 0.5)`);
    grad.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    chartData.forEach((p, i) => {
        const x = i * step;
        const y = h - (p.val / max) * h;
        if (i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = `rgb(${color})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [chartData]);

  // --- METRICS CALC ---
  const dl90 = useMemo(() => calculatePercentile(results.rawDownload, 90).toFixed(2), [results.rawDownload]);
  const ul90 = useMemo(() => calculatePercentile(results.rawUpload, 90).toFixed(2), [results.rawUpload]);

  // Group data for details table
  const getTableData = (data) => {
      const groups = {};
      data.forEach(p => {
          if (!groups[p.bytes]) groups[p.bytes] = { sum: 0, count: 0, bytes: p.bytes };
          groups[p.bytes].sum += p.bps;
          groups[p.bytes].count++;
      });
      return Object.values(groups).sort((a,b) => a.bytes - b.bytes);
  };
  
  const dlTable = useMemo(() => getTableData(results.rawDownload), [results.rawDownload]);
  const ulTable = useMemo(() => getTableData(results.rawUpload), [results.rawUpload]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">

            {/* --- LEFT COLUMN (Main Speed) --- */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* Hero Card */}
                <Card className="min-h-[320px] flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                            <span className="text-xs font-mono uppercase text-slate-400">
                                {status === 'idle' ? 'READY' : status === 'completed' ? 'COMPLETE' : `TESTING ${phase}`}
                            </span>
                        </div>
                        {status === 'running' && <div className="text-3xl font-mono text-white font-bold">{liveSpeed.toFixed(0)} <span className="text-sm text-slate-500">Mbps</span></div>}
                    </div>

                    {/* Chart Area */}
                    <div className="relative flex-grow w-full h-[200px] bg-[#0f172a] rounded-lg border border-white/5 overflow-hidden mb-6">
                        {status === 'idle' ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button onClick={startTest} className="group relative flex items-center gap-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all hover:scale-105">
                                    <Play className="fill-black" /> RUN DIAGNOSTIC
                                    <div className="absolute inset-0 rounded-full bg-cyan-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
                                </button>
                            </div>
                        ) : (
                            <canvas ref={canvasRef} width={800} height={200} className="w-full h-full" />
                        )}
                    </div>
                    
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ease-out ${phase === 'upload' ? 'bg-purple-500' : 'bg-cyan-500'}`} style={{ width: `${progress}%` }} />
                    </div>
                </Card>

                {/* 90th Percentile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-t-4 border-t-cyan-500 bg-gradient-to-b from-[#0b1121] to-[#0f172a]">
                        <div className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2 mb-2"><ArrowDown size={14}/> Download (90th %ile)</div>
                        <div className="text-5xl font-mono font-bold text-white mb-1">{status === 'idle' ? '--' : dl90}</div>
                        <div className="text-sm text-slate-500">Mbps</div>
                    </Card>
                    <Card className="border-t-4 border-t-purple-500 bg-gradient-to-b from-[#0b1121] to-[#0f172a]">
                        <div className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2 mb-2"><ArrowUp size={14}/> Upload (90th %ile)</div>
                        <div className="text-5xl font-mono font-bold text-white mb-1">{status === 'idle' ? '--' : ul90}</div>
                        <div className="text-sm text-slate-500">Mbps</div>
                    </Card>
                </div>

                {/* LATENCY MATRIX (RESTORED) */}
                <Card>
                    <h3 className="text-slate-200 font-bold text-sm flex items-center gap-2 mb-6">
                        <Layers size={16} className="text-amber-500"/> LATENCY MATRIX (Bufferbloat Analysis)
                    </h3>
                    <div className="grid grid-cols-3 gap-2 md:gap-6 divide-x divide-white/10">
                        <div className="px-2 text-center md:text-left">
                            <div className="text-[10px] md:text-xs text-slate-500 uppercase mb-2 font-bold">Unloaded (Idle)</div>
                            <div className="text-xl md:text-2xl text-white font-mono mb-1">{results.unloadedLatency.toFixed(0)} <span className="text-xs text-slate-500">ms</span></div>
                            <div className="text-[10px] text-slate-500">Jitter: {results.unloadedJitter.toFixed(1)}</div>
                        </div>
                        <div className="px-2 text-center md:text-left">
                            <div className="text-[10px] md:text-xs text-cyan-500 uppercase mb-2 font-bold">DL Loaded</div>
                            <div className={`text-xl md:text-2xl font-mono mb-1 ${results.downLoadedLatency > results.unloadedLatency + 30 ? 'text-amber-400' : 'text-white'}`}>
                                {results.downLoadedLatency.toFixed(0)} <span className="text-xs text-slate-500">ms</span>
                            </div>
                            <div className="text-[10px] text-slate-500">Jitter: {results.downLoadedJitter.toFixed(1)}</div>
                        </div>
                        <div className="px-2 text-center md:text-left">
                            <div className="text-[10px] md:text-xs text-purple-500 uppercase mb-2 font-bold">UL Loaded</div>
                             <div className={`text-xl md:text-2xl font-mono mb-1 ${results.upLoadedLatency > results.unloadedLatency + 30 ? 'text-amber-400' : 'text-white'}`}>
                                {results.upLoadedLatency.toFixed(0)} <span className="text-xs text-slate-500">ms</span>
                            </div>
                            <div className="text-[10px] text-slate-500">Jitter: {results.upLoadedJitter.toFixed(1)}</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* --- RIGHT COLUMN (Quality & Scores) --- */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* PACKET LOSS CARD */}
                <Card className="bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
                    <h3 className="text-slate-400 font-bold text-xs uppercase mb-4 flex items-center gap-2"><Activity size={14} /> Network Health</h3>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                        <div>
                            <div className="text-sm text-slate-400">Packet Loss</div>
                            <div className={`text-3xl font-mono font-bold ${results.packetLoss > 0.01 ? 'text-red-500' : 'text-emerald-400'}`}>
                                {isNaN(results.packetLoss) ? '0.0' : (results.packetLoss * 100).toFixed(1)}%
                            </div>
                        </div>
                        {results.packetLoss <= 0.01 ? <CheckCircle className="text-emerald-500" size={32} /> : <AlertTriangle className="text-red-500 animate-pulse" size={32} />}
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Connection Status</span>
                        <span className="text-white font-medium flex items-center gap-2"><Shield size={12} className="text-emerald-500"/> Encrypted</span>
                    </div>
                </Card>

                {/* CLASSIFICATION SCORES (RESTORED) */}
                <Card>
                    <h3 className="text-slate-400 font-bold text-xs uppercase mb-4 flex items-center gap-2"><Zap size={14} /> Performance Scores</h3>
                    <div className="space-y-3">
                        {results.scores ? ['gaming', 'streaming', 'rtc'].map(k => (
                            <div key={k} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                                <div className="flex items-center gap-3">
                                    {k === 'gaming' && <Gamepad2 size={16} className="text-slate-400"/>}
                                    {k === 'streaming' && <Tv size={16} className="text-slate-400"/>}
                                    {k === 'rtc' && <Video size={16} className="text-slate-400"/>}
                                    <div>
                                        <div className="capitalize text-sm font-bold text-slate-200">{k}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{results.scores[k].classificationName}</div>
                                    </div>
                                </div>
                                <div className={`text-xl font-bold ${getScoreColor(results.scores[k].points)}`}>
                                    {results.scores[k].points}
                                </div>
                            </div>
                        )) : (
                            <div className="py-8 text-center text-slate-600 text-sm italic">
                                Run test to view application scores
                            </div>
                        )}
                    </div>
                </Card>

                {/* META INFO */}
                <Card>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <div className="text-slate-500 uppercase mb-1">Server Location</div>
                            <div className="text-white font-medium">Auto-Detect (Edge)</div>
                        </div>
                        <div>
                            <div className="text-slate-500 uppercase mb-1">Server</div>
                            <div className="text-white font-mediumtransition-all cursor-pointer">CLOUDFLARE</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>

        {/* --- DETAILED METRICS TABLE --- */}
        <div className="max-w-7xl mx-auto">
            <button onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider mb-4">
                <Table size={16} /> Detailed Metrics {showDetails ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            
            {showDetails && (
                <Card className="animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-cyan-400 font-bold text-sm mb-4 flex items-center gap-2"><ArrowDown size={16}/> Download Measurements</h4>
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs text-slate-500 uppercase bg-white/5">
                                    <tr><th className="px-4 py-2">Size</th><th className="px-4 py-2 text-right">Speed (Avg)</th></tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {dlTable.map((r, i) => (
                                        <tr key={i}><td className="px-4 py-2 font-mono text-white">{formatBytes(r.bytes)}</td><td className="px-4 py-2 text-right font-mono text-cyan-400">{(r.sum/r.count/1e6).toFixed(2)} Mbps</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h4 className="text-purple-400 font-bold text-sm mb-4 flex items-center gap-2"><ArrowUp size={16}/> Upload Measurements</h4>
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs text-slate-500 uppercase bg-white/5">
                                    <tr><th className="px-4 py-2">Size</th><th className="px-4 py-2 text-right">Speed (Avg)</th></tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {ulTable.map((r, i) => (
                                        <tr key={i}><td className="px-4 py-2 font-mono text-white">{formatBytes(r.bytes)}</td><td className="px-4 py-2 text-right font-mono text-purple-400">{(r.sum/r.count/1e6).toFixed(2)} Mbps</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}