'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export function InputPanel({
  disabled,
  onProcess,
}: {
  disabled: boolean;
  onProcess: (source: string, mode: 'file' | 'text') => void;
}) {
  const [mode, setMode] = useState<'file' | 'text'>('file');
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onProcess(trimmed, mode);
    setInput('');
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-1">
        {(['file', 'text'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs px-3 py-1 rounded-md transition-colors ${
              mode === m
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {m === 'file' ? 'File' : 'Text'}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        {mode === 'file' ? (
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g., /path/to/document.pdf"
            disabled={disabled}
            className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-purple-500/50 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 disabled:opacity-50"
          />
        ) : (
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste document text here..."
            disabled={disabled}
            rows={3}
            className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-purple-500/50 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 disabled:opacity-50 resize-none"
          />
        )}
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white rounded-lg px-4 py-2 transition-colors self-end"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
