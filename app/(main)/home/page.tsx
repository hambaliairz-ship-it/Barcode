
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                        RzValor
                    </h1>
                    <p className="text-sm text-slate-400">Welcome back, User</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700" />
            </header>

            <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <h2 className="text-lg font-semibold mb-2">Today's Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800 rounded-xl">
                        <p className="text-xs text-slate-400">Scans</p>
                        <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl">
                        <p className="text-xs text-slate-400">Products</p>
                        <p className="text-2xl font-bold">8</p>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Recent Scans</h2>
                    <Link href="/history" className="text-xs text-blue-400">View all</Link>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                            <div className="h-10 w-10 rounded-lg bg-slate-800" />
                            <div>
                                <p className="font-medium text-sm">Product Name {i}</p>
                                <p className="text-xs text-slate-400">2 mins ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
