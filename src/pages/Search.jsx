import React, { useState } from 'react';
import { MOCK_PEOPLE, ROLES, SKILLS } from '../services/mockData';
import { Search as SearchIcon, X, Mail, Building, Star, AlertTriangle } from 'lucide-react';

const Search = () => {
    // Filter States
    const [roleFilter, setRoleFilter] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [orgFilter, setOrgFilter] = useState('');
    const [certFilter, setCertFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('');

    const [availMin, setAvailMin] = useState(0);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showFullProfile, setShowFullProfile] = useState(false);

    // Derived Filter Lists
    const uniqueOrgs = ['Platform Team', 'AI Research', 'Service Dev', 'Data Ops', 'UX Studio'];
    const uniqueCerts = ['AWS SA', 'CKA', 'PMP', 'Google Cloud DE', 'CISSP'];

    const filtered = MOCK_PEOPLE.filter(p => {
        // 1. Basic Matches
        const matchRole = roleFilter === '' || p.role === roleFilter;
        const matchSkill = skillFilter === '' || p.skills.includes(skillFilter);
        const matchOrg = orgFilter === '' || p.department === orgFilter;
        const matchCert = certFilter === '' || (p.certifications && p.certifications.includes(certFilter));

        // 2. Project Search (Text match in history)
        const matchProject = projectFilter === '' ||
            (p.projectExperienceList && p.projectExperienceList.some(pr => pr.toLowerCase().includes(projectFilter.toLowerCase())));

        // 3. Availability Slider (Show if available >= selected min)
        const matchAvail = p.availability >= availMin;

        // 4. Date Logic: person must be available by the requested Start Date.
        // If End Date is specified, strictly we don't have "busy from" data, but we can assume they remain available.
        // For now, we mainly check if they are available *by* the start date.
        const matchDateStart = dateStart === '' || (p.availableFrom && p.availableFrom <= dateStart);
        // Placeholder logic for End Date if we had 'availableTo' field in future
        const matchDateEnd = true;

        return matchRole && matchSkill && matchOrg && matchCert && matchProject && matchAvail && matchDateStart && matchDateEnd;
    });

    const handleResetFilters = () => {
        setRoleFilter(''); setSkillFilter(''); setOrgFilter(''); setCertFilter('');
        setProjectFilter(''); setAvailMin(0); setDateStart(''); setDateEnd('');
    };

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: '1.5rem' }}>인력찾기</h1>

            {/* Advanced Filter Panel */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Row 1 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>조직 (Organization)</label>
                        <select value={orgFilter} onChange={e => setOrgFilter(e.target.value)} className="input" style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>
                            <option value="">전체 조직</option>
                            {uniqueOrgs.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>역할 (Role)</label>
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input" style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>
                            <option value="">전체 역할</option>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>스킬 (Skill)</label>
                        <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} className="input" style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>
                            <option value="">전체 스킬</option>
                            {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>보유 자격증</label>
                        <select value={certFilter} onChange={e => setCertFilter(e.target.value)} className="input" style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>
                            <option value="">전체 자격증</option>
                            {uniqueCerts.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Row 2 */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>프로젝트 경험</label>
                        <input
                            type="text" placeholder="프로젝트명 검색..." value={projectFilter} onChange={e => setProjectFilter(e.target.value)}
                            className="input" style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>최소 가용률 (%)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="range" min="0" max="100" step="10" value={availMin} onChange={e => setAvailMin(Number(e.target.value))}
                                style={{ flex: 1, accentColor: 'var(--accent-primary)' }}
                            />
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', width: '3rem', textAlign: 'right' }}>{availMin}%</span>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>투입 가능 기간</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid var(--glass-border)' }} />
                            <span style={{ color: 'var(--text-secondary)' }}>~</span>
                            <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid var(--glass-border)' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <button onClick={handleResetFilters} className="btn" style={{ fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--glass-border)' }}>초기화</button>
                    <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                        <SearchIcon size={16} /> 검색 ({filtered.length})
                    </button>
                </div>
            </div>

            {/* Results - List View */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem', fontWeight: '600', width: '25%' }}>Name / Role / Org</th>
                            <th style={{ padding: '1rem', fontWeight: '600', width: '15%' }}>Level/Cert</th>
                            <th style={{ padding: '1rem', fontWeight: '600', width: '20%' }}>Availability</th>
                            <th style={{ padding: '1rem', fontWeight: '600', width: '40%' }}>Skills & Project</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr
                                key={p.id}
                                onClick={() => { setSelectedPerson(p); setShowFullProfile(false); }}
                                style={{
                                    borderBottom: '1px solid var(--glass-border)',
                                    height: '40px',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '0.5rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{p.name}</span>
                                        <span style={{
                                            fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px', fontWeight: '600',
                                            background: ['TA', 'DA'].includes(p.role) ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                            color: ['TA', 'DA'].includes(p.role) ? 'white' : 'var(--text-secondary)',
                                            border: ['TA', 'DA'].includes(p.role) ? 'none' : '1px solid var(--glass-border)'
                                        }}>
                                            {p.role}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Building size={10} /> {p.department}
                                    </div>
                                </td>
                                <td style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <div>{p.level}</div>
                                    {p.certifications && p.certifications.length > 0 && (
                                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-success)', marginTop: '2px' }}>{p.certifications[0]} {p.certifications.length > 1 && `+${p.certifications.length - 1}`}</div>
                                    )}
                                </td>
                                <td style={{ padding: '0.5rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{
                                            padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500',
                                            background: p.availability >= 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: p.availability >= 80 ? 'var(--accent-success)' : 'var(--accent-danger)'
                                        }}>
                                            {p.availability}%
                                        </span>
                                        {p.availableFrom && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>from {p.availableFrom.slice(5)}</span>}
                                    </div>
                                </td>
                                <td style={{ padding: '0.5rem 1rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '2px' }}>
                                        {p.skills.slice(0, 4).map(s => (
                                            <span key={s} style={{ fontSize: '0.7rem', background: 'var(--bg-secondary)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--glass-border)', whiteSpace: 'nowrap' }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    {p.projectExperienceList && p.projectExperienceList.length > 0 && (
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                                            Ex: {p.projectExperienceList.join(', ')}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No results found matching your criteria.
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedPerson && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }} onClick={() => setSelectedPerson(null)}>
                    <div
                        className="glass-panel"
                        style={{ width: '500px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-primary)', padding: '2rem', position: 'relative' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedPerson(null)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start', marginBottom: '2rem' }}>
                            <img
                                src={selectedPerson.photo}
                                alt={selectedPerson.name}
                                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--bg-secondary)' }}
                            />
                            <div>
                                <h2 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {selectedPerson.name}
                                    <span style={{ fontSize: '0.9rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--accent-primary)', color: 'white' }}>
                                        {selectedPerson.role}
                                    </span>
                                </h2>
                                <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.95rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={16} /> {selectedPerson.department}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {selectedPerson.email}</div>
                                </div>
                            </div>
                        </div>

                        {!showFullProfile ? (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Performance Rating</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {selectedPerson.performanceRating} <Star size={16} fill="var(--accent-warning)" color="var(--accent-warning)" />
                                        </div>
                                    </div>
                                    <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Risk Factor</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: selectedPerson.riskFactor === 'High' ? 'var(--accent-danger)' : 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {selectedPerson.riskFactor} {selectedPerson.riskFactor === 'High' && <AlertTriangle size={16} />}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem' }}>Skills & Capability</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {selectedPerson.skills.map(s => (
                                            <span key={s} style={{ background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid var(--glass-border)' }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease-in-out' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Self Introduction</h3>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                                        {selectedPerson.selfIntro}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Education</h3>
                                    <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{selectedPerson.education}</div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Work Experience</h3>
                                    {selectedPerson.experience.map((exp, idx) => (
                                        <div key={idx} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--glass-border)' }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{exp.role}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{exp.company} | {exp.duration}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                            <button className="btn" style={{ background: 'var(--bg-secondary)' }} onClick={() => setSelectedPerson(null)}>Close</button>
                            {!showFullProfile && (
                                <button className="btn btn-primary" onClick={() => setShowFullProfile(true)}>
                                    View Full Profile
                                </button>
                            )}
                            {showFullProfile && (
                                <button className="btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }} onClick={() => setShowFullProfile(false)}>
                                    Back to Summary
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
