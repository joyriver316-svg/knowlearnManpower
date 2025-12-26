import React, { useState, useMemo } from 'react';
import { Search, Filter, Briefcase, Star, Users, CheckCircle, XCircle, Building2, Phone, MapPin, Calendar, Award, X } from 'lucide-react';
import { MOCK_PARTNERS } from '../services/mockData';

const PartnerSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        specialty: 'All',
        tier: 'All',
        status: 'All'
    });
    const [selectedPartner, setSelectedPartner] = useState(null);

    const specialties = ['All', 'SI/SM', 'Cloud Infra', 'AI/Data', 'UX/UI Design', 'Mobile App'];
    const tiers = ['All', 'Tier 1 (Strategic)', 'Tier 2 (Preferred)', 'Tier 3 (General)'];

    const filteredPartners = useMemo(() => {
        return MOCK_PARTNERS.filter(partner => {
            const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                partner.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSpecialty = filters.specialty === 'All' || partner.specialty === filters.specialty;
            const matchesTier = filters.tier === 'All' || partner.tier === filters.tier;
            const matchesStatus = filters.status === 'All' ||
                (filters.status === 'Active' ? partner.contractStatus === 'Active' : partner.contractStatus === 'Expired');
            return matchesSearch && matchesSpecialty && matchesTier && matchesStatus;
        });
    }, [searchTerm, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="page-container">
            <h1 className="page-title" style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>협력업체 찾기</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '2rem', alignItems: 'start' }}>

                {/* Search & Filter Panel */}
                <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <Filter size={20} color="var(--accent-primary)" />
                        <h3 style={{ fontWeight: '600', margin: 0 }}>검색 필터</h3>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>통합 검색</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                className="input"
                                placeholder="업체명, 전문분야 검색..."
                                style={{ width: '100%', padding: '0.7rem 0.7rem 0.7rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>전문 분야</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {specialties.map(spec => (
                                <button
                                    key={spec}
                                    onClick={() => handleFilterChange('specialty', spec)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        border: `1px solid ${filters.specialty === spec ? 'var(--accent-primary)' : '#e2e8f0'}`,
                                        background: filters.specialty === spec ? 'rgba(59, 130, 246, 0.1)' : 'white',
                                        color: filters.specialty === spec ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {spec}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>파트너 등급</label>
                        <select
                            className="input"
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            value={filters.tier}
                            onChange={(e) => handleFilterChange('tier', e.target.value)}
                        >
                            {tiers.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>계약 상태</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" name="status" checked={filters.status === 'All'} onChange={() => handleFilterChange('status', 'All')} /> 全
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" name="status" checked={filters.status === 'Active'} onChange={() => handleFilterChange('status', 'Active')} /> 유효 (Active)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" name="status" checked={filters.status === 'Executed'} onChange={() => handleFilterChange('status', 'Expired')} /> 만료
                            </label>
                        </div>
                    </div>
                </div>

                {/* Results List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>검색 결과: <strong style={{ color: 'var(--text-primary)' }}>{filteredPartners.length}</strong>개 업체</span>
                    </div>

                    {filteredPartners.map(partner => (
                        <div
                            key={partner.id}
                            className="glass-panel"
                            onClick={() => setSelectedPartner(partner)}
                            style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer', border: '1px solid transparent' }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                        >
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Building2 size={30} color="#64748b" />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>{partner.name}</h3>
                                        <span style={{
                                            fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px',
                                            background: partner.contractStatus === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                            color: partner.contractStatus === 'Active' ? 'var(--accent-success)' : '#64748b',
                                            display: 'flex', alignItems: 'center', gap: '0.3rem'
                                        }}>
                                            {partner.contractStatus === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {partner.contractStatus}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>{partner.description}</p>

                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#475569' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={14} /> {partner.specialty}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={14} color="#fbbf24" fill="#fbbf24" /> {partner.rating} / 5.0</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={14} /> 가용인력 {partner.availableDevelopers}명</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-primary)', background: '#eff6ff', padding: '0.3rem 0.8rem', borderRadius: '6px' }}>
                                    {partner.tier}
                                </span>
                                <button
                                    className="btn"
                                    onClick={(e) => { e.stopPropagation(); alert(`Contacting ${partner.contact}...`); }}
                                    style={{ border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
                                >
                                    <Phone size={14} /> 연락하기
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredPartners.length === 0 && (
                        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p>검색 조건에 맞는 협력업체가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedPartner && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }} onClick={() => setSelectedPartner(null)}>
                    <div
                        className="glass-panel"
                        style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto', background: 'white', padding: '0', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <Building2 size={24} color="var(--accent-primary)" />
                                {selectedPartner.name}
                            </h2>
                            <button onClick={() => setSelectedPartner(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{selectedPartner.tier}</span>
                                <span style={{ background: selectedPartner.contractStatus === 'Active' ? 'var(--accent-success)' : '#94a3b8', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{selectedPartner.contractStatus}</span>
                            </div>

                            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.05rem' }}>{selectedPartner.description}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Briefcase size={20} color="var(--accent-secondary)" />
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>전문 분야</span>
                                        <span style={{ fontWeight: '600' }}>{selectedPartner.specialty}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Star size={20} color="#fbbf24" fill="#fbbf24" />
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>평가 등급</span>
                                        <span style={{ fontWeight: '600' }}>{selectedPartner.rating} / 5.0</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Users size={20} color="var(--accent-primary)" />
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>보유 인력 (전체/가용)</span>
                                        <span style={{ fontWeight: '600' }}>{selectedPartner.employees}명 / <span style={{ color: 'var(--accent-success)' }}>{selectedPartner.availableDevelopers}명</span></span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Calendar size={20} color="#64748b" />
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>설립 연도</span>
                                        <span style={{ fontWeight: '600' }}>{selectedPartner.foundedYear}년</span>
                                    </div>
                                </div>
                                <div style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <MapPin size={20} color="#64748b" />
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>주소</span>
                                        <span style={{ fontWeight: '600' }}>{selectedPartner.address}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}><Award size={18} /> 보유 자격 및 인증</h4>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {selectedPartner.certifications && selectedPartner.certifications.length > 0 ? (
                                        selectedPartner.certifications.map((cert, idx) => (
                                            <span key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', color: '#475569' }}>{cert}</span>
                                        ))
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>등록된 인증 정보가 없습니다.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#f8fafc' }}>
                            <button className="btn" onClick={() => setSelectedPartner(null)} style={{ background: 'white', border: '1px solid #cbd5e1', color: '#475569' }}>닫기</button>
                            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={16} /> 담당자 연락하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default PartnerSearch;
