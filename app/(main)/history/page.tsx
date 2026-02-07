import { getScanHistory } from "@/lib/data/history";
import { Package, Clock, Search, Calendar, Barcode } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const history = await getScanHistory();

    return (
        <div className="space-y-6 pb-24">
            <header>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                    Scan History
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Your recent scanning activity.
                </p>
            </header>

            {/* Search Bar (Visual Only for now) */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search history..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-500"
                />
            </div>

            <div className="space-y-3">
                {history.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No history yet</p>
                        <p className="text-xs text-slate-400 mt-1">Scanned items will appear here</p>
                    </div>
                ) : (
                    history.map((scan) => (
                        <div key={scan.id} className="group bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md dark:hover:shadow-none relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>

                            <div className="flex items-start gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-slate-700 transition-colors">
                                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 dark:text-white truncate pr-4">
                                        {scan.productName}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md font-mono">
                                            <Barcode className="w-3 h-3" />
                                            {scan.barcode}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="text-[10px] font-medium text-slate-400 block mb-1">
                                        {scan.timeAgo}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
