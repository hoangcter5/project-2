import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDb } from "../../lib/useDb";
import { store } from "../../lib/store";
import { uid, when } from "../../lib/format";
import { Modal } from "../../components/Modal";
import { WidgetView } from "../../components/Charts";
import { Req } from "../../components/Req";
import type { Board, SharePerm, Widget, WidgetType } from "../../types";

function blankBoard(ownerId: string): Board {
  return {
    id: uid("b"),
    name: "",
    description: "",
    ownerId,
    theme: "paper",
    layout: "grid2",
    widgets: [],
    shares: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function BoardsPage() {
  const { user, isAdmin } = useAuth();
  const { refresh } = useDb();
  const [edit, setEdit] = useState<Board | null>(null);
  const nav = useNavigate();
  if (!user) return null;
  const rows = store.visibleBoards(user.id, isAdmin);

  function save(e: FormEvent) {
    e.preventDefault();
    if (!edit || !user) return;
    store.saveBoard(edit, user.name, edit.name ? "tạo / cập nhật bảng điều khiển" : "lưu bảng");
    setEdit(null);
    refresh();
    nav(`/app/boards/${edit.id}`);
  }

  return (
    <>
      <div className="toolbar">
        <p>
          <Req id="USR-DBD01" /> <Req id="USR-DBD02" />
        </p>
        <button className="btn btn-gold" onClick={() => setEdit(blankBoard(user.id))}>
          <Plus size={16} /> Tạo bảng điều khiển
        </button>
      </div>
      <div className="grid-3">
        {rows.map((b) => (
          <article key={b.id} className={`card theme-${b.theme}`}>
            <div className="card-head">
              <h3>{b.name}</h3>
              <span className="badge active">{b.widgets.length} widget</span>
            </div>
            <p className="hint">{b.description}</p>
            <p className="muted">Cập nhật {when(b.updatedAt)}</p>
            <div className="row-actions" style={{ marginTop: 12 }}>
              <Link className="btn btn-ghost" to={`/app/boards/${b.id}`}>
                Mở
              </Link>
              {(isAdmin || b.ownerId === user.id) && (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    store.removeBoard(b.id, user.name);
                    refresh();
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {rows.length === 0 && <p className="empty">Chưa có bảng. Tạo mới để thêm widget.</p>}
      {edit && (
        <Modal title="Tạo bảng điều khiển" onClose={() => setEdit(null)}>
          <form onSubmit={save}>
            <div className="field">
              <label>Tên</label>
              <input required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Mô tả</label>
              <input value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>
                Hủy
              </button>
              <button className="btn btn-primary" style={{ width: "auto" }}>
                Tạo & cấu hình widget
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export function BoardEditorPage() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const { db, refresh } = useDb();
  const board = db.boards.find((b) => b.id === id);
  const [w, setW] = useState<Widget | null>(null);
  if (!user) return null;
  if (!board) return <p className="empty">Không tìm thấy bảng.</p>;
  const canEdit = store.canEditBoard(board, user.id, isAdmin);

  function persist(next: Board, action: string) {
    store.saveBoard(next, user!.name, action);
    refresh();
  }

  return (
    <div className={`board-wrap theme-${board.theme}`}>
      <div className="toolbar">
        <div>
          <h3>{board.name}</h3>
          <p className="muted">
            <Req id="USR-DBD06" /> <Req id="USR-DBD07" /> layout {board.layout}
          </p>
        </div>
        {canEdit && (
          <div className="row-actions">
            <select
              value={board.layout}
              onChange={(e) => persist({ ...board, layout: e.target.value as Board["layout"] }, "đổi layout")}
            >
              <option value="grid2">2 cột</option>
              <option value="grid3">3 cột</option>
            </select>
            <select
              value={board.theme}
              onChange={(e) => persist({ ...board, theme: e.target.value as Board["theme"] }, "đổi giao diện")}
            >
              <option value="paper">Paper</option>
              <option value="ink">Ink</option>
              <option value="forest">Forest</option>
            </select>
            <button className="btn btn-gold" onClick={() => setW({ id: uid("w"), type: "kpi", title: "", sourceId: db.sources[0]?.id ?? "", metric: "revenue" })}>
              <Plus size={16} /> Widget
            </button>
          </div>
        )}
      </div>
      <div className={board.layout === "grid3" ? "grid-3" : "grid-2"}>
        {board.widgets.map((widget) => (
          <article key={widget.id} className="card">
            <div className="card-head">
              <strong>{widget.title}</strong>
              {canEdit && (
                <div className="row-actions">
                  <button onClick={() => setW(widget)}>
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() =>
                      persist({ ...board, widgets: board.widgets.filter((x) => x.id !== widget.id) }, `xóa widget ${widget.title}`)
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
            <WidgetView widget={widget} />
          </article>
        ))}
      </div>
      {w && (
        <Modal title="Cấu hình widget" onClose={() => setW(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const exists = board.widgets.some((x) => x.id === w.id);
              const widgets = exists ? board.widgets.map((x) => (x.id === w.id ? w : x)) : [...board.widgets, w];
              persist({ ...board, widgets }, exists ? `sửa widget ${w.title}` : `thêm widget ${w.title}`);
              setW(null);
            }}
          >
            <div className="field">
              <label>Tiêu đề</label>
              <input required value={w.title} onChange={(e) => setW({ ...w, title: e.target.value })} />
            </div>
            <div className="field">
              <label>Kiểu</label>
              <select value={w.type} onChange={(e) => setW({ ...w, type: e.target.value as WidgetType })}>
                {["kpi", "line", "bar", "pie", "area", "table"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Nguồn dữ liệu</label>
              <select value={w.sourceId} onChange={(e) => setW({ ...w, sourceId: e.target.value })}>
                {db.sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Metric</label>
              <input required value={w.metric} onChange={(e) => setW({ ...w, metric: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setW(null)}>
                Hủy
              </button>
              <button className="btn btn-primary" style={{ width: "auto" }}>
                Lưu
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export function ShareAccessPage() {
  const { user, isAdmin } = useAuth();
  const { db, refresh } = useDb();
  const [boardId, setBoardId] = useState(db.boards[0]?.id ?? "");
  const [uidSel, setUid] = useState(db.accounts.find((a) => a.role === "user")?.id ?? "");
  const [perm, setPerm] = useState<SharePerm>("view");
  if (!user) return null;
  const board = db.boards.find((b) => b.id === boardId);
  const mine = store.visibleBoards(user.id, isAdmin);

  return (
    <article className="card">
      <p>
        <Req id="USR-DBD05" /> <Req id="USR-DBD13" /> Chia sẻ bảng với user khác và gán quyền view / edit / manage.
      </p>
      <div className="field">
        <label>Bảng</label>
        <select value={boardId} onChange={(e) => setBoardId(e.target.value)}>
          {mine.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      {board && (
        <>
          <table>
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Quyền</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {board.shares.map((s) => (
                <tr key={s.userId}>
                  <td>{db.accounts.find((a) => a.id === s.userId)?.name ?? s.userId}</td>
                  <td>
                    <span className="badge manager">{s.permission}</span>
                  </td>
                  <td>
                    {(board.ownerId === user.id || isAdmin) && (
                      <button
                        onClick={() => {
                          store.saveBoard(
                            { ...board, shares: board.shares.filter((x) => x.userId !== s.userId) },
                            user.name,
                            "gỡ chia sẻ",
                          );
                          refresh();
                        }}
                      >
                        Gỡ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="toolbar" style={{ marginTop: 16 }}>
            <select value={uidSel} onChange={(e) => setUid(e.target.value)}>
              {db.accounts
                .filter((a) => a.id !== board.ownerId)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
            <select value={perm} onChange={(e) => setPerm(e.target.value as SharePerm)}>
              <option value="view">view</option>
              <option value="edit">edit</option>
              <option value="manage">manage</option>
            </select>
            <button
              className="btn btn-gold"
              onClick={() => {
                const shares = [...board.shares.filter((s) => s.userId !== uidSel), { userId: uidSel, permission: perm }];
                store.saveBoard({ ...board, shares }, user.name, `chia sẻ ${perm}`);
                refresh();
              }}
            >
              Chia sẻ
            </button>
          </div>
        </>
      )}
    </article>
  );
}
