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
                    <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text drop-shadow-sm">
                        RzValor
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Smart Inventory Tracker</p>
                        <span className="text-slate-400 dark:text-slate-700">•</span>
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${aiStatus.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                aiStatus.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                                AI: {aiStatus.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-800">
                    RZ
                </div>
            </header>

            <section className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-white relative z-10">
                    <ScanBarcode className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    Overview
                </h2>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Total Scans</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalScans}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Saved Products</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalProducts}</p>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                        <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                        Recent Activity
                    </h2>
                    <Link href="/history" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-400/10 px-3 py-1.5 rounded-full border border-blue-100 dark:border-transparent">
                        View All
                    </Link>
                </div>

                <div className="space-y-3">
                    {recentScans.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                            <p className="text-slate-500 text-sm">No scans yet. Start scanning!</p>
                        </div>
                    ) : (
                        recentScans.map((scan) => (
                            <div key={scan.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-slate-700 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 group">
                                <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-colors">
                                    <Package className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{scan.productName}</p>
                                    <p className="text-xs text-slate-500 font-mono truncate hidden sm:block">{scan.barcode}</p>
                                    <p className="text-xs text-slate-400 sm:hidden">{scan.barcode.substring(0, 10)}...</p>
                                </div>
                                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 shrink-0 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md">
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
