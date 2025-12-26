import React, { useState } from 'react';
import { Save, RefreshCw, Database, GitBranch, Settings, FileText, Activity } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('schema');

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: '1.5rem' }}>시스템 관리 (Admin)</h1>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                {[
                    { id: 'schema', label: '스키마 매핑', icon: Database },
                    { id: 'ontology', label: '온톨로지 관리', icon: GitBranch },
                    { id: 'tenant', label: '테넌트 설정', icon: Settings },
                    { id: 'logs', label: '로그/감사', icon: FileText },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.75rem 1rem',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                            color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            fontWeight: activeTab === tab.id ? '600' : '400',
                            cursor: 'pointer',
                            fontSize: '0.95rem'
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }}>
                {activeTab === 'schema' && <SchemaMapping />}
                {activeTab === 'ontology' && <OntologyManager />}
                {activeTab === 'tenant' && <TenantSettings />}
                {activeTab === 'logs' && <SystemLogs />}
            </div>
        </div>
    );
};

// Sub-components for each tab
const SchemaMapping = () => {
    const [mappings, setMappings] = useState([
        { id: 1, source: 'HR_DB.employees.emp_id', target: 'User.id', type: 'String' },
        { id: 2, source: 'HR_DB.employees.full_name', target: 'User.name', type: 'String' },
        { id: 3, source: 'LMS.certifications.cert_name', target: 'Certification.title', type: 'String' },
        { id: 4, source: 'Project_Mgmt.projects.p_code', target: 'Project.code', type: 'String' },
    ]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>데이터 스키마 매핑</h3>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>+ 새 매핑 추가</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.9rem' }}>Source Field</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.9rem' }}>Target Property</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.9rem' }}>Data Type</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.9rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mappings.map(m => (
                        <tr key={m.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '0.75rem' }}>{m.source}</td>
                            <td style={{ padding: '0.75rem' }}>{m.target}</td>
                            <td style={{ padding: '0.75rem' }}><span style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{m.type}</span></td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                <button style={{ marginRight: '0.5rem', background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>Edit</button>
                                <button style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer' }}>Del</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const OntologyManager = () => {
    // Mock Tree Data
    const classes = [
        { name: 'Person', children: ['Employee', 'Candidate'] },
        { name: 'Project', children: ['InternalProject', 'ClientProject'] },
        { name: 'Skill', children: ['TechSkill', 'SoftSkill'] },
        { name: 'Organization', children: ['Department', 'Team'] },
    ];

    return (
        <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
            <div style={{ flex: 1, borderRight: '1px solid var(--glass-border)', paddingRight: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Ontology Structure</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {classes.map((c, i) => (
                        <li key={i} style={{ marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%' }}></div>
                                {c.name}
                            </div>
                            <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                {c.children.map((child, j) => (
                                    <li key={j} style={{ padding: '0.25rem 0', color: 'var(--text-secondary)' }}>└ {child}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
                <button className="btn" style={{ width: '100%', marginTop: '1rem', border: '1px dashed #ccc' }}>+ Add Class</button>
            </div>
            <div style={{ flex: 2 }}>
                <h3 style={{ marginBottom: '1rem' }}>Class Details</h3>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Select a class from the left to view properties and relationships.
                </div>
            </div>
        </div>
    );
};

const TenantSettings = () => {
    return (
        <div style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>테넌트 기본 설정</h3>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Name</label>
                <input type="text" className="input" defaultValue="Knowlearn Corp." style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--glass-border)', borderRadius: '4px' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Domain</label>
                <input type="text" className="input" defaultValue="knowlearn.ai" disabled style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--glass-border)', borderRadius: '4px', background: '#f5f5f5' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Theme Color (Primary)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="color" defaultValue="#3b82f6" style={{ height: '40px', width: '60px', padding: 0, border: 'none' }} />
                    <input type="text" className="input" defaultValue="#3b82f6" style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--glass-border)', borderRadius: '4px' }} />
                </div>
            </div>

            <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={18} /> 저장하기
            </button>
        </div>
    );
};

const SystemLogs = () => {
    const logs = [
        { id: 101, time: '2023-10-27 14:30:22', user: 'admin', action: 'Schema Update', status: 'Success' },
        { id: 102, time: '2023-10-27 14:15:05', user: 'system', action: 'Data Sync (HR)', status: 'Success' },
        { id: 103, time: '2023-10-27 13:50:11', user: 'user1', action: 'Login Failed', status: 'Warning' },
        { id: 104, time: '2023-10-27 11:20:44', user: 'admin', action: 'Policy Change', status: 'Success' },
        { id: 105, time: '2023-10-27 09:05:30', user: 'system', action: 'Backup', status: 'Success' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>최근 활동 로그</h3>
                <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.9rem' }}>Time</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.9rem' }}>User</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.9rem' }}>Action</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.9rem' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{log.time}</td>
                            <td style={{ padding: '0.75rem', fontWeight: '500' }}>{log.user}</td>
                            <td style={{ padding: '0.75rem' }}>{log.action}</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '600',
                                    background: log.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: log.status === 'Success' ? 'var(--accent-success)' : 'var(--accent-danger)'
                                }}>
                                    {log.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
