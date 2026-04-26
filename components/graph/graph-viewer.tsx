'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { GraphData, GraphNode } from '@/lib/graph/types';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-neutral-900 text-neutral-400">
      Loading graph...
    </div>
  ),
});

export interface HighlightData {
  connectedNodeIds: Set<string>;
}

export interface ForceConfig {
  chargeStrength?: number;
  linkDistance?: number;
  centerStrength?: number;
}

export interface GraphViewerProps {
  graphData: GraphData;
  selectedNodeId?: string | null;
  highlightData?: HighlightData;
  onNodeClick?: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode | null) => void;
  width?: number;
  height?: number;
  forceConfig?: ForceConfig;
  nodeIconMap?: Map<string, HTMLImageElement>;
}

export interface GraphViewerRef {
  centerAt: (x?: number, y?: number, duration?: number) => void;
  zoom: (scale: number, duration?: number) => void;
  zoomToFit: (duration?: number, padding?: number) => void;
}

function hexagonPath(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const hx = x + radius * Math.cos(angle);
    const hy = y + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
}

export const GraphViewer = forwardRef<GraphViewerRef, GraphViewerProps>(
  (
    {
      graphData,
      selectedNodeId,
      highlightData,
      onNodeClick,
      onNodeHover,
      width = 800,
      height = 500,
      forceConfig,
      nodeIconMap,
    },
    ref
  ) => {
    const fgRef = useRef<any>(null);
    const [mounted, setMounted] = useState(false);
    const [initialFitDone, setInitialFitDone] = useState(false);

    useEffect(() => {
      setMounted(true);
      setInitialFitDone(false);
    }, []);

    useEffect(() => {
      setInitialFitDone(false);
    }, [graphData]);

    useEffect(() => {
      if (!forceConfig || !mounted) return;
      let attempts = 0;
      const maxAttempts = 20;
      const interval = setInterval(() => {
        attempts++;
        const fg = fgRef.current;
        if (!fg || !fg.d3Force) {
          if (attempts >= maxAttempts) clearInterval(interval);
          return;
        }
        clearInterval(interval);
        if (forceConfig.chargeStrength != null) {
          fg.d3Force('charge')?.strength(forceConfig.chargeStrength);
        }
        if (forceConfig.linkDistance != null) {
          fg.d3Force('link')?.distance(forceConfig.linkDistance);
        }
        if (forceConfig.centerStrength != null) {
          fg.d3Force('center')?.strength(forceConfig.centerStrength);
        }
        fg.d3ReheatSimulation();
      }, 100);
      return () => clearInterval(interval);
    }, [forceConfig, graphData, mounted]);

    useImperativeHandle(ref, () => ({
      centerAt: (x?: number, y?: number, duration?: number) => {
        fgRef.current?.centerAt(x, y, duration);
      },
      zoom: (scale: number, duration?: number) => {
        fgRef.current?.zoom(scale, duration);
      },
      zoomToFit: (duration?: number, padding?: number) => {
        fgRef.current?.zoomToFit(duration, padding);
      },
    }));

    const getNodeColor = (node: any) => {
      if (selectedNodeId && node.id === selectedNodeId) return '#c084fc';
      if (highlightData?.connectedNodeIds.has(node.id)) return '#d8b4fe';
      return node.color;
    };

    const getNodeSize = (node: any) => {
      if (selectedNodeId && node.id === selectedNodeId) return node.size * 1.5;
      return node.size;
    };

    const getLinkColor = (link: any) => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      if (selectedNodeId && (sourceId === selectedNodeId || targetId === selectedNodeId)) return '#c084fc';
      return link.color;
    };

    const getLinkWidth = (link: any) => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      if (selectedNodeId && (sourceId === selectedNodeId || targetId === selectedNodeId)) return 2;
      return Math.max(link.confidence * 2, 0.5);
    };

    if (!mounted) {
      return (
        <div
          className="relative rounded-lg overflow-hidden border border-neutral-700 flex items-center justify-center"
          style={{ width, height, backgroundColor: '#171717' }}
        >
          <span className="text-neutral-400">Loading graph...</span>
        </div>
      );
    }

    return (
      <div
        className="relative rounded-lg overflow-hidden border border-neutral-700"
        style={{ width, height, backgroundColor: '#171717' }}
      >
        <ForceGraph2D
          ref={fgRef}
          width={width}
          height={height}
          graphData={graphData}
          backgroundColor="#171717"
          nodeLabel={(node: any) => `${node.label}: ${node.title}`}
          nodeColor={getNodeColor}
          nodeVal={getNodeSize}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const size = getNodeSize(node);
            const color = getNodeColor(node);
            const isHexagon = node.shape === 'hexagon';

            if (isHexagon) {
              hexagonPath(ctx, node.x, node.y, size * 1.15);
            } else {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            }
            ctx.fillStyle = color;
            ctx.fill();

            if (selectedNodeId && node.id === selectedNodeId) {
              ctx.strokeStyle = '#e9d5ff';
              ctx.lineWidth = 2 / globalScale;
              ctx.stroke();
            }

            const icon = nodeIconMap?.get(node.id);
            if (icon && icon.complete && icon.naturalWidth > 0) {
              const iconSize = size * 1.1;
              ctx.drawImage(icon, node.x - iconSize / 2, node.y - iconSize / 2, iconSize, iconSize);
            }

            if (globalScale > 1.2) {
              const fontSize = Math.max(10 / globalScale, 3);
              ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#e5e5e5';
              ctx.fillText(node.label, node.x, node.y + size + fontSize + (isHexagon ? 2 : 0));
            }
          }}
          linkColor={getLinkColor}
          linkWidth={getLinkWidth}
          linkDirectionalParticles={0}
          onNodeClick={(node: any) => onNodeClick?.(node)}
          onNodeHover={(node: any) => onNodeHover?.(node || null)}
          cooldownTicks={100}
          minZoom={0.5}
          maxZoom={8}
          onEngineStop={() => {
            if (!initialFitDone) {
              fgRef.current?.zoomToFit(400, 50);
              setInitialFitDone(true);
            }
          }}
        />
      </div>
    );
  }
);

GraphViewer.displayName = 'GraphViewer';
