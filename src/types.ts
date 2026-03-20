import React from 'react';

export interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;
  x: number;
  y: number;
}

export type OperationType = 'insert' | 'delete' | 'find' | 'inorder' | 'preorder' | 'postorder' | 'none';

export interface Step {
  nodeId: string | null;
  codeLine: number;
  description: string;
  treeState: TreeNode | null;
  highlightedNodes: string[];
  visitedNodes: string[];
}

export const PSEUDO_CODE: Record<OperationType, string[]> = {
  insert: [
    "function insert(node, value):",
    "  if node is null:",
    "    return new Node(value)",
    "  if value < node.value:",
    "    node.left = insert(node.left, value)",
    "  else if value > node.value:",
    "    node.right = insert(node.right, value)",
    "  return node"
  ],
  delete: [
    "function delete(node, value):",
    "  if node is null: return null",
    "  if value < node.value:",
    "    node.left = delete(node.left, value)",
    "  else if value > node.value:",
    "    node.right = delete(node.right, value)",
    "  else:",
    "    if node.left is null: return node.right",
    "    if node.right is null: return node.left",
    "    temp = findMin(node.right)",
    "    node.value = temp.value",
    "    node.right = delete(node.right, temp.value)",
    "  return node"
  ],
  find: [
    "function find(node, value):",
    "  if node is null: return false",
    "  if node.value == value: return true",
    "  if value < node.value:",
    "    return find(node.left, value)",
    "  else:",
    "    return find(node.right, value)"
  ],
  inorder: [
    "function inorder(node):",
    "  if node is null: return",
    "  inorder(node.left)",
    "  visit(node)",
    "  inorder(node.right)"
  ],
  preorder: [
    "function preorder(node):",
    "  if node is null: return",
    "  visit(node)",
    "  preorder(node.left)",
    "  preorder(node.right)"
  ],
  postorder: [
    "function postorder(node):",
    "  if node is null: return",
    "  postorder(node.left)",
    "  postorder(node.right)",
    "  visit(node)"
  ],
  none: []
};
