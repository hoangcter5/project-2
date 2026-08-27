import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDb } from "../../lib/useDb";
import { download, store } from "../../lib/store";
import { uid, when, vnd } from "../../lib/format";
import { Modal } from "../../components/Modal";
import { Req } from "../../components/Req";
import type { Account, ApiKey, DataSource, Notice, PayAccount, Plan, Ticket, UserStatus } from "../../types";

export function AdminHome() {
  const { db } = useDb();
  return (
    <div className="grid-4">
      {[
        ["Người dùng", db.accounts.length, "AD-ADM01"],
        ["Bảng", db.boards.length, "AD-ADM04"],
        ["Ticket mở", db.tickets.filter((t) => t.status !== "resolved").length, "AD-ADM06"],
        ["Phiên active", db.sessions.filter((s) => s.active).length, "AD-ADM13"],
      ].map(([l, v, id]) => (
        <article key={String(id)} className="card kpi">
          <div className="label">
            {l} <Req id={String(id)} />
          </div>
          <div className="value">{v}</div>
        </article>
      ))}
    </div>
  );
}

export function AdminUsersPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [edit, setEdit] = useState<Account | null>(null);
  return (
    <>
      <div className="toolbar">
        <Req id="AD-ADM01" />
        <button
          className="btn btn-gold"
          onClick={() =>
            setEdit({
              id: uid("acc"),
              name: "",
              email: "",
              password: "User@123",
              role: "user",
              avatar: "U",
              title: "Người dùng",
              phone: "",
              status: "invited",
              groupId: db.groups[1]?.id ?? "",
              planId: "plan-free",
              createdAt: new Date().toISOString(),
            })
          }
        >
          <Plus size={16} /> Thêm
        </button>
      </div>
      <article className="card">
        <table>
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Nhóm</th>
              <th>Gói</th>
              <th>TT</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {db.accounts.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.name}</strong>
                  <div className="muted">{a.email}</div>
                </td>
                <td>
                  <span className={`badge ${a.role}`}>{a.role}</span>
                </td>
                <td>{db.groups.find((g) => g.id === a.groupId)?.name}</td>
                <td>{db.plans.find((p) => p.id === a.planId)?.name}</td>
                <td>
                  <span className={`badge ${a.status}`}>{a.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => setEdit({ ...a })}>Sửa</button>
                    {a.role !== "admin" && (
                      <button
                        onClick={() => {
                          store.removeAccount(a.id, user!.name);
                          refresh();
                        }}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      {edit && (
        <Modal title="Người dùng" onClose={() => setEdit(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              store.saveAccount(edit, user!.name);
              setEdit(null);
              refresh();
            }}
          >
            <div className="field">
              <label>Tên</label>
              <input required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input required type="email" value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Mật khẩu</label>
              <input value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} />
            </div>
            <div className="field">
              <label>Vai trò</label>
              <select value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value as Account["role"] })}>
                <option value="admin">admin</option>
                <option value="user">user</option>
              </select>
            </div>
            <div className="field">
              <label>Nhóm</label>
              <select value={edit.groupId} onChange={(e) => setEdit({ ...edit, groupId: e.target.value })}>
                {db.groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Trạng thái</label>
              <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value as UserStatus })}>
                <option value="active">active</option>
                <option value="invited">invited</option>
                <option value="suspended">suspended</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>
                Hủy
              </button>
              <button className="btn btn-primary" style={{ width: "auto" }}>
                Lưu
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export function AdminAccessPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [name, setName] = useState("");
  const [perms, setPerms] = useState("boards,sources");
  return (
    <article className="card">
      <p>
        <Req id="AD-ADM02" /> Nhóm quyền cho user.
      </p>
      <table>
        <thead>
          <tr>
            <th>Nhóm</th>
            <th>Permissions</th>
            <th>Thành viên</th>
          </tr>
        </thead>
        <tbody>
          {db.groups.map((g) => (
            <tr key={g.id}>
              <td>{g.name}</td>
              <td>{g.permissions.join(", ")}</td>
              <td>{db.accounts.filter((a) => a.groupId === g.id).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="toolbar" style={{ marginTop: 16 }}>
        <input placeholder="Tên nhóm" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="perm1,perm2" value={perms} onChange={(e) => setPerms(e.target.value)} />
        <button
          className="btn btn-gold"
          onClick={() => {
            store.saveGroups(
              [...db.groups, { id: uid("g"), name, permissions: perms.split(",").map((p) => p.trim()) }],
              user!.name,
            );
            setName("");
            refresh();
          }}
        >
          Thêm nhóm
        </button>
      </div>
    </article>
  );
}

export function AdminSourcesPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [edit, setEdit] = useState<DataSource | null>(null);
  return (
    <>
      <div className="toolbar">
        <Req id="AD-ADM03" />
        <button
          className="btn btn-gold"
          onClick={() =>
            setEdit({
              id: uid("src"),
              name: "",
              type: "api",
              endpoint: "",
              status: "connected",
              ownerId: user!.id,
              lastSync: new Date().toISOString(),
            })
          }
        >
          Thêm nguồn
        </button>
      </div>
      <article className="card">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Loại</th>
              <th>Endpoint</th>
              <th>TT</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {db.sources.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.type}</td>
                <td>{s.endpoint}</td>
                <td>
                  <span className={`badge ${s.status === "connected" ? "active" : "low"}`}>{s.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => setEdit({ ...s })}>Sửa</button>
                    <button
                      onClick={() => {
                        store.removeSource(s.id, user!.name);
                        refresh();
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      {edit && (
        <Modal title="Nguồn" onClose={() => setEdit(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              store.saveSource(edit, user!.name);
              setEdit(null);
              refresh();
            }}
          >
            <div className="field">
              <label>Tên</label>
              <input required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Endpoint</label>
              <input required value={edit.endpoint} onChange={(e) => setEdit({ ...edit, endpoint: e.target.value })} />
            </div>
            <div className="field">
              <label>Trạng thái</label>
              <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value as DataSource["status"] })}>
                <option value="connected">connected</option>
                <option value="paused">paused</option>
                <option value="error">error</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>
                Hủy
              </button>
              <button className="btn btn-primary" style={{ width: "auto" }}>
                Lưu
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export function AdminBoardsPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  return (
    <article className="card">
      <p>
        <Req id="AD-ADM04" /> Toàn bộ dashboard trên hệ thống.
      </p>
      <table>
        <thead>
          <tr>
            <th>Bảng</th>
            <th>Chủ</th>
            <th>Widget</th>
            <th>Cập nhật</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {db.boards.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{db.accounts.find((a) => a.id === b.ownerId)?.name}</td>
              <td>{b.widgets.length}</td>
              <td>{when(b.updatedAt)}</td>
              <td>
                <Link to={`/app/boards/${b.id}`}>Xem</Link>{" "}
                <button
                  onClick={() => {
                    store.removeBoard(b.id, user!.name);
                    refresh();
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export function AdminNoticesPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  return (
    <div className="grid-2">
      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          const n: Notice = { id: uid("n"), title, body, audience, at: new Date().toISOString() };
          store.pushNotice(n, user!.name);
          setTitle("");
          setBody("");
          refresh();
        }}
      >
        <h3>
          Gửi thông báo <Req id="AD-ADM05" />
        </h3>
        <div className="field">
          <label>Tiêu đề</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label>Nội dung</label>
          <textarea required rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="field">
          <label>Đối tượng</label>
          <select value={audience} onChange={(e) => setAudience(e.target.value)}>
            <option value="all">Tất cả</option>
            {db.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary">Gửi</button>
      </form>
      <article className="card">
        {db.notices.map((n) => (
          <div key={n.id} style={{ padding: "10px 0", borderBottom: "1px dashed var(--line)" }}>
            <strong>{n.title}</strong>
            <p>{n.body}</p>
            <p className="muted">{when(n.at)}</p>
          </div>
        ))}
      </article>
    </div>
  );
}

export function AdminSupportPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [reply, setReply] = useState<Record<string, string>>({});
  return (
    <article className="card">
      <p>
        <Req id="AD-ADM06" />
      </p>
      {db.tickets.map((t) => (
        <div key={t.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
          <strong>{t.subject}</strong>{" "}
          <span className={`badge ${t.status === "resolved" ? "active" : "pending"}`}>{t.status}</span>
          <p>
            {db.accounts.find((a) => a.id === t.userId)?.name}: {t.message}
          </p>
          <input
            placeholder="Phản hồi"
            value={reply[t.id] ?? t.reply ?? ""}
            onChange={(e) => setReply({ ...reply, [t.id]: e.target.value })}
          />
          <div className="row-actions" style={{ marginTop: 8 }}>
            <button
              className="btn btn-ghost"
              onClick={() => {
                const next: Ticket = { ...t, reply: reply[t.id] ?? t.reply, status: "pending" };
                store.saveTicket(next, user!.name);
                refresh();
              }}
            >
              Trả lời
            </button>
            <button
              className="btn btn-gold"
              onClick={() => {
                store.saveTicket({ ...t, status: "resolved", reply: reply[t.id] ?? t.reply }, user!.name);
                refresh();
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      ))}
    </article>
  );
}

export function AdminReportsPage() {
  const { db } = useDb();
  return (
    <>
      <p>
        <Req id="AD-ADM07" /> Báo cáo hoạt động hệ thống.
      </p>
      <div className="grid-4">
        <article className="card kpi">
          <div className="label">Users</div>
          <div className="value">{db.accounts.length}</div>
        </article>
        <article className="card kpi">
          <div className="label">Dashboards</div>
          <div className="value">{db.boards.length}</div>
        </article>
        <article className="card kpi">
          <div className="label">Sources</div>
          <div className="value">{db.sources.length}</div>
        </article>
        <article className="card kpi">
          <div className="label">API keys</div>
          <div className="value">{db.keys.length}</div>
        </article>
      </div>
      <button
        className="btn btn-gold"
        style={{ marginTop: 16 }}
        onClick={() =>
          download(
            "system-report.csv",
            `users,${db.accounts.length}\nboards,${db.boards.length}\nsources,${db.sources.length}\ntickets,${db.tickets.length}`,
            "text/csv",
          )
        }
      >
        Xuất CSV
      </button>
    </>
  );
}

export function AdminSecurityPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [cfg, setCfg] = useState(db.security);
  return (
    <form
      className="card"
      style={{ maxWidth: 560 }}
      onSubmit={(e) => {
        e.preventDefault();
        store.saveSecurity(cfg, user!.name);
        refresh();
      }}
    >
      <h3>
        Bảo mật <Req id="AD-ADM08" />
      </h3>
      <label className="switch">
        Bắt buộc 2FA
        <input type="checkbox" checked={cfg.twoFactor} onChange={(e) => setCfg({ ...cfg, twoFactor: e.target.checked })} />
      </label>
      <div className="field">
        <label>Độ dài mật khẩu tối thiểu</label>
        <input type="number" min={6} value={cfg.minPassword} onChange={(e) => setCfg({ ...cfg, minPassword: Number(e.target.value) })} />
      </div>
      <div className="field">
        <label>Thời hạn phiên (giờ)</label>
        <input type="number" value={cfg.sessionHours} onChange={(e) => setCfg({ ...cfg, sessionHours: Number(e.target.value) })} />
      </div>
      <div className="field">
        <label>IP allowlist (tuỳ chọn)</label>
        <input value={cfg.ipAllow} onChange={(e) => setCfg({ ...cfg, ipAllow: e.target.value })} placeholder="192.168.1.0/24" />
      </div>
      <button className="btn btn-primary" style={{ width: "auto" }}>
        Lưu
      </button>
    </form>
  );
}

export function AdminApiPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [name, setName] = useState("SDK key");
  return (
    <article className="card">
      <p>
        <Req id="AD-ADM09" /> Cấp key cho developer.
      </p>
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Key</th>
            <th>Scopes</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {db.keys.map((k) => (
            <tr key={k.id}>
              <td>{k.name}</td>
              <td>
                <code>{k.key}</code>
              </td>
              <td>{k.scopes}</td>
              <td>
                <button
                  onClick={() => {
                    store.revokeKey(k.id, user!.name);
                    refresh();
                  }}
                >
                  Thu hồi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="toolbar" style={{ marginTop: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button
          className="btn btn-gold"
          onClick={() => {
            const k: ApiKey = {
              id: uid("k"),
              name,
              key: `ds_live_${uid("x").slice(-8)}`,
              ownerId: user!.id,
              scopes: "read:boards",
              at: new Date().toISOString(),
              lastUsed: new Date().toISOString(),
            };
            store.saveKey(k, user!.name);
            refresh();
          }}
        >
          Tạo key
        </button>
      </div>
    </article>
  );
}

export function AdminLogsPage({ kind }: { kind: "system" | "event" }) {
  const { db } = useDb();
  const rows = db.logs.filter((l) => l.kind === kind);
  return (
    <article className="card">
      <p>
        <Req id={kind === "system" ? "AD-ADM10" : "AD-ADM14"} />
      </p>
      <table>
        <thead>
          <tr>
            <th>Mức</th>
            <th>Tác nhân</th>
            <th>Nội dung</th>
            <th>Lúc</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l.id}>
              <td>
                <span className={`badge ${l.level === "error" ? "low" : l.level === "warn" ? "pending" : "active"}`}>{l.level}</span>
              </td>
              <td>{l.actor}</td>
              <td>{l.message}</td>
              <td>{when(l.at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export function AdminPaymentsPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [list, setList] = useState(db.payments);
  return (
    <article className="card">
      <p>
        <Req id="AD-ADM11" />
      </p>
      {list.map((p, i) => (
        <div key={p.id} className="toolbar">
          <input
            value={p.provider}
            onChange={(e) => {
              const n = [...list];
              n[i] = { ...p, provider: e.target.value };
              setList(n);
            }}
          />
          <input
            value={p.account}
            onChange={(e) => {
              const n = [...list];
              n[i] = { ...p, account: e.target.value };
              setList(n);
            }}
          />
          <select
            value={p.status}
            onChange={(e) => {
              const n = [...list];
              n[i] = { ...p, status: e.target.value as PayAccount["status"] };
              setList(n);
            }}
          >
            <option value="live">live</option>
            <option value="test">test</option>
            <option value="disabled">disabled</option>
          </select>
        </div>
      ))}
      <button
        className="btn btn-primary"
        style={{ width: "auto" }}
        onClick={() => {
          store.savePayments(list, user!.name);
          refresh();
        }}
      >
        Lưu
      </button>
    </article>
  );
}

export function AdminPlansPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  return (
    <div className="grid-3">
      {db.plans.map((p) => (
        <article key={p.id} className="card">
          <h3>
            {p.name} <Req id="AD-ADM12" />
          </h3>
          <div className="value">{vnd(p.price)}/th</div>
          <p className="muted">
            {p.boards} bảng · {p.widgets} widget
          </p>
          <label className="switch">
            Active
            <input
              type="checkbox"
              checked={p.active}
              onChange={(e) => {
                const next: Plan[] = db.plans.map((x) => (x.id === p.id ? { ...x, active: e.target.checked } : x));
                store.savePlans(next, user!.name);
                refresh();
              }}
            />
          </label>
        </article>
      ))}
    </div>
  );
}

export function AdminSessionsPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  return (
    <article className="card">
      <p>
        <Req id="AD-ADM13" />
      </p>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Thiết bị</th>
            <th>IP</th>
            <th>TT</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {db.sessions.map((s) => (
            <tr key={s.id}>
              <td>{db.accounts.find((a) => a.id === s.userId)?.name}</td>
              <td>{s.device}</td>
              <td>{s.ip}</td>
              <td>
                <span className={`badge ${s.active ? "active" : "pending"}`}>{s.active ? "active" : "revoked"}</span>
              </td>
              <td>
                {s.active && (
                  <button
                    onClick={() => {
                      store.revokeSession(s.id, user!.name);
                      refresh();
                    }}
                  >
                    Thu hồi
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export function AdminBackupPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  return (
    <article className="card">
      <p>
        <Req id="AD-ADM15" /> Tạo snapshot JSON, khôi phục dữ liệu mẫu.
      </p>
      <div className="row-actions">
        <button
          className="btn btn-gold"
          onClick={() => {
            const payload = store.backup("Manual snapshot", user!.name);
            download(`backup-${Date.now()}.json`, payload, "application/json");
            refresh();
          }}
        >
          Tạo backup
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            store.restoreSeed();
            window.location.href = "/login";
          }}
        >
          Reset dữ liệu demo
        </button>
      </div>
      <table style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Lúc</th>
            <th>Ghi chú</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {db.backups.map((b) => (
            <tr key={b.id}>
              <td>{when(b.at)}</td>
              <td>{b.note}</td>
              <td>{Math.round(b.bytes / 1024)} KB</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
