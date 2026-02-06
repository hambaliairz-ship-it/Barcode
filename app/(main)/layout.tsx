
import { BottomNav } from "@/components/layout/BottomNav";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="container mx-auto px-4 py-8 max-w-md">
            {children}
            <BottomNav />
        </main>
    );
}
