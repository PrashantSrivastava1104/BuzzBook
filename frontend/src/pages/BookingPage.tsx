import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { TripDetails } from '../types';
import SeatGrid from '../components/SeatGrid';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Clock, Calendar, ShieldCheck, Ticket, CheckCircle2, Sparkles } from 'lucide-react';

const BookingPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const res = await api.get(`/trips/${id}`);
                setTripDetails(res.data);
            } catch (err) {
                console.error('Failed to load trip', err);
                toast.error('Failed to load trip details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTripDetails();
    }, [id]);

    const handleToggleSeat = (seatId: number) => {
        if (!isAuthenticated) {
            toast.error('Please login to select seats', { icon: '🔒' });
            return;
        }

        setSelectedSeatIds(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            } else {
                if (prev.length >= 5) {
                    toast('Maximum 5 seats per booking', { icon: '⚠️', duration: 3000 });
                    return prev;
                }
                return [...prev, seatId];
            }
        });
    };

    const handleBooking = async () => {
        if (selectedSeatIds.length === 0) return;
        setSubmitting(true);

        try {
            await api.post('/bookings', {
                tripId: tripDetails?.trip.id,
                seatIds: selectedSeatIds
            });

            toast.success('🎉 Booking Confirmed!', { duration: 4000 });
            setTimeout(() => navigate('/'), 2500);
        } catch (err: any) {
            console.error('Booking failed', err);
            const msg = err.response?.data?.message || 'Booking failed';

            if (err.response?.status === 409) {
                toast.error(msg, { duration: 5000, icon: '⚠️' });
                const res = await api.get(`/trips/${id}`);
                setTripDetails(res.data);
                setSelectedSeatIds([]);
            } else {
                toast.error(msg, { icon: '❌' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center py-32">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-slate-500 font-medium">Loading your journey...</p>
        </div>
    );

    if (!tripDetails) return (
        <div className="flex flex-col items-center justify-center py-32">
            <div className="text-6xl mb-6">🚌</div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Trip Not Found</h2>
            <p className="text-slate-500 mb-8">This journey doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
                Back to Home
            </button>
        </div>
    );

    const totalPrice = selectedSeatIds.length * tripDetails.trip.price;
    const availableSeats = tripDetails.seats.filter(s => s.status === 'AVAILABLE').length;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Toaster position="top-center" />

            <button
                onClick={() => navigate('/')}
                className="group mb-8 flex items-center text-slate-500 hover:text-indigo-600 transition-all font-medium"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to All Trips
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Seat Selection */}
                <div className="flex-grow">
                    {/* Trip Info Card */}
                    <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 rounded-3xl shadow-2xl mb-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold mb-3">
                                        <Sparkles size={12} />
                                        Premium Journey
                                    </div>
                                    <h1 className="text-4xl font-black text-white mb-3">{tripDetails.trip.name}</h1>
                                    <div className="flex flex-wrap gap-6 text-indigo-100">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={18} />
                                            <span className="font-semibold">{new Date(tripDetails.trip.start_time).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={18} />
                                            <span className="font-semibold">{new Date(tripDetails.trip.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-5xl font-black text-white">₹{tripDetails.trip.price}</div>
                                    <div className="text-indigo-100 text-sm font-medium">per seat</div>
                                    <div className="mt-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-bold">
                                        {availableSeats} Seats Available
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seat Selection Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 md:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Select Your Seats</h2>
                            <p className="text-slate-500">Choose up to 5 seats for your journey</p>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-6 mb-10 p-6 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-lg bg-white border-2 border-slate-300 shadow-sm"></div>
                                <span className="text-sm font-semibold text-slate-600">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-300"></div>
                                <span className="text-sm font-semibold text-slate-600">Your Selection</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-lg bg-slate-300"></div>
                                <span className="text-sm font-semibold text-slate-600">Booked</span>
                            </div>
                        </div>

                        {/* Driver Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="px-8 py-2 bg-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest rounded-b-2xl flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs">🚗</div>
                                Driver Zone
                            </div>
                        </div>

                        <SeatGrid
                            seats={tripDetails.seats}
                            selectedSeatIds={selectedSeatIds}
                            onToggleSeat={handleToggleSeat}
                        />

                        {selectedSeatIds.length > 0 && (
                            <div className="mt-8 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                                <div className="flex items-center gap-2 text-indigo-700 text-sm font-semibold">
                                    <CheckCircle2 size={18} />
                                    You've selected {selectedSeatIds.length} seat{selectedSeatIds.length > 1 ? 's' : ''}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Booking Summary (Sticky) */}
                <div className="w-full lg:w-[420px]">
                    <div className="sticky top-24 bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6">
                            <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold mb-2">
                                <Ticket size={16} />
                                BOOKING SUMMARY
                            </div>
                            <h3 className="text-2xl font-black text-white">Your Order</h3>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Selected Seats Count */}
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Selected Seats</span>
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center">
                                        <span className="text-2xl font-black gradient-text">{selectedSeatIds.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Price per Seat</span>
                                    <span className="text-slate-900 font-bold text-lg">₹{tripDetails.trip.price}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Number of Seats</span>
                                    <span className="text-slate-900 font-bold text-lg">× {selectedSeatIds.length}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Total Amount</div>
                                        <div className="text-sm text-slate-600">Including all taxes</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-black gradient-text">₹{Math.round(totalPrice)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Login Warning */}
                            {!isAuthenticated && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3 items-start">
                                    <ShieldCheck size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-800">
                                        <div className="font-bold mb-1">Authentication Required</div>
                                        Please log in to complete your booking.
                                    </div>
                                </div>
                            )}

                            {/* CTA Button */}
                            <button
                                onClick={handleBooking}
                                disabled={selectedSeatIds.length === 0 || submitting || !isAuthenticated}
                                className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-300/50 hover:shadow-indigo-400/60 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-sm flex justify-center items-center gap-2 group"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white/40 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Confirm Booking
                                    </>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            </button>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-4 pt-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <ShieldCheck size={14} className="text-green-600" />
                                    <span className="font-semibold">Secure Payment</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 size={14} className="text-blue-600" />
                                    <span className="font-semibold">Instant Confirmation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
