import { checkAiStatus } from '@/lib/actions/check-ai';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/data/dashboard';
import { Package, ScanBarcode, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function HomePage() {
    const { totalScans, totalProducts, recentScans } = await getDashboardStats();
    // Disabled AI check to save quota (15 RPM limit)
    const aiStatus = { status: 'online', message: 'Ready' };

    return (
        <div className="space-y-6 pb-24">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                        RzValor
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-400">Smart Inventory Tracker</p>
                        <span className="text-slate-700">•</span>
                        <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700/50">
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${aiStatus.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                aiStatus.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                AI: {aiStatus.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    RZ
                </div>
            </header>

            <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ScanBarcode className="w-5 h-5 text-blue-400" />
                    Overview
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                        <p className="text-xs text-slate-400 mb-1">Total Scans</p>
                        <p className="text-3xl font-bold text-white">{totalScans}</p>
                    </div>
                    <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                        <p className="text-xs text-slate-400 mb-1">Saved Products</p>
                        <p className="text-3xl font-bold text-blue-400">{totalProducts}</p>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-400" />
                        Recent Activity
                    </h2>
                    <Link href="/history" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 px-3 py-1 rounded-full">
                        View All
                    </Link>
                </div>

                <div className="space-y-3">
                    {recentScans.length === 0 ? (
                        <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                            <p className="text-slate-500 text-sm">No scans yet. Start scanning!</p>
                        </div>
                    ) : (
                        recentScans.map((scan) => (
                            <div key={scan.id} className="flex items-center gap-4 p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                                <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                    <Package className="w-6 h-6 text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-white truncate">{scan.productName}</p>
                                    <p className="text-xs text-slate-500 font-mono truncate">{scan.barcode}</p>
                                </div>
                                <p className="text-[10px] text-slate-400 shrink-0 bg-slate-800/50 px-2 py-1 rounded-md">
                                    {scan.timeAgo}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
