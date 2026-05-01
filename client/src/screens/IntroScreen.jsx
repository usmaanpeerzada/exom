export default function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-indigo-600 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-80px] right-[-60px] w-64 h-64 rounded-full bg-violet-500 opacity-40 blur-3xl" />
      <div className="absolute bottom-[-60px] left-[-40px] w-56 h-56 rounded-full bg-blue-400 opacity-30 blur-3xl" />

      {/* Top section */}
      <div className="flex-1 flex flex-col justify-center px-7 pt-20 pb-10 relative z-10">
        {/* App name */}
        <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-3">
          Exom<span className="text-yellow-300">.</span>
        </h1>
        <p className="text-indigo-200 text-lg font-medium leading-snug mb-12">
          Snap your notes.<br />Get real PYQs instantly.
        </p>

        {/* Features */}
        <div className="flex flex-col gap-4">
          {[
            { icon: '📸', title: 'Snap anything', desc: 'Notes, textbook pages, diagrams. Any photo works.' },
            { icon: '🎯', title: 'Built for Indian exams', desc: 'Trained on JEE, NEET, CUET and CBSE patterns. Finds the exact concept from the chapter.' },
            { icon: '📝', title: 'Real PYQs in seconds', desc: 'JEE, NEET, CUET and CBSE question banks' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4 bg-white/10 rounded-2xl px-4 py-4">
              <span className="text-2xl mt-0.5">{f.icon}</span>
              <div>
                <p className="text-white font-bold text-sm">{f.title}</p>
                <p className="text-indigo-200 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-7 pb-14 relative z-10">
        <button
          onClick={onStart}
          className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-base
                     active:scale-95 transition-transform shadow-2xl"
        >
          Get Started →
        </button>
        <p className="text-center text-indigo-300 text-xs mt-4">No sign-up needed. Just snap and go.</p>
      </div>
    </div>
  )
}
