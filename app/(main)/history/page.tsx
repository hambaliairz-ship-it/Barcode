import { getScanHistory } from "@/lib/data/history";
import { Package, Clock, Search, Calendar, Barcode } from "lucide-react";

export const dynamic = 'force-dynamic';

interface HistoryPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const { data: history, pagination } = await getScanHistory(page);

    return (
        <div className="space-y-6 pb-24">
            <header>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                    Scan History
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {pagination.totalItems} items found.
                </p>
            </header>

            {/* Pagination Controls Top (Optional) */}

            <div className="space-y-3">
                {history.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No history found</p>
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

            {/* Pagination Controls Bottom */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <a
                        href={`/history?page=${pagination.currentPage - 1}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.hasPrevPage
                                ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                : "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed pointer-events-none"
                            }`}
                    >
                        Previous
                    </a>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <a
                        href={`/history?page=${pagination.currentPage + 1}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.hasNextPage
                                ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                : "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed pointer-events-none"
                            }`}
                    >
                        Next
                    </a>
                </div>
            )}
        </div>
    );
}
