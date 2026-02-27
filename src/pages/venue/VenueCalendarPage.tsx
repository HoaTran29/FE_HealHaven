import React, { useState } from 'react';
import './VenuePage.css';

// Calendar mini mock
const SPACES = ['Studio A', 'Studio B', 'Sân vườn'];
const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

type SlotStatus = 'available' | 'booked' | 'blocked';

interface Slot { space: string; day: number; hour: number; status: SlotStatus; }

// Generate default slots: 8h-20h, 7 days
const generateSlots = (): Slot[] => {
    const slots: Slot[] = [];
    SPACES.forEach(space => {
        for (let day = 0; day < 7; day++) {
            for (let h = 8; h < 20; h++) {
                let status: SlotStatus = 'available';
                // Seed some bookings
                if (space === 'Studio A' && day === 0 && h >= 9 && h < 12) status = 'booked';
                if (space === 'Studio A' && day === 2 && h >= 14 && h < 17) status = 'booked';
                if (space === 'Studio B' && day === 1 && h >= 10 && h < 13) status = 'booked';
                if (space === 'Sân vườn' && day === 5 && h >= 8 && h < 11) status = 'booked';
                slots.push({ space, day, hour: h, status });
            }
        }
    });
    return slots;
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8-19

const VenueCalendarPage: React.FC = () => {
    const [selectedSpace, setSelectedSpace] = useState('Studio A');
    const [slots, setSlots] = useState<Slot[]>(generateSlots());
    const [week] = useState('24/02 - 02/03/2026');

    const getSlot = (day: number, hour: number) =>
        slots.find(s => s.space === selectedSpace && s.day === day && s.hour === hour);

    const toggleSlot = (day: number, hour: number) => {
        setSlots(prev => prev.map(s => {
            if (s.space !== selectedSpace || s.day !== day || s.hour !== hour) return s;
            if (s.status === 'booked') return s; // không tự toggle booked
            return { ...s, status: s.status === 'available' ? 'blocked' : 'available' };
        }));
    };

    const slotCounts = {
        available: slots.filter(s => s.space === selectedSpace && s.status === 'available').length,
        booked: slots.filter(s => s.space === selectedSpace && s.status === 'booked').length,
        blocked: slots.filter(s => s.space === selectedSpace && s.status === 'blocked').length,
    };

    return (
        <div className="venue-page">
            <div className="venue-page-header">
                <div>
                    <h1 className="venue-page-title">Lịch trống</h1>
                    <p className="venue-page-subtitle">Quản lý lịch cho thuê theo tuần. Click ô trống để chặn/mở lịch.</p>
                </div>
                <span className="week-label">📅 Tuần: {week}</span>
            </div>

            {/* Space selector */}
            <div className="venue-card space-selector-bar">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Không gian:</span>
                    {SPACES.map(sp => (
                        <button key={sp} className={`venue-chip-btn ${selectedSpace === sp ? 'active' : ''}`} onClick={() => setSelectedSpace(sp)}>{sp}</button>
                    ))}
                </div>
                <div className="slot-legend">
                    <span className="legend-item avail">✅ {slotCounts.available} khả dụng</span>
                    <span className="legend-item booked">🔵 {slotCounts.booked} đã đặt</span>
                    <span className="legend-item blocked">⛔ {slotCounts.blocked} chặn</span>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="venue-card calendar-wrap">
                <div className="cal-grid">
                    {/* Header row */}
                    <div className="cal-hour-col" />
                    {DAYS.map((d, i) => <div key={i} className="cal-day-header">{d}</div>)}

                    {/* Hour rows */}
                    {HOURS.map(h => (
                        <React.Fragment key={h}>
                            <div className="cal-hour-label">{h}:00</div>
                            {DAYS.map((_, d) => {
                                const slot = getSlot(d, h);
                                return (
                                    <div
                                        key={d}
                                        className={`cal-cell ${slot?.status ?? 'available'}`}
                                        onClick={() => toggleSlot(d, h)}
                                        title={slot?.status === 'booked' ? 'Đã có đặt phòng' : slot?.status === 'blocked' ? 'Đang chặn – click để mở' : 'Click để chặn'}
                                    />
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                <div className="cal-note">
                    💡 Click ô <strong>trắng</strong> để chặn lịch · Click ô <strong>đỏ</strong> để mở lại · Ô <strong>xanh</strong> = đã có đặt (không thể thay đổi)
                </div>
            </div>
        </div>
    );
};

export default VenueCalendarPage;
