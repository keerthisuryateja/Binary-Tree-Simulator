import React from 'react';
import { motion } from 'motion/react';
import { TreeNode } from '../types';

interface TreeVisualizerProps {
  root: TreeNode | null;
  highlightedNodes: string[];
  visitedNodes: string[];
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ root, highlightedNodes, visitedNodes }) => {
  const renderEdges = (node: TreeNode | null): React.ReactNode[] => {
    if (!node) return [];
    const edges: React.ReactNode[] = [];
    if (node.left) {
      edges.push(
        <line
          key={`edge-${node.id}-${node.left.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      );
      edges.push(...renderEdges(node.left));
    }
    if (node.right) {
      edges.push(
        <line
          key={`edge-${node.id}-${node.right.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      );
      edges.push(...renderEdges(node.right));
    }
    return edges;
  };

  const renderNodes = (node: TreeNode | null): React.ReactNode[] => {
    if (!node) return [];
    const isHighlighted = highlightedNodes.includes(node.id);
    const isVisited = visitedNodes.includes(node.id);
    const isRoot = node.id === root?.id;
    const isLeaf = !node.left && !node.right;

    const nodes: React.ReactNode[] = [
      <g key={`node-group-${node.id}`}>
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="22"
          fill={isHighlighted ? '#3b82f6' : isVisited ? '#10b981' : '#ffffff'}
          stroke={isHighlighted ? '#1d4ed8' : isVisited ? '#059669' : '#64748b'}
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
        <text
          x={node.x}
          y={node.y}
          dy=".3em"
          textAnchor="middle"
          fill={isHighlighted || isVisited ? '#ffffff' : '#1e293b'}
          className="text-sm font-bold select-none"
        >
          {node.value}
        </text>
        {isRoot && (
          <text x={node.x} y={node.y - 30} textAnchor="middle" className="text-lg select-none">
            🌳
          </text>
        )}
        {isLeaf && !isRoot && (
          <text x={node.x} y={node.y + 40} textAnchor="middle" className="text-lg select-none">
            🍃
          </text>
        )}
      </g>
    ];
    nodes.push(...renderNodes(node.left));
    nodes.push(...renderNodes(node.right));
    return nodes;
  };

  return (
    <div className="w-full h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
      <svg width="100%" height="100%" viewBox="0 0 800 600">
        <g>
          {renderEdges(root)}
          {renderNodes(root)}
        </g>
      </svg>
      {root === null && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium italic">
          Tree is empty. Insert a value to begin.
        </div>
      )}
    </div>
  );
};
