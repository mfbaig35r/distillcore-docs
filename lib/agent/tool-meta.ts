import {
  Eye,
  List,
  Workflow,
  Database,
  BarChart,
  Layers,
  Search,
  FileSearch,
  PieChart,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export interface ToolMeta {
  label: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  iconBg: string;
  activeBorder: string;
  completedBorder: string;
  activeGlow: string;
}

export const TOOL_META: Record<string, ToolMeta> = {
  preview_document: {
    label: 'Preview',
    icon: Eye,
    color: 'purple',
    textColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    activeBorder: 'border-purple-500/50',
    completedBorder: 'border-purple-500/20',
    activeGlow: 'shadow-[0_0_25px_-4px_rgba(168,85,247,0.3)]',
  },
  list_available_presets: {
    label: 'Presets',
    icon: List,
    color: 'purple',
    textColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    activeBorder: 'border-purple-500/50',
    completedBorder: 'border-purple-500/20',
    activeGlow: 'shadow-[0_0_25px_-4px_rgba(168,85,247,0.3)]',
  },
  process_document: {
    label: 'Process',
    icon: Workflow,
    color: 'blue',
    textColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    activeBorder: 'border-blue-500/50',
    completedBorder: 'border-blue-500/20',
    activeGlow: 'shadow-[0_0_25px_-4px_rgba(59,130,246,0.3)]',
  },
  save_result: {
    label: 'Save',
    icon: Database,
    color: 'blue',
    textColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    activeBorder: 'border-blue-500/50',
    completedBorder: 'border-blue-500/20',
    activeGlow: 'shadow-[0_0_25px_-4px_rgba(59,130,246,0.3)]',
  },
  check_coverage: {
    label: 'Coverage',
    icon: BarChart,
    color: 'emerald',
    textColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    activeBorder: 'border-emerald-500/50',
    completedBorder: 'border-emerald-500/20',
    activeGlow: 'shadow-[0_0_25px_-4px_rgba(16,185,129,0.3)]',
  },
  check_chunks: {
    label: 'Chunks',
    icon: Layers,
    color: 'emerald',
    textColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    activeBorder: 'border-emerald-500/50',
    completedBorder: 'border-emerald-500/20',
    activeGlow: 'shadow-[0_0_25px_-4px_rgba(16,185,129,0.3)]',
  },
  search_store: {
    label: 'Search',
    icon: Search,
    color: 'amber',
    textColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    activeBorder: 'border-amber-500/50',
    completedBorder: 'border-amber-500/20',
    activeGlow: 'shadow-[0_0_25px_-4px_rgba(245,158,11,0.3)]',
  },
  get_document_info: {
    label: 'Get Doc',
    icon: FileSearch,
    color: 'amber',
    textColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    activeBorder: 'border-amber-500/50',
    completedBorder: 'border-amber-500/20',
    activeGlow: 'shadow-[0_0_25px_-4px_rgba(245,158,11,0.3)]',
  },
  get_store_stats: {
    label: 'Stats',
    icon: PieChart,
    color: 'amber',
    textColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    activeBorder: 'border-amber-500/50',
    completedBorder: 'border-amber-500/20',
    activeGlow: 'shadow-[0_0_25px_-4px_rgba(245,158,11,0.3)]',
  },
};

export const DEFAULT_TOOL_META: ToolMeta = {
  label: 'Tool',
  icon: Wrench,
  color: 'neutral',
  textColor: 'text-neutral-400',
  iconBg: 'bg-neutral-500/10',
  activeBorder: 'border-neutral-500/50',
  completedBorder: 'border-neutral-500/20',
  activeGlow: '',
};

export const STAGE_META: Record<string, { label: string; color: string; borderColor: string; bgColor: string }> = {
  triage: { label: 'Triage', color: '#8b5cf6', borderColor: 'border-purple-500/30', bgColor: 'bg-purple-500/5' },
  processing: { label: 'Processing', color: '#3b82f6', borderColor: 'border-blue-500/30', bgColor: 'bg-blue-500/5' },
  qa: { label: 'QA', color: '#10b981', borderColor: 'border-emerald-500/30', bgColor: 'bg-emerald-500/5' },
  research: { label: 'Research', color: '#f59e0b', borderColor: 'border-amber-500/30', bgColor: 'bg-amber-500/5' },
};

export function getToolMeta(toolName: string): ToolMeta {
  return TOOL_META[toolName] || DEFAULT_TOOL_META;
}
