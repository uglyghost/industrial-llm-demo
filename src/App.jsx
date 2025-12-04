import React, { useState, useEffect, useRef } from 'react';
import { Database, Cpu, Activity, GitMerge, Layers, Zap, Server, Network, Search, FileText, ArrowRight, Share2, Box, Info } from 'lucide-react';

// ==========================================
// 核心工具：KaTeX 动态加载与渲染组件
// ==========================================

const useKaTeX = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.katex) {
      setIsLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {};
  }, []);

  return isLoaded;
};

// Latex 组件：渲染行内公式
const Latex = ({ children, className = "" }) => {
  const containerRef = useRef(null);
  const isKaTeXLoaded = useKaTeX();

  useEffect(() => {
    if (isKaTeXLoaded && window.katex && containerRef.current) {
      try {
        // 强制转为字符串，防止 JSX 传入对象
        const content = String(children);
        window.katex.render(content, containerRef.current, {
          throwOnError: false,
          displayMode: false, // 行内模式
          output: 'html',
          trust: true,
        });
      } catch (e) {
        console.error("Katex render error:", e);
        containerRef.current.innerText = String(children);
      }
    }
  }, [children, isKaTeXLoaded]);

  if (!isKaTeXLoaded) {
    return <span className="text-slate-500 text-xs font-mono">{children}</span>;
  }

  return <span ref={containerRef} className={`inline-block mx-1 ${className}`} />;
};

// BlockMath 组件：渲染块级公式
const BlockMath = ({ tex, className = "" }) => {
  const containerRef = useRef(null);
  const isKaTeXLoaded = useKaTeX();

  useEffect(() => {
    if (isKaTeXLoaded && window.katex && containerRef.current) {
      try {
        window.katex.render(tex, containerRef.current, {
          throwOnError: false,
          displayMode: true, // 块级模式
          output: 'html',
          trust: true,
        });
      } catch (e) {
        console.error("Katex render error:", e);
        containerRef.current.innerText = tex;
      }
    }
  }, [tex, isKaTeXLoaded]);

  if (!isKaTeXLoaded) {
    return <div className="text-slate-500 text-xs font-mono p-4 text-center">{tex}</div>;
  }

  return <div ref={containerRef} className={`my-4 overflow-x-auto ${className}`} />;
};

// ==========================================
// 基础 UI 组件
// ==========================================

