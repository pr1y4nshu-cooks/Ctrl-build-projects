import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function TriageResultsPage() {
  const location = useLocation();
  const issue = location.state?.issue || {
    title: "Authentication failure on secondary cluster nodes...",
    id: 1247,
  };

  const [expandedDuplicate, setExpandedDuplicate] = useState(0);

  const duplicates = [
    {
      id: 0,
      title: "JWKS timeout on region-east-2 secondary deployments",
      match: 88,
      excerpt: "...seeing intermittent 504 errors when secondary nodes attempt to pull the signing keys from our internal OIDC proxy. Logs attached below show the timeout happening at exactly 500ms...",
      status: "open",
    },
    {
      id: 1,
      title: "Cluster node initialization sequence failing in v2.4.1",
      match: 42,
      status: "closed",
    },
    {
      id: 2,
      title: "Secondary node replication lag across multi-region",
      match: 29,
      status: "closed",
    },
  ];

  return (
    <>
      <main className="lg:ml-[220px] pt-20 pb-24 px-6 md:px-10 max-w-7xl">
        {/* Breadcrumbs & Header */}
        <header className="mb-10">
          <div className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span>OpenIssue</span>
            <span className="text-slate-700">/</span>
            <span>Triage</span>
            <span className="text-slate-700">/</span>
            <span className="text-violet-400">Results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-white tracking-tight leading-tight mb-6">
            {issue.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-tertiary-container/20 text-tertiary rounded-lg text-xs font-mono border border-tertiary/20">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              open
            </div>
            <div className="px-3 py-1 bg-surface-container text-slate-400 rounded-lg text-xs font-mono">
              #{issue.id || 1247}
            </div>
            <div className="text-slate-500 text-xs font-mono">Analyzed 2s ago</div>
          </div>
        </header>

        {/* Result Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Classification */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-white/5 group hover:border-violet-500/30 transition-all">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">Classification</p>
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-md font-mono text-xs font-bold uppercase">
                BUG
              </span>
              <span className="font-headline font-bold text-2xl text-white">94%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-violet-500 h-full w-[94%] shadow-[0_0_10px_rgba(124,58,237,0.5)]"></div>
            </div>
            <p className="text-slate-500 text-[10px] mt-2 font-mono">Confidence rating</p>
          </div>

          {/* Card 2: Priority */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-white/5 group hover:border-error/30 transition-all">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">Priority & Impact</p>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 bg-error/10 text-error border border-error/20 rounded-full flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
                CRITICAL
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] rounded border border-white/5 font-mono">
                Production
              </span>
              <span className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] rounded border border-white/5 font-mono">
                Auth System
              </span>
            </div>
          </div>

          {/* Card 3: Smart Labels */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-white/5 group hover:border-secondary/30 transition-all">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">Suggested Labels</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] rounded border border-violet-500/10 font-mono">
                bug
              </span>
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] rounded border border-secondary/10 font-mono">
                authentication
              </span>
              <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] rounded border border-tertiary/10 font-mono">
                cluster
              </span>
              <span className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] rounded border border-white/5 font-mono">
                oidc
              </span>
              <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] rounded border border-error/10 font-mono">
                p0-critical
              </span>
            </div>
            <button className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs">add</span>
              Add label
            </button>
          </div>
        </div>

        {/* AI Insight Panel */}
        <section className="mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.5)]"></div>
          <div className="bg-surface-container-low/50 border border-white/5 rounded-r-xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 border border-violet-500/30">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-white">AI Analysis Insight</h3>
                <p className="font-mono text-[10px] text-slate-500">Triage Decision Reasoning</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
              <div className="md:col-span-3">
                <p className="text-on-surface leading-relaxed text-sm">
                  The error logs indicate a synchronization mismatch in the OIDC provider handshake specifically during
                  traffic bursts. The trace shows that while primary nodes maintain consistent key rotations, secondary
                  clusters fail to refresh JWKS endpoints within the 500ms timeout threshold. This signature matches known
                  race conditions in the <span className="text-secondary font-mono">auth-orchestrator-v2</span> module.
                  Recommendation is categorized as <span className="text-error font-bold">Critical</span> due to the failure
                  preventing legitimate user login across all failover regions.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-white/5 pl-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      className="text-white/5"
                      cx="48"
                      cy="48"
                      fill="transparent"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <circle
                      className="text-violet-500"
                      cx="48"
                      cy="48"
                      fill="transparent"
                      r="40"
                      stroke="currentColor"
                      strokeDasharray="251.2"
                      strokeDashoffset="15"
                      strokeWidth="4"
                    ></circle>
                  </svg>
                  <span className="absolute font-headline font-bold text-xl text-white">94%</span>
                </div>
                <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mt-2">Confidence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Possible Duplicates */}
        <section className="mb-20">
          <h2 className="font-headline font-bold text-xl text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500">content_copy</span>
            Potential Duplicates
          </h2>
          <div className="space-y-3">
            {duplicates.map((dup) => (
              <div
                key={dup.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  expandedDuplicate === dup.id
                    ? "bg-surface-container border-secondary/30"
                    : "bg-surface-container-low hover:bg-surface-container border-white/5"
                }`}
              >
                <div
                  className="p-5 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedDuplicate(expandedDuplicate === dup.id ? null : dup.id)}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dup.status === "open" ? "bg-tertiary" : "bg-slate-700"
                      }`}
                    ></span>
                    <a
                      href="#"
                      className={`font-medium text-sm ${
                        expandedDuplicate === dup.id
                          ? "text-secondary hover:underline"
                          : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {dup.title}
                    </a>
                    <div
                      className={`px-2 py-0.5 text-[9px] font-mono border rounded ${
                        dup.match >= 80
                          ? "bg-secondary/10 text-secondary border-secondary/20"
                          : "bg-white/5 text-slate-500 border-white/5"
                      }`}
                    >
                      {dup.match}% Match
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-500">
                    {expandedDuplicate === dup.id ? "expand_less" : "expand_more"}
                  </span>
                </div>

                {expandedDuplicate === dup.id && dup.excerpt && (
                  <div className="px-5 pb-5 pt-0 border-t border-white/5">
                    <div className="mt-4 p-4 bg-surface-container-lowest rounded-lg border border-white/5">
                      <p className="text-slate-400 text-xs leading-relaxed font-mono italic">"{dup.excerpt}"</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border border-surface bg-slate-700"></div>
                        <div className="w-6 h-6 rounded-full border border-surface bg-slate-600"></div>
                      </div>
                      <a
                        href="#"
                        className="text-secondary font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        View on GitHub
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Action Bar (Sticky Glass) */}
      <footer className="fixed bottom-0 w-full z-50 px-6 py-4 flex justify-center pointer-events-none">
        <div className="w-full max-w-5xl glass-card border border-white/10 rounded-2xl shadow-2xl flex items-center justify-between px-6 py-3 pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-violet-500 text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xs">Issue #{issue.id || 1247} analyzed</span>
              <span className="text-slate-500 font-mono text-[9px] uppercase tracking-widest">
                Awaiting triage confirmation
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
              Re-analyze
            </button>
            <button className="px-4 py-2 bg-transparent border border-tertiary/50 text-tertiary rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-tertiary/10 transition-all">
              Mark Resolved
            </button>
            <button className="px-6 py-2 bg-primary-container text-white rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:scale-105 transition-transform">
              Apply Labels
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
