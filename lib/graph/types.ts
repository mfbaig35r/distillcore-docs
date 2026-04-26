/**
 * Graph types for agent architecture visualization
 */

export type NodeLevel = 'agent' | 'tool' | 'api';

export interface GraphNode {
  id: string;
  label: string;
  title: string;
  level: NodeLevel;
  group: string;
  size: number;
  color: string;
  shape?: 'circle' | 'hexagon';
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
  color: string;
  relationshipType: 'hierarchy';
  confidence: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
