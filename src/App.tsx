import React from 'react';
import { useBinaryTree } from './useBinaryTree';
import { TreeVisualizer } from './components/TreeVisualizer';
import { PseudoCodePanel } from './components/PseudoCodePanel';
import { Controls } from './components/Controls';

export default function App() {
  const {
    root,
    steps,
    currentStepIndex,
    isAnimating,
    animationSpeed,
    setAnimationSpeed,
    currentOp,
    outputMessage,
    resetTree,
    insertNode,
    insertNodes,
    deleteNode,
    findNode,
    traverse,
    loadPreset,
  } = useBinaryTree();

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  return (
    <div className="forest-app">
      <div className="forest-glow" aria-hidden="true" />
      <div className="forest-mist" aria-hidden="true" />

      <div className="forest-shell">
        <main className="forest-grid">
          <aside className="forest-left custom-scrollbar">
            <Controls
              onInsert={insertNode}
              onInsertMany={insertNodes}
              onReset={resetTree}
              onDelete={deleteNode}
              onFind={findNode}
              onTraverse={traverse}
              onLoadPreset={loadPreset}
              isAnimating={isAnimating}
              animationSpeed={animationSpeed}
              onSpeedChange={setAnimationSpeed}
            />
          </aside>

          <section className="forest-center">
            <TreeVisualizer
              root={currentStep ? currentStep.treeState : root}
              highlightedNodes={currentStep ? currentStep.highlightedNodes : []}
              visitedNodes={currentStep ? currentStep.visitedNodes : []}
            />

            <div className="forest-outputbar" role="status" aria-live="polite">
              <span className="output-label">Output</span>
              <span className="output-text">{outputMessage}</span>
            </div>

            <div className="forest-statusbar">
              <div className="legend-item">
                <span className="legend-dot active" />
                Active Path
              </div>
              <div className="legend-item">
                <span className="legend-dot visited" />
                Visited Node
              </div>
              <div className="legend-step">
                Step {steps.length ? currentStepIndex + 1 : 0} of {steps.length}
              </div>
              {isAnimating && <div className="legend-badge">Casting: {currentOp}</div>}
            </div>
          </section>

          <aside className="forest-right">
            <PseudoCodePanel
              operation={currentOp}
              currentLine={currentStep ? currentStep.codeLine : -1}
              description={currentStep ? currentStep.description : ''}
              reasoning={currentStep?.reasoning}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}
