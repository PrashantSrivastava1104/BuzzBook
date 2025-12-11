import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, LogOut, PlusCircle, Sparkles } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-2xl border-b border-slate-700/50 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-xl text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                                <Bus size={22} className="stroke-[2.5px]" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight group-hover:scale-105 transition-transform origin-left">
                                BuzzBook
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider -mt-1">Premium Travel</span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-tight">Welcome</span>
                                        <span className="text-white font-bold text-sm leading-tight">{user?.name}</span>
                                    </div>
                                </div>

                                <Link
                                    to="/add-trip"
                                    className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 font-semibold text-sm"
                                >
                                    <PlusCircle size={16} />
                                    <span>Add Trip</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-all font-medium group px-3 py-2 rounded-lg hover:bg-slate-800/50"
                                    title="Logout"
                                >
                                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-slate-300 hover:text-white font-semibold transition-colors text-sm px-4 py-2 rounded-lg hover:bg-slate-800/50"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:from-blue-700 hover:to-purple-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <Sparkles size={16} />
                                    <span>Get Started</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
