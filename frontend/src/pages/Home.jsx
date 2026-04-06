import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAnalyze = () => {
    navigate("/triage", { state: { issue: { title, description } } });
  };

  return (
    <main className="pt-[52px]">
      {/* Hero Section */}
      <section className="relative min-h-[870px] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 dot-grid -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/20 rounded-full blur-[120px] -z-20"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-secondary-container/10 rounded-full blur-[100px] -z-20"></div>

        {/* Content */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant/20 bg-surface-container-low/50 backdrop-blur-sm shadow-sm">
            <span className="text-primary text-sm">✦</span>
            <span className="text-xs font-label tracking-wider uppercase text-on-surface-variant">
              AI-Powered Triage · Now in Beta
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-[0.9] text-white">
            Stop triaging issues<br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              manually.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-outline max-w-2xl mx-auto font-body leading-relaxed">
            AI classifies, deduplicates, and prioritizes your GitHub issues in milliseconds. 
            Let your engineers focus on code, not on cleanup.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => document.getElementById('issue-form').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-primary-container text-on-primary-container font-headline font-bold rounded-full hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all active:scale-95 duration-200"
            >
              Analyze an Issue →
            </button>
            <button className="px-8 py-4 border border-outline-variant/30 text-on-surface font-headline font-bold rounded-full hover:bg-white/5 transition-all active:scale-95 duration-200">
              View Dashboard
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-12">
            <div className="glass-card px-6 py-3 rounded-xl border border-white/5 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                trending_up
              </span>
              <span className="text-sm font-label tracking-wide">↑ 94% accuracy</span>
            </div>
            <div className="glass-card px-6 py-3 rounded-xl border border-white/5 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <span className="text-sm font-label tracking-wide">⚡ &lt;200ms</span>
            </div>
            <div className="glass-card px-6 py-3 rounded-xl border border-white/5 flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                all_inclusive
              </span>
              <span className="text-sm font-label tracking-wide">∞ Any repo size</span>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Section */}
      <section id="issue-form" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Subtle Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[80px]"></div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-headline font-bold text-white tracking-tight">New Issue</h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    <span className="text-[10px] font-label uppercase tracking-[0.2em] text-outline">AI Ready</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white/20 text-4xl">edit_note</span>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-label text-outline tracking-widest uppercase block ml-1">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-4 text-white font-headline font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-white/10"
                    placeholder="e.g. Memory leak in production when scaling workers"
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-label text-outline tracking-widest uppercase block ml-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-4 text-white font-body focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-white/10"
                    placeholder="Describe the behavior, steps to reproduce, and any logs..."
                    rows="6"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-md border border-secondary/20 bg-secondary/5">
                    <span className="text-[10px] font-label text-secondary uppercase tracking-wider">
                      text-embedding-3-small
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-md border border-white/5 bg-white/5">
                    <span className="text-[10px] font-label text-outline uppercase tracking-wider">
                      v4_optimized
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="w-full md:w-auto px-10 py-4 bg-primary-container text-on-primary-container font-headline font-bold rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  Analyze Issue
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="py-12 border-t border-white/5 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors">
              <span className="material-symbols-outlined text-primary text-xl">layers</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-headline font-bold text-white tracking-tight">Semantic Deduplication</h3>
              <p className="text-sm text-outline leading-relaxed">
                Automatically identifies issues with similar intent, even if the phrasing differs.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-white/5 group-hover:border-secondary/30 transition-colors">
              <span className="material-symbols-outlined text-secondary text-xl">label</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-headline font-bold text-white tracking-tight">Auto Classification</h3>
              <p className="text-sm text-outline leading-relaxed">
                Assigns labels like Bug, Feature, or Question based on deep context understanding.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-white/5 group-hover:border-tertiary/30 transition-colors">
              <span className="material-symbols-outlined text-tertiary text-xl">priority_high</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-headline font-bold text-white tracking-tight">Priority Scoring</h3>
              <p className="text-sm text-outline leading-relaxed">
                Calculates urgency by analyzing impact, severity, and customer urgency signals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-sm font-headline text-slate-400">
            <span className="material-symbols-outlined text-violet-400/50" style={{ fontVariationSettings: "'FILL' 1" }}>
              terminal
            </span>
            OpenIssue AI © 2024
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-label text-outline hover:text-white uppercase tracking-widest">
              Docs
            </a>
            <a href="#" className="text-xs font-label text-outline hover:text-white uppercase tracking-widest">
              Security
            </a>
            <a href="#" className="text-xs font-label text-outline hover:text-white uppercase tracking-widest">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
