import { getInsights } from "@/lib/data/history";
import { BarChart3, TrendingUp, Clock, Zap } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
    const { topCategories, totalScanned, peakHour, mostActiveCategory } = await getInsights();

    return (
        <div className="space-y-6 pb-24">
            <header>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                    AI Insights
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Analyze your scanning habits with AI.
                </p>
            </header>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            Peak Hour
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {peakHour}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                            Most active scanning time
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <Zap className="w-3 h-3" />
                            Top Category
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white truncate" title={mostActiveCategory}>
                            {mostActiveCategory}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                            Most frequent items
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Distribution */}
            <section className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Category Distribution</h2>
                </div>

                <div className="space-y-4">
                    {topCategories.length === 0 ? (
                        <p className="text-center text-slate-400 text-sm py-4">No data available yet.</p>
                    ) : (
                        topCategories.map((cat, index) => (
                            <div key={cat.name} className="group">
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                                    <span className="text-slate-500 font-mono text-xs">{cat.value} scans</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ease-out bg-linear-to-r ${getGradient(index)}`}
                                        style={{ width: `${(cat.value / totalScanned) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* AI Suggestion Card (Static for now) */}
            <section className="bg-linear-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-80 decoration-slice">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">AI Suggestion</span>
                    </div>
                    <p className="text-lg font-medium leading-relaxed">
                        "Your scanning pattern suggests a focus on <strong>{mostActiveCategory}</strong>. Try exploring similar healthy alternatives!"
                    </p>
                </div>
            </section>
        </div>
    );
}

function getGradient(index: number) {
    const gradients = [
        "from-blue-500 to-cyan-400",
        "from-purple-500 to-pink-400",
        "from-amber-400 to-orange-500",
        "from-emerald-400 to-teal-500",
        "from-slate-400 to-slate-500"
    ];
    return gradients[index % gradients.length];
}
