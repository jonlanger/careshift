import { AppShell } from "@/components/app/app-shell";
import { CareshiftProvider } from "@/lib/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CareshiftProvider>
      <AppShell>{children}</AppShell>
    </CareshiftProvider>
  );
}
