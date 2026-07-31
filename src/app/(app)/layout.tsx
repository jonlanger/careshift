export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="atmosphere min-h-full">
      {children}
    </div>
  );
}
