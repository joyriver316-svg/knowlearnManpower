
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { AlertCircle, TrendingUp, Users, DollarSign } from 'lucide-react';
import { MOCK_PEOPLE, MOCK_PROJECTS } from '../services/mockData';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</span>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
                <Icon size={20} />
            </div>
        </div>
        <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{subtext}</span>
    </div>
);

const Dashboard = () => {
    // 1. Calculate Real Metrics
    const totalPeople = MOCK_PEOPLE.length;

    // Utilization
    const avgUtilization = Math.round(MOCK_PEOPLE.reduce((acc, p) => acc + p.availability, 0) / totalPeople);

    // Outsource Ratio
    const externalCount = MOCK_PEOPLE.filter(p => p.type === 'External').length;
    const outsourceRatio = ((externalCount / totalPeople) * 100).toFixed(1);

    // Risk Count
    const riskCount = MOCK_PEOPLE.filter(p => p.riskFactor === 'High').length;

    // 2. Dynamic Chart Data Generation (Simulate history based on current stats)
    // We'll generate previous quarters with slight random variance from current current stats to look realistic
    const generateTrend = (baseValue, variance) => {
        return Array.from({ length: 3 }, (_, i) => {
            const change = (Math.random() * variance * 2) - variance;
            return Math.max(0, Math.min(100, Math.round(baseValue + change)));
        }).concat([Math.round(baseValue)]); // Last point is current
    };

    const currentInternalUtil = Math.round(MOCK_PEOPLE.filter(p => p.type === 'Internal').reduce((acc, p) => acc + p.availability, 0) / (totalPeople - externalCount) || 0);
    const currentExternalUtil = Math.round(MOCK_PEOPLE.filter(p => p.type === 'External').reduce((acc, p) => acc + p.availability, 0) / externalCount || 0);

    const trendInternal = generateTrend(currentInternalUtil, 10);
    const trendExternal = generateTrend(currentExternalUtil, 15);

    // Risk Radar Data
    const activeProjects = MOCK_PROJECTS.filter(p => p.status !== 'Completed');
    const riskData = [
        { subject: '일정 (Schedule)', A: 0, fullMark: 100 },
        { subject: '비용 (Cost)', A: 0, fullMark: 100 },
        { subject: '인력 (Manpower)', A: 0, fullMark: 100 },
        { subject: '기술 (Tech)', A: 0, fullMark: 100 },
        { subject: '외부 (External)', A: 0, fullMark: 100 },
    ];

    if (activeProjects.length > 0) {
        activeProjects.forEach(p => {
            if (p.risks) {
                riskData[0].A += p.risks.schedule;
                riskData[1].A += p.risks.cost;
                riskData[2].A += p.risks.manpower;
                riskData[3].A += p.risks.technical;
                riskData[4].A += p.risks.external;
            }
        });
        riskData.forEach(d => d.A = Math.round(d.A / activeProjects.length));
    }

    const chartData = [
        { name: '1Q', utilization: trendInternal[0], outsource: trendExternal[0] },
        { name: '2Q', utilization: trendInternal[1], outsource: trendExternal[1] },
        { name: '3Q', utilization: trendInternal[2], outsource: trendExternal[2] },
        { name: '4Q', utilization: trendInternal[3], outsource: trendExternal[3] }, // Current Quarter
    ];

    // 3. Monthly Trend Data (Jan - Dec)
    const generateMonthlyTrend = (base, variance) => {
        return Array.from({ length: 12 }, (_, i) => {
            // Simulate a seasonal curve or trend
            const seasonalFactor = Math.sin(i / 2) * 5;
            const randomVar = (Math.random() * variance * 2) - variance;
            return Math.max(0, Math.min(100, Math.round(base + seasonalFactor + randomVar)));
        });
    };

    const monthlyInternal = generateMonthlyTrend(currentInternalUtil, 8);
    const monthlyExternal = generateMonthlyTrend(currentExternalUtil, 12);

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        name: `${i + 1}월`,
        internal: monthlyInternal[i],
        external: monthlyExternal[i]
    }));

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: '2rem' }}>대시보드</h1>

            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard
                    title="전체 인력"
                    value={totalPeople}
                    subtext="전월 대비 +4명"
                    icon={Users}
                    color="59, 130, 246" // Blue
                />
                <StatCard
                    title="평균 가동률"
                    value={`${avgUtilization}%`}
                    subtext="적정 범위: 85-95%"
                    icon={TrendingUp}
                    color="16, 185, 129" // Green
                />
                <StatCard
                    title="외주 비중"
                    value={`${outsourceRatio}%`}
                    subtext="관리 기준(20%) 미만"
                    icon={DollarSign}
                    color="245, 158, 11" // Orange
                />
                <StatCard
                    title="고위험 리스크"
                    value={riskCount}
                    subtext="즉각적인 조치 필요"
                    icon={AlertCircle}
                    color="239, 68, 68" // Red
                />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', height: '400px' }}>
                    <h3 className="card-title">분기별 가동률 추이</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Legend />
                            <Bar dataKey="utilization" fill="var(--accent-primary)" name="내부 인력 (%)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="outsource" fill="var(--accent-secondary)" name="외주 인력 (%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', height: '400px' }}>
                    <h3 className="card-title">프로젝트 리스크 분포 (평균)</h3>
                    <div style={{ width: '100%', height: '90%', fontSize: '0.8rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="평균 리스크 점수"
                                    dataKey="A"
                                    stroke="var(--accent-danger)"
                                    strokeWidth={2}
                                    fill="var(--accent-danger)"
                                    fillOpacity={0.4}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: 'var(--accent-danger)' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Monthly Trend Chart (Full Width) */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem', height: '400px' }}>
                <h3 className="card-title">월별 가동률 추이 (1월 - 12월)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                        <YAxis domain={[0, 100]} stroke="var(--text-secondary)" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="internal" name="내부 인력 가동률 (%)" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="external" name="외주 인력 가동률 (%)" stroke="var(--accent-secondary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
