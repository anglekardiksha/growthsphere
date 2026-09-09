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
  ArrowDownRight,
  Activity,
  Menu,
} from "lucide-react";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* Sidebar */}
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

      {/* Main */}
      <main className="main">
        {/* Header */}
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

        {/* Content */}
        <section className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Good evening, Diksha 👋</h1>
              <p className="subtitle">
                Here's what's happening with your growth today.
              </p>
            </div>

            <button className="date-button">
              Last 30 days ▾
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <StatCard
              title="Total Revenue"
              value="₹84,250"
              change="+12.5%"
              positive
              icon={<TrendingUp size={20} />}
            />

            <StatCard
              title="Active Users"
              value="12,540"
              change="+8.2%"
              positive
              icon={<Users size={20} />}
            />

            <StatCard
              title="Conversion Rate"
              value="6.84%"
              change="+2.4%"
              positive
              icon={<Target size={20} />}
            />

            <StatCard
              title="Bounce Rate"
              value="32.8%"
              change="-4.1%"
              positive
              icon={<Activity size={20} />}
            />
          </div>

          {/* Charts */}
          <div className="dashboard-grid">
            <div className="card revenue-card">
              <div className="card-header">
                <div>
                  <h2>Growth Overview</h2>
                  <p>Revenue performance over time</p>
                </div>

                <select>
                  <option>Revenue</option>
                  <option>Users</option>
                  <option>Conversions</option>
                </select>
              </div>

              <div className="chart">
                <div className="y-labels">
                  <span>100K</span>
                  <span>75K</span>
                  <span>50K</span>
                  <span>25K</span>
                  <span>0</span>
                </div>

                <div className="chart-area">
                  <div className="grid-line one"></div>
                  <div className="grid-line two"></div>
                  <div className="grid-line three"></div>
                  <div className="grid-line four"></div>
                  <div className="grid-line five"></div>

                  <svg
                    viewBox="0 0 700 260"
                    preserveAspectRatio="none"
                    className="growth-line"
                  >
                    <defs>
                      <linearGradient
                        id="areaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#6366f1"
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="100%"
                          stopColor="#6366f1"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="M0 220
                      C45 205 55 185 100 190
                      C145 195 150 155 200 165
                      C245 175 255 125 300 135
                      C345 145 360 105 400 115
                      C445 125 455 75 500 90
                      C545 105 565 50 610 65
                      C650 78 675 35 700 45
                      L700 260 L0 260 Z"
                      fill="url(#areaGradient)"
                    />

                    <path
                      d="M0 220
                      C45 205 55 185 100 190
                      C145 195 150 155 200 165
                      C245 175 255 125 300 135
                      C345 145 360 105 400 115
                      C445 125 455 75 500 90
                      C545 105 565 50 610 65
                      C650 78 675 35 700 45"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="x-labels">
                    <span>Aug 10</span>
                    <span>Aug 15</span>
                    <span>Aug 20</span>
                    <span>Aug 25</span>
                    <span>Aug 30</span>
                    <span>Sep 5</span>
                    <span>Sep 9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals */}
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

          {/* Bottom cards */}
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
                positive
              />

              <ActivityRow
                icon="＋"
                title="New customers"
                description="128 new customers this week"
                time="1 hr ago"
                positive
              />

              <ActivityRow
                icon="!"
                title="Bounce rate improved"
                description="Website bounce rate dropped by 4.1%"
                time="3 hrs ago"
                positive
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

              <div className="performance">
                <div className="performance-row">
                  <span>Organic Traffic</span>
                  <strong>78%</strong>
                </div>
                <div className="progress">
                  <div style={{ width: "78%" }}></div>
                </div>

                <div className="performance-row">
                  <span>Paid Traffic</span>
                  <strong>62%</strong>
                </div>
                <div className="progress">
                  <div style={{ width: "62%" }}></div>
                </div>

                <div className="performance-row">
                  <span>Social Media</span>
                  <strong>86%</strong>
                </div>
                <div className="progress">
                  <div style={{ width: "86%" }}></div>
                </div>

                <div className="performance-row">
                  <span>Email</span>
                  <strong>71%</strong>
                </div>
                <div className="progress">
                  <div style={{ width: "71%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, change, positive, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>

        <span className={`change ${positive ? "positive" : "negative"}`}>
          {positive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
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

function ActivityRow({ icon, title, description, time, positive }) {
  return (
    <div className="activity-row">
      <div className={`activity-icon ${positive ? "positive-bg" : ""}`}>
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

export default App;