import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import IssueForm from '../components/IssueForm';
import { validateIssueForm, hasErrors } from '../utils/helpers';
import { triageIssue } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateIssueForm(title, description);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const result = await triageIssue(title, description);
      navigate('/triage', { state: { issue: { title, description }, result } });
    } catch (error) {
      console.error('Triage failed:', error);
      // fallback: navigate with just issue data
      navigate('/triage', { state: { issue: { title, description } } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopNavBar currentPage="HOME" />
      <main className="relative pt-14 min-h-screen overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 hero-gradient pointer-events-none"></div>

        <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 flex flex-col items-center">
          {/* Hero */}
          <div className="text-center mb-16 max-w-2xl">
            <h1 className="font-mono font-bold text-[48px] leading-tight tracking-tighter text-slate-100 mb-4">
              Triage Issues. <span className="text-[#58a6ff]">Instantly.</span>
            </h1>
            <p className="text-[16px] text-[#8b949e] font-body">
              Automate your open-source maintenance. Identify duplicates, assign labels, and track
              SLOs with neural-engine precision.
            </p>
          </div>

          {/* Form Card */}
          <div className="w-full max-w-[680px] bg-surface-container border border-outline-variant/30 rounded-[12px] p-[32px] shadow-2xl">
            <IssueForm
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
              onSubmit={handleSubmit}
              loading={loading}
              errors={errors}
            />
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16">
            <div className="bg-surface-container border border-outline-variant/20 rounded-xl p-6 hover:border-primary-container/50 hover:bg-surface-container-high transition-all">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center mb-4 border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary-container">content_copy</span>
              </div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-slate-100 mb-2">Deduplication</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">Vector-based similarity checks to catch duplicate issues before they clutter your backlog.</p>
            </div>
            <div className="bg-surface-container border border-outline-variant/20 rounded-xl p-6 hover:border-primary-container/50 hover:bg-surface-container-high transition-all">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center mb-4 border border-outline-variant/10">
                <span className="material-symbols-outlined text-tertiary">label</span>
              </div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-slate-100 mb-2">Auto-Labeling</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">Intelligent categorization using custom LLM models trained on your project's unique taxonomy.</p>
            </div>
            <div className="bg-surface-container border border-outline-variant/20 rounded-xl p-6 hover:border-primary-container/50 hover:bg-surface-container-high transition-all">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center mb-4 border border-outline-variant/10">
                <span className="material-symbols-outlined text-error">timer</span>
              </div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-slate-100 mb-2">SLO Tracking</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">Monitor response times and resolution health with automated alerts for critical regressions.</p>
            </div>
          </div>
        </section>
      </main>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-20"></div>
    </>
  );
}
