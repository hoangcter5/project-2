import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Req } from "../components/Req";
import { store } from "../lib/store";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@dashstack.dev");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const err = login(email, password);
    setError(err);
    if (!err) nav(store.current()?.role === "admin" ? "/admin" : "/app", { replace: true });
  }

  return (
    <div className="login-shell">
      <section className="login-art">
        <div className="brand-mark">
          <span className="mark">D</span>
          DashStack
        </div>
        <div>
          <h1>Tạo, tùy chỉnh và theo dõi dashboard từ nhiều nguồn dữ liệu.</h1>
          <p className="lead">
            Dành cho quản trị viên, nhà phân tích và nhóm vận hành — biểu đồ, báo cáo, chia sẻ và cảnh báo trên một hệ thống.
          </p>
        </div>
        <div className="kpis-mini">
          <div>
            <span>Nguồn dữ liệu</span>
            <strong>API · SQL</strong>
          </div>
          <div>
            <span>Widget</span>
            <strong>KPI · Chart</strong>
          </div>
          <div>
            <span>Vai trò</span>
            <strong>Admin · User</strong>
          </div>
        </div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <h2>
            Đăng nhập <Req id="USR-LOG01" />
          </h2>
          <p className="hint">Tài khoản phải đã đăng ký. Admin vào cổng quản trị; user vào workspace.</p>
          {error && <div className="error">{error}</div>}
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <div className="field">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button className="btn btn-primary" type="submit">
            Đăng nhập
          </button>
          <p className="hint" style={{ marginTop: 16 }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký (USR-REG01)</Link>
          </p>
          <div className="demo-accounts">
            <p className="muted">Tài khoản demo</p>
            <button type="button" onClick={() => { setEmail("admin@dashstack.dev"); setPassword("Admin@123"); }}>
              <strong>Admin</strong>
              <br />
              <small>admin@dashstack.dev / Admin@123</small>
            </button>
            <button type="button" onClick={() => { setEmail("user@dashstack.dev"); setPassword("User@123"); }}>
              <strong>User</strong>
              <br />
              <small>user@dashstack.dev / User@123</small>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