const Section = ({ title, icon: Icon, children, id }) => (
  <section id={id} className="mb-24 scroll-mt-28">
    <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 border-b border-slate-700/80 pb-4 md:pb-6">
      <div className="p-2 md:p-3 bg-blue-500/10 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
        <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
      </div>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

const Card = ({ title, children, className = "" }) => (
  <div className={`bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-5 md:p-6 hover:border-blue-500/40 transition-all duration-300 ${className}`}>
    {title && <h3 className="text-base md:text-lg font-bold text-blue-300 mb-3 md:mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3">{title}</h3>}
    <div className="text-slate-300 space-y-3 leading-relaxed text-xs md:text-sm">
      {children}
    </div>
  </div>
);

// ==========================================
// 1. RAG 相关组件
// ==========================================

const HybridRAGFlow = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { id: 0, label: "用户Query", icon: Search },
    { id: 1, label: "双路分流", icon: Network },
    { id: 2, label: "混合检索", icon: Database },
    { id: 3, label: "融合重排", icon: GitMerge },
    { id: 4, label: "生成回答", icon: FileText }
  ];

  useEffect(() => {
    const timer = setInterval(() => setStep(s => (s + 1) % 5), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-[420px] md:h-[500px]">
      <div className="flex-1 relative p-4 md:p-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div className="w-full max-w-2xl relative h-48 md:h-64">
           {/* SVG 动画保持不变 */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
             <path d="M 50% 10 Q 20% 50, 20% 100" fill="none" stroke={step >= 1 ? "#60a5fa" : "#1e293b"} strokeWidth="3" className="transition-all duration-1000" />
             <path d="M 50% 10 Q 80% 50, 80% 100" fill="none" stroke={step >= 1 ? "#34d399" : "#1e293b"} strokeWidth="3" className="transition-all duration-1000" />
             <path d="M 20% 100 Q 50% 150, 50% 200" fill="none" stroke={step >= 3 ? "#a855f7" : "#1e293b"} strokeWidth="3" className="transition-all duration-1000" />
             <path d="M 80% 100 Q 50% 150, 50% 200" fill="none" stroke={step >= 3 ? "#a855f7" : "#1e293b"} strokeWidth="3" className="transition-all duration-1000" />
           </svg>

           {/* 节点元素 */}
           <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 border-2 border-blue-500 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center z-10 transition-all ${step === 0 ? 'scale-110 shadow-[0_0_20px_#3b82f6]' : 'scale-100'}`}>
             <Search className="text-blue-400 w-5 h-5 md:w-8 md:h-8" />
           </div>
           <div className={`absolute top-1/2 left-[15%] md:left-[20%] -translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-blue-400 rounded p-2 md:p-3 z-10 transition-all ${step === 2 ? 'opacity-100 scale-110 shadow-[0_0_15px_#60a5fa]' : 'opacity-80 scale-100'}`}>
             <div className="text-[10px] md:text-xs font-mono text-blue-300 whitespace-nowrap">BM25 检索</div>
             <div className="h-1 bg-blue-900 mt-2 rounded overflow-hidden"><div className="h-full bg-blue-400 w-[70%]"></div></div>
           </div>
           <div className={`absolute top-1/2 right-[15%] md:right-[20%] translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-emerald-400 rounded p-2 md:p-3 z-10 transition-all ${step === 2 ? 'opacity-100 scale-110 shadow-[0_0_15px_#34d399]' : 'opacity-80 scale-100'}`}>
             <div className="text-[10px] md:text-xs font-mono text-emerald-300 whitespace-nowrap">Vector 检索</div>
             <div className="h-1 bg-emerald-900 mt-2 rounded overflow-hidden"><div className="h-full bg-emerald-400 w-[85%]"></div></div>
           </div>
           <div className={`absolute bottom-[-40px] left-1/2 -translate-x-1/2 bg-slate-800 border border-purple-500 rounded-lg px-4 md:px-6 py-2 md:py-3 z-10 flex items-center gap-2 md:gap-3 transition-all ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
             <GitMerge className="text-purple-400 w-4 h-4 md:w-5 md:h-5" />
             <div className="text-xs md:text-sm text-purple-200 whitespace-nowrap">Rerank 融合</div>
           </div>
        </div>
      </div>

      <div className="bg-slate-950 p-4 md:p-6 border-t border-slate-800">
        <div className="relative flex justify-between items-center max-w-3xl mx-auto">
          <div className="absolute top-3 md:top-4 left-0 w-full h-0.5 bg-slate-800 z-0"></div>
          <div className="absolute top-3 md:top-4 left-0 h-0.5 bg-blue-500 z-0 transition-all duration-500 ease-linear" style={{ width: `${(step / (steps.length - 1)) * 100}%` }}></div>
          {steps.map((s, i) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 md:gap-3">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${i <= step ? 'bg-slate-900 border-blue-500 text-blue-400 scale-110' : 'bg-slate-900 border-slate-700 text-slate-700'}`}>
                <s.icon className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <span className={`text-[10px] md:text-xs font-medium transition-colors ${i === step ? 'text-blue-400' : 'text-slate-500'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GraphRAGVisualization = () => {
  const [step, setStep] = useState(1);

  const nodes = [
    { id: 1, x: 20, y: 20, group: 'A' }, { id: 2, x: 30, y: 30, group: 'A' },
    { id: 3, x: 15, y: 35, group: 'A' }, { id: 4, x: 35, y: 15, group: 'A' },
    { id: 5, x: 25, y: 45, group: 'A' }, { id: 6, x: 40, y: 40, group: 'A' },
    { id: 7, x: 70, y: 20, group: 'B' }, { id: 8, x: 80, y: 30, group: 'B' },
    { id: 9, x: 65, y: 35, group: 'B' }, { id: 10, x: 85, y: 15, group: 'B' },
    { id: 11, x: 75, y: 45, group: 'B' }, { id: 12, x: 60, y: 15, group: 'B' },
    { id: 13, x: 45, y: 75, group: 'C' }, { id: 14, x: 55, y: 85, group: 'C' },
    { id: 15, x: 35, y: 80, group: 'C' }, { id: 16, x: 65, y: 80, group: 'C' },
    { id: 17, x: 50, y: 65, group: 'C' }, { id: 18, x: 40, y: 90, group: 'C' }
  ];

  const edges = [
    [1,2], [1,3], [2,4], [2,5], [3,5], [4,6], [5,6],
    [7,8], [7,9], [8,10], [9,11], [10,11], [7,12],
    [13,14], [13,15], [14,16], [15,17], [16,17], [13,18],
    [6, 7], [6, 9], [11, 17], [9, 13]
  ];

  const getGroupColor = (group) => {
    if (step === 0) return "#475569";
    switch(group) {
      case 'A': return "#ef4444";
      case 'B': return "#3b82f6";
      case 'C': return "#10b981";
      default: return "#475569";
    }
  };

  return (
    <div className="h-[500px] md:h-[600px] bg-slate-900 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
      <div className="bg-slate-950 p-3 md:p-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-xs md:text-sm font-bold text-slate-300 flex items-center gap-2">
          <Share2 size={16} className="text-orange-500" /> GraphRAG 处理流程
        </h3>
        <div className="flex gap-1 md:gap-2">
          {['图谱构建', 'Leiden 聚类', '社区摘要', '全局检索'].map((label, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-medium transition-all ${step === idx ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-950">
        <svg className="w-full h-full p-4 md:p-8" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {edges.map(([src, trg], i) => {
            const sNode = nodes.find(n => n.id === src);
            const tNode = nodes.find(n => n.id === trg);
            return <line key={i} x1={sNode.x} y1={sNode.y} x2={tNode.x} y2={tNode.y} stroke={step >= 1 ? "#334155" : "#1e293b"} strokeWidth="0.5" className="transition-all duration-1000" />;
          })}
          {nodes.map((node) => (
            <g key={node.id} className="transition-all duration-1000">
              <circle cx={node.x} cy={node.y} r={step >= 2 ? 3 : 2} fill={getGroupColor(node.group)} className={`transition-all duration-1000 ${step === 3 && node.group === 'B' ? 'opacity-100 stroke-2 stroke-white' : 'opacity-80'}`} />
            </g>
          ))}
          {/* 社区轮廓与摘要标签... (省略重复SVG代码，逻辑同上) */}
          {step >= 1 && (
            <>
              <path d="M 10 10 Q 45 10 45 45 Q 10 50 10 10" fill="rgba(239, 68, 68, 0.05)" stroke="rgba(239, 68, 68, 0.2)" strokeDasharray="1" className="transition-all duration-1000" />
              <path d="M 60 10 Q 95 10 90 50 Q 55 50 60 10" fill="rgba(59, 130, 246, 0.05)" stroke="rgba(59, 130, 246, 0.2)" strokeDasharray="1" className="transition-all duration-1000" />
              <path d="M 30 70 Q 70 60 70 95 Q 30 95 30 70" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(16, 185, 129, 0.2)" strokeDasharray="1" className="transition-all duration-1000" />
            </>
          )}
          {step >= 2 && (
            <>
              <foreignObject x="15" y="20" width="30" height="20">
                <div className="bg-red-900/90 border border-red-500 text-[3px] leading-tight text-red-100 p-1 rounded backdrop-blur shadow-lg"><span className="font-bold">Community A</span><br/>故障聚合...</div>
              </foreignObject>
              <foreignObject x="70" y="25" width="30" height="20">
                <div className={`bg-blue-900/90 border border-blue-500 text-[3px] leading-tight text-blue-100 p-1 rounded backdrop-blur shadow-lg transition-all duration-500 ${step === 3 ? 'scale-110 ring-1 ring-blue-400' : ''}`}><span className="font-bold">Community B</span><br/>核心部件...</div>
              </foreignObject>
              <foreignObject x="45" y="80" width="30" height="20">
                <div className="bg-green-900/90 border border-green-500 text-[3px] leading-tight text-green-100 p-1 rounded backdrop-blur shadow-lg"><span className="font-bold">Community C</span><br/>修复方案...</div>
              </foreignObject>
            </>
          )}
        </svg>
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-slate-700 p-3 md:p-4 rounded-lg backdrop-blur">
          <h4 className="text-xs md:text-sm font-bold text-orange-400 mb-1">
            {step === 0 && "Step 1: 原始图谱构建"}
            {step === 1 && "Step 2: Leiden 算法聚类"}
            {step === 2 && "Step 3: 社区摘要生成 (Community Summaries)"}
            {step === 3 && "Step 4: 全局问题检索 (Global Search)"}
          </h4>
          <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">
            {step === 0 && "从非结构化文档中抽取实体与关系，构建初始网络。"}
            {step === 1 && "应用 Leiden 算法最大化模块度，将紧密关联的节点划分为社区，保证内部连通性。"}
            {step === 2 && "LLM 为每个社区生成摘要，将微观节点压缩为宏观语义。"}
            {step === 3 && "当用户询问跨域问题时，直接检索社区摘要，效率提升百倍。"}
          </p>
        </div>
      </div>
    </div>
  );
};

const LeidenExplanation = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <Card title="Leiden 算法核心原理">
        <p className="mb-4">Leiden 算法解决了 Louvain 可能产生<strong>断连社区</strong>的问题。</p>
        <div className="space-y-3">
          <div className="flex gap-3 bg-slate-900/50 p-3 rounded border border-slate-700">
            <div className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
            <div><div className="text-xs font-bold text-blue-300">本地移动</div><div className="text-[10px] text-slate-400">遍历节点优化模块度。</div></div>
          </div>
          <div className="flex gap-3 bg-slate-900/50 p-3 rounded border border-slate-700">
            <div className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
            <div><div className="text-xs font-bold text-orange-300">社区精炼 (核心)</div><div className="text-[10px] text-slate-400">将大社区分裂为连通子社区。</div></div>
          </div>
          <div className="flex gap-3 bg-slate-900/50 p-3 rounded border border-slate-700">
            <div className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
            <div><div className="text-xs font-bold text-green-300">社区聚合</div><div className="text-[10px] text-slate-400">合并为超节点，迭代下一层。</div></div>
          </div>
        </div>
      </Card>
      <Card title="数学模型：模块度 (Modularity)">
        <div className="mb-4 text-slate-300 text-sm flex items-center">
          <span className="mr-2">目标函数：最大化模块度</span> <Latex>{`Q`}</Latex>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col items-center">
          <BlockMath tex={`Q = \\frac{1}{2m} \\sum_{i,j} \\left( A_{ij} - \\frac{k_i k_j}{2m} \\right) \\delta(c_i, c_j)`} />
          <div className="mt-4 text-[10px] md:text-xs text-slate-500 w-full space-y-2">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span><Latex>{`A_{ij}`}</Latex></span> <span>节点权重</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span><Latex>{`k_i`}</Latex></span> <span>节点度</span>
            </div>
            <div className="flex justify-between">
              <span><Latex>{`\\delta(c_i, c_j)`}</Latex></span> <span>社区指示函数</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ==========================================
// 2. PD 解耦模块
// ==========================================

const PDSeparationDemo = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => (t + 1) % 100), 50);
    return () => clearInterval(timer);
  }, []);

  const isMixedPrefill = tick < 40;
  const isMixedDecode = tick >= 40;
  const isPDPrefill = tick < 35;
  const isPDTransfer = tick >= 35 && tick < 50;
  const isPDDecode = tick >= 50;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 上半部分：传统混合部署 */}
      <div className="bg-slate-900 rounded-xl border border-red-500/30 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-red-900/50 text-red-200 text-[10px] md:text-xs font-bold px-3 py-1 rounded-br-lg z-10 border-b border-r border-red-500/30">
          方案 A: 传统混合部署 (无迁移，资源争抢)
        </div>
        <div className="flex items-center justify-around mt-6 gap-4 md:gap-8">
          <div className="flex-1 bg-slate-800/80 border border-slate-600 rounded-lg p-3 md:p-4 flex flex-col items-center gap-3 relative">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-xs md:text-sm"><Server size={14} /> Node 01</div>
            <div className="w-full h-12 md:h-16 bg-slate-950 rounded border border-slate-700 relative overflow-hidden flex flex-col">
               {isMixedPrefill ? (
                 <div className="flex-1 bg-red-600/80 flex items-center justify-center text-[10px] md:text-xs text-white animate-pulse">Prefill (计算阻塞)</div>
               ) : (
                 <div className="flex-1 bg-blue-600/80 flex items-center justify-center text-[10px] md:text-xs text-white">Decoding</div>
               )}
            </div>
            <div className="text-[10px] text-slate-500 text-center">显存碎片化</div>
          </div>
          <div className="h-20 w-px bg-slate-700 border-l border-dashed border-slate-500/50"></div>
          <div className="flex-1 bg-slate-800/80 border border-slate-600 rounded-lg p-3 md:p-4 flex flex-col items-center gap-3 relative">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-xs md:text-sm"><Server size={14} /> Node 02</div>
            <div className="w-full h-12 md:h-16 bg-slate-950 rounded border border-slate-700 relative overflow-hidden flex flex-col">
               {isMixedPrefill ? (
                 <div className="flex-1 bg-red-600/80 flex items-center justify-center text-[10px] md:text-xs text-white animate-pulse delay-75">Prefill (计算阻塞)</div>
               ) : (
                 <div className="flex-1 bg-blue-600/80 flex items-center justify-center text-[10px] md:text-xs text-white delay-75">Decoding</div>
               )}
            </div>
            <div className="text-[10px] text-slate-500 text-center">显存碎片化</div>
          </div>
        </div>
      </div>

      {/* 向下箭头 */}
      <div className="flex justify-center -my-3 z-10">
        <div className="bg-slate-800 rounded-full p-1 border border-slate-600"><ArrowRight className="rotate-90 text-slate-400 w-5 h-5" /></div>
      </div>

      {/* 下半部分：PD 解耦部署 */}
      <div className="bg-slate-900 rounded-xl border border-green-500/30 p-6 relative overflow-hidden flex-1 flex flex-col">
        <div className="absolute top-0 left-0 bg-green-900/50 text-green-200 text-[10px] md:text-xs font-bold px-3 py-1 rounded-br-lg z-10 border-b border-r border-green-500/30">
          方案 B: PD 解耦部署 (KV Cache 迁移，流水线并行)
        </div>
        <div className="flex items-center justify-between mt-8 gap-4 relative flex-1">
          <div className={`w-1/3 p-3 md:p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-3 relative z-10 ${isPDPrefill ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-slate-800 border-slate-700'}`}>
            <div className="absolute -top-3 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">Prefill 专用</div>
            <div className="flex items-center gap-2 text-purple-200 font-bold text-xs md:text-sm"><Zap size={14} /> Node A</div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full bg-purple-500 transition-all duration-100 ease-linear ${isPDPrefill ? 'w-full' : 'w-0'}`}></div>
            </div>
            <span className="text-[10px] text-purple-300 whitespace-nowrap">{isPDPrefill ? "计算中..." : "等待..."}</span>
          </div>

          <div className="flex-1 h-3 bg-slate-800 rounded-full relative overflow-hidden mx-2 border border-slate-700">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(255,255,255,0.05)_50%)] bg-[size:20px_100%]"></div>
            {isPDTransfer && (
              <div
                className="absolute top-0 h-full bg-yellow-400 shadow-[0_0_15px_#facc15] z-20 flex items-center justify-center rounded-full"
                style={{ width: '40px', left: `${((tick - 35) / 15) * 100}%`, transition: 'left 0.05s linear' }}
              >
                <span className="text-[8px] font-bold text-black scale-75">KV</span>
              </div>
            )}
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 text-[10px] text-yellow-500 font-mono flex items-center gap-1 whitespace-nowrap"><Network size={10} /> RDMA 迁移</div>
          </div>

          <div className={`w-1/3 p-3 md:p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-3 relative z-10 ${isPDDecode ? 'bg-green-900/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-slate-800 border-slate-700'}`}>
            <div className="absolute -top-3 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">Decode 专用</div>
            <div className="flex items-center gap-2 text-green-200 font-bold text-xs md:text-sm"><Activity size={14} /> Node B</div>
            <div className="flex gap-1 h-4 items-end">
               <div className={`w-2 bg-green-500 rounded-sm ${isPDDecode ? 'h-full animate-bounce' : 'h-1'}`}></div>
               <div className={`w-2 bg-green-500 rounded-sm ${isPDDecode ? 'h-3/4 animate-bounce delay-75' : 'h-1'}`}></div>
               <div className={`w-2 bg-green-500 rounded-sm ${isPDDecode ? 'h-full animate-bounce delay-150' : 'h-1'}`}></div>
            </div>
            <span className="text-[10px] text-green-300 whitespace-nowrap">{isPDDecode ? "生成中..." : "等待KV"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. 微调 & 算法组件 (LoRA & CV)
// ==========================================

const LoRAVisualization = () => {
  return (
    <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex items-center justify-center p-4 md:p-8 gap-4 md:gap-8">
      <div className="relative flex flex-col items-center">
        <div className="w-24 h-32 md:w-32 md:h-40 bg-blue-600/10 border-2 border-blue-500 rounded-lg flex items-center justify-center relative">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 gap-1 p-1 opacity-20">
            {Array.from({length: 20}).map((_, i) => <div key={i} className="bg-blue-400 rounded-sm"></div>)}
          </div>
          <span className="text-xl md:text-2xl font-bold text-blue-400 z-10"><Latex>{`W_0`}</Latex></span>
          <div className="absolute -top-3 bg-slate-900 px-2 text-[10px] md:text-xs text-blue-300 border border-blue-500 rounded whitespace-nowrap">Frozen (冻结)</div>
        </div>
        <span className="text-[10px] md:text-xs text-slate-500 mt-2">d × k 参数矩阵</span>
      </div>
      <div className="text-2xl md:text-3xl text-slate-400 font-light">+</div>
      <div className="relative flex flex-col items-center">
        <div className="flex items-center gap-1">
          <div className="w-8 h-32 md:w-10 md:h-40 bg-orange-500/10 border border-orange-500 rounded flex items-center justify-center relative group">
             <span className="text-base md:text-lg font-bold text-orange-400"><Latex>{`B`}</Latex></span>
             <div className="absolute -bottom-6 w-max text-[10px] text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">d × r</div>
          </div>
          <span className="text-slate-500">×</span>
          <div className="w-24 h-6 md:w-32 md:h-8 bg-orange-500/10 border border-orange-500 rounded flex items-center justify-center relative group">
             <span className="text-base md:text-lg font-bold text-orange-400"><Latex>{`A`}</Latex></span>
             <div className="absolute -bottom-6 w-max text-[10px] text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">r × k</div>
          </div>
        </div>
        <div className="mt-4 text-[10px] md:text-xs text-orange-300 bg-orange-900/30 px-3 py-1 rounded-full border border-orange-500/30">Rank <Latex>{`r \\ll \\min(d, k)`}</Latex></div>
        <span className="text-[10px] md:text-xs text-slate-500 mt-2">Trainable</span>
      </div>
    </div>
  );
};

const ControlVariatesFixedChart = () => {
  const [useCV, setUseCV] = useState(false);
  const pathData = useCV
    ? "M 10 90 Q 30 70, 50 50 T 90 20"
    : "M 10 90 L 20 85 L 25 95 L 40 70 L 45 80 L 60 50 L 70 60 L 90 20";

  return (
    <div className="h-80 bg-slate-900 rounded-xl border border-slate-700 p-6 flex flex-col">
       <div className="flex justify-between items-center mb-4">
         <h4 className="text-sm font-bold text-slate-300">梯度下降收敛对比</h4>
         <div className="flex gap-2">
           <button onClick={() => setUseCV(false)} className={`px-2 py-1 text-xs rounded border ${!useCV ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-slate-600 text-slate-500'}`}>Standard SGD</button>
           <button onClick={() => setUseCV(true)} className={`px-2 py-1 text-xs rounded border ${useCV ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-slate-600 text-slate-500'}`}>Control Variates</button>
         </div>
       </div>
       <div className="flex-1 w-full relative border-l border-b border-slate-600 box-border">
         <svg className="w-full h-full p-4 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 10 90 Q 30 70, 50 50 T 90 20" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="5" />
            <path d={pathData} fill="none" stroke={useCV ? "#3b82f6" : "#ef4444"} strokeWidth="2" className="transition-all duration-500 ease-in-out" />
            <circle cx="90" cy="20" r="3" fill="#10b981" />
         </svg>
         <div className="absolute bottom-2 right-2 text-xs text-emerald-500 font-bold">Optimal Loss</div>
       </div>
    </div>
  );
};

// ==========================================
// 主应用 App
// ==========================================

const App = () => {
  const [activeTab, setActiveTab] = useState('rag');

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveTab(id);
  };

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">

      {/* 侧边导航 (Desktop) */}
      <nav className="fixed left-0 top-0 h-full w-24 hidden lg:flex flex-col items-center py-8 bg-slate-900/80 border-r border-slate-800 z-50 backdrop-blur-md">
        <div className="mb-12 p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
          <Layers className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col gap-10 w-full px-2">
          {[
            { id: 'rag', icon: Database, label: "RAG" },
            { id: 'pd', icon: Zap, label: "推理加速" },
            { id: 'lora', icon: GitMerge, label: "LoRA" },
            { id: 'cv', icon: Activity, label: "梯度优化" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative group w-full flex flex-col items-center gap-2 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-blue-500/10 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
            >
              <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'text-blue-400' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>}
            </button>
          ))}
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="pl-0 lg:pl-28 pr-6 py-16 max-w-[1600px] mx-auto">

        <header className="mb-24 px-4 lg:px-0 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-xs font-bold mb-6">
            <Box size={14} /> 大模型相关核心技术
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-6 leading-tight">
            大模型原理深度解析与可视化
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed lg:mx-0 mx-auto">
            一站式交互展示：从 <span className="text-blue-400">RAG检索一致性</span> 到 <span className="text-green-400">PD推理加速</span>，再到 <span className="text-purple-400">LoRA微调</span> 与 <span className="text-orange-400">抗噪训练</span>。
          </p>
        </header>

        {/* 1. RAG 章节 */}
        <Section title="RAG 检索增强：混合检索与图谱融合" icon={Database} id="rag">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-16">
            <div className="xl:col-span-5 space-y-6">
              <Card title="混合检索 (Hybrid Retrieval)">
                <p>BM25 擅长精确匹配专有名词（如“错误码 E-01”），向量检索擅长语义泛化（如“启动故障”）。两者结合解决工业场景的语义鸿沟。</p>
                <div className="bg-slate-900/50 p-4 rounded border border-slate-800 mt-4">
                  <div className="text-xs text-slate-500 mb-1">BM25 关键词评分:</div>
                  <BlockMath tex={`\\text{score}(D,Q) = \\sum \\text{IDF}(q_i) \\cdot \\frac{f(q_i, D) \\cdot (k+1)}{f(q_i, D) + k \\cdot (1-b+b \\cdot \\frac{|D|}{\\text{avgdl}})}`} />
                </div>
              </Card>
            </div>
            <div className="xl:col-span-7 h-full">
              <HybridRAGFlow />
            </div>
          </div>

          <div className="pt-12 border-t border-slate-800">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><Share2 className="text-orange-500" /> GraphRAG: 结构化知识发现</h3>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-7 h-full">
                <GraphRAGVisualization />
              </div>
              <div className="xl:col-span-5 space-y-6">
                <Card title="Graph + GNN 技术原理">
                   <p className="text-sm">在故障排查等强关联场景，图神经网络 (GNN) 通过消息传递机制聚合邻居信息，能够发现向量检索无法捕捉的拓扑依赖。</p>
                   <div className="bg-slate-900/50 p-4 rounded border border-slate-800 mt-4">
                     <div className="text-xs text-slate-500 mb-1">GNN 消息传递:</div>
                     <BlockMath tex={`h_v^{(l+1)} = \\sigma(W \\cdot \\text{AGG}(\\{h_u^{(l)}, \\forall u \\in \\mathcal{N}(v)\\}))`} />
                   </div>
                </Card>
              </div>
            </div>
            <LeidenExplanation />
          </div>
        </Section>

        {/* 2. PD 解耦章节 */}
        <Section title="推理加速：PD 解耦与 MLA 压缩" icon={Zap} id="pd">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-5 space-y-6">
               <Card title="技术背景：Prefill 与 Decode 的冲突">
                 <p className="mb-4 text-sm leading-relaxed">
                   大模型推理分为两个截然不同的阶段：
                   <br/>1. <strong className="text-purple-400">Prefill (预填充)</strong>: 算力密集型，计算量大。
                   <br/>2. <strong className="text-green-400">Decode (解码)</strong>: 访存密集型，受限于显存带宽。
                 </p>
                 <p className="text-sm leading-relaxed">
                   在传统<strong>混合部署</strong>（右图上部）中，这两种任务混杂在同一 GPU 上，Prefill 的突发计算会“卡住”正在进行的 Decode 任务。
                 </p>
               </Card>

               <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                 <h4 className="text-sm font-bold text-green-400 mb-3">关键技术：MLA 压缩</h4>
                 <p className="text-xs text-slate-400 mb-4">
                   利用类似 LoRA 的低秩矩阵投影思想，MLA 对 KV Cache 进行极致压缩，大幅降低节点间传输带宽需求。
                 </p>
                 <BlockMath tex={`C_{KV} = W_{Down} \\cdot h_{input}`} />
                 <p className="text-[10px] text-slate-500 mt-2 text-center">
                   通过降维矩阵 <Latex>{`W_{Down}`}</Latex> 将高维 KV 投影到低维潜空间
                 </p>
               </div>
            </div>
            <div className="xl:col-span-7 h-full">
              <PDSeparationDemo />
            </div>
          </div>
        </Section>

        {/* 3. 微调 & 优化 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <Section title="LoRA 微调策略" icon={GitMerge} id="lora">
             <div className="space-y-6">
               <Card title="LoRA 低秩自适应">
                 <p className="text-sm text-slate-400">
                   冻结预训练权重 <Latex>{`W_0`}</Latex>，仅训练旁路低秩矩阵 <Latex>{`A`}</Latex> 和 <Latex>{`B`}</Latex>。大幅降低显存占用。
                 </p>
                 <div className="mt-4">
                   <BlockMath tex={`W' = W_0 + \\Delta W = W_0 + B \\cdot A`} />
                 </div>
               </Card>
               <LoRAVisualization />
             </div>
          </Section>

          <Section title="Control Variates 梯度优化" icon={Activity} id="cv">
             <div className="space-y-6">
               <Card title="抗噪训练原理">
                 <p className="text-sm text-slate-400">
                   针对工业数据噪声大的问题，引入控制变量 <Latex>{`z`}</Latex> 修正梯度方向，降低方差 <Latex>{`\\text{Var}(g)`}</Latex>，实现稳定收敛。
                 </p>
                 <div className="mt-4">
                   <BlockMath tex={`\\hat{g}_{cv} = \\hat{g} - c(z - \\mathbb{E}[z])`} />
                 </div>
               </Card>
               <ControlVariatesFixedChart />
             </div>
          </Section>
        </div>

      </main>
    </div>
  );
};

export default App;