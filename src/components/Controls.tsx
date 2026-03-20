import React, { useState } from 'react';
import { Plus, Trash2, Search, Settings2, Database } from 'lucide-react';

interface ControlsProps {
  onInsert: (val: number) => Promise<void> | void;
  onDelete: (val: number) => Promise<void> | void;
  onFind: (val: number) => Promise<void> | void;
  onTraverse: (type: 'inorder' | 'preorder' | 'postorder') => Promise<void> | void;
  onLoadPreset: (values: number[]) => Promise<void> | void;
  isAnimating: boolean;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const PRESETS = [
  { name: 'Balanced Tree', values: [50, 25, 75, 12, 37, 62, 87] },
  { name: 'Skewed Left', values: [50, 40, 30, 20, 10] },
  { name: 'Skewed Right', values: [10, 20, 30, 40, 50] },
  { name: 'Random Mix', values: [42, 21, 68, 14, 33, 55, 91, 8, 19, 27, 39] },
];

export const Controls: React.FC<ControlsProps> = ({
  onInsert,
  onDelete,
  onFind,
  onTraverse,
  onLoadPreset,
  isAnimating,
  animationSpeed,
  onSpeedChange,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAction = async (action: (val: number) => Promise<void> | void) => {
    const values = inputValue.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (values.length > 0) {
      setInputValue('');
      for (const val of values) {
        await action(val);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="space-y-4">
        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Operations</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value (e.g. 10, 20, 5)"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            disabled={isAnimating}
          />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handleAction(onInsert)}
            disabled={isAnimating}
            className="flex items-center justify-center gap-1 px-1.5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[11px] font-bold uppercase truncate"
          >
            <Plus size={14} /> Insert
          </button>
          <button
            onClick={() => handleAction(onDelete)}
            disabled={isAnimating}
            className="flex items-center justify-center gap-1 px-1.5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[11px] font-bold uppercase truncate"
          >
            <Trash2 size={14} /> Delete
          </button>
          <button
            onClick={() => handleAction(onFind)}
            disabled={isAnimating}
            className="flex items-center justify-center gap-1 px-1.5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[11px] font-bold uppercase truncate"
          >
            <Search size={14} /> Find
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Presets</label>
        <div className="relative">
          <select
            onChange={(e) => {
              const preset = PRESETS.find(p => p.name === e.target.value);
              if (preset) onLoadPreset(preset.values);
            }}
            disabled={isAnimating}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer disabled:opacity-50"
            defaultValue=""
          >
            <option value="" disabled>Select a Preset Tree</option>
            {PRESETS.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Database size={14} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Traversals</label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onTraverse('inorder')}
            disabled={isAnimating}
            className="px-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] font-bold uppercase truncate"
            title="Inorder"
          >
            Inorder
          </button>
          <button
            onClick={() => onTraverse('preorder')}
            disabled={isAnimating}
            className="px-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] font-bold uppercase truncate"
            title="Preorder"
          >
            Preorder
          </button>
          <button
            onClick={() => onTraverse('postorder')}
            disabled={isAnimating}
            className="px-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] font-bold uppercase truncate"
            title="Postorder"
          >
            Postorder
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
            <Settings2 size={14} /> Animation Speed
          </label>
          <span className="text-xs font-mono text-slate-400">{animationSpeed}ms</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={animationSpeed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          disabled={isAnimating}
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>
    </div>
  );
};
