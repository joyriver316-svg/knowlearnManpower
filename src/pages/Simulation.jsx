import React, { useState } from 'react';
import { Activity, DollarSign, AlertTriangle, FileJson, FileText, CheckCircle, Users, BarChart3, Settings2, Loader2 } from 'lucide-react';

const Simulation = () => {
    // Input Variables (Units: 만원 for Cost)
    const [inputs, setInputs] = useState({
        availableMM: 120,    // Internal Man-Months available
        requiredMM: 150,     // Project required Man-Months
        unitCostInternal: 800, // 800만원 (8백만)
        unitCostExternal: 1200, // 1200만원 (1천2백만)
        outsourceLimit: 20,  // % Limit
        strategyMode: 'Neutral' // Conservative, Neutral, Aggressive
    });

    const [simulationResult, setSimulationResult] = useState(null);
    const [viewMode, setViewMode] = useState('summary'); // summary, spec, schema
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    const runSimulation = () => {
        setIsLoading(true);
        // Simulate processing time
        setTimeout(() => {
            const { availableMM, requiredMM, unitCostInternal, unitCostExternal, outsourceLimit, strategyMode } = inputs;

            let allocatedInternal = 0;
            let allocatedExternal = 0;
            let riskIndex = 0;
            let logicName = "";
            let logicSteps = [];

            // Scenario Generation Logic
            if (strategyMode === 'Conservative') {
                logicName = "Secure_Internal_v1 (안전 우선 전략)";
                logicSteps = [
                    "1. 내부 인력(Internal Resource)을 프로젝트 소요량(Required)까지 최우선 배정",
                    "2. 부족분(Shortage) 발생 시 외주(External) 인력 검토",
                    "3. 외주 배정 시 '외주 비중 제한(Outsource Limit)'을 Hard Constraint로 적용 (초과 불가)",
                    "4. 리스크 지수: 외주 비중에 비례하여 보수적으로 산정 (Base: 15)"
                ];
                allocatedInternal = Math.min(availableMM, requiredMM);
                const remaining = requiredMM - allocatedInternal;
                const maxExternal = (requiredMM * outsourceLimit) / 100;
                allocatedExternal = Math.min(remaining, maxExternal);
                riskIndex = 15 + (allocatedExternal / requiredMM) * 20;

            } else if (strategyMode === 'Neutral') {
                logicName = "Balanced_Mix_v2 (균형 전략)";
                logicSteps = [
                    "1. 내부 인력을 가용 범위 내에서 최대한 배정",
                    "2. 잔여 소요량은 외주 인력으로 전체 충당 시도 (Fulfillment 우선)",
                    "3. '외주 비중 제한'을 Soft Constraint로 적용 (초과 시 리스크 페널티 부과)",
                    "4. 리스크 지수: 외주 비율 및 제한 초과 여부에 따라 가중치 적용 (Base: 35)"
                ];
                allocatedInternal = Math.min(availableMM, requiredMM);
                allocatedExternal = requiredMM - allocatedInternal;
                if ((allocatedExternal / requiredMM) * 100 > outsourceLimit) {
                    riskIndex += 10;
                }
                riskIndex = 35 + (allocatedExternal / requiredMM) * 30;

            } else { // Aggressive
                logicName = "Cost_Opt_v3 (비용 최적화)";
                logicSteps = [
                    "1. 내부/외주 단가를 비교(Compare Unit Cost)하여 저렴한 리소스를 우선 순위로 설정",
                    "2. 저단가 리소스가 가용한도(Available Cap)에 도달할 때까지 배정",
                    "3. 외주 제한을 1.5배까지 완화하여(Relaxed Limit) 비용 절감 극대화",
                    "4. 리스크 지수: 높은 외주 의존도와 품질 변동성을 반영하여 높게 책정 (Base: 65)"
                ];
                if (unitCostExternal < unitCostInternal) {
                    allocatedExternal = Math.min(requiredMM, (requiredMM * outsourceLimit * 1.5) / 100);
                    allocatedInternal = requiredMM - allocatedExternal;
                } else {
                    allocatedInternal = Math.min(availableMM, requiredMM);
                    allocatedExternal = requiredMM - allocatedInternal;
                }
                riskIndex = 65 + (allocatedExternal / requiredMM) * 50;
            }

            const totalCost = (allocatedInternal * unitCostInternal) + (allocatedExternal * unitCostExternal);
            const totalAllocated = allocatedInternal + allocatedExternal;
            const fulfillmentRate = Math.min(100, Math.round((totalAllocated / requiredMM) * 100));
            const bottleneck = fulfillmentRate < 100 ? "Senior Developer (Java)" : "없음";

            setSimulationResult({
                totalCost, // unit: 만원
                fulfillmentRate,
                riskIndex: Math.min(100, Math.round(riskIndex)),
                bottleneck,
                logicName,
                logicSteps,
                timestamp: new Date().toISOString(),
                generatedScenario: strategyMode
            });
            setViewMode('summary');
            setIsLoading(false);
        }, 1500); // 1.5s delay
    };

    // Format currency: 12000 -> 1억 2,000만원 or just 12,000만원
    const formatCurrency = (val) => {
        // val is in 만원. e.g. 80000 = 8억. 
        if (val >= 10000) {
            const eok = Math.floor(val / 10000);
            const man = val % 10000;
            return `₩${eok}억 ${man.toLocaleString()}만원`;
        }
        return `₩${val.toLocaleString()}만원`;
    };

    return (
        <div className="page-container" style={{ fontFamily: 'Pretendard, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                    <BarChart3 color="white" size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.2rem', background: 'linear-gradient(to right, #1e293b, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>인력 전략 시뮬레이션</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>다양한 변수에 따른 최적의 인력 운용 시나리오를 분석합니다.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 25%) 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* Input Panel */}
                <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '16px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#334155' }}>
                        <Settings2 size={20} color="var(--accent-primary)" />
                        시뮬레이션 변수 설정
                    </h3>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="label" style={{ fontWeight: '500', color: '#475569', marginBottom: '0.5rem', display: 'block' }}>전략 모드</label>
                        <select
                            className="input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', transition: 'all 0.2s' }}
                            value={inputs.strategyMode}
                            onChange={(e) => handleInputChange('strategyMode', e.target.value)}
                        >
                            <option value="Conservative">🛡️ 보수적 (안전 우선)</option>
                            <option value="Neutral">⚖️ 중립적 (외주 혼합)</option>
                            <option value="Aggressive">💰 공격적 (비용 최소화)</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label className="label" style={{ fontWeight: '500', color: '#475569' }}>리소스 투입량 (MM)</label>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>가용 (내부)</span>
                                <input type="number" className="input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={inputs.availableMM} onChange={e => handleInputChange('availableMM', Number(e.target.value))} />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>프로젝트 소요</span>
                                <input type="number" className="input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={inputs.requiredMM} onChange={e => handleInputChange('requiredMM', Number(e.target.value))} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label className="label" style={{ fontWeight: '500', color: '#475569' }}>인력 단가 (단위: 만원)</label>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>내부</span>
                                <input type="number" className="input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={inputs.unitCostInternal} onChange={e => handleInputChange('unitCostInternal', Number(e.target.value))} />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>외주</span>
                                <input type="number" className="input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={inputs.unitCostExternal} onChange={e => handleInputChange('unitCostExternal', Number(e.target.value))} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label className="label" style={{ fontWeight: '500', color: '#475569' }}>외주 비중 제한</label>
                            <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: '600' }}>{inputs.outsourceLimit}%</span>
                        </div>
                        <input
                            type="range" min="0" max="100" className="input" style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                            value={inputs.outsourceLimit} onChange={e => handleInputChange('outsourceLimit', Number(e.target.value))}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{ width: '100%', padding: '0.9rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                        onClick={runSimulation}
                    >
                        {isLoading ? <Loader2 size={18} className="spin" /> : <Activity size={18} />}
                        {isLoading ? '시뮬레이션 분석 중...' : '시뮬레이션 실행하기'}
                    </button>
                </div>

                {/* Results Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '600px' }}>
                    {simulationResult ? (
                        <>
                            {/* Summary Metrics */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
                                <ResultCard
                                    label="총 원가 (Total Cost)"
                                    value={formatCurrency(simulationResult.totalCost)}
                                    subValue="예상 소요 비용"
                                    icon={DollarSign}
                                    color="var(--accent-primary)"
                                />
                                <ResultCard
                                    label="충족률 (Fulfillment)"
                                    value={`${simulationResult.fulfillmentRate}%`}
                                    subValue={`${inputs.requiredMM}MM 중 충족`}
                                    icon={CheckCircle}
                                    color="var(--accent-success)"
                                />
                                <ResultCard
                                    label="리스크 지수"
                                    value={simulationResult.riskIndex}
                                    subValue={simulationResult.riskIndex > 50 ? "High Risk" : "Stable"}
                                    icon={AlertTriangle}
                                    color={simulationResult.riskIndex > 50 ? "var(--accent-danger)" : "#fbbf24"}
                                />
                                <ResultCard
                                    label="병목 인력"
                                    value={simulationResult.bottleneck}
                                    subValue="채용 필요 직군"
                                    icon={Users}
                                    color="#64748b"
                                />
                            </div>

                            {/* Detail View Container */}
                            <div className="glass-panel" style={{ flex: 1, padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)' }}>
                                {/* Tab Header */}
                                <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', background: '#f8fafc' }}>
                                    {[
                                        { id: 'summary', icon: BarChart3, label: '결과 분석' },
                                        { id: 'spec', icon: FileText, label: '로직 명세 (Logic Spec)' },
                                        { id: 'schema', icon: FileJson, label: 'JSON 스키마' }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setViewMode(tab.id)}
                                            style={{
                                                flex: 1, padding: '1rem', border: 'none', background: viewMode === tab.id ? 'white' : 'transparent',
                                                borderBottom: viewMode === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                                color: viewMode === tab.id ? 'var(--accent-primary)' : '#94a3b8',
                                                fontWeight: viewMode === tab.id ? '600' : '500',
                                                cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                                            }}
                                        >
                                            <tab.icon size={16} /> {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Content Body */}
                                <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', background: 'white' }}>
                                    {viewMode === 'summary' && (
                                        <div style={{ animation: 'fadeIn 0.3s' }}>
                                            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                                                <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '0.5rem' }}>"{simulationResult.logicName}"</h3>
                                                <p style={{ color: '#64748b' }}>선택하신 전략 모드에 따라 생성된 최적의 시나리오입니다.</p>
                                            </div>

                                            <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '1.5rem' }}>
                                                <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                                                    <CheckCircle size={18} color="var(--accent-success)" /> 실행 결과 요약
                                                </h4>
                                                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569', lineHeight: '1.8' }}>
                                                    <li><strong>리소스 배정:</strong> 내부 {Math.min(inputs.availableMM, inputs.requiredMM)}MM / 외주 {(inputs.requiredMM - Math.min(inputs.availableMM, inputs.requiredMM)) > 0 ? (inputs.requiredMM - Math.min(inputs.availableMM, inputs.requiredMM)) : 0}MM (예상)</li>
                                                    <li><strong>비용 분석:</strong> 내부 단가({inputs.unitCostInternal}만) vs 외주 단가({inputs.unitCostExternal}만) 고려됨</li>
                                                    <li><strong>제약 조건:</strong> 외주 비중 {inputs.outsourceLimit}% {simulationResult.riskIndex > 50 ? '초과 또는 위험 수준' : '준수함'}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {viewMode === 'spec' && (
                                        <div style={{ animation: 'fadeIn 0.3s' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                                                시뮬레이션 로직 명세서 (Logic Specification)
                                            </h3>
                                            <div style={{ fontFamily: 'monospace', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155' }}>
                                                <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>Algorithm: {simulationResult.logicName}</div>
                                                <div style={{ marginBottom: '1rem', color: '#64748b' }}>// Logic Steps executed by the engine:</div>
                                                {simulationResult.logicSteps.map((step, idx) => (
                                                    <div key={idx} style={{ marginBottom: '0.8rem', paddingLeft: '1rem', borderLeft: '2px solid #cbd5e1' }}>
                                                        {step}
                                                    </div>
                                                ))}
                                                <div style={{ marginTop: '1.5rem', color: '#64748b' }}>
                                                    // Constraints:<br />
                                                    - Available MM: {inputs.availableMM}<br />
                                                    - Outsource Limit: {inputs.outsourceLimit}%
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {viewMode === 'schema' && (
                                        <div style={{ animation: 'fadeIn 0.3s' }}>
                                            <pre style={{ margin: 0, padding: '1.5rem', background: '#0f172a', color: '#f8fafc', borderRadius: '8px', overflow: 'auto', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                {JSON.stringify({
                                                    "$schema": "http://knowlearn.ai/schemas/simulation-result-v1.json",
                                                    "simulationId": "SIM-" + Date.now(),
                                                    "executedAt": simulationResult.timestamp,
                                                    "configuration": {
                                                        "strategy": inputs.strategyMode,
                                                        "constraints": {
                                                            "maxExternalRatio": inputs.outsourceLimit,
                                                            "internalCap": inputs.availableMM
                                                        },
                                                        "costs": {
                                                            "internal": inputs.unitCostInternal,
                                                            "external": inputs.unitCostExternal
                                                        }
                                                    },
                                                    "results": {
                                                        "metrics": {
                                                            "totalCostKRW": simulationResult.totalCost * 10000,
                                                            "fulfillmentPercent": simulationResult.fulfillmentRate,
                                                            "riskScore": simulationResult.riskIndex
                                                        },
                                                        "analysis": {
                                                            "bottleneckRole": simulationResult.bottleneck,
                                                            "appliedLogic": simulationResult.logicName
                                                        }
                                                    }
                                                }, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', borderRadius: '16px', border: '2px dashed #e2e8f0', background: 'rgba(255,255,255,0.5)' }}>
                            <div style={{ padding: '1.5rem', borderRadius: '50%', background: 'white', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Activity size={32} color="var(--accent-primary)" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '0.5rem' }}>시뮬레이션 준비 완료</h3>
                            <p>좌측 설정 패널에서 변수를 조정하고 실행 버튼을 눌러주세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ResultCard = ({ label, value, subValue, icon: Icon, color }) => (
    <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderLeft: `5px solid ${color}`, borderRadius: '12px', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{label}</span>
            <div style={{ padding: '0.4rem', borderRadius: '6px', background: `${color}15` }}>
                <Icon size={16} color={color} />
            </div>
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e293b' }}>{value}</div>
        {subValue && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{subValue}</div>}
    </div>
);

export default Simulation;
