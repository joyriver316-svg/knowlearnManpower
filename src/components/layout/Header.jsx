import React from 'react';
import { Activity, Bell, Search } from 'lucide-react';
import './Layout.css';

const Header = () => {
    return (
        <header className="gnb glass-panel">
            <div className="gnb-left">
                <div className="logo-container">
                    <Activity className="logo-icon" size={24} color="var(--accent-primary)" />
                    <span className="logo-text">KNOWLEARN</span>
                </div>
            </div>

            <div className="gnb-right">
                <div className="header-actions">
                    <button className="icon-btn">
                        <Search size={20} />
                    </button>
                    <button className="icon-btn">
                        <Bell size={20} />
                    </button>
                </div>
                <div className="user-profile">
                    <div className="avatar__small">AD</div>
                    <span className="user-name">Admin User</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
