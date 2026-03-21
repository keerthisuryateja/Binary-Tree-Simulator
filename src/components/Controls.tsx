import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import buttonPlant from '../../assets/button_plant_v2.png';
import buttonHarvest from '../../assets/button_harvest.png';
import buttonSearch from '../../assets/button_search.png';
import squirrelIcon from '../../assets/squirrel.png';
import magicPotion from '../../assets/magic_potion.png';

interface ControlsProps {
  onInsert: (val: number) => Promise<void> | void;
  onInsertMany?: (vals: number[]) => Promise<void> | void;
  onReset: () => void;
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
  onInsertMany,
  onReset,
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

      if (action === onInsert && onInsertMany && values.length > 1) {
        await onInsertMany(values);
        return;
      }

      for (const val of values) {
        await action(val);
      }
    }
  };

  return (
    <div className="spell-card">
      <h2 className="panel-heading">Binary Tree Controls</h2>

      <div className="value-entry">
        <label htmlFor="value-input" className="mini-label">VALUES</label>
        <input
          id="value-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="10, 20, 5"
          className="spell-input"
          disabled={isAnimating}
        />
      </div>

      <div className="spell-buttons">
        <button onClick={() => handleAction(onInsert)} disabled={isAnimating} className="spell-btn plant">
          <img src={buttonPlant} alt="Insert icon" className="spell-icon" />
          <span className="spell-text-wrap">
            <strong>Insert Node</strong>
            <small>Insert</small>
          </span>
        </button>

        <button onClick={() => handleAction(onDelete)} disabled={isAnimating} className="spell-btn harvest">
          <img src={buttonHarvest} alt="Delete icon" className="spell-icon" />
          <span className="spell-text-wrap">
            <strong>Delete Node</strong>
            <small>Delete</small>
          </span>
        </button>

        <button onClick={() => handleAction(onFind)} disabled={isAnimating} className="spell-btn search">
          <img src={buttonSearch} alt="Find icon" className="spell-icon" />
          <span className="spell-text-wrap">
            <strong>Find Node</strong>
            <small>Find</small>
          </span>
        </button>

        <button onClick={onReset} disabled={isAnimating} className="spell-btn reset">
          <img src={squirrelIcon} alt="Reset tree icon" className="spell-icon" />
          <span className="spell-text-wrap">
            <strong>Reset Tree</strong>
            <small>Clear All</small>
          </span>
        </button>
      </div>

      <section className="control-block">
        <h3 className="sub-heading">Preset Trees</h3>
        <div className="select-wrap">
          <select
            onChange={(e) => {
              const preset = PRESETS.find(p => p.name === e.target.value);
              if (preset) onLoadPreset(preset.values);
            }}
            disabled={isAnimating}
            className="spell-select"
            defaultValue=""
          >
            <option value="" disabled>Select a Tree Preset</option>
            {PRESETS.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="select-chevron" />
        </div>
      </section>

      <section className="control-block">
        <h3 className="sub-heading">Traversals</h3>
        <p className="sub-copy">Traversal Order</p>
        <div className="travel-grid">
          <button onClick={() => onTraverse('inorder')} disabled={isAnimating} className="travel-btn">
            <span>Inorder Traversal</span>
            <small>Inorder</small>
          </button>
          <button onClick={() => onTraverse('preorder')} disabled={isAnimating} className="travel-btn">
            <span>Preorder Traversal</span>
            <small>Preorder</small>
          </button>
          <button onClick={() => onTraverse('postorder')} disabled={isAnimating} className="travel-btn">
            <span>Postorder Traversal</span>
            <small>Postorder</small>
          </button>
        </div>
      </section>

      <section className="control-block speed-block">
        <h3 className="sub-heading">Animation Speed</h3>
        <div className="speed-row">
          <img src={magicPotion} alt="Potion" className="potion-icon" />
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value, 10))}
            className="speed-slider"
            disabled={isAnimating}
          />
        </div>
        <div className="speed-meta">
          <span>Fast</span>
          <span>{animationSpeed} ms</span>
          <span>Slow</span>
        </div>
      </section>
    </div>
  );
};
