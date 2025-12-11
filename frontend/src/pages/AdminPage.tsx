import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Bus, Calendar, DollarSign, LayoutGrid } from 'lucide-react';

const CreateTripPage = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [startTime, setStartTime] = useState('');
    // Fixed at 40 seats as per requirement
    const totalSeats = 40;
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Combine Source and Destination into the 'name' field expected by backend
            const tripName = `${source} → ${destination}`;

            await api.post('/trips', {
                name: tripName,
                start_time: startTime,
                total_seats: totalSeats,
                price
            });

            alert('Trip created successfully!');
            navigate('/');
        } catch (error) {
            console.error('Failed to create trip', error);
            alert('Failed to create trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="bg-white rounded-3xl shadow-xl border border-indigo-50 overflow-hidden">
                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <PlusCircle className="text-indigo-400" /> Create New Trip
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Add a new bus route and schedule</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl">
                        <Bus className="text-white" size={24} />
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Source City</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors font-bold text-xs">FROM</div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                                        placeholder="e.g. Mumbai"
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Destination City</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors font-bold text-xs">TO</div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                                        placeholder="e.g. Pune"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Start Time</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Price per Seat (₹)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="1"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                                        value={price}
                                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Hidden info about fixed seats */}
                        <div className="px-4 py-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                            <LayoutGrid size={18} className="text-amber-500" />
                            <p className="text-xs text-amber-700 font-medium">Standard Bus Configuration: <span className="font-bold">40 Seats (2+2 Layout)</span></p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Route...' : 'Create Route'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTripPage;
