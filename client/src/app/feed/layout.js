import Navbar from '../../components/Navbar';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:pb-8">
        {children}
      </main>
    </div>
  );
}
