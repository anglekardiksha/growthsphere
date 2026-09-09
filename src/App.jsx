import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  Activity,
  Menu,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./App.css";

const analyticsData = {
  "7 Days": {
    Revenue: [
      { date: "Sep 3", value: 72000 },
      { date: "Sep 4", value: 75500 },
      { date: "Sep 5", value: 79000 },
      { date: "Sep 6", value: 80500 },
      { date: "Sep 7", value: 82000 },
      { date: "Sep 8", value: 83500 },
      { date: "Sep 9", value: 84250 },
    ],
    Users: [
      { date: "Sep 3", value: 10800 },
      { date: "Sep 4", value: 11200 },
      { date: "Sep 5", value: 11700 },
      { date: "Sep 6", value: 11900 },
      { date: "Sep 7", value: 12100 },
      { date: "Sep 8", value: 12350 },
      { date: "Sep 9", value: 12540 },
    ],
    Conversions: [
      { date: "Sep 3", value: 5400 },
      { date: "Sep 4", value: 5600 },
      { date: "Sep 5", value: 5900 },
      { date: "Sep 6", value: 6100 },
      { date: "Sep 7", value: 6300 },
      { date: "Sep 8", value: 6600 },
      { date: "Sep 9", value: 6840 },
    ],
  },

  "30 Days": {
    Revenue: [
      { date: "Aug 10", value: 42000 },
      { date: "Aug 15", value: 48000 },
      { date: "Aug 20", value: 53000 },
      { date: "Aug 25", value: 62000 },
      { date: "Aug 30", value: 71000 },
      { date: "Sep 5", value: 79000 },
      { date: "Sep 9", value: 84250 },
    ],
    Users: [
      { date: "Aug 10", value: 7200 },
      { date: "Aug 15", value: 8100 },
      { date: "Aug 20", value: 8800 },
      { date: "Aug 25", value: 9600 },
      { date: "Aug 30", value: 10500 },
      { date: "Sep 5", value: 11700 },
      { date: "Sep 9", value: 12540 },
    ],
    Conversions: [
      { date: "Aug 10", value: 3200 },
      { date: "Aug 15", value: 3600 },
      { date: "Aug 20", value: 3900 },
      { date: "Aug 25", value: 4400 },
      { date: "Aug 30", value: 5100 },
      { date: "Sep 5", value: 5900 },
      { date: "Sep 9", value: 6840 },
    ],
  },

  "90 Days": {
    Revenue: [
      { date: "Jun 12", value: 28000 },
      { date: "Jun 25", value: 34000 },
      { date: "Jul 8", value: 41000 },
      { date: "Jul 21", value: 47000 },
      { date: "Aug 3", value: 56000 },
      { date: "Aug 20", value: 70000 },
      { date: "Sep 9", value: 84250 },
    ],
    Users: [
      { date: "Jun 12", value: 4300 },
      { date: "Jun 25", value: 5200 },
      { date: "Jul 8", value: 6500 },
      { date: "Jul 21", value: 7300 },
      { date: "Aug 3", value: 8500 },
      { date: "Aug 20", value: 10800 },
      { date: "Sep 9", value: 12540 },
    ],
    Conversions: [
      { date: "Jun 12", value: 1800 },
      { date: "Jun 25", value: 2200 },
      { date: "Jul 8", value: 2800 },
      { date: "Jul 21", value: 3400 },
      { date: "Aug 3", value: 4100 },
      { date: "Aug 20", value: 5200 },
      { date: "Sep 9", value: 6840 },
    ],
  },
};

