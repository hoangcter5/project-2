import type { Account, Board, DB, DataSource, Widget } from "../types";
import { uid } from "./format";

const KEY = "dashstack.spec.v1";

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600_000).toISOString();
}
function daysAgo(d: number) {
  return new Date(Date.now() - d * 86400_000).toISOString();
}

const ADMIN: Account = {
  id: "acc-admin",
  name: "Minh Trần",
  email: "admin@dashstack.dev",
  password: "Admin@123",
  role: "admin",
  avatar: "MT",
  title: "Quản trị viên",
  phone: "0901001001",
  status: "active",
  groupId: "g-admin",
  planId: "plan-biz",
  createdAt: daysAgo(200),
};

const USER: Account = {
  id: "acc-user",
  name: "Lan Phạm",
  email: "user@dashstack.dev",
  password: "User@123",
  role: "user",
  avatar: "LP",
  title: "Chuyên viên phân tích",
  phone: "0902002002",
  status: "active",
  groupId: "g-analyst",
  planId: "plan-pro",
  createdAt: daysAgo(40),
};

const USER2: Account = {
  id: "acc-user2",
  name: "Huy Nguyễn",
  email: "huy@dashstack.dev",
  password: "User@123",
  role: "user",
  avatar: "HN",
  title: "Quản lý nhóm",
  phone: "0903003003",
  status: "active",
  groupId: "g-ops",
  planId: "plan-free",
  createdAt: daysAgo(12),
};

