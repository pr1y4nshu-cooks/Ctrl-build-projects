import Loader from './Loader';

export default function IssueForm({ title, onTitleChange, description, onDescriptionChange, onSubmit, loading, errors }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <label className="block font-mono text-xs uppercase tracking-widest text-slate-400">
          Issue Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Briefly describe the bug or feature request..."
          disabled={loading}
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all terminal-glow"
        />
        {errors?.title && (
          <p className="text-xs text-red-400 font-mono">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label className="block font-mono text-xs uppercase tracking-widest text-slate-400">
          Issue Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Provide context, reproduction steps, or expected behavior..."
          rows="6"
          disabled={loading}
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all terminal-glow resize-none"
        />
        {errors?.description && (
          <p className="text-xs text-red-400 font-mono">{errors.description}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[48px] bg-[#58a6ff] text-background font-mono font-bold uppercase tracking-widest rounded-lg hover:bg-[#79c0ff] hover:-translate-y-[1px] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader text="Analyzing..." /> : (
            <>
              Analyze Issue
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </>
          )}
        </button>
        <p className="mt-4 text-center text-[12px] text-[#484f58] font-mono">
          ⚡ Powered by OpenAI text-embedding-3-small
        </p>
      </div>
    </form>
  );
}
