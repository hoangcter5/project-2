import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Req } from "../components/Req";

export function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Xác nhận mật khẩu không khớp.");
      return;
    }
    const err = register(name, email, password);
    setError(err);
    if (!err) nav("/app", { replace: true });
  }

  return (
    <div className="login-shell">
      <section className="login-art">
        <div className="brand-mark">
          <span className="mark">D</span>
          DashStack
        </div>
        <div>
          <h1>Mở workspace phân tích trong vài bước.</h1>
          <p className="lead">Sau khi đăng ký bạn có thể tạo bảng điều khiển, gắn widget và kết nối nguồn dữ liệu.</p>
        </div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <h2>
            Đăng ký tài khoản <Req id="USR-REG01" />
          </h2>
          <p className="hint">Tên, email, mật khẩu và xác nhận mật khẩu.</p>
          {error && <div className="error">{error}</div>}
          <div className="field">
            <label>Họ tên</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Mật khẩu</label>
            <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="field">
            <label>Xác nhận mật khẩu</label>
            <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit">
            Tạo tài khoản
          </button>
          <p className="hint" style={{ marginTop: 16 }}>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
