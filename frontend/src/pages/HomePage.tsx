import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Trip } from '../types';
import { Calendar, Clock, Users, ArrowRight, MapPin, TrendingUp, Shield, Zap } from 'lucide-react';

const HomePage = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await api.get('/trips');
                setTrips(res.data);
            } catch (err) {
                console.error('Failed to fetch trips', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <section className="relative -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-purple-500/20">
                    {/* Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>

                    <div className="relative z-10 px-6 md:px-12 py-12 md:py-16">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                {/* Left Content */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold mb-4">
                                        <Zap size={14} className="text-yellow-300" />
                                        <span>India's Premium Bus Network</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black mb-3 text-white leading-tight">
                                        Travel Smart,
                                        <br />
                                        <span className="text-pink-200">Arrive Happy</span>
                                    </h1>
                                    <p className="text-lg text-blue-50 mb-6 max-w-xl">
                                        Book your journey across India with real-time seat selection and instant confirmation.
                                    </p>
                                    <button
                                        onClick={() => document.getElementById('trips')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="group px-8 py-3 bg-white text-purple-700 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 mx-auto md:mx-0"
                                    >
                                        Browse Routes
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {/* Right Stats */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-white mb-1">50K+</div>
                                        <div className="text-blue-100 text-xs font-medium">Travelers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-white mb-1">6</div>
                                        <div className="text-blue-100 text-xs font-medium">Routes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-white mb-1">24/7</div>
                                        <div className="text-blue-100 text-xs font-medium">Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
                {[
                    { icon: Shield, text: 'Secure', color: 'from-blue-500 to-blue-600' },
                    { icon: TrendingUp, text: 'Real-time', color: 'from-purple-500 to-purple-600' },
                    { icon: Zap, text: 'Instant', color: 'from-pink-500 to-pink-600' },
                ].map((feature, idx) => (
                    <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} text-white font-semibold text-sm shadow-lg shadow-${feature.color.split('-')[1]}-500/30`}>
                        <feature.icon size={14} />
                        <span>{feature.text}</span>
                    </div>
                ))}
            </div>

            {/* Trips Grid */}
            <div id="trips" className="scroll-mt-20">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={20} className="text-blue-400" />
                        <h2 className="text-2xl font-black text-white">Available Routes</h2>
                    </div>
                    <p className="text-slate-400 text-sm">Choose your journey and book instantly</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-slate-800/50 border border-slate-700 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : trips.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-dashed border-slate-700">
                        <div className="text-4xl mb-3">🚌</div>
                        <p className="text-slate-400">No trips available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trips.map((trip) => (
                            <div key={trip.id} className="group bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border border-slate-700/60 hover:border-purple-500/40 overflow-hidden hover:-translate-y-1">
                                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors mb-1">
                                                {trip.name}
                                            </h3>
                                            <div className="text-xs text-slate-500 font-medium">Bus #{trip.id + 100}</div>
                                        </div>
                                    </div>

                                    {/* Trip Info */}
                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar size={14} className="text-blue-400" />
                                            <span>{new Date(trip.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Clock size={14} className="text-purple-400" />
                                            <span>{new Date(trip.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Users size={14} className="text-pink-400" />
                                            <span className="font-semibold">{(trip as any).available_seats || trip.total_seats}/{trip.total_seats} Available</span>
                                        </div>
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-slate-500 font-semibold mb-0.5">From</div>
                                            <div className="text-2xl font-black gradient-text">₹{trip.price}</div>
                                        </div>
                                        <Link
                                            to={`/booking/${trip.id}`}
                                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105 flex items-center gap-1"
                                        >
                                            Book
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
