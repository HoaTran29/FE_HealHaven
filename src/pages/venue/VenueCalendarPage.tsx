import React, { useState, useEffect } from 'react';
import { venueApi, venueBookingApi, type Venue, type VenueBooking } from '../../services/api';
import './VenuePage.css';

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
type SlotStatus = 'available' | 'booked' | 'blocked';
interface Slot { venueId: string; dateStr: string; dayIndex: number; hour: number; status: SlotStatus; bookingInfo?: any }

// Tạo lưới 7 ngày tới, mỗi ngày 8h-20h
const generateEmptySlots = (venueId: string): { slots: Slot[], dateLabels: string[] } => {
    const slots: Slot[] = [];
    const dateLabels: string[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split('T')[0]; // yyyy-mm-dd
        const label = `${DAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
        dateLabels.push(label);

        for (let h = 8; h < 20; h++) {
            slots.push({ venueId, dateStr, dayIndex: i, hour: h, status: 'available' });
        }
    }
    return { slots, dateLabels };
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8-19

const VenueCalendarPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [selectedVenueId, setSelectedVenueId] = useState<string>('');
    const [slots, setSlots] = useState<Slot[]>([]);
    const [dateLabels, setDateLabels] = useState<string[]>([]);
    const [bookings, setBookings] = useState<VenueBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        venueApi.getMyVenues().then(res => {
            if (res && res.length > 0) {
                setVenues(res);
                setSelectedVenueId(res[0].id);
            }
            setIsLoading(false);
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!selectedVenueId) return;
        const { slots: emptySlots, dateLabels: labels } = generateEmptySlots(selectedVenueId);
        setDateLabels(labels);

        venueBookingApi.getByVenue(selectedVenueId).then(res => {
            const list = res || [];
            setBookings(list);

            // Map bookings to slots
            const newSlots = [...emptySlots];
            list.forEach(b => {
                if (b.status !== 'CONFIRMED' && b.status !== 'REQUESTING') return;
                const start = new Date(b.startTime);
                const end = new Date(b.endTime);
                const dateStr = start.toISOString().split('T')[0];
                const startHour = start.getHours();
                const endHour = end.getHours() + (end.getMinutes() > 0 ? 1 : 0);

                newSlots.forEach(s => {
                    if (s.dateStr === dateStr && s.hour >= startHour && s.hour < endHour) {
                        s.status = 'booked';
                        s.bookingInfo = b;
                    }
                });
            });
            setSlots(newSlots);
        }).catch(err => console.error(err));
    }, [selectedVenueId]);

    const getSlot = (dayIndex: number, hour: number) =>
        slots.find(s => s.dayIndex === dayIndex && s.hour === hour);

    const toggleSlot = (dayIndex: number, hour: number) => {
        setSlots(prev => prev.map(s => {
            if (s.dayIndex !== dayIndex || s.hour !== hour) return s;
            if (s.status === 'booked') return s;
            return { ...s, status: s.status === 'available' ? 'blocked' : 'available' };
        }));
    };

    const slotCounts = {
        available: slots.filter(s => s.status === 'available').length,
        booked: slots.filter(s => s.status === 'booked').length,
        blocked: slots.filter(s => s.status === 'blocked').length,
    };

    return (
        <div className="venue-page">
            <div className="venue-page-header">
                <div>
                    <h1 className="venue-page-title">Lịch trống</h1>
                    <p className="venue-page-subtitle">Quản lý lịch cho thuê 7 ngày tới. Click ô trống để chặn/mở lịch.</p>
                </div>
            </div>

            {/* Space selector */}
            <div className="venue-card space-selector-bar">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Không gian:</span>
                    {isLoading ? <span>Đang tải...</span> : venues.map(v => (
                        <button key={v.id} className={`venue-chip-btn ${selectedVenueId === v.id ? 'active' : ''}`} onClick={() => setSelectedVenueId(v.id)}>{v.name}</button>
                    ))}
                </div>
                {venues.length > 0 && (
                    <div className="slot-legend">
                        <span className="legend-item avail">✅ {slotCounts.available} khả dụng</span>
                        <span className="legend-item booked">🔵 {slotCounts.booked} đã đặt</span>
                        <span className="legend-item blocked">⛔ {slotCounts.blocked} chặn</span>
                    </div>
                )}
            </div>

            {/* Calendar grid */}
            {!selectedVenueId ? <p>Vui lòng tạo Không gian trước khi quản lý Lịch.</p> : (
                <div className="venue-card calendar-wrap">
                    <div className="cal-grid">
                        {/* Header row */}
                        <div className="cal-hour-col" />
                        {dateLabels.map((lbl, i) => <div key={i} className="cal-day-header">{lbl}</div>)}

                        {/* Hour rows */}
                        {HOURS.map(h => (
                            <React.Fragment key={h}>
                                <div className="cal-hour-label">{h}:00</div>
                                {dateLabels.map((_, i) => {
                                    const slot = getSlot(i, h);
                                    return (
                                        <div
                                            key={i}
                                            className={`cal-cell ${slot?.status ?? 'available'}`}
                                            onClick={() => toggleSlot(i, h)}
                                            title={slot?.status === 'booked' ? `Đã có đặt phòng (Mã: ${slot.bookingInfo?.id?.substring(0, 8)})` : slot?.status === 'blocked' ? 'Đang chặn – click để mở' : 'Click để chặn'}
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
            )}
        </div>
    );
};

export default VenueCalendarPage;
