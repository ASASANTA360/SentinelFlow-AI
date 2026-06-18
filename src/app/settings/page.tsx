export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#020617] p-8 text-white">
      <h1 className="text-4xl font-black">Settings</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold">Platform Mode</h2>
          <p className="mt-2 text-slate-400">Enterprise demo environment</p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold">AI Engine</h2>
          <p className="mt-2 text-slate-400">Gemini-powered risk analysis</p>
        </div>
      </div>
    </main>
  );
}