function seed(): DB {
  const widgets: Widget[] = [
    { id: "w1", type: "kpi", title: "Doanh thu tháng", sourceId: "src-1", metric: "revenue" },
    { id: "w2", type: "area", title: "Xu hướng 14 ngày", sourceId: "src-1", metric: "trend" },
    { id: "w3", type: "bar", title: "Theo kênh", sourceId: "src-2", metric: "channel" },
    { id: "w4", type: "pie", title: "Cơ cấu khách", sourceId: "src-2", metric: "segment" },
  ];
  return {
    accounts: [ADMIN, USER, USER2],
    groups: [
      { id: "g-admin", name: "Administrators", permissions: ["users", "security", "billing", "boards", "sources", "api"] },
      { id: "g-analyst", name: "Analysts", permissions: ["boards", "sources", "reports", "export"] },
      { id: "g-ops", name: "Operations", permissions: ["boards", "support"] },
    ],
    sources: [
      { id: "src-1", name: "Sales API", type: "api", endpoint: "https://api.dashstack.dev/sales", status: "connected", ownerId: USER.id, lastSync: hoursAgo(1) },
      { id: "src-2", name: "CRM Google Sheet", type: "google", endpoint: "sheets://crm-q3", status: "connected", ownerId: USER.id, lastSync: hoursAgo(4) },
      { id: "src-3", name: "Warehouse SQL", type: "sql", endpoint: "postgres://analytics/wh", status: "paused", ownerId: ADMIN.id, lastSync: daysAgo(2) },
    ],
    boards: [
      {
        id: "b1",
        name: "Hiệu suất bán hàng Q3",
        description: "Theo dõi KPI và kênh chuyển đổi",
        ownerId: USER.id,
        theme: "paper",
        layout: "grid2",
        widgets,
        shares: [{ userId: USER2.id, permission: "view" }],
        createdAt: daysAgo(10),
        updatedAt: hoursAgo(3),
      },
      {
        id: "b2",
        name: "Vận hành học tập",
        description: "Tỷ lệ hoàn thành khóa và hỗ trợ",
        ownerId: USER2.id,
        theme: "forest",
        layout: "grid3",
        widgets: [{ id: "w5", type: "kpi", title: "Ticket mở", sourceId: "src-3", metric: "tickets" }],
        shares: [],
        createdAt: daysAgo(4),
        updatedAt: hoursAgo(20),
      },
    ],
    history: [
      { id: "h1", boardId: "b1", actor: USER.name, action: "thêm widget Xu hướng 14 ngày", at: hoursAgo(3) },
      { id: "h2", boardId: "b1", actor: USER.name, action: "đổi layout grid2", at: hoursAgo(8) },
      { id: "h3", boardId: "b1", actor: USER.name, action: "chia sẻ với Huy Nguyễn (view)", at: daysAgo(1) },
    ],
    notices: [
      { id: "n1", title: "Bảo trì nguồn SQL", body: "Warehouse SQL tạm dừng đồng bộ 02:00–03:00.", audience: "all", at: hoursAgo(6) },
    ],
    tickets: [
      { id: "t1", userId: USER.id, subject: "Sheet CRM không sync", message: "Last sync đứng ở 4 giờ trước.", status: "open", at: hoursAgo(5) },
    ],
    keys: [
      { id: "k1", name: "SDK production", key: "ds_live_7f3a91c2", ownerId: ADMIN.id, scopes: "read:boards write:sources", at: daysAgo(30), lastUsed: hoursAgo(2) },
    ],
    logs: [
      { id: "l1", kind: "system", level: "info", actor: "Hệ thống", message: "Đồng bộ Sales API thành công", at: hoursAgo(1) },
      { id: "l2", kind: "event", level: "warn", actor: USER.name, message: "Cảnh báo doanh thu < ngưỡng", at: hoursAgo(2) },
      { id: "l3", kind: "system", level: "error", actor: "Hệ thống", message: "Warehouse SQL timeout", at: daysAgo(2) },
    ],
    sessions: [
      { id: "s1", userId: ADMIN.id, device: "Chrome / Windows", ip: "192.168.1.15", at: hoursAgo(0.2), active: true },
      { id: "s2", userId: USER.id, device: "Edge / Windows", ip: "192.168.1.22", at: hoursAgo(1), active: true },
      { id: "s3", userId: USER.id, device: "Safari / iPhone", ip: "10.0.4.8", at: daysAgo(3), active: false },
    ],
    payments: [
      { id: "pay1", provider: "VNPay", account: "merchant_dashstack", status: "live" },
      { id: "pay2", provider: "Stripe", account: "acct_demo_88", status: "test" },
    ],
    plans: [
      { id: "plan-free", name: "Free", price: 0, boards: 3, widgets: 8, active: true },
      { id: "plan-pro", name: "Pro", price: 199000, boards: 20, widgets: 80, active: true },
      { id: "plan-biz", name: "Business", price: 499000, boards: 999, widgets: 999, active: true },
    ],
    alerts: [
      { id: "al1", boardId: "b1", name: "Doanh thu giảm", metric: "revenue", op: "<", threshold: 5000000, channel: "inapp", enabled: true, ownerId: USER.id },
    ],
    reports: [
      { id: "r1", boardId: "b1", cadence: "weekly", format: "csv", email: USER.email, enabled: true, ownerId: USER.id },
    ],
    apps: [
      { id: "app1", name: "Slack", kind: "chat", connected: true, ownerId: USER.id },
      { id: "app2", name: "Google Drive", kind: "storage", connected: false, ownerId: USER.id },
      { id: "app3", name: "Zapier", kind: "automation", connected: false, ownerId: USER.id },
    ],
    backups: [{ id: "bk1", note: "Snapshot nightly", at: hoursAgo(10), bytes: 248320 }],
    security: { twoFactor: false, minPassword: 8, sessionHours: 12, ipAllow: "" },
    sessionUserId: null,
  };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return { ...seed(), ...JSON.parse(raw) };
  } catch {
    return seed();
  }
}

