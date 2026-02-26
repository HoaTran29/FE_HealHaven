import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
    const { theme, toggleTheme, lang, setLang } = useSettings();

    return (
        <div className="settings-page container">
            <header className="settings-header">
                <h1>⚙️ Cài đặt</h1>
                <p>Tùy chỉnh giao diện và trải nghiệm của bạn trên Heal Haven.</p>
            </header>

            <div className="settings-content">

                {/* === GIAO DIỆN === */}
                <section className="settings-section">
                    <h2>🎨 Giao diện</h2>

                    {/* Dark Mode */}
                    <div className="settings-row">
                        <div className="settings-row-info">
                            <div className="settings-row-title">Chế độ tối (Dark Mode)</div>
                            <div className="settings-row-desc">
                                {theme === 'dark' ? 'Đang bật Dark Mode 🌙' : 'Đang dùng Light Mode ☀️'}
                            </div>
                        </div>
                        <button
                            className={`toggle-switch ${theme === 'dark' ? 'on' : ''}`}
                            onClick={toggleTheme}
                            aria-label="Toggle Dark Mode"
                        >
                            <span className="toggle-knob" />
                        </button>
                    </div>

                    {/* Theme preview */}
                    <div className="theme-preview">
                        <div className={`preview-card ${theme === 'dark' ? 'preview-dark' : 'preview-light'}`}>
                            <div className="preview-bar" />
                            <div className="preview-lines">
                                <div className="preview-line long" />
                                <div className="preview-line short" />
                                <div className="preview-line medium" />
                            </div>
                            <span className="preview-label">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
                        </div>
                    </div>
                </section>

                {/* === NGÔN NGỮ === */}
                <section className="settings-section">
                    <h2>🌐 Ngôn ngữ</h2>
                    <div className="settings-row">
                        <div className="settings-row-info">
                            <div className="settings-row-title">Ngôn ngữ hiển thị</div>
                            <div className="settings-row-desc">Chọn ngôn ngữ giao diện</div>
                        </div>
                    </div>
                    <div className="lang-options">
                        <button
                            className={`lang-btn ${lang === 'vi' ? 'selected' : ''}`}
                            onClick={() => setLang('vi')}
                        >
                            🇻🇳 Tiếng Việt
                        </button>
                        <button
                            className={`lang-btn ${lang === 'en' ? 'selected' : ''}`}
                            onClick={() => setLang('en')}
                        >
                            🇬🇧 English
                        </button>
                    </div>
                    {lang === 'en' && (
                        <p className="lang-notice">
                            ℹ️ English translation is coming soon. Most content will still display in Vietnamese.
                        </p>
                    )}
                </section>

                {/* === THÔNG BÁO === */}
                <section className="settings-section">
                    <h2>🔔 Thông báo</h2>

                    {[
                        { id: 'email-notif', label: 'Thông báo qua Email', desc: 'Nhận nhắc nhở về lịch workshop qua email' },
                        { id: 'push-notif', label: 'Thông báo đẩy (Push)', desc: 'Hiển thị thông báo trực tiếp trên trình duyệt' },
                        { id: 'promo-notif', label: 'Ưu đãi & Khuyến mãi', desc: 'Nhận thông tin về các ưu đãi đặc biệt' },
                    ].map(item => (
                        <div className="settings-row" key={item.id}>
                            <div className="settings-row-info">
                                <div className="settings-row-title">{item.label}</div>
                                <div className="settings-row-desc">{item.desc}</div>
                            </div>
                            <label className="toggle-switch on" aria-label={item.label}>
                                <input type="checkbox" defaultChecked style={{ display: 'none' }} />
                                <span className="toggle-knob" />
                            </label>
                        </div>
                    ))}
                </section>

            </div>
        </div>
    );
};

export default SettingsPage;
