export default function Loader({ text = 'Analyzing...' }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="w-4 h-4 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin"></span>
      <span className="font-mono text-sm text-[#58a6ff]">{text}</span>
    </div>
  );
}
