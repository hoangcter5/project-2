import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { store } from "../lib/store";
import type { Widget } from "../types";

const COLORS = ["#1a7f64", "#c9a227", "#1d4ed8", "#b42318", "#6b7c74"];

export function WidgetView({ widget, height = 220 }: { widget: Widget; height?: number }) {
  const data = store.series(widget.metric);
  const pie = [
    { name: "A", value: 38 },
    { name: "B", value: 27 },
    { name: "C", value: 21 },
    { name: "D", value: 14 },
  ];
  if (widget.type === "kpi") {
    const last = data[data.length - 1]?.value ?? 0;
    return (
      <div className="kpi">
        <div className="label">{widget.title}</div>
        <div className="value">{last.toLocaleString("vi-VN")}</div>
        <div className="delta up">Nguồn {widget.sourceId}</div>
      </div>
    );
  }
  if (widget.type === "table") {
    return (
      <table>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Giá trị</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(-6).map((r) => (
            <tr key={r.day}>
              <td>{r.day}</td>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return (
    <div style={{ height }}>
      <ResponsiveContainer>
        {widget.type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid stroke="#eee6d6" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#12261f" radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : widget.type === "pie" ? (
          <PieChart>
            <Pie data={pie} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80}>
              {pie.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : widget.type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid stroke="#eee6d6" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#1a7f64" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <AreaChart data={data}>
            <CartesianGrid stroke="#eee6d6" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#1a7f64" fill="#d7efe6" />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export function AdvancedCharts() {
  const data = store.series("revenue").map((d, i) => ({ ...d, b: d.value * 0.6, x: i + 3, y: d.value / 2 }));
  return (
    <div className="grid-2">
      <article className="card">
        <h3>Composed</h3>
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <ComposedChart data={data}>
              <CartesianGrid stroke="#eee6d6" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="b" fill="#c9a227" />
              <Line dataKey="value" stroke="#1a7f64" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="card">
        <h3>Radar</h3>
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <RadarChart data={["Tăng trưởng", "Giữ chân", "Chuyển đổi", "Hỗ trợ", "Chất lượng"].map((k, i) => ({ k, v: 50 + i * 8 }))}>
              <PolarGrid />
              <PolarAngleAxis dataKey="k" />
              <Radar dataKey="v" stroke="#1a7f64" fill="#1a7f64" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="card">
        <h3>Scatter</h3>
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid stroke="#eee6d6" />
              <XAxis dataKey="x" />
              <YAxis dataKey="y" />
              <Tooltip />
              <Scatter data={data} fill="#12261f" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}
