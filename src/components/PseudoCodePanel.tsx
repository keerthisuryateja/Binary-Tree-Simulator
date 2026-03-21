import React, { useState, useEffect } from 'react';
import { OperationType, PSEUDO_CODE } from '../types';
import { ChevronDown, Lightbulb } from 'lucide-react';
import magicScroll from '../../assets/magic_scroll.png';

interface PseudoCodePanelProps {
  operation: OperationType;
  currentLine: number;
  description: string;
  reasoning?: string;
}

export const PseudoCodePanel: React.FC<PseudoCodePanelProps> = ({ operation, currentLine, description, reasoning }) => {
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
    <div className="spellbook-shell">
      <h2 className="panel-heading spellbook-title">Algorithm Trace</h2>

      <div className="spellbook-controls">
        <div className="scroll-select-wrap">
          <select
            value={viewOperation}
            onChange={(e) => setViewOperation(e.target.value as OperationType)}
            disabled={operation !== 'none'}
            className="scroll-select"
          >
            {operations.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="scroll-select-chevron" />
        </div>
      </div>

      <div className="scroll-surface">
        <img src={magicScroll} alt="Pseudo-code panel" className="scroll-image" />

        <div className="scroll-content custom-scrollbar">
          {reasoning && operation === viewOperation && (
            <div className="reason-box">
              <div className="reason-head">
                <Lightbulb size={14} /> Decision Reasoning
              </div>
              <p>{reasoning}</p>
            </div>
          )}

          <div className="code-list">
            {code.map((line, index) => (
              <div
                key={index}
                className={`code-line ${
                  index === currentLine && operation === viewOperation
                    ? 'active-line'
                    : ''
                }`}
              >
                <span className="line-number">{index + 1}</span>
                <pre>{line}</pre>
              </div>
            ))}
          </div>

          {description && (
            <div className="step-note">
              <p className="note-label">Current Step</p>
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="step-counter">Step {currentLine >= 0 ? currentLine + 1 : 0} of {code.length}</div>
    </div>
  );
};
