import {
  Home,
  Rocket,
  Settings,
  Palette,
  FileText,
  Database,
  Binary,
  Zap,
  Shield,
  Bot,
  Code,
  Scissors,
  Plug,
  type LucideIcon,
} from 'lucide-react'

const NavItem = ({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
    <Icon size={16} />
    <span>{children}</span>
  </span>
)

export default {
  index: <NavItem icon={Home}>Introduction</NavItem>,
  'getting-started': <NavItem icon={Rocket}>Getting Started</NavItem>,
  chunking: <NavItem icon={Scissors}>Chunking</NavItem>,
  configuration: <NavItem icon={Settings}>Configuration</NavItem>,
  presets: <NavItem icon={Palette}>Presets</NavItem>,
  extractors: <NavItem icon={FileText}>Extractors</NavItem>,
  storage: <NavItem icon={Database}>Storage</NavItem>,
  'embedding-providers': <NavItem icon={Binary}>Embedding Providers</NavItem>,
  'async-batch': <NavItem icon={Zap}>Async & Batch</NavItem>,
  'mcp-server': <NavItem icon={Plug}>MCP Server</NavItem>,
  security: <NavItem icon={Shield}>Security</NavItem>,
  agents: <NavItem icon={Bot}>Agents</NavItem>,
  api: <NavItem icon={Code}>API Reference</NavItem>,
}
