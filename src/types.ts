export type Role = "admin" | "user";
export type UserStatus = "active" | "invited" | "suspended";
export type TicketStatus = "open" | "pending" | "resolved";
export type WidgetType = "kpi" | "line" | "bar" | "pie" | "area" | "table";
export type SharePerm = "view" | "edit" | "manage";

export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  title: string;
  phone: string;
  status: UserStatus;
  groupId: string;
  planId: string;
  createdAt: string;
}

export interface AccessGroup {
  id: string;
  name: string;
  permissions: string[];
}

export interface DataSource {
  id: string;
  name: string;
  type: "api" | "csv" | "sql" | "google";
  endpoint: string;
  status: "connected" | "error" | "paused";
  ownerId: string;
  lastSync: string;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  sourceId: string;
  metric: string;
}

export interface Share {
  userId: string;
  permission: SharePerm;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  theme: "paper" | "ink" | "forest";
  layout: "grid2" | "grid3";
  widgets: Widget[];
  shares: Share[];
  createdAt: string;
  updatedAt: string;
}

export interface HistoryItem {
  id: string;
  boardId: string;
  actor: string;
  action: string;
  at: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  audience: "all" | string;
  at: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: TicketStatus;
  at: string;
  reply?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  ownerId: string;
  scopes: string;
  at: string;
  lastUsed: string;
}

export interface LogItem {
  id: string;
  kind: "system" | "event";
  level: "info" | "warn" | "error";
  actor: string;
  message: string;
  at: string;
}

export interface LoginSession {
  id: string;
  userId: string;
  device: string;
  ip: string;
  at: string;
  active: boolean;
}

export interface PayAccount {
  id: string;
  provider: string;
  account: string;
  status: "live" | "test" | "disabled";
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  boards: number;
  widgets: number;
  active: boolean;
}

export interface AlertRule {
  id: string;
  boardId: string;
  name: string;
  metric: string;
  op: ">" | "<" | "=";
  threshold: number;
  channel: "email" | "inapp";
  enabled: boolean;
  ownerId: string;
}

export interface AutoReport {
  id: string;
  boardId: string;
  cadence: "daily" | "weekly" | "monthly";
  format: "csv" | "json" | "pdf";
  email: string;
  enabled: boolean;
  ownerId: string;
}

export interface ThirdParty {
  id: string;
  name: string;
  kind: string;
  connected: boolean;
  ownerId: string;
}

export interface BackupJob {
  id: string;
  note: string;
  at: string;
  bytes: number;
}

export interface SecurityCfg {
  twoFactor: boolean;
  minPassword: number;
  sessionHours: number;
  ipAllow: string;
}

export interface DB {
  accounts: Account[];
  groups: AccessGroup[];
  sources: DataSource[];
  boards: Board[];
  history: HistoryItem[];
  notices: Notice[];
  tickets: Ticket[];
  keys: ApiKey[];
  logs: LogItem[];
  sessions: LoginSession[];
  payments: PayAccount[];
  plans: Plan[];
  alerts: AlertRule[];
  reports: AutoReport[];
  apps: ThirdParty[];
  backups: BackupJob[];
  security: SecurityCfg;
  sessionUserId: string | null;
}
