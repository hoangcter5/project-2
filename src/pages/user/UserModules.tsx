import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDb } from "../../lib/useDb";
import { download, store } from "../../lib/store";
import { uid, when } from "../../lib/format";
import { Modal } from "../../components/Modal";
import { Req } from "../../components/Req";
import { AdvancedCharts } from "../../components/Charts";
import type { AlertRule, AutoReport, DataSource, Ticket } from "../../types";

export function SourcesPage() {
  const { user, isAdmin } = useAuth();
  const { db, refresh } = useDb();
  const [edit, setEdit] = useState<DataSource | null>(null);
  const rows = isAdmin ? db.sources : db.sources.filter((s) => s.ownerId === user?.id || s.status === "connected");
  return (
    <>
      <div className="toolbar">
        <Req id="USR-DBD03" />
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
              <th>Trạng thái</th>
              <th>Sync</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong>{s.name}</strong>
                </td>
                <td>{s.type}</td>
                <td className="muted">{s.endpoint}</td>
                <td>
                  <span className={`badge ${s.status === "connected" ? "active" : "low"}`}>{s.status}</span>
                </td>
                <td>{when(s.lastSync)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      {edit && (
        <Modal title="Nguồn dữ liệu" onClose={() => setEdit(null)}>
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
              <label>Loại</label>
              <select value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value as DataSource["type"] })}>
                <option value="api">api</option>
                <option value="csv">csv</option>
                <option value="sql">sql</option>
                <option value="google">google</option>
              </select>
            </div>
            <div className="field">
              <label>Endpoint</label>
              <input required value={edit.endpoint} onChange={(e) => setEdit({ ...edit, endpoint: e.target.value })} />
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

export function ReportsViewPage() {
  const { db } = useDb();
  return (
    <>
      <p>
        <Req id="USR-DBD04" /> Phân tích số liệu từ các bảng đã tạo.
      </p>
      <div className="grid-4">
        <article className="card kpi">
          <div className="label">Số bảng</div>
          <div className="value">{db.boards.length}</div>
        </article>
        <article className="card kpi">
          <div className="label">Widget</div>
          <div className="value">{db.boards.reduce((s, b) => s + b.widgets.length, 0)}</div>
        </article>
        <article className="card kpi">
          <div className="label">Nguồn</div>
          <div className="value">{db.sources.length}</div>
        </article>
        <article className="card kpi">
          <div className="label">Cảnh báo bật</div>
          <div className="value">{db.alerts.filter((a) => a.enabled).length}</div>
        </article>
      </div>
      <article className="card" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>Bảng</th>
              <th>Widget</th>
              <th>Chia sẻ</th>
            </tr>
          </thead>
          <tbody>
            {db.boards.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.widgets.length}</td>
                <td>{b.shares.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </>
  );
}

export function AlertsPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [edit, setEdit] = useState<AlertRule | null>(null);
  const rows = db.alerts.filter((a) => a.ownerId === user?.id || user?.role === "admin");
  return (
    <>
      <div className="toolbar">
        <Req id="USR-ALRT01" />
        <button
          className="btn btn-gold"
          onClick={() =>
            setEdit({
              id: uid("al"),
              boardId: db.boards[0]?.id ?? "",
              name: "",
              metric: "revenue",
              op: "<",
              threshold: 0,
              channel: "inapp",
              enabled: true,
              ownerId: user!.id,
            })
          }
        >
          Thêm cảnh báo
        </button>
      </div>
      <article className="card">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Điều kiện</th>
              <th>Kênh</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>
                  {a.metric} {a.op} {a.threshold}
                </td>
                <td>{a.channel}</td>
                <td>
                  <button
                    onClick={() => {
                      store.removeAlert(a.id);
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
      {edit && (
        <Modal title="Cảnh báo" onClose={() => setEdit(null)}>
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              store.saveAlert(edit, user!.name);
              setEdit(null);
              refresh();
            }}
          >
            <div className="field">
              <label>Tên</label>
              <input required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Bảng</label>
              <select value={edit.boardId} onChange={(e) => setEdit({ ...edit, boardId: e.target.value })}>
                {db.boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Metric / ngưỡng</label>
              <input value={edit.metric} onChange={(e) => setEdit({ ...edit, metric: e.target.value })} />
              <input type="number" value={edit.threshold} onChange={(e) => setEdit({ ...edit, threshold: Number(e.target.value) })} />
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

export function WidgetsHubPage() {
  const { user, isAdmin } = useAuth();
  const boards = store.visibleBoards(user!.id, isAdmin);
  return (
    <article className="card">
      <p>
        <Req id="USR-DBD06" /> Danh sách widget trên mọi bảng. Mở bảng để thêm / sửa / xóa.
      </p>
      <table>
        <thead>
          <tr>
            <th>Widget</th>
            <th>Kiểu</th>
            <th>Bảng</th>
            <th>Metric</th>
          </tr>
        </thead>
        <tbody>
          {boards.flatMap((b) =>
            b.widgets.map((w) => (
              <tr key={w.id}>
                <td>{w.title}</td>
                <td>{w.type}</td>
                <td>{b.name}</td>
                <td>{w.metric}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </article>
  );
}

export function ThemePage() {
  const { user, isAdmin } = useAuth();
  const { db, refresh } = useDb();
  const mine = db.boards.filter((b) => b.ownerId === user?.id || isAdmin);
  return (
    <div className="grid-3">
      {mine.map((b) => (
        <article key={b.id} className={`card theme-${b.theme}`}>
          <h3>{b.name}</h3>
          <p className="hint">
            <Req id="USR-DBD07" /> Theme + layout
          </p>
          <select
            value={b.theme}
            onChange={(e) => {
              store.saveBoard({ ...b, theme: e.target.value as typeof b.theme }, user!.name, "tùy chỉnh giao diện");
              refresh();
            }}
          >
            <option value="paper">paper</option>
            <option value="ink">ink</option>
            <option value="forest">forest</option>
          </select>
          <select
            style={{ marginTop: 8 }}
            value={b.layout}
            onChange={(e) => {
              store.saveBoard({ ...b, layout: e.target.value as typeof b.layout }, user!.name, "đổi bố cục");
              refresh();
            }}
          >
            <option value="grid2">grid2</option>
            <option value="grid3">grid3</option>
          </select>
        </article>
      ))}
    </div>
  );
}

export function HistoryPage() {
  const { db } = useDb();
  return (
    <article className="card">
      <p>
        <Req id="USR-DBD08" />
      </p>
      <table>
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Người</th>
            <th>Hành động</th>
            <th>Bảng</th>
          </tr>
        </thead>
        <tbody>
          {db.history.map((h) => (
            <tr key={h.id}>
              <td>{when(h.at)}</td>
              <td>{h.actor}</td>
              <td>{h.action}</td>
              <td>{db.boards.find((b) => b.id === h.boardId)?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export function ExportPage() {
  const { db } = useDb();
  return (
    <article className="card">
      <p>
        <Req id="USR-DBD09" /> Xuất CSV / JSON từ dữ liệu bảng.
      </p>
      <div className="row-actions">
        <button
          className="btn btn-gold"
          onClick={() => {
            const csv = ["name,widgets,shares", ...db.boards.map((b) => `${b.name},${b.widgets.length},${b.shares.length}`)].join("\n");
            download("dashboards.csv", csv, "text/csv");
          }}
        >
          Xuất CSV
        </button>
        <button className="btn btn-ghost" onClick={() => download("dashboards.json", JSON.stringify(db.boards, null, 2), "application/json")}>
          Xuất JSON
        </button>
      </div>
    </article>
  );
}

export function SchedulePage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [edit, setEdit] = useState<AutoReport | null>(null);
  return (
    <>
      <div className="toolbar">
        <Req id="USR-DBD10" />
        <button
          className="btn btn-gold"
          onClick={() =>
            setEdit({
              id: uid("rep"),
              boardId: db.boards[0]?.id ?? "",
              cadence: "weekly",
              format: "csv",
              email: user!.email,
              enabled: true,
              ownerId: user!.id,
            })
          }
        >
          Lịch mới
        </button>
      </div>
      <article className="card">
        <table>
          <thead>
            <tr>
              <th>Bảng</th>
              <th>Nhịp</th>
              <th>Định dạng</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {db.reports.map((r) => (
              <tr key={r.id}>
                <td>{db.boards.find((b) => b.id === r.boardId)?.name}</td>
                <td>{r.cadence}</td>
                <td>{r.format}</td>
                <td>{r.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      {edit && (
        <Modal title="Báo cáo tự động" onClose={() => setEdit(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              store.saveReport(edit, user!.name);
              setEdit(null);
              refresh();
            }}
          >
            <div className="field">
              <label>Bảng</label>
              <select value={edit.boardId} onChange={(e) => setEdit({ ...edit, boardId: e.target.value })}>
                {db.boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Lịch</label>
              <select value={edit.cadence} onChange={(e) => setEdit({ ...edit, cadence: e.target.value as AutoReport["cadence"] })}>
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
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

export function AppsPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  return (
    <div className="grid-3">
      {db.apps.map((a) => (
        <article key={a.id} className="card">
          <h3>{a.name}</h3>
          <p className="muted">
            <Req id="USR-DBD11" /> {a.kind}
          </p>
          <span className={`badge ${a.connected ? "active" : "pending"}`}>{a.connected ? "connected" : "off"}</span>
          <button
            className="btn btn-ghost"
            style={{ marginTop: 12 }}
            onClick={() => {
              store.toggleApp(a.id, user!.name);
              refresh();
            }}
          >
            {a.connected ? "Ngắt" : "Kết nối"}
          </button>
        </article>
      ))}
    </div>
  );
}

export function ChartsPage() {
  return (
    <>
      <p>
        <Req id="USR-DBD12" /> Composed, radar, scatter.
      </p>
      <AdvancedCharts />
    </>
  );
}

export function SupportPage() {
  const { user } = useAuth();
  const { db, refresh } = useDb();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const mine = db.tickets.filter((t) => t.userId === user?.id);
  return (
    <div className="grid-2">
      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          const t: Ticket = {
            id: uid("t"),
            userId: user!.id,
            subject,
            message,
            status: "open",
            at: new Date().toISOString(),
          };
          store.saveTicket(t, user!.name);
          setSubject("");
          setMessage("");
          refresh();
        }}
      >
        <h3>
          Gửi yêu cầu <Req id="USR-SPT01" />
        </h3>
        <div className="field">
          <label>Tiêu đề</label>
          <input required value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="field">
          <label>Nội dung</label>
          <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <button className="btn btn-primary">Gửi</button>
      </form>
      <article className="card">
        <h3>Ticket của bạn</h3>
        {mine.map((t) => (
          <div key={t.id} style={{ padding: "10px 0", borderBottom: "1px dashed var(--line)" }}>
            <strong>{t.subject}</strong>
            <span className={`badge ${t.status === "resolved" ? "active" : "pending"}`}>{t.status}</span>
            <p className="muted">{t.message}</p>
            {t.reply && <p>Phản hồi: {t.reply}</p>}
          </div>
        ))}
      </article>
    </div>
  );
}

export function AccountPage() {
  const { user, reload } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [title, setTitle] = useState(user?.title ?? "");
  const [saved, setSaved] = useState(false);
  if (!user) return null;
  return (
    <form
      className="card"
      style={{ maxWidth: 520 }}
      onSubmit={(e) => {
        e.preventDefault();
        store.saveAccount({ ...user, name, phone, title }, user.name);
        reload();
        setSaved(true);
      }}
    >
      <h3>
        Hồ sơ <Req id="USR-ACC01" />
      </h3>
      <div className="field">
        <label>Họ tên</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Email</label>
        <input value={user.email} disabled />
      </div>
      <div className="field">
        <label>Chức danh</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="field">
        <label>Điện thoại</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <p className="muted">Gói: {user.planId}</p>
      <button className="btn btn-primary" style={{ width: "auto" }}>
        {saved ? "Đã lưu" : "Lưu"}
      </button>
    </form>
  );
}
