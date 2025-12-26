import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Map, Activity, Settings, BrainCircuit, Bot, Building2 } from 'lucide-react';
import './Layout.css';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: '대시보드', icon: LayoutDashboard },
        { path: '/search', label: '인력찾기', icon: Users },
        { path: '/partner-search', label: '협력업체 찾기', icon: Building2 },
        { path: '/projects', label: '프로젝트 맵', icon: Map },
        { path: '/ai-agent', label: 'AI 에이전트', icon: Bot },
        { path: '/simulation', label: '전략 시뮬레이션', icon: BrainCircuit },
        { path: '/admin', label: '관리자', icon: Settings },
    ];

    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <Activity className="logo-icon" size={28} color="var(--accent-primary)" />
                <span className="logo-text">KNOWLEARN</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="avatar">AD</div>
                    <div className="texts">
                        <span className="name">Admin User</span>
                        <span className="role">System Manager</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
