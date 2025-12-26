import React, { useState, useEffect } from 'react';
import { Settings, ZoomIn, ZoomOut, RefreshCw, X } from 'lucide-react';

const GraphView = () => {
    // UI States
    const [graphName, setGraphName] = useState('KnowlearnGraph');
    const [startNode, setStartNode] = useState('ObjectNodes');
    const [startValue, setStartValue] = useState('ObjectNodes/((CH2CH2O)8_32...');
    const [layout, setLayout] = useState('forceAtlas2');
    const [depth, setDepth] = useState(3);
    const [limit, setLimit] = useState(250);
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock Graph Data
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        generateMockGraph();
    }, []);

    const generateMockGraph = () => {
        const newNodes = [];
        const newEdges = [];
        const centerNode = { id: 0, x: 400, y: 300, label: '시스템', type: 'root' };
        newNodes.push(centerNode);

        // Generate clusters
        const clusters = 3;
        for (let c = 0; c < clusters; c++) {
            const clusterCenter = {
                id: `c${c}`,
                x: 400 + Math.cos(c * 2 * Math.PI / clusters) * 200,
                y: 300 + Math.sin(c * 2 * Math.PI / clusters) * 200,
                label: `Cluster ${c}`,
                type: 'cluster'
            };
            newNodes.push(clusterCenter);
            newEdges.push({ source: centerNode.id, target: clusterCenter.id });

            // Leaves
            const leaves = 10 + Math.floor(Math.random() * 10);
            for (let i = 0; i < leaves; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const dist = 50 + Math.random() * 50;
                newNodes.push({
                    id: `c${c}-l${i}`,
                    x: clusterCenter.x + Math.cos(angle) * dist,
                    y: clusterCenter.y + Math.sin(angle) * dist,
                    label: `Item ${i}`,
                    type: 'leaf'
                });
                newEdges.push({ source: clusterCenter.id, target: `c${c}-l${i}` });
            }
        }
        setNodes(newNodes);
        setEdges(newEdges);
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            generateMockGraph();
            setIsGenerating(false);
        }, 800);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{ background: 'white', padding: '1rem 1.5rem', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Graph View - 화장품</h2>
                <button className="btn" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #d0d0d0', color: '#666' }}>닫기</button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#f8f9fa' }}>
                {/* Left: Graph Area */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    {/* SVG Graph Visualizer */}
                    <svg width="100%" height="100%" style={{ background: 'white' }}>
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#ccc" />
                            </marker>
                        </defs>
                        {edges.map((e, i) => {
                            const source = nodes.find(n => n.id === e.source);
                            const target = nodes.find(n => n.id === e.target);
                            if (!source || !target) return null;
                            return (
                                <line
                                    key={i}
                                    x1={source.x} y1={source.y}
                                    x2={target.x} y2={target.y}
                                    stroke="#e0e0e0"
                                    strokeWidth="1.5"
                                />
                            );
                        })}
                        {nodes.map((n, i) => (
                            <g key={i} transform={`translate(${n.x},${n.y})`}>
                                <circle
                                    r={n.type === 'root' ? 12 : n.type === 'cluster' ? 8 : 5}
                                    fill={n.type === 'root' ? 'var(--accent-primary)' : '#4ade80'}
                                    stroke="white" strokeWidth="2"
                                    style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                                />
                                {n.type !== 'leaf' && (
                                    <text y={20} textAnchor="middle" fontSize="10" fill="#666" style={{ pointerEvents: 'none' }}>{n.label}</text>
                                )}
                            </g>
                        ))}
                    </svg>

                    {/* Info Box */}
                    <div style={{
                        position: 'absolute', top: '1rem', left: '1rem',
                        background: 'var(--accent-success)', color: 'white',
                        padding: '1rem', borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        maxWidth: '350px'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4081', border: '2px solid white' }}></div>
                            현재 시작 노드
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: '1.4' }}>
                            ID: {startValue}<br />
                            라벨: 폴리에틸렌 글리콜 사슬 (8개 단위)
                        </div>
                    </div>

                    {/* Controls Overlay */}
                    <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="btn-icon" style={{ background: 'white', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px' }}><ZoomIn size={18} /></button>
                        <button className="btn-icon" style={{ background: 'white', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px' }}><ZoomOut size={18} /></button>
                    </div>
                </div>

                {/* Right: Settings Panel */}
                <div style={{ width: '300px', background: 'white', borderLeft: '1px solid #e0e0e0', padding: '1.5rem', overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#333' }}>Graph Settings</h3>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Graph name</label>
                        <select
                            value={graphName} onChange={e => setGraphName(e.target.value)}
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                        >
                            <option value="KnowlearnGraph">KnowlearnGraph</option>
                            <option value="ProjectGraph">ProjectGraph_V2</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Start node</label>
                        <select
                            value={startNode} onChange={e => setStartNode(e.target.value)}
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                        >
                            <option value="ObjectNodes">ObjectNodes</option>
                            <option value="ConceptNodes">ConceptNodes</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Start value</label>
                        <select
                            value={startValue} onChange={e => setStartValue(e.target.value)}
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                        >
                            <option value="ObjectNodes/((CH2CH2O)8_32...">ObjectNodes/((CH2CH2O)8_32...</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Layout</label>
                        <select
                            value={layout} onChange={e => setLayout(e.target.value)}
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                        >
                            <option value="forceAtlas2">forceAtlas2</option>
                            <option value="random">Random</option>
                            <option value="grid">Grid</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Depth</label>
                        <input
                            type="number" value={depth} onChange={e => setDepth(e.target.value)}
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Limit</label>
                        <input
                            type="number" value={limit} onChange={e => setLimit(e.target.value)}
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                        />
                    </div>

                    <button
                        className="btn"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        style={{
                            width: '100%', padding: '0.8rem', background: '#4caf50', color: 'white',
                            border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem',
                            cursor: isGenerating ? 'not-allowed' : 'pointer',
                            opacity: isGenerating ? 0.7 : 1
                        }}
                    >
                        {isGenerating ? '생성 중...' : '그래프 생성'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GraphView;
