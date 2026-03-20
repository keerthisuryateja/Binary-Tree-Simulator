import React from 'react';
import { useBinaryTree } from './useBinaryTree';
import { TreeVisualizer } from './components/TreeVisualizer';
import { PseudoCodePanel } from './components/PseudoCodePanel';
import { Controls } from './components/Controls';
import { Network, Info } from 'lucide-react';

export default function App() {
  const {
    root,
    steps,
    currentStepIndex,
    isAnimating,
    animationSpeed,
    setAnimationSpeed,
    currentOp,
    insertNode,
    deleteNode,
    findNode,
    traverse,
    loadPreset,
  } = useBinaryTree();

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Network size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Binary Tree Simulator</h1>
            <p className="text-xs text-slate-500 font-medium">Interactive BST Visualization & Learning Tool</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isAnimating && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold animate-pulse">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              ANIMATING: {currentOp.toUpperCase()}
            </div>
          )}
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Info size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1800px] w-full mx-auto grid grid-cols-12 gap-6 overflow-hidden">
        {/* Left Column: Controls & Info */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <Controls
            onInsert={insertNode}
            onDelete={deleteNode}
            onFind={findNode}
            onTraverse={traverse}
            onLoadPreset={loadPreset}
            isAnimating={isAnimating}
            animationSpeed={animationSpeed}
            onSpeedChange={setAnimationSpeed}
          />
          
        </div>

        {/* Middle Column: Tree Visualization */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 relative bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden">
            <TreeVisualizer
              root={currentStep ? currentStep.treeState : root}
              highlightedNodes={currentStep ? currentStep.highlightedNodes : []}
              visitedNodes={currentStep ? currentStep.visitedNodes : []}
            />
          </div>
          
          {/* Status Bar */}
          <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 flex items-center justify-between text-sm shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-500 font-medium">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-500 font-medium">Visited</span>
              </div>
            </div>
            <div className="text-slate-400 font-mono text-xs">
              Step {currentStepIndex + 1} of {steps.length || 0}
            </div>
          </div>
        </div>

        {/* Right Column: Pseudo Code */}
        <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
          <PseudoCodePanel
            operation={currentOp}
            currentLine={currentStep ? currentStep.codeLine : -1}
            description={currentStep ? currentStep.description : ''}
          />
        </div>
      </main>
    </div>
  );
}
