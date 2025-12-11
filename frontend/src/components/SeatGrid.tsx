import React from 'react';
import type { Seat } from '../types';
import { Armchair, Check, Accessibility } from 'lucide-react';

interface SeatGridProps {
    seats: Seat[];
    selectedSeatIds: number[];
    onToggleSeat: (seatIds: number) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, selectedSeatIds, onToggleSeat }) => {
    // Define reserved seats
    const womenReservedSeats = [1, 5, 9, 13, 17]; // First 5 in column 1
    const disabledReservedSeats = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40]; // All 10 in column 4

    // Organize seats in bus layout: 2-2 configuration
    const rows: Seat[][] = [];
    for (let i = 0; i < seats.length; i += 4) {
        rows.push(seats.slice(i, i + 4));
    }

    const renderSeat = (seat: Seat) => {
        const isBooked = seat.status === 'BOOKED';
        const isSelected = selectedSeatIds.includes(seat.id);
        const isWomenReserved = womenReservedSeats.includes(seat.seat_number);
        const isDisabledReserved = disabledReservedSeats.includes(seat.seat_number);

        return (
            <button
                key={seat.id}
                disabled={isBooked}
                onClick={() => onToggleSeat(seat.id)}
                className={`
                    relative group flex flex-col items-center justify-center p-2 rounded-xl 
                    transition-all duration-300 w-14 h-14 border-b-4
                    ${isBooked
                        ? "bg-slate-700 border-slate-600 cursor-not-allowed opacity-60"
                        : isSelected
                            ? isWomenReserved
                                ? "bg-gradient-to-br from-pink-600 to-rose-700 border-pink-900 shadow-2xl shadow-pink-400/50 scale-110 z-10"
                                : isDisabledReserved
                                    ? "bg-gradient-to-br from-amber-600 to-orange-700 border-amber-900 shadow-2xl shadow-amber-400/50 scale-110 z-10"
                                    : "bg-gradient-to-br from-blue-600 to-purple-700 border-blue-900 shadow-2xl shadow-blue-400/50 scale-110 z-10"
                            : isWomenReserved
                                ? "bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/50 hover:border-pink-400 hover:shadow-xl hover:shadow-pink-200/50 hover:-translate-y-1 hover:scale-105 backdrop-blur-sm"
                                : isDisabledReserved
                                    ? "bg-gradient-to-br from-amber-500/30 to-orange-500/30 border-amber-400/60 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-200/50 hover:-translate-y-1 hover:scale-105 backdrop-blur-sm"
                                    : "bg-slate-800/50 border-slate-600 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-1 hover:scale-105"
                    }
                `}
                title={`Seat ${seat.seat_number}${isWomenReserved ? ' (Women Reserved)' : isDisabledReserved ? ' (Disabled/Senior Reserved)' : ''} - ${seat.status}`}
            >
                <div className="relative">
                    {isDisabledReserved && !isBooked ? (
                        <Accessibility
                            size={22}
                            className={`transition-all duration-300 ${isSelected
                                ? "text-white drop-shadow-lg"
                                : "text-amber-400 group-hover:text-amber-300 group-hover:scale-110"
                                }`}
                        />
                    ) : (
                        <Armchair
                            size={22}
                            className={`transition-all duration-300 ${isBooked
                                ? "text-slate-500"
                                : isSelected
                                    ? "text-white drop-shadow-lg"
                                    : isWomenReserved
                                        ? "text-pink-400 group-hover:text-pink-300 group-hover:scale-110"
                                        : "text-slate-400 group-hover:text-blue-400 group-hover:scale-110"
                                }`}
                        />
                    )}

                    {isSelected && (
                        <div className={`absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200`}>
                            <Check
                                size={12}
                                className={
                                    isWomenReserved
                                        ? "text-pink-600"
                                        : isDisabledReserved
                                            ? "text-amber-600"
                                            : "text-blue-600"
                                }
                                strokeWidth={3}
                            />
                        </div>
                    )}

                    {isWomenReserved && !isBooked && (
                        <div className="absolute -top-1 -left-1 text-[8px] font-black text-pink-400">♀</div>
                    )}

                    {isDisabledReserved && !isBooked && !isSelected && (
                        <div className="absolute -top-1 -right-1 text-[10px]">♿</div>
                    )}
                </div>

                <span className={`
                    text-[10px] font-black mt-1 transition-all duration-300
                    ${isBooked
                        ? "text-slate-500"
                        : isSelected
                            ? "text-white"
                            : "text-slate-900"
                    }
                `}>
                    {seat.seat_number}
                </span>

                {isSelected && (
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${isWomenReserved
                        ? 'from-pink-400/30 to-rose-600/30'
                        : isDisabledReserved
                            ? 'from-amber-400/30 to-orange-600/30'
                            : 'from-blue-400/30 to-purple-600/30'
                        } blur-xl -z-10 animate-pulse`}></div>
                )}
            </button>
        );
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mb-6 p-4 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-600">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-800/50 border-2 border-slate-600 rounded"></div>
                    <span className="text-xs text-slate-200 font-semibold">Regular</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-pink-500/30 to-rose-500/30 border-2 border-pink-500/50 rounded"></div>
                    <span className="text-xs text-pink-200 font-semibold">Women ♀</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-amber-500/40 to-orange-500/40 border-2 border-amber-400/70 rounded"></div>
                    <span className="text-xs text-amber-200 font-semibold">Disabled ♿</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-700 border-2 border-slate-600 rounded"></div>
                    <span className="text-xs text-slate-300 font-semibold">Booked</span>
                </div>
            </div>

            {/* Bus Layout */}
            <div className="space-y-3">
                {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex items-center gap-3 justify-center">
                        {/* Left Side - 2 seats */}
                        <div className="flex gap-2">
                            {row.slice(0, 2).map(seat => renderSeat(seat))}
                        </div>

                        {/* Aisle */}
                        <div className="w-8 flex items-center justify-center">
                            <div className="w-0.5 h-12 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 rounded-full"></div>
                        </div>

                        {/* Right Side - 2 seats */}
                        <div className="flex gap-2">
                            {row.slice(2, 4).map(seat => renderSeat(seat))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Row info */}
            <div className="text-center mt-4 text-xs text-slate-500 font-medium">
                {rows.length} Rows • 2-2 Configuration • {womenReservedSeats.length} Women • {disabledReservedSeats.length} Disabled
            </div>
        </div>
    );
};

export default SeatGrid;
