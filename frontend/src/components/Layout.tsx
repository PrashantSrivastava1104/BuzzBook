import type { ReactNode } from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <Toaster position="top-center" toastOptions={{
                className: 'rounded-xl shadow-lg border border-slate-100 text-sm font-medium',
                duration: 4000,
            }} />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-in fade-in duration-500">
                {children}
            </main>
            <footer className="border-t border-slate-800/50 bg-slate-900/40 backdrop-blur-sm mt-auto">
                <div className="max-w-7xl mx-auto py-8 px-4 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        &copy; {new Date().getFullYear()} BuzzBook. Engineered for concurrency.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
