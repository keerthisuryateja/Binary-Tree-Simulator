import React from 'react';
import { motion } from 'motion/react';
import { TreeNode } from '../types';
import acornAsset from '../../assets/acorn.png';
import grapesAsset from '../../assets/grapes.png';
import appleAsset from '../../assets/apple_v2.png';
import magicLamp from '../../assets/magic_lamp.png';

interface TreeVisualizerProps {
  root: TreeNode | null;
  highlightedNodes: string[];
  visitedNodes: string[];
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ root, highlightedNodes, visitedNodes }) => {
  const getNodeAsset = (value: number, isHighlighted: boolean, isVisited: boolean) => {
    if (isHighlighted) return acornAsset;
    if (isVisited) return grapesAsset;
    return value % 2 === 0 ? appleAsset : acornAsset;
  };

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
          stroke="url(#branchGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
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
          stroke="url(#branchGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
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
        <motion.image
          href={getNodeAsset(node.value, isHighlighted, isVisited)}
          x={node.x - 34}
          y={node.y - 34}
          width="68"
          height="68"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
        <motion.circle
          cx={node.x}
          cy={node.y + 2}
          r="14"
          fill={isHighlighted ? 'rgba(111, 29, 27, 0.86)' : isVisited ? 'rgba(65, 32, 109, 0.86)' : 'rgba(19, 31, 34, 0.78)'}
          stroke={isHighlighted ? '#fed7aa' : '#d9f99d'}
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <text
          x={node.x}
          y={node.y + 2}
          dy=".3em"
          textAnchor="middle"
          fill="#fff7ed"
          className="forest-node-label"
        >
          {node.value}
        </text>
        {isRoot && <circle cx={node.x} cy={node.y - 38} r="5" fill="#fde68a" />}
        {isLeaf && !isRoot && <circle cx={node.x} cy={node.y + 34} r="4" fill="#86efac" opacity="0.9" />}
      </g>
    ];
    nodes.push(...renderNodes(node.left));
    nodes.push(...renderNodes(node.right));
    return nodes;
  };

  return (
    <div className="tree-stage">
      <img src={magicLamp} alt="Hanging lantern" className="lantern lantern-left" />
      <img src={magicLamp} alt="Hanging lantern" className="lantern lantern-right" />

      <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b5f08c" />
            <stop offset="50%" stopColor="#62be6b" />
            <stop offset="100%" stopColor="#368363" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g>
          <g filter="url(#glow)">{renderEdges(root)}</g>
          <g>{renderNodes(root)}</g>
        </g>
      </svg>

      {root === null && (
        <div className="empty-tree-state">
          <img src={acornAsset} alt="Tree node" />
          <p>Insert your first value to create the binary tree.</p>
        </div>
      )}
    </div>
  );
};
