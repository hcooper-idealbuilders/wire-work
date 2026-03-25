import { create } from 'zustand'
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow'
import { CanvasNodeData } from '../types'

interface CanvasStore {
  nodes: Node<CanvasNodeData>[]
  edges: Edge[]
  setNodes: (nodes: Node<CanvasNodeData>[]) => void
  setEdges: (edges: Edge[]) => void
  applyNodeChanges: (changes: NodeChange[]) => void
  applyEdgeChanges: (changes: EdgeChange[]) => void
  addNode: (node: Node<CanvasNodeData>) => void
  updateNodeLabel: (id: string, label: string) => void
  updateNodeColor: (id: string, color: string) => void
  removeNode: (id: string) => void
  addEdge: (edge: Edge) => void
  removeEdge: (id: string) => void
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  applyNodeChanges: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) as Node<CanvasNodeData>[] })),
  applyEdgeChanges: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  addNode: (node) =>
    set((state) => {
      if (state.nodes.find((n) => n.id === node.id)) return state
      return { nodes: [...state.nodes, node] }
    }),
  updateNodeLabel: (id, label) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n)),
    })),
  updateNodeColor: (id, color) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, color } } : n)),
    })),
  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    })),
  addEdge: (edge) =>
    set((state) => {
      if (state.edges.find((e) => e.id === edge.id)) return state
      return { edges: [...state.edges, edge] }
    }),
  removeEdge: (id) =>
    set((state) => ({ edges: state.edges.filter((e) => e.id !== id) })),
}))
