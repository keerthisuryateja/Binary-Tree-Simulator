import React, { useState, useEffect } from 'react';
import { OperationType, PSEUDO_CODE } from '../types';
import { ChevronDown, Code } from 'lucide-react';

interface PseudoCodePanelProps {
  operation: OperationType;
  currentLine: number;
  description: string;
}

export const PseudoCodePanel: React.FC<PseudoCodePanelProps> = ({ operation, currentLine, description }) => {
  const [viewOperation, setViewOperation] = useState<OperationType>('insert');

  // Sync view with active operation
  useEffect(() => {
    if (operation !== 'none') {
      setViewOperation(operation);
    }
  }, [operation]);

  const code = PSEUDO_CODE[viewOperation];

  const operations: { value: OperationType; label: string }[] = [
    { value: 'insert', label: 'Insert' },
    { value: 'delete', label: 'Delete' },
    { value: 'find', label: 'Find' },
    { value: 'inorder', label: 'Inorder' },
    { value: 'preorder', label: 'Preorder' },
    { value: 'postorder', label: 'Postorder' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Code size={14} className="text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pseudo Code</span>
        </div>
        
        <div className="relative group">
          <select
            value={viewOperation}
            onChange={(e) => setViewOperation(e.target.value as OperationType)}
            disabled={operation !== 'none'}
            className="appearance-none bg-slate-700 text-blue-400 text-[10px] font-bold uppercase px-3 py-1 pr-7 rounded border border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer"
          >
            {operations.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-1 custom-scrollbar">
        {code.map((line, index) => (
          <div
            key={index}
            className={`px-2 py-1 rounded transition-all duration-200 ${
              index === currentLine && operation === viewOperation
                ? 'bg-blue-600/40 text-blue-100 border-l-2 border-blue-500 shadow-sm'
                : 'hover:bg-slate-800/30'
            }`}
          >
            <span className="inline-block w-6 text-slate-600 select-none text-xs">{index + 1}</span>
            <pre className="inline whitespace-pre-wrap">{line}</pre>
          </div>
        ))}
      </div>

      {description && (
        <div className="bg-slate-800/80 p-4 border-t border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-[10px] text-blue-400 uppercase mb-1 tracking-wider font-bold">Current Step</p>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">{description}</p>
        </div>
      )}
    </div>
  );
};
