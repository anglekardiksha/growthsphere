import React, { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  LayoutDashboard,
  Moon,
  RefreshCcw,
  Search,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  UserPlus,
  Wallet,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import growthDataRaw from "./data/growthData.csv?raw";
import "./App.css";

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(csv) {
  const lines = csv
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));

  return lines.slice(1).map((line) => {
    const values = line
      .split(",")
      .map((v) => v.trim().replace(/^"|"$/g, ""));

    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

/* =========================================================
   HELPERS
========================================================= */

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return 0;

  const number = Number(String(value).replace(/[%₹$,]/g, ""));

  return Number.isFinite(number) ? number : 0;
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

const formatCurrency = (value) =>
  `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;

const getField = (row, names) => {
  for (const name of names) {
    if (row[name] !== undefined) return row[name];
  }

  return "";
};

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [theme, setTheme] = useState("light");

  const [period, setPeriod] = useState("30");
  const [region, setRegion] = useState("All");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const rawData = useMemo(() => {
    return parseCSV(growthDataRaw);
  }, []);

  /* =======================================================
     NORMALIZE DATA
  ======================================================= */

  const data = useMemo(() => {
    return rawData.map((row, index) => {
      const date = getField(row, [
        "date",
        "Date",
        "DATE",
        "day",
        "Day",
      ]);

      const revenue = toNumber(
        getField(row, [
          "revenue",
          "Revenue",
          "sales",
          "Sales",
          "income",
        ])
      );

      const users = toNumber(
        getField(row, [
          "users",
          "Users",
          "active_users",
          "Active Users",
          "activeUsers",
        ])
      );

      const newCustomers = toNumber(
        getField(row, [
          "new_customers",
          "New Customers",
          "newCustomers",
          "customers",
          "Customers",
        ])
      );

      const conversions = toNumber(
        getField(row, [
          "conversions",
          "Conversions",
          "conversion",
        ])
      );

      const bounceRate = toNumber(
        getField(row, [
          "bounce_rate",
          "Bounce Rate",
          "bounceRate",
        ])
      );

      const engagementRate = toNumber(
        getField(row, [
          "engagement_rate",
          "Engagement Rate",
          "engagementRate",
        ])
      );

      const rowRegion =
        getField(row, [
          "region",
          "Region",
          "location",
          "Location",
        ]) || "Unknown";

      const rowCategory =
        getField(row, [
          "category",
          "Category",
          "type",
          "Type",
        ]) || "General";

      return {
        id: index + 1,
        date,
        revenue,
        users,
        newCustomers,
        conversions,
        bounceRate,
        engagementRate,
        region: rowRegion,
        category: rowCategory,
        original: row,
      };
    });
  }, [rawData]);

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const regions = useMemo(() => {
    return [
      "All",
      ...new Set(data.map((item) => item.region).filter(Boolean)),
    ];
  }, [data]);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(data.map((item) => item.category).filter(Boolean)),
    ];
  }, [data]);

  /* =======================================================
     FILTER DATA
  ======================================================= */

  const filteredData = useMemo(() => {
    let result = [...data];

    if (region !== "All") {
      result = result.filter((item) => item.region === region);
    }

    if (category !== "All") {
      result = result.filter((item) => item.category === category);
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((item) =>
        `${item.date} ${item.region} ${item.category}`
          .toLowerCase()
          .includes(query)
      );
    }

    const limit = Number(period);

    if (limit && result.length > limit) {
      result = result.slice(-limit);
    }

    return result;
  }, [data, region, category, search, period]);

  /* =======================================================
     KPI CALCULATIONS
  ======================================================= */

  const totals = useMemo(() => {
    const revenue = filteredData.reduce(
      (sum, item) => sum + item.revenue,
      0
    );

    const users = filteredData.reduce(
      (sum, item) => sum + item.users,
      0
    );

    const newCustomers = filteredData.reduce(
      (sum, item) => sum + item.newCustomers,
      0
    );

    const conversions = filteredData.reduce(
      (sum, item) => sum + item.conversions,
      0
    );

    const avgBounce =
      filteredData.length > 0
        ? filteredData.reduce(
            (sum, item) => sum + item.bounceRate,
            0
          ) / filteredData.length
        : 0;

    const avgEngagement =
      filteredData.length > 0
        ? filteredData.reduce(
            (sum, item) => sum + item.engagementRate,
            0
          ) / filteredData.length
        : 0;

    const conversionRate =
      users > 0 ? (conversions / users) * 100 : 0;

    return {
      revenue,
      users,
      newCustomers,
      conversions,
      bounceRate: avgBounce,
      engagementRate: avgEngagement,
      conversionRate,
    };
  }, [filteredData]);

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData = useMemo(() => {
    return filteredData.map((item, index) => ({
      name:
        item.date ||
        `Day ${index + 1}`,
      Revenue: item.revenue,
      Users: item.users,
      Customers: item.newCustomers,
      Conversions: item.conversions,
      Engagement: item.engagementRate,
    }));
  }, [filteredData]);

  /* =======================================================
     REGION PERFORMANCE
  ======================================================= */

  const regionPerformance = useMemo(() => {
    const map = {};

    filteredData.forEach((item) => {
      if (!map[item.region]) {
        map[item.region] = {
          region: item.region,
          revenue: 0,
          users: 0,
          conversions: 0,
        };
      }

      map[item.region].revenue += item.revenue;
      map[item.region].users += item.users;
      map[item.region].conversions += item.conversions;
    });

    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [filteredData]);

  /* =======================================================
     CATEGORY PERFORMANCE
  ======================================================= */

  const categoryPerformance = useMemo(() => {
    const map = {};

    filteredData.forEach((item) => {
      if (!map[item.category]) {
        map[item.category] = {
          category: item.category,
          revenue: 0,
          users: 0,
        };
      }

      map[item.category].revenue += item.revenue;
      map[item.category].users += item.users;
    });

    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [filteredData]);

  /* =======================================================
     PERFORMANCE SCORE
  ======================================================= */

  const performanceScore = useMemo(() => {
    const conversionScore = Math.min(
      totals.conversionRate * 8,
      35
    );

    const engagementScore = Math.min(
      totals.engagementRate * 0.35,
      30
    );

    const bounceScore = Math.max(
      30 - totals.bounceRate * 0.3,
      0
    );

    return Math.min(
      Math.round(
        conversionScore +
          engagementScore +
          bounceScore
      ),
      100
    );
  }, [totals]);

  /* =======================================================
     TOP / LOWEST PERFORMER
  ======================================================= */

  const topRegion =
    regionPerformance.length > 0
      ? regionPerformance[0]
      : null;

  const lowestRegion =
    regionPerformance.length > 1
      ? regionPerformance[regionPerformance.length - 1]
      : null;

  const topCategory =
    categoryPerformance.length > 0
      ? categoryPerformance[0]
      : null;

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setPeriod("30");
    setRegion("All");
    setCategory("All");
    setSearch("");
  };

  /* =======================================================
     CSV EXPORT
  ======================================================= */

  const exportCSV = () => {
    if (!filteredData.length) return;

    const headers = [
      "Date",
      "Revenue",
      "Users",
      "New Customers",
      "Conversions",
      "Bounce Rate",
      "Engagement Rate",
      "Region",
      "Category",
    ];

    const rows = filteredData.map((item) => [
      item.date,
      item.revenue,
      item.users,
      item.newCustomers,
      item.conversions,
      item.bounceRate,
      item.engagementRate,
      item.region,
      item.category,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "growthsphere-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     TEXT REPORT
  ======================================================= */

  const downloadReport = () => {
    const report = `
GROWTHSPHERE ANALYTICS REPORT
==============================

Period: Last ${period} Days
Region: ${region}
Category: ${category}

KEY METRICS
-----------
Revenue: ${formatCurrency(totals.revenue)}
Users: ${formatNumber(totals.users)}
New Customers: ${formatNumber(totals.newCustomers)}
Conversions: ${formatNumber(totals.conversions)}
Conversion Rate: ${totals.conversionRate.toFixed(2)}%
Bounce Rate: ${totals.bounceRate.toFixed(2)}%
Engagement Rate: ${totals.engagementRate.toFixed(2)}%

PERFORMANCE
-----------
Performance Score: ${performanceScore}/100

Top Region:
${topRegion?.region || "N/A"}

Top Category:
${topCategory?.category || "N/A"}

Generated by GrowthSphere.
`;

    const blob = new Blob([report], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "growthsphere-report.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     KPI CARD COMPONENT
  ======================================================= */

  const StatCard = ({
    icon: Icon,
    label,
    value,
    description,
    change,
    positive = true,
  }) => (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={18} />
        </div>

        {change && (
          <div
            className={`change ${
              positive ? "positive" : "negative"
            }`}
          >
            {positive ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}

            {change}
          </div>
        )}
      </div>

      <span className="stat-label">{label}</span>

      <h2>{value}</h2>

      <span className="stat-description">
        {description}
      </span>
    </div>
  );

  /* =======================================================
     DASHBOARD PAGE
  ======================================================= */

  const DashboardPage = () => (
    <div className="section-stack">
      <div className="stats-grid">
        <StatCard
          icon={Wallet}
          label="Total Revenue"
          value={formatCurrency(totals.revenue)}
          description="Revenue generated"
          change="+12.4%"
        />

        <StatCard
          icon={Users}
          label="Active Users"
          value={formatNumber(totals.users)}
          description="Total active users"
          change="+8.7%"
        />

        <StatCard
          icon={UserPlus}
          label="New Customers"
          value={formatNumber(totals.newCustomers)}
          description="New customers acquired"
          change="+6.2%"
        />

        <StatCard
          icon={Zap}
          label="Conversions"
          value={formatNumber(totals.conversions)}
          description="Successful conversions"
          change="+9.1%"
        />

        <StatCard
          icon={BarChart3}
          label="Conversion Rate"
          value={`${totals.conversionRate.toFixed(1)}%`}
          description="Users converted"
          change="+2.4%"
        />

        <StatCard
          icon={TrendingDown}
          label="Bounce Rate"
          value={`${totals.bounceRate.toFixed(1)}%`}
          description="Average bounce rate"
          change="-3.2%"
          positive
        />

        <StatCard
          icon={Activity}
          label="Engagement Rate"
          value={`${totals.engagementRate.toFixed(1)}%`}
          description="Average engagement"
          change="+4.8%"
        />

        <StatCard
          icon={Target}
          label="Performance"
          value={`${performanceScore}/100`}
          description="Overall performance score"
          change="+5.6%"
        />
      </div>

      <div className="dashboard-grid">
        <div className="chart-card large">
          <div className="card-header">
            <div>
              <h3>Growth Overview</h3>
              <p>
                Revenue and user growth over the selected period
              </p>
            </div>

            <TrendingUp size={18} />
          </div>

          <ResponsiveContainer width="100%" height={310}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6366f1"
                    stopOpacity={0.3}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6366f1"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#6366f1"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="performance-card">
          <div className="card-header">
            <div>
              <h3>Performance Score</h3>
              <p>Overall business health</p>
            </div>

            <Target size={18} />
          </div>

          <div className="score-circle">
            <strong>{performanceScore}</strong>
            <span>out of 100</span>
          </div>

          <div className="score-status">
            {performanceScore >= 75
              ? "Excellent Performance"
              : performanceScore >= 50
              ? "Good Performance"
              : "Needs Improvement"}
          </div>

          <div className="score-description">
            <span>
              Conversion
              <br />
              {totals.conversionRate.toFixed(1)}%
            </span>

            <span>
              Engagement
              <br />
              {totals.engagementRate.toFixed(1)}%
            </span>

            <span>
              Bounce
              <br />
              {totals.bounceRate.toFixed(1)}%
            </span>

            <span>
              Users
              <br />
              {formatNumber(totals.users)}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>User Growth</h3>
              <p>Active users and new customers</p>
            </div>

            <Users size={18} />
          </div>

          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="Users"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="Customers"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>Revenue by Region</h3>
              <p>Top performing regions</p>
            </div>

            <BarChart3 size={18} />
          </div>

          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={regionPerformance}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="region" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="revenue"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="performer-grid">
        <div className="performer-card">
          <span>TOP REGION</span>

          <div className="performer-title">
            <strong>
              {topRegion?.region || "No data"}
            </strong>

            <TrendingUp size={18} />
          </div>

          <p>
            {topRegion
              ? `${formatCurrency(
                  topRegion.revenue
                )} revenue generated`
              : "No regional data available"}
          </p>
        </div>

        <div className="performer-card">
          <span>TOP CATEGORY</span>

          <div className="performer-title">
            <strong>
              {topCategory?.category || "No data"}
            </strong>

            <CheckCircle2 size={18} />
          </div>

          <p>
            {topCategory
              ? `${formatCurrency(
                  topCategory.revenue
                )} revenue generated`
              : "No category data available"}
          </p>
        </div>
      </div>

      <div className="insight-card">
        <div className="card-header">
          <div>
            <h3>Key Insights</h3>
            <p>Automatically generated from your data</p>
          </div>

          <Activity size={18} />
        </div>

        <div className="insight-list">
          <div className="insight-item">
            <div className="insight-number">01</div>

            <p>
              {topRegion
                ? `${topRegion.region} is currently the strongest revenue-generating region.`
                : "Regional performance data is available once data is loaded."}
            </p>
          </div>

          <div className="insight-item">
            <div className="insight-number">02</div>

            <p>
              {topCategory
                ? `${topCategory.category} is the leading category based on revenue contribution.`
                : "Category performance will appear here."}
            </p>
          </div>

          <div className="insight-item">
            <div className="insight-number">03</div>

            <p>
              The current conversion rate is{" "}
              <strong>
                {totals.conversionRate.toFixed(1)}%
              </strong>
              , while engagement is{" "}
              <strong>
                {totals.engagementRate.toFixed(1)}%
              </strong>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* =======================================================
     GROWTH ANALYTICS PAGE
  ======================================================= */

  const GrowthAnalyticsPage = () => (
    <div className="section-stack">
      <div className="dashboard-grid">
        <div className="chart-card large">
          <div className="card-header">
            <div>
              <h3>Revenue Trend</h3>
              <p>Revenue performance over time</p>
            </div>

            <Wallet size={18} />
          </div>

          <ResponsiveContainer width="100%" height={310}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.12}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card large">
          <div className="card-header">
            <div>
              <h3>Engagement Trend</h3>
              <p>Average engagement performance</p>
            </div>

            <Activity size={18} />
          </div>

          <ResponsiveContainer width="100%" height={310}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="Engagement"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mini-stats">
        <div className="report-metric">
          <span>Total Revenue</span>
          <strong>
            {formatCurrency(totals.revenue)}
          </strong>
        </div>

        <div className="report-metric">
          <span>Users</span>
          <strong>
            {formatNumber(totals.users)}
          </strong>
        </div>

        <div className="report-metric">
          <span>Conversions</span>
          <strong>
            {formatNumber(totals.conversions)}
          </strong>
        </div>
      </div>
    </div>
  );

  /* =======================================================
     CUSTOMERS PAGE
  ======================================================= */

  const CustomersPage = () => (
    <div className="section-stack">
      <div className="chart-card">
        <div className="card-header">
          <div>
            <h3>Customer Analytics</h3>
            <p>Customer acquisition and conversion data</p>
          </div>

          <Users size={18} />
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Region</th>
                <th>Category</th>
                <th>Users</th>
                <th>New Customers</th>
                <th>Conversions</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => {
                const rate =
                  item.users > 0
                    ? (item.conversions / item.users) *
                      100
                    : 0;

                return (
                  <tr key={item.id}>
                    <td>{item.date || "-"}</td>

                    <td>{item.region}</td>

                    <td>{item.category}</td>

                    <td>
                      {formatNumber(item.users)}
                    </td>

                    <td>
                      {formatNumber(item.newCustomers)}
                    </td>

                    <td>
                      {formatNumber(item.conversions)}
                    </td>

                    <td>
                      {rate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* =======================================================
     GOALS PAGE
  ======================================================= */

  const GoalsPage = () => {
    const goals = [
      {
        title: "Revenue Goal",
        value: totals.revenue,
        target: Math.max(totals.revenue * 1.2, 1),
      },
      {
        title: "Customer Goal",
        value: totals.newCustomers,
        target: Math.max(totals.newCustomers * 1.25, 1),
      },
      {
        title: "Conversion Goal",
        value: totals.conversionRate,
        target: Math.max(totals.conversionRate * 1.15, 1),
      },
      {
        title: "Engagement Goal",
        value: totals.engagementRate,
        target: Math.max(totals.engagementRate * 1.1, 1),
      },
    ];

    return (
      <div className="goals-grid">
        {goals.map((goal) => {
          const percentage = Math.min(
            (goal.value / goal.target) * 100,
            100
          );

          const displayValue =
            goal.title.includes("Revenue")
              ? formatCurrency(goal.value)
              : goal.title.includes("Goal")
              ? formatNumber(goal.value)
              : `${goal.value.toFixed(1)}%`;

          return (
            <div className="goal-card" key={goal.title}>
              <div className="goal-header">
                <div>
                  <span>{goal.title}</span>

                  <h3>{displayValue}</h3>
                </div>

                <Target size={20} />
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <div className="goal-footer">
                <span>
                  {percentage.toFixed(0)}% achieved
                </span>

                <span>
                  Target:{" "}
                  {goal.title.includes("Revenue")
                    ? formatCurrency(goal.target)
                    : goal.title.includes("Goal")
                    ? formatNumber(goal.target)
                    : `${goal.target.toFixed(1)}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /* =======================================================
     REPORTS PAGE
  ======================================================= */

  const ReportsPage = () => (
    <div className="section-stack">
      <div className="report-header">
        <div>
          <h2>Analytics Report</h2>

          <p>
            Export your current GrowthSphere analysis.
          </p>
        </div>

        <div className="report-actions">
          <button
            className="secondary-button"
            onClick={exportCSV}
          >
            <Download size={15} />
            Export CSV
          </button>

          <button
            className="primary-button"
            onClick={downloadReport}
          >
            <Download size={15} />
            Download Report
          </button>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-row">
          <span>Total Revenue</span>

          <strong>
            {formatCurrency(totals.revenue)}
          </strong>
        </div>

        <div className="report-row">
          <span>Active Users</span>

          <strong>
            {formatNumber(totals.users)}
          </strong>
        </div>

        <div className="report-row">
          <span>New Customers</span>

          <strong>
            {formatNumber(totals.newCustomers)}
          </strong>
        </div>

        <div className="report-row">
          <span>Conversions</span>

          <strong>
            {formatNumber(totals.conversions)}
          </strong>
        </div>

        <div className="report-row">
          <span>Conversion Rate</span>

          <strong>
            {totals.conversionRate.toFixed(1)}%
          </strong>
        </div>

        <div className="report-row">
          <span>Engagement Rate</span>

          <strong>
            {totals.engagementRate.toFixed(1)}%
          </strong>
        </div>

        <div className="report-row">
          <span>Top Region</span>

          <strong>
            {topRegion?.region || "N/A"}
          </strong>
        </div>

        <div className="report-row">
          <span>Top Category</span>

          <strong>
            {topCategory?.category || "N/A"}
          </strong>
        </div>
      </div>
    </div>
  );

  /* =======================================================
     ACTIVITY PAGE
  ======================================================= */

  const ActivityPage = () => {
    const activities = [
      {
        icon: TrendingUp,
        title: "Revenue analysis completed",
        value: formatCurrency(totals.revenue),
      },
      {
        icon: Users,
        title: "User activity analysed",
        value: formatNumber(totals.users),
      },
      {
        icon: UserPlus,
        title: "Customer acquisition tracked",
        value: formatNumber(totals.newCustomers),
      },
      {
        icon: Target,
        title: "Performance score calculated",
        value: `${performanceScore}/100`,
      },
      {
        icon: CheckCircle2,
        title: "Conversion analysis completed",
        value: `${totals.conversionRate.toFixed(1)}%`,
      },
    ];

    return (
      <div className="chart-card">
        <div className="card-header">
          <div>
            <h3>Recent Activity</h3>

            <p>
              Latest analytics generated by GrowthSphere
            </p>
          </div>

          <Activity size={18} />
        </div>

        <div className="activity-list">
          {activities.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <div
                className="activity-item"
                key={index}
              >
                <div className="activity-icon">
                  <Icon size={16} />
                </div>

                <div className="activity-content">
                  <strong>{activity.title}</strong>

                  <span>
                    Updated from current filtered dataset
                  </span>
                </div>

                <div className="activity-value">
                  {activity.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* =======================================================
     PAGE ROUTER
  ======================================================= */

  const renderPage = () => {
    switch (activePage) {
      case "Growth Analytics":
        return <GrowthAnalyticsPage />;

      case "Customers":
        return <CustomersPage />;

      case "Goals":
        return <GoalsPage />;

      case "Reports":
        return <ReportsPage />;

      case "Activity":
        return <ActivityPage />;

      default:
        return <DashboardPage />;
    }
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigation = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Growth Analytics",
      icon: BarChart3,
    },
    {
      label: "Customers",
      icon: Users,
    },
    {
      label: "Goals",
      icon: Target,
    },
    {
      label: "Reports",
      icon: Download,
    },
    {
      label: "Activity",
      icon: Activity,
    },
  ];

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div
      className={`app-shell theme-${theme}`}
    >
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            GS
          </div>

          <div>
            <h2>GrowthSphere</h2>

            <span>Analytics Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  activePage === item.label
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(item.label)
                }
              >
                <Icon size={17} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-card">
            <div className="avatar">
              DA
            </div>

            <div>
              <strong>Data Analyst</strong>

              <span>GrowthSphere</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main-content">
        {/* TOPBAR */}

        <div className="topbar">
          <div>
            <h1>{activePage}</h1>

            <p>
              Monitor growth, customers and performance
              from one place.
            </p>
          </div>

          <div className="topbar-actions">
            <span className="theme-status">
              {theme === "light"
                ? "Light Mode"
                : "Dark Mode"}
            </span>

            <button
              className="theme-toggle"
              onClick={() =>
                setTheme((current) =>
                  current === "light"
                    ? "dark"
                    : "light"
                )
              }
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={17} />
              ) : (
                <Sun size={17} />
              )}
            </button>
          </div>
        </div>

        {/* FILTER PANEL */}

        <div className="filter-panel">
          <div className="filter-title">
            <Filter size={14} />
            Filters
          </div>

          <div className="filter-group">
            <label>Period</label>

            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value)
              }
            >
              <option value="7">
                Last 7 Days
              </option>

              <option value="30">
                Last 30 Days
              </option>

              <option value="90">
                Last 90 Days
              </option>
            </select>
          </div>

          <div className="filter-group">
            <label>Region</label>

            <select
              value={region}
              onChange={(e) =>
                setRegion(e.target.value)
              }
            >
              {regions.map((item) => (
                <option
                  value={item}
                  key={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              {categories.map((item) => (
                <option
                  value={item}
                  key={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            className="reset-button"
            onClick={resetFilters}
          >
            <RefreshCcw size={13} />
            Reset
          </button>
        </div>

        {/* SEARCH */}

        {(activePage === "Customers" ||
          activePage === "Dashboard") && (
          <div className="search-box">
            <Search size={15} />

            <input
              type="text"
              placeholder="Search date, region or category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        )}

        {/* PAGE */}

        <div className="page-content">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}