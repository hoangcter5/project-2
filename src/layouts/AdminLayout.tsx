import {
  Users,
  Shield,
  Database,
  LayoutDashboard,
  Bell,
  LifeBuoy,
  FileBarChart,
  Lock,
  KeyRound,
  ScrollText,
  CreditCard,
  Layers,
  MonitorSmartphone,
  Activity,
  HardDrive,
} from "lucide-react";
import { Shell } from "./Shell";

const items = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Người dùng", icon: Users },
  { to: "/admin/access", label: "Quyền truy cập", icon: Shield },
  { to: "/admin/sources", label: "Tích hợp dữ liệu", icon: Database },
  { to: "/admin/boards", label: "Bảng điều khiển", icon: LayoutDashboard },
  { to: "/admin/notices", label: "Thông báo", icon: Bell },
  { to: "/admin/support", label: "Hỗ trợ", icon: LifeBuoy },
  { to: "/admin/reports", label: "Báo cáo", icon: FileBarChart },
  { to: "/admin/security", label: "Bảo mật", icon: Lock },
  { to: "/admin/api", label: "API", icon: KeyRound },
  { to: "/admin/logs", label: "Nhật ký", icon: ScrollText },
  { to: "/admin/payments", label: "Thanh toán", icon: CreditCard },
  { to: "/admin/plans", label: "Gói dịch vụ", icon: Layers },
  { to: "/admin/sessions", label: "Phiên đăng nhập", icon: MonitorSmartphone },
  { to: "/admin/events", label: "Log sự kiện", icon: Activity },
  { to: "/admin/backup", label: "Backup", icon: HardDrive },
];

const titles: Record<string, { title: string; sub: string }> = {
  "/admin": { title: "Điều hành hệ thống", sub: "AD-ADM01 → AD-ADM15" },
  "/admin/users": { title: "Quản lý người dùng", sub: "AD-ADM01 — xem, thêm, sửa, xóa" },
  "/admin/access": { title: "Quản lý quyền truy cập", sub: "AD-ADM02 — nhóm và permission" },
  "/admin/sources": { title: "Tích hợp dữ liệu", sub: "AD-ADM03 — nguồn API / SQL / Sheet" },
  "/admin/boards": { title: "Bảng điều khiển hệ thống", sub: "AD-ADM04" },
  "/admin/notices": { title: "Thông báo", sub: "AD-ADM05 — gửi tới người dùng" },
  "/admin/support": { title: "Hỗ trợ kỹ thuật", sub: "AD-ADM06" },
  "/admin/reports": { title: "Báo cáo hoạt động", sub: "AD-ADM07 — xem và xuất" },
  "/admin/security": { title: "Bảo mật", sub: "AD-ADM08" },
  "/admin/api": { title: "Quản lý API", sub: "AD-ADM09" },
  "/admin/logs": { title: "Nhật ký hệ thống", sub: "AD-ADM10" },
  "/admin/payments": { title: "Tài khoản thanh toán", sub: "AD-ADM11" },
  "/admin/plans": { title: "Gói dịch vụ", sub: "AD-ADM12" },
  "/admin/sessions": { title: "Phiên đăng nhập", sub: "AD-ADM13" },
  "/admin/events": { title: "Log sự kiện", sub: "AD-ADM14" },
  "/admin/backup": { title: "Backup dữ liệu", sub: "AD-ADM15" },
};

export function AdminLayout() {
  return <Shell items={items} titles={titles} switchTo={{ to: "/app", label: "→ Workspace người dùng" }} />;
}