function App() {
 const [dateRange, setDateRange] = useState("30 Days");

const currentData = analyticsData[dateRange][metric];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">G</div>
          <span>GrowthSphere</span>
        </div>

        <nav>
          <p className="nav-title">MAIN</p>

          <a className="nav-item active">
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a className="nav-item">
            <TrendingUp size={19} />
            Growth Analytics
          </a>

          <a className="nav-item">
            <Users size={19} />
            Customers
          </a>

          <a className="nav-item">
            <Target size={19} />
            Goals
          </a>

          <p className="nav-title">INSIGHTS</p>

          <a className="nav-item">
            <BarChart3 size={19} />
            Reports
          </a>

          <a className="nav-item">
            <Activity size={19} />
            Activity
          </a>

          <p className="nav-title">SYSTEM</p>

          <a className="nav-item">
            <Settings size={19} />
            Settings
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <h4>Grow smarter</h4>
            <p>Unlock advanced growth insights.</p>
            <button>Explore Pro</button>
          </div>

          <div className="profile">
            <div className="avatar">D</div>
            <div>
              <strong>Diksha</strong>
              <span>Admin</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="mobile-menu">
            <Menu size={22} />
          </div>

          <div className="search">
            <Search size={18} />
            <input placeholder="Search anything..." />
          </div>

          <div className="header-right">
            <button className="icon-button">
              <Bell size={19} />
              <span className="notification-dot"></span>
            </button>

            <div className="header-avatar">D</div>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Good evening, Diksha 👋</h1>
              <p className="subtitle">
                Here's what's happening with your growth today.
              </p>
            </div>

            <select
  className="date-button"
  value={dateRange}
  onChange={(e) => setDateRange(e.target.value)}
>
  <option>7 Days</option>
  <option>30 Days</option>
  <option>90 Days</option>
</select>
          </div>

          <div className="stats-grid">
            <StatCard
              title="Total Revenue"
              value="₹84,250"
              change="+12.5%"
              icon={<TrendingUp size={20} />}
            />

            <StatCard
              title="Active Users"
              value="12,540"
              change="+8.2%"
              icon={<Users size={20} />}
            />

            <StatCard
              title="Conversion Rate"
              value="6.84%"
              change="+2.4%"
              icon={<Target size={20} />}
            />

            <StatCard
              title="Bounce Rate"
              value="32.8%"
              change="-4.1%"
              icon={<Activity size={20} />}
            />
          </div>

          <div className="dashboard-grid">
            <div className="card revenue-card">
              <div className="card-header">
                <div>
                  <h2>Growth Overview</h2>
                  <p>{metric} performance over time</p>
                </div>

                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                >
                  <option>Revenue</option>
                  <option>Users</option>
                  <option>Conversions</option>
                </select>
              </div>

              <div className="real-chart">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={currentData}>
                    <defs>
                      <linearGradient
                        id="growthGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#6366f1"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="100%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#eeeeF3"
                    />

                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "#a1a1aa" }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{ fontSize: 10, fill: "#a1a1aa" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        metric === "Revenue"
                          ? `₹${value / 1000}K`
                          : `${value / 1000}K`
                      }
                    />

                    <Tooltip
                      formatter={(value) =>
                        metric === "Revenue"
                          ? [`₹${Number(value).toLocaleString()}`, metric]
                          : [Number(value).toLocaleString(), metric]
                      }
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #e5e5eb",
                        fontSize: "11px",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fill="url(#growthGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card goals-card">
              <div className="card-header">
                <div>
                  <h2>Goals</h2>
                  <p>Monthly targets</p>
                </div>

                <button className="more">•••</button>
              </div>

              <Goal
                name="Revenue"
                current="₹84.2K"
                target="₹100K"
                percentage={84}
              />

              <Goal
                name="New Customers"
                current="1,240"
                target="1,500"
                percentage={83}
              />

              <Goal
                name="Retention"
                current="78%"
                target="85%"
                percentage={92}
              />

              <Goal
                name="Engagement"
                current="68%"
                target="75%"
                percentage={91}
              />
            </div>
          </div>

          <div className="bottom-grid">
            <div className="card">
              <div className="card-header">
                <div>
                  <h2>Recent Activity</h2>
                  <p>Latest growth events</p>
                </div>

                <button className="view-all">View all</button>
              </div>

              <ActivityRow
                icon="↗"
                title="Revenue increased"
                description="Monthly revenue crossed ₹80K"
                time="12 min ago"
              />

              <ActivityRow
                icon="＋"
                title="New customers"
                description="128 new customers this week"
                time="1 hr ago"
              />

              <ActivityRow
                icon="!"
                title="Bounce rate improved"
                description="Website bounce rate dropped by 4.1%"
                time="3 hrs ago"
              />

              <ActivityRow
                icon="↓"
                title="Traffic decreased"
                description="Organic traffic dropped slightly"
                time="5 hrs ago"
              />
            </div>

            <div className="card performance-card">
              <div className="card-header">
                <div>
                  <h2>Performance</h2>
                  <p>This month's key metrics</p>
                </div>
              </div>

              <Performance
                name="Organic Traffic"
                percentage={78}
              />

              <Performance
                name="Paid Traffic"
                percentage={62}
              />

              <Performance
                name="Social Media"
                percentage={86}
              />

              <Performance
                name="Email"
                percentage={71}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, change, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>

        <span className="change positive">
          <ArrowUpRight size={14} />
          {change}
        </span>
      </div>

      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Goal({ name, current, target, percentage }) {
  return (
    <div className="goal">
      <div className="goal-info">
        <span>{name}</span>
        <strong>
          {current} <small>/ {target}</small>
        </strong>
      </div>

      <div className="goal-bar">
        <div style={{ width: `${percentage}%` }}></div>
      </div>

      <span className="goal-percent">{percentage}%</span>
    </div>
  );
}

function ActivityRow({ icon, title, description, time }) {
  return (
    <div className="activity-row">
      <div className="activity-icon positive-bg">
        {icon}
      </div>

      <div className="activity-text">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <time>{time}</time>
    </div>
  );
}

function Performance({ name, percentage }) {
  return (
    <>
      <div className="performance-row">
        <span>{name}</span>
        <strong>{percentage}%</strong>
      </div>

      <div className="progress">
        <div style={{ width: `${percentage}%` }}></div>
      </div>
    </>
  );
}

export default App;