import { useState, useCallback, useRef } from 'react';
import { TreeNode, OperationType, Step } from './types';

const INITIAL_X = 400;
const INITIAL_Y = 60;
const X_OFFSET = 180;
const Y_OFFSET = 80;

export function useBinaryTree() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [currentOp, setCurrentOp] = useState<OperationType>('none');
  
  const treeRef = useRef<TreeNode | null>(null);

  const updatePositions = (node: TreeNode | null, x: number, y: number, offset: number): TreeNode | null => {
    if (!node) return null;
    return {
      ...node,
      x,
      y,
      left: updatePositions(node.left, x - offset, y + Y_OFFSET, offset / 1.8),
      right: updatePositions(node.right, x + offset, y + Y_OFFSET, offset / 1.8),
    };
  };

  const deepCopy = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    return {
      ...node,
      left: deepCopy(node.left),
      right: deepCopy(node.right),
    };
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const insertNode = async (value: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentOp('insert');
    const newSteps: Step[] = [];
    let currentTree = deepCopy(treeRef.current);

    const animateInsert = (node: TreeNode | null, val: number): TreeNode => {
      newSteps.push({
        nodeId: node?.id || null,
        codeLine: 0,
        description: `Starting insertion of ${val}`,
        treeState: deepCopy(currentTree),
        highlightedNodes: node ? [node.id] : [],
        visitedNodes: [],
      });

      if (!node) {
        const newNode: TreeNode = {
          value: val,
          left: null,
          right: null,
          id: generateId(),
          x: 0,
          y: 0,
        };
        newSteps.push({
          nodeId: newNode.id,
          codeLine: 2,
          description: `Created new node with value ${val}`,
          treeState: null, // Will be updated after positioning
          highlightedNodes: [newNode.id],
          visitedNodes: [],
        });
        return newNode;
      }

      if (val < node.value) {
        newSteps.push({
          nodeId: node.id,
          codeLine: 3,
          description: `${val} < ${node.value}, going left`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [],
        });
        node.left = animateInsert(node.left, val);
      } else if (val > node.value) {
        newSteps.push({
          nodeId: node.id,
          codeLine: 5,
          description: `${val} > ${node.value}, going right`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [],
        });
        node.right = animateInsert(node.right, val);
      }

      return node;
    };

    const finalTree = animateInsert(currentTree, value);
    const positionedTree = updatePositions(finalTree, INITIAL_X, INITIAL_Y, X_OFFSET);
    
    // Update tree states in steps to have correct positions for visualization
    newSteps.forEach(step => {
      if (!step.treeState) step.treeState = positionedTree;
    });

    setSteps(newSteps);
    await playSteps(newSteps, positionedTree);
  };

  const findNode = async (value: number) => {
    if (isAnimating || !treeRef.current) return;
    setIsAnimating(true);
    setCurrentOp('find');
    const newSteps: Step[] = [];
    const currentTree = deepCopy(treeRef.current);

    const animateFind = (node: TreeNode | null, val: number): boolean => {
      newSteps.push({
        nodeId: node?.id || null,
        codeLine: 0,
        description: `Searching for ${val}`,
        treeState: deepCopy(currentTree),
        highlightedNodes: node ? [node.id] : [],
        visitedNodes: [],
      });

      if (!node) {
        newSteps.push({
          nodeId: null,
          codeLine: 1,
          description: `Node is null, ${val} not found`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [],
          visitedNodes: [],
        });
        return false;
      }

      if (node.value === val) {
        newSteps.push({
          nodeId: node.id,
          codeLine: 2,
          description: `Found ${val}!`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [],
        });
        return true;
      }

      if (val < node.value) {
        newSteps.push({
          nodeId: node.id,
          codeLine: 3,
          description: `${val} < ${node.value}, searching left`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [],
        });
        return animateFind(node.left, val);
      } else {
        newSteps.push({
          nodeId: node.id,
          codeLine: 5,
          description: `${val} > ${node.value}, searching right`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [],
        });
        return animateFind(node.right, val);
      }
    };

    animateFind(currentTree, value);
    setSteps(newSteps);
    await playSteps(newSteps, treeRef.current);
  };

  const deleteNode = async (value: number) => {
    if (isAnimating || !treeRef.current) return;
    setIsAnimating(true);
    setCurrentOp('delete');
    const newSteps: Step[] = [];
    let currentTree = deepCopy(treeRef.current);

    const findMin = (node: TreeNode): TreeNode => {
      let current = node;
      while (current.left) current = current.left;
      return current;
    };

    const animateDelete = (node: TreeNode | null, val: number): TreeNode | null => {
      newSteps.push({
        nodeId: node?.id || null,
        codeLine: 0,
        description: `Deleting ${val}`,
        treeState: deepCopy(currentTree),
        highlightedNodes: node ? [node.id] : [],
        visitedNodes: [],
      });

      if (!node) return null;

      if (val < node.value) {
        newSteps.push({
          nodeId: node.id,
          codeLine: 2,
          description: `${val} < ${node.value}, searching left`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [],
        });
        node.left = animateDelete(node.left, val);
      } else if (val > node.value) {
        newSteps.push({
          nodeId: node.id,
          codeLine: 4,
          description: `${val} > ${node.value}, searching right`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [],
        });
        node.right = animateDelete(node.right, val);
      } else {
        newSteps.push({
          nodeId: node.id,
          codeLine: 6,
          description: `Found node to delete: ${val}`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [],
        });

        if (!node.left) {
          newSteps.push({
            nodeId: node.id,
            codeLine: 7,
            description: `No left child, replacing with right child`,
            treeState: deepCopy(currentTree),
            highlightedNodes: [node.id],
            visitedNodes: [],
          });
          return node.right;
        }
        if (!node.right) {
          newSteps.push({
            nodeId: node.id,
            codeLine: 8,
            description: `No right child, replacing with left child`,
            treeState: deepCopy(currentTree),
            highlightedNodes: [node.id],
            visitedNodes: [],
          });
          return node.left;
        }

        const temp = findMin(node.right);
        newSteps.push({
          nodeId: node.id,
          codeLine: 9,
          description: `Two children, finding successor: ${temp.value}`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id, temp.id],
          visitedNodes: [],
        });
        node.value = temp.value;
        node.right = animateDelete(node.right, temp.value);
      }
      return node;
    };

    const finalTree = animateDelete(currentTree, value);
    const positionedTree = updatePositions(finalTree, INITIAL_X, INITIAL_Y, X_OFFSET);
    
    setSteps(newSteps);
    await playSteps(newSteps, positionedTree);
  };

  const traverse = async (type: 'inorder' | 'preorder' | 'postorder') => {
    if (isAnimating || !treeRef.current) return;
    setIsAnimating(true);
    setCurrentOp(type);
    const newSteps: Step[] = [];
    const visited: string[] = [];
    const currentTree = deepCopy(treeRef.current);

    const animateTraverse = (node: TreeNode | null) => {
      newSteps.push({
        nodeId: node?.id || null,
        codeLine: 0,
        description: `Visiting ${node?.value || 'null'}`,
        treeState: deepCopy(currentTree),
        highlightedNodes: node ? [node.id] : [],
        visitedNodes: [...visited],
      });

      if (!node) {
        newSteps.push({
          nodeId: null,
          codeLine: 1,
          description: `Node is null, returning`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [],
          visitedNodes: [...visited],
        });
        return;
      }

      if (type === 'preorder') {
        visited.push(node.id);
        newSteps.push({
          nodeId: node.id,
          codeLine: 2,
          description: `Preorder: Visit ${node.value}`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [...visited],
        });
      }

      newSteps.push({
        nodeId: node.id,
        codeLine: type === 'preorder' ? 3 : type === 'inorder' ? 2 : 2,
        description: `Recurse left`,
        treeState: deepCopy(currentTree),
        highlightedNodes: [node.id],
        visitedNodes: [...visited],
      });
      animateTraverse(node.left);

      if (type === 'inorder') {
        visited.push(node.id);
        newSteps.push({
          nodeId: node.id,
          codeLine: 3,
          description: `Inorder: Visit ${node.value}`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [...visited],
        });
      }

      newSteps.push({
        nodeId: node.id,
        codeLine: type === 'preorder' ? 4 : type === 'inorder' ? 4 : 3,
        description: `Recurse right`,
        treeState: deepCopy(currentTree),
        highlightedNodes: [node.id],
        visitedNodes: [...visited],
      });
      animateTraverse(node.right);

      if (type === 'postorder') {
        visited.push(node.id);
        newSteps.push({
          nodeId: node.id,
          codeLine: 4,
          description: `Postorder: Visit ${node.value}`,
          treeState: deepCopy(currentTree),
          highlightedNodes: [node.id],
          visitedNodes: [...visited],
        });
      }
    };

    animateTraverse(currentTree);
    setSteps(newSteps);
    await playSteps(newSteps, treeRef.current);
  };

  const playSteps = async (stepsToPlay: Step[], finalTree: TreeNode | null) => {
    for (let i = 0; i < stepsToPlay.length; i++) {
      setCurrentStepIndex(i);
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    treeRef.current = finalTree;
    setRoot(finalTree);
    setIsAnimating(false);
    setCurrentStepIndex(-1);
    setCurrentOp('none');
  };

  return {
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
    loadPreset: async (values: number[]) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentOp('insert');
      
      let currentTree: TreeNode | null = null;
      
      for (const val of values) {
        const insertInternal = (node: TreeNode | null, v: number): TreeNode => {
          if (!node) {
            return {
              value: v,
              left: null,
              right: null,
              id: generateId(),
              x: 0,
              y: 0,
            };
          }
          if (v < node.value) node.left = insertInternal(node.left, v);
          else if (v > node.value) node.right = insertInternal(node.right, v);
          return node;
        };
        
        currentTree = insertInternal(currentTree, val);
      }
      
      const positionedTree = updatePositions(currentTree, INITIAL_X, INITIAL_Y, X_OFFSET);
      treeRef.current = positionedTree;
      setRoot(positionedTree);
      setIsAnimating(false);
      setCurrentOp('none');
    },
  };
}
