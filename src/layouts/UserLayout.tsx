import {
  LayoutDashboard,
  Database,
  FileBarChart,
  Bell,
  Share2,
  LifeBuoy,
  UserRound,
  Puzzle,
  Palette,
  History,
  Download,
  CalendarClock,
  Plug,
  LineChart,
} from "lucide-react";
import { Shell } from "./Shell";
import { useAuth } from "../context/AuthContext";

const items = [
  { to: "/app", label: "Bảng của tôi", icon: LayoutDashboard, end: true },
  { to: "/app/sources", label: "Nguồn dữ liệu", icon: Database },
  { to: "/app/reports", label: "Báo cáo", icon: FileBarChart },
  { to: "/app/alerts", label: "Cảnh báo", icon: Bell },
  { to: "/app/share", label: "Chia sẻ", icon: Share2 },
  { to: "/app/widgets", label: "Widget", icon: Puzzle },
  { to: "/app/theme", label: "Giao diện", icon: Palette },
  { to: "/app/history", label: "Lịch sử", icon: History },
  { to: "/app/export", label: "Xuất dữ liệu", icon: Download },
  { to: "/app/schedule", label: "Báo cáo tự động", icon: CalendarClock },
  { to: "/app/apps", label: "Ứng dụng thứ 3", icon: Plug },
  { to: "/app/charts", label: "Biểu đồ nâng cao", icon: LineChart },
  { to: "/app/support", label: "Hỗ trợ", icon: LifeBuoy },
  { to: "/app/account", label: "Tài khoản", icon: UserRound },
];

const titles: Record<string, { title: string; sub: string }> = {
  "/app": { title: "Quản lý bảng điều khiển", sub: "USR-DBD01 · USR-DBD02 — tạo, xem, sửa, xóa" },
  "/app/sources": { title: "Tích hợp dữ liệu", sub: "USR-DBD03" },
  "/app/reports": { title: "Xem báo cáo", sub: "USR-DBD04" },
  "/app/alerts": { title: "Cài đặt cảnh báo", sub: "USR-ALRT01" },
  "/app/share": { title: "Chia sẻ & quyền bảng", sub: "USR-DBD05 · USR-DBD13" },
  "/app/widgets": { title: "Quản lý widget", sub: "USR-DBD06" },
  "/app/theme": { title: "Tùy chỉnh giao diện", sub: "USR-DBD07" },
  "/app/history": { title: "Lịch sử thay đổi", sub: "USR-DBD08" },
  "/app/export": { title: "Xuất dữ liệu", sub: "USR-DBD09" },
  "/app/schedule": { title: "Báo cáo tự động", sub: "USR-DBD10" },
  "/app/apps": { title: "Tích hợp bên thứ ba", sub: "USR-DBD11" },
  "/app/charts": { title: "Biểu đồ nâng cao", sub: "USR-DBD12" },
  "/app/support": { title: "Yêu cầu hỗ trợ", sub: "USR-SPT01" },
  "/app/account": { title: "Tài khoản cá nhân", sub: "USR-ACC01" },
};

export function UserLayout() {
  const { isAdmin } = useAuth();
  return (
    <Shell
      items={items}
      titles={titles}
      switchTo={isAdmin ? { to: "/admin", label: "→ Cổng quản trị" } : undefined}
    />
  );
}