function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function download(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export const store = {
  read: load,
  write: save,
  log(kind: DB["logs"][0]["kind"], level: DB["logs"][0]["level"], actor: string, message: string) {
    const db = load();
    db.logs.unshift({ id: uid("log"), kind, level, actor, message, at: new Date().toISOString() });
    db.logs = db.logs.slice(0, 80);
    save(db);
  },
  current(): Account | null {
    const db = load();
    if (!db.sessionUserId) return null;
    return db.accounts.find((a) => a.id === db.sessionUserId) ?? null;
  },
  login(email: string, password: string): Account | null {
    const db = load();
    const acc = db.accounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password && a.status !== "suspended",
    );
    if (!acc) return null;
    db.sessionUserId = acc.id;
    db.sessions.unshift({
      id: uid("ses"),
      userId: acc.id,
      device: navigator.userAgent.slice(0, 48),
      ip: "127.0.0.1",
      at: new Date().toISOString(),
      active: true,
    });
    save(db);
    this.log("event", "info", acc.name, "Đăng nhập thành công");
    return acc;
  },
  logout() {
    const db = load();
    const acc = db.accounts.find((a) => a.id === db.sessionUserId);
    db.sessionUserId = null;
    save(db);
    if (acc) this.log("event", "info", acc.name, "Đăng xuất");
  },
  register(name: string, email: string, password: string): string | null {
    const db = load();
    if (db.accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) return "Email đã được đăng ký.";
    if (password.length < db.security.minPassword) return `Mật khẩu tối thiểu ${db.security.minPassword} ký tự.`;
    const acc: Account = {
      id: uid("acc"),
      name,
      email,
      password,
      role: "user",
      avatar: initials(name),
      title: "Người dùng",
      phone: "",
      status: "active",
      groupId: "g-analyst",
      planId: "plan-free",
      createdAt: new Date().toISOString(),
    };
    db.accounts.push(acc);
    db.sessionUserId = acc.id;
    save(db);
    this.log("event", "info", acc.name, "Đăng ký tài khoản mới");
    return null;
  },
  saveAccount(acc: Account, actor: string) {
    const db = load();
    const i = db.accounts.findIndex((a) => a.id === acc.id);
    if (i >= 0) db.accounts[i] = acc;
    else db.accounts.push(acc);
    save(db);
    this.log("event", "info", actor, `Cập nhật người dùng ${acc.email}`);
  },
  removeAccount(id: string, actor: string) {
    const db = load();
    if (id === "acc-admin") return;
    db.accounts = db.accounts.filter((a) => a.id !== id);
    save(db);
    this.log("event", "warn", actor, `Xóa người dùng ${id}`);
  },
  saveGroups(groups: DB["groups"], actor: string) {
    const db = load();
    db.groups = groups;
    save(db);
    this.log("event", "info", actor, "Cập nhật nhóm quyền");
  },
  saveSource(src: DataSource, actor: string) {
    const db = load();
    const i = db.sources.findIndex((s) => s.id === src.id);
    if (i >= 0) db.sources[i] = src;
    else db.sources.unshift(src);
    save(db);
    this.log("system", "info", actor, `Nguồn dữ liệu ${src.name}`);
  },
  removeSource(id: string, actor: string) {
    const db = load();
    db.sources = db.sources.filter((s) => s.id !== id);
    save(db);
    this.log("system", "warn", actor, `Xóa nguồn ${id}`);
  },
  saveBoard(board: Board, actor: string, action: string) {
    const db = load();
    const i = db.boards.findIndex((b) => b.id === board.id);
    board.updatedAt = new Date().toISOString();
    if (i >= 0) db.boards[i] = board;
    else db.boards.unshift(board);
    db.history.unshift({ id: uid("his"), boardId: board.id, actor, action, at: board.updatedAt });
    save(db);
  },
  removeBoard(id: string, actor: string) {
    const db = load();
    const b = db.boards.find((x) => x.id === id);
    db.boards = db.boards.filter((x) => x.id !== id);
    save(db);
    if (b) this.log("event", "warn", actor, `Xóa bảng ${b.name}`);
  },
  visibleBoards(userId: string, isAdmin: boolean) {
    const db = load();
    if (isAdmin) return db.boards;
    return db.boards.filter((b) => b.ownerId === userId || b.shares.some((s) => s.userId === userId));
  },
  canEditBoard(board: Board, userId: string, isAdmin: boolean) {
    if (isAdmin || board.ownerId === userId) return true;
    return board.shares.some((s) => s.userId === userId && (s.permission === "edit" || s.permission === "manage"));
  },
  pushNotice(n: DB["notices"][0], actor: string) {
    const db = load();
    db.notices.unshift(n);
    save(db);
    this.log("event", "info", actor, `Gửi thông báo: ${n.title}`);
  },
  saveTicket(t: DB["tickets"][0], actor: string) {
    const db = load();
    const i = db.tickets.findIndex((x) => x.id === t.id);
    if (i >= 0) db.tickets[i] = t;
    else db.tickets.unshift(t);
    save(db);
    this.log("event", "info", actor, `Hỗ trợ: ${t.subject}`);
  },
  saveKey(k: DB["keys"][0], actor: string) {
    const db = load();
    const i = db.keys.findIndex((x) => x.id === k.id);
    if (i >= 0) db.keys[i] = k;
    else db.keys.unshift(k);
    save(db);
    this.log("system", "info", actor, `API key ${k.name}`);
  },
  revokeKey(id: string, actor: string) {
    const db = load();
    db.keys = db.keys.filter((k) => k.id !== id);
    save(db);
    this.log("system", "warn", actor, `Thu hồi API key ${id}`);
  },
  revokeSession(id: string, actor: string) {
    const db = load();
    const s = db.sessions.find((x) => x.id === id);
    if (s) s.active = false;
    save(db);
    this.log("event", "warn", actor, "Thu hồi phiên đăng nhập");
  },
  savePayments(list: DB["payments"], actor: string) {
    const db = load();
    db.payments = list;
    save(db);
    this.log("event", "info", actor, "Cập nhật tài khoản thanh toán");
  },
  savePlans(list: DB["plans"], actor: string) {
    const db = load();
    db.plans = list;
    save(db);
    this.log("event", "info", actor, "Cập nhật gói dịch vụ");
  },
  saveSecurity(cfg: DB["security"], actor: string) {
    const db = load();
    db.security = cfg;
    save(db);
    this.log("system", "warn", actor, "Cập nhật cấu hình bảo mật");
  },
  saveAlert(a: DB["alerts"][0], actor: string) {
    const db = load();
    const i = db.alerts.findIndex((x) => x.id === a.id);
    if (i >= 0) db.alerts[i] = a;
    else db.alerts.unshift(a);
    save(db);
    this.log("event", "info", actor, `Cảnh báo ${a.name}`);
  },
  removeAlert(id: string) {
    const db = load();
    db.alerts = db.alerts.filter((a) => a.id !== id);
    save(db);
  },
  saveReport(r: DB["reports"][0], actor: string) {
    const db = load();
    const i = db.reports.findIndex((x) => x.id === r.id);
    if (i >= 0) db.reports[i] = r;
    else db.reports.unshift(r);
    save(db);
    this.log("event", "info", actor, `Báo cáo tự động ${r.cadence}`);
  },
  toggleApp(id: string, actor: string) {
    const db = load();
    const a = db.apps.find((x) => x.id === id);
    if (a) a.connected = !a.connected;
    save(db);
    if (a) this.log("system", "info", actor, `${a.connected ? "Kết nối" : "Ngắt"} ${a.name}`);
  },
  backup(note: string, actor: string) {
    const db = load();
    const payload = JSON.stringify(db);
    db.backups.unshift({ id: uid("bk"), note, at: new Date().toISOString(), bytes: payload.length });
    save(db);
    this.log("system", "info", actor, "Tạo backup dữ liệu");
    return payload;
  },
  restoreSeed() {
    localStorage.removeItem(KEY);
  },
  series(metric: string) {
    return [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const base = metric === "revenue" ? 8 : metric === "tickets" ? 12 : 5;
      return { day: `${d.getDate()}/${d.getMonth() + 1}`, value: Math.round(base * 10 + Math.sin(i / 2) * 18 + i * 3) };
    });
  },
};
