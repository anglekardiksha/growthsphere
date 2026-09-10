import { useMemo, useState } from "react";

import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Download,
  FileText,
  Filter,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  MapPin,
  Package,
  Lightbulb,
  Gauge,
  Globe,
  Sun,
  Moon,
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

import growthData from "./data/growthData.csv?raw";
import "./App.css";

/* =========================================================
   CSV PARSER
========================================================= */

const parsedGrowthData = growthData
  .trim()
  .split("\n")
  .slice(1)
  .map((row) => {
    const values = row.split(",");

    return {
      date: values[0],
      region: values[1],
      category: values[2],
      revenue: Number(values[3]) || 0,
      users: Number(values[4]) || 0,
      new_customers: Number(values[5]) || 0,
      conversions: Number(values[6]) || 0,
      traffic: Number(values[7]) || 0,
      bounce_rate: Number(values[8]) || 0,
    };
  });

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value) =>
  `${Number(value).toFixed(1)}%`;

const calculateChange = (current, previous) => {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const sumBy = (data, key) =>
  data.reduce((sum, item) => sum + Number(item[key] || 0), 0);

const averageBy = (data, key) => {
  if (!data.length) return 0;
  return sumBy(data, key) / data.length;
};

const getMetricKey = (metric) => {
  if (metric === "Revenue") return "revenue";
  if (metric === "Users") return "users";
  if (metric === "Customers") return "customers";
  if (metric === "Conversions") return "conversions";
  return "traffic";
};

/* =========================================================
   AGGREGATION
========================================================= */

const aggregateByDate = (data) => {
  const grouped = {};

  data.forEach((item) => {
    if (!grouped[item.date]) {
      grouped[item.date] = {
        date: item.date,
        revenue: 0,
        users: 0,
        customers: 0,
        conversions: 0,
        traffic: 0,
      };
    }

    grouped[item.date].revenue += item.revenue;
    grouped[item.date].users += item.users;
    grouped[item.date].customers += item.new_customers;
    grouped[item.date].conversions += item.conversions;
    grouped[item.date].traffic += item.traffic;
  });

  return Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};

const aggregateBy = (data, key) => {
  const grouped = {};

  data.forEach((item) => {
    const name = item[key];

    if (!grouped[name]) {
      grouped[name] = {
        name,
        revenue: 0,
        users: 0,
        customers: 0,
        conversions: 0,
        traffic: 0,
      };
    }

    grouped[name].revenue += item.revenue;
    grouped[name].users += item.users;
    grouped[name].customers += item.new_customers;
    grouped[name].conversions += item.conversions;
    grouped[name].traffic += item.traffic;
  });

  return Object.values(grouped);
};

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [metric, setMetric] = useState("Revenue");
  const [dateRange, setDateRange] = useState("30 Days");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const regions = useMemo(
    () => [
      "All Regions",
      ...new Set(parsedGrowthData.map((item) => item.region)),
    ],
    []
  );

  const categories = useMemo(
    () => [
      "All Categories",
      ...new Set(parsedGrowthData.map((item) => item.category)),
    ],
    []
  );

  const latestDate = useMemo(() => {
    if (!parsedGrowthData.length) return null;

    return parsedGrowthData.reduce((latest, item) => {
      return new Date(item.date) > new Date(latest)
        ? item.date
        : latest;
    }, parsedGrowthData[0].date);
  }, []);

  /* =======================================================
     DATE RANGE FILTER
  ======================================================= */

  const selectedData = useMemo(() => {
    if (!latestDate) return [];

    const latest = new Date(latestDate);

    let days = 30;

    if (dateRange === "7 Days") days = 7;
    if (dateRange === "90 Days") days = 90;

    const startDate = new Date(latest);
    startDate.setDate(startDate.getDate() - days + 1);

    return parsedGrowthData.filter((item) => {
      const date = new Date(item.date);

      return date >= startDate && date <= latest;
    });
  }, [dateRange, latestDate]);

  /* =======================================================
     MAIN FILTERED DATA
  ======================================================= */

  const filteredData = useMemo(() => {
    return selectedData.filter((item) => {
      const matchesRegion =
        regionFilter === "All Regions" ||
        item.region === regionFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        item.category === categoryFilter;

      const matchesSearch =
        !search ||
        item.region.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      return (
        matchesRegion &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    selectedData,
    regionFilter,
    categoryFilter,
    search,
  ]);

  /* =======================================================
     KPI CALCULATIONS
  ======================================================= */

  const totalRevenue = sumBy(filteredData, "revenue");
  const activeUsers = sumBy(filteredData, "users");
  const totalTraffic = sumBy(filteredData, "traffic");
  const totalConversions = sumBy(filteredData, "conversions");
  const totalCustomers = sumBy(filteredData, "new_customers");

  const conversionRate =
    totalTraffic > 0
      ? (totalConversions / totalTraffic) * 100
      : 0;

  const bounceRate = averageBy(
    filteredData,
    "bounce_rate"
  );

  const engagementRate = Math.max(
    0,
    100 - bounceRate
  );

  /* =======================================================
     PREVIOUS PERIOD
  ======================================================= */

  const previousData = useMemo(() => {
    if (!latestDate) return [];

    const latest = new Date(latestDate);

    let days = 30;

    if (dateRange === "7 Days") days = 7;
    if (dateRange === "90 Days") days = 90;

    const currentStart = new Date(latest);

    currentStart.setDate(
      currentStart.getDate() - days + 1
    );

    const previousEnd = new Date(currentStart);

    previousEnd.setDate(
      previousEnd.getDate() - 1
    );

    const previousStart = new Date(previousEnd);

    previousStart.setDate(
      previousStart.getDate() - days + 1
    );

    return parsedGrowthData.filter((item) => {
      const date = new Date(item.date);

      const matchesDate =
        date >= previousStart &&
        date <= previousEnd;

      const matchesRegion =
        regionFilter === "All Regions" ||
        item.region === regionFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        item.category === categoryFilter;

      return (
        matchesDate &&
        matchesRegion &&
        matchesCategory
      );
    });
  }, [
    dateRange,
    latestDate,
    regionFilter,
    categoryFilter,
  ]);

  const previousRevenue = sumBy(
    previousData,
    "revenue"
  );

  const previousUsers = sumBy(
    previousData,
    "users"
  );

  const previousCustomers = sumBy(
    previousData,
    "new_customers"
  );

  const previousConversions = sumBy(
    previousData,
    "conversions"
  );

  const revenueChange = calculateChange(
    totalRevenue,
    previousRevenue
  );

  const usersChange = calculateChange(
    activeUsers,
    previousUsers
  );

  const customersChange = calculateChange(
    totalCustomers,
    previousCustomers
  );

  const conversionsChange = calculateChange(
    totalConversions,
    previousConversions
  );

  /* =======================================================
     CHART DATA
  ======================================================= */

  const dateChartData = useMemo(
    () => aggregateByDate(filteredData),
    [filteredData]
  );

  const regionData = useMemo(
    () => aggregateBy(filteredData, "region"),
    [filteredData]
  );

  const categoryData = useMemo(
    () => aggregateBy(filteredData, "category"),
    [filteredData]
  );

  /* =======================================================
     PERFORMANCE SCORE
  ======================================================= */

  const revenueScore = Math.min(
    100,
    Math.max(0, 50 + revenueChange)
  );

  const customerScore = Math.min(
    100,
    Math.max(0, 50 + customersChange)
  );

  const conversionScore = Math.min(
    100,
    conversionRate * 3
  );

  const engagementScore = Math.min(
    100,
    engagementRate
  );

  const performanceScore =
    revenueScore * 0.3 +
    customerScore * 0.25 +
    conversionScore * 0.25 +
    engagementScore * 0.2;

  let performanceLabel = "At Risk";

  if (performanceScore >= 80) {
    performanceLabel = "Excellent";
  } else if (performanceScore >= 65) {
    performanceLabel = "Healthy";
  } else if (performanceScore >= 50) {
    performanceLabel = "Needs Attention";
  }

  /* =======================================================
     TOP PERFORMERS
  ======================================================= */

  const topRegion = [...regionData].sort(
    (a, b) => b.revenue - a.revenue
  )[0];

  const lowestRegion = [...regionData].sort(
    (a, b) => a.revenue - b.revenue
  )[0];

  const topCategory = [...categoryData].sort(
    (a, b) => b.revenue - a.revenue
  )[0];

  const lowestCategory = [...categoryData].sort(
    (a, b) => a.revenue - b.revenue
  )[0];

  /* =======================================================
     REVENUE CONTRIBUTION
  ======================================================= */

  const revenueContribution = regionData.map(
    (item) => ({
      ...item,
      percentage:
        totalRevenue > 0
          ? (item.revenue / totalRevenue) * 100
          : 0,
    })
  );

  /* =======================================================
     INSIGHTS
  ======================================================= */

  const insights = [
    topRegion
      ? `The strongest region is ${topRegion.name}, contributing ${formatCurrency(
          topRegion.revenue
        )} in revenue.`
      : "No regional data available.",

    topCategory
      ? `${topCategory.name} is currently the strongest-performing category.`
      : "No category data available.",

    regionData.length
      ? `${regionData
          .slice()
          .sort(
            (a, b) =>
              b.conversions / Math.max(b.traffic, 1) -
              a.conversions / Math.max(a.traffic, 1)
          )[0].name} has the highest conversion efficiency.`
      : "Conversion data is unavailable.",

    filteredData.length
      ? "Use the filters above to identify specific growth opportunities."
      : "Try changing the filters to view more data.",
  ];

  /* =======================================================
     RECOMMENDATIONS
  ======================================================= */

  const recommendations = [];

  if (lowestRegion) {
    recommendations.push(
      `Review performance in ${lowestRegion.name} and identify opportunities to improve revenue.`
    );
  }

  if (conversionRate < 5) {
    recommendations.push(
      "Focus on improving conversion journeys and calls-to-action."
    );
  }

  if (bounceRate > 50) {
    recommendations.push(
      "Investigate high-bounce pages and improve content engagement."
    );
  }

  if (topCategory) {
    recommendations.push(
      `Consider expanding successful strategies from ${topCategory.name}.`
    );
  }

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  const exportCSV = () => {
    const headers = [
      "Date",
      "Region",
      "Category",
      "Revenue",
      "Users",
      "New Customers",
      "Conversions",
      "Traffic",
      "Bounce Rate",
    ];

    const rows = filteredData.map((item) => [
      item.date,
      item.region,
      item.category,
      item.revenue,
      item.users,
      item.new_customers,
      item.conversions,
      item.traffic,
      item.bounce_rate,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "growthsphere-filtered-data.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     DOWNLOAD REPORT
  ======================================================= */

  const downloadReport = () => {
    const report = `
GROWTHSPHERE BUSINESS REPORT
============================

Date Range: ${dateRange}
Region: ${regionFilter}
Category: ${categoryFilter}

KEY PERFORMANCE INDICATORS
--------------------------
Total Revenue: ${formatCurrency(totalRevenue)}
Active Users: ${formatNumber(activeUsers)}
New Customers: ${formatNumber(totalCustomers)}
Conversions: ${formatNumber(totalConversions)}
Conversion Rate: ${formatPercent(conversionRate)}
Bounce Rate: ${formatPercent(bounceRate)}
Engagement Rate: ${formatPercent(engagementRate)}

PERFORMANCE
-----------
Performance Score: ${performanceScore.toFixed(1)}/100
Status: ${performanceLabel}

TOP PERFORMERS
--------------
Top Region: ${topRegion?.name || "N/A"}
Top Category: ${topCategory?.name || "N/A"}

INSIGHTS
--------
${insights.map((item) => `- ${item}`).join("\n")}

RECOMMENDATIONS
---------------
${recommendations
  .map((item) => `- ${item}`)
  .join("\n")}
`;

    const blob = new Blob([report], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "growthsphere-business-report.txt";

    link.click();

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetFilters = () => {
    setDateRange("30 Days");
    setRegionFilter("All Regions");
    setCategoryFilter("All Categories");
    setSearch("");
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigation = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Growth Analytics",
      icon: TrendingUp,
    },
    {
      name: "Customers",
      icon: Users,
    },
    {
      name: "Goals",
      icon: Target,
    },
    {
      name: "Reports",
      icon: BarChart3,
    },
    {
      name: "Activity",
      icon: Activity,
    },
  ];

  return (
    <div
      className={`app-shell ${
        darkMode
          ? "theme-dark"
          : "theme-light"
      }`}
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            GS
          </div>

          <div className="brand-text">
            <h2>GrowthSphere</h2>
            <span>Analytics Platform</span>
          </div>

        </div>

        <div className="sidebar-label">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  page === item.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPage(item.name)
                }
              >
                <Icon size={18} />

                <span>
                  {item.name}
                </span>

                {page === item.name && (
                  <ChevronRight
                    size={15}
                    className="nav-arrow"
                  />
                )}
              </button>
            );
          })}

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-mini-card">

            <div className="mini-card-icon">
              <BarChart3 size={17} />
            </div>

            <div>
              <strong>Analytics Ready</strong>
              <span>Portfolio Dashboard</span>
            </div>

          </div>

          <div className="profile-card">

            <div className="avatar">
              DA
            </div>

            <div>
              <strong>Data Analyst</strong>
              <span>Portfolio Project</span>
            </div>

          </div>

        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div className="page-heading">

            <div className="breadcrumb">
              GrowthSphere
              <ChevronRight size={13} />
              {page}
            </div>

            <h1>{page}</h1>

            <p>
              Monitor your business growth and
              performance
            </p>

          </div>

          <div className="topbar-actions">

            <div className="theme-label">
              <span className="theme-dot"></span>

              {darkMode
                ? "Dark mode"
                : "Light mode"}
            </div>

            <button
              className="theme-toggle"
              onClick={() =>
                setDarkMode(
                  (value) => !value
                )
              }
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              aria-pressed={darkMode}
            >
              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

          </div>

        </header>

        {/* FILTER PANEL */}

        <section className="filter-panel">

          <div className="filter-title">

            <div className="filter-icon">
              <Filter size={17} />
            </div>

            <div>
              <strong>Filters</strong>
              <span>Refine dashboard data</span>
            </div>

          </div>

          <div className="filter-group">

            <label>Date Range</label>

            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(
                  e.target.value
                )
              }
            >
              <option>7 Days</option>
              <option>30 Days</option>
              <option>90 Days</option>
            </select>

          </div>

          <div className="filter-group">

            <label>Region</label>

            <select
              value={regionFilter}
              onChange={(e) =>
                setRegionFilter(
                  e.target.value
                )
              }
            >
              {regions.map((region) => (
                <option
                  key={region}
                  value={region}
                >
                  {region}
                </option>
              ))}
            </select>

          </div>

          <div className="filter-group">

            <label>Category</label>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

          </div>

          <button
            className="reset-button"
            onClick={resetFilters}
          >
            <RotateCcw size={15} />
            Reset
          </button>

        </section>

        {/* PAGE CONTENT */}

        <div className="page-content">

          {page === "Dashboard" && (
            <DashboardPage
              totalRevenue={totalRevenue}
              activeUsers={activeUsers}
              totalCustomers={totalCustomers}
              totalConversions={totalConversions}
              conversionRate={conversionRate}
              bounceRate={bounceRate}
              revenueChange={revenueChange}
              usersChange={usersChange}
              customersChange={customersChange}
              conversionsChange={conversionsChange}
              dateChartData={dateChartData}
              regionData={regionData}
              categoryData={categoryData}
              metric={metric}
              setMetric={setMetric}
              insights={insights}
              recommendations={
                recommendations
              }
              performanceScore={
                performanceScore
              }
              performanceLabel={
                performanceLabel
              }
              revenueContribution={
                revenueContribution
              }
              topRegion={topRegion}
              lowestRegion={lowestRegion}
              topCategory={topCategory}
              lowestCategory={
                lowestCategory
              }
            />
          )}

          {page === "Growth Analytics" && (
            <GrowthAnalyticsPage
              dateChartData={dateChartData}
              regionData={regionData}
              categoryData={categoryData}
              metric={metric}
              setMetric={setMetric}
            />
          )}

          {page === "Customers" && (
            <CustomersPage
              filteredData={filteredData}
              search={search}
              setSearch={setSearch}
            />
          )}

          {page === "Goals" && (
            <GoalsPage
              totalRevenue={
                totalRevenue
              }
              totalCustomers={
                totalCustomers
              }
              conversionRate={
                conversionRate
              }
              performanceScore={
                performanceScore
              }
            />
          )}

          {page === "Reports" && (
            <ReportsPage
              totalRevenue={
                totalRevenue
              }
              activeUsers={
                activeUsers
              }
              totalCustomers={
                totalCustomers
              }
              totalConversions={
                totalConversions
              }
              conversionRate={
                conversionRate
              }
              bounceRate={
                bounceRate
              }
              performanceScore={
                performanceScore
              }
              performanceLabel={
                performanceLabel
              }
              downloadReport={
                downloadReport
              }
              exportCSV={exportCSV}
            />
          )}

          {page === "Activity" && (
            <ActivityPage
              filteredData={
                filteredData
              }
            />
          )}

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   DASHBOARD PAGE
========================================================= */

function DashboardPage({
  totalRevenue,
  activeUsers,
  totalCustomers,
  totalConversions,
  conversionRate,
  bounceRate,
  revenueChange,
  usersChange,
  customersChange,
  conversionsChange,
  dateChartData,
  regionData,
  categoryData,
  metric,
  setMetric,
  insights,
  recommendations,
  performanceScore,
  performanceLabel,
  revenueContribution,
  topRegion,
  lowestRegion,
  topCategory,
  lowestCategory,
}) {
  return (
    <>

      {/* KPI CARDS */}

      <div className="stats-grid">

        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            totalRevenue
          )}
          change={revenueChange}
          icon={
            <BarChart3 size={20} />
          }
          tone="purple"
        />

        <StatCard
          title="Active Users"
          value={formatNumber(
            activeUsers
          )}
          change={usersChange}
          icon={
            <Users size={20} />
          }
          tone="blue"
        />

        <StatCard
          title="New Customers"
          value={formatNumber(
            totalCustomers
          )}
          change={
            customersChange
          }
          icon={
            <Target size={20} />
          }
          tone="teal"
        />

        <StatCard
          title="Conversions"
          value={formatNumber(
            totalConversions
          )}
          change={
            conversionsChange
          }
          icon={
            <TrendingUp size={20} />
          }
          tone="orange"
        />

      </div>

      {/* MAIN TREND */}

      <div className="dashboard-grid">

        <ChartCard
          title="Growth Trend"
          subtitle="Performance over time"
          large
        >

          <div className="chart-controls">

            <span className="chart-label">
              Metric
            </span>

            <select
              value={metric}
              onChange={(e) =>
                setMetric(
                  e.target.value
                )
              }
            >
              <option>Revenue</option>
              <option>Users</option>
              <option>Customers</option>
              <option>Conversions</option>
              <option>Traffic</option>
            </select>

          </div>

          <ResponsiveContainer
            width="100%"
            height={310}
          >

            <AreaChart
              data={dateChartData}
            >

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
                    stopColor="var(--accent)"
                    stopOpacity={0.3}
                  />

                  <stop
                    offset="100%"
                    stopColor="var(--accent)"
                    stopOpacity={0}
                  />
                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid)"
              />

              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  value.slice(5)
                }
                tick={{
                  fill: "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={{
                  stroke:
                    "var(--border)",
                }}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "var(--surface)",
                  border:
                    "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow:
                    "var(--shadow-lg)",
                  color:
                    "var(--text)",
                }}
                labelStyle={{
                  color:
                    "var(--text)",
                  fontWeight: 700,
                }}
                itemStyle={{
                  color:
                    "var(--text)",
                }}
              />

              <Area
                type="monotone"
                dataKey={getMetricKey(
                  metric
                )}
                stroke="var(--accent)"
                strokeWidth={3}
                fill="url(#growthGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill:
                    "var(--accent)",
                }}
              />

            </AreaChart>

          </ResponsiveContainer>

        </ChartCard>

        <PerformanceScoreCard
          score={performanceScore}
          label={performanceLabel}
        />

      </div>

      {/* REGIONAL / CATEGORY */}

      <div className="dashboard-grid">

        <ChartCard
          title="Regional Performance"
          subtitle="Revenue by region"
        >

          <ResponsiveContainer
            width="100%"
            height={280}
          >

            <BarChart
              data={regionData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid)"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill:
                    "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill:
                    "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "var(--surface)",
                  border:
                    "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow:
                    "var(--shadow-lg)",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="var(--accent)"
                radius={[
                  7,
                  7,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </ChartCard>

        <ChartCard
          title="Category Performance"
          subtitle="Revenue by category"
        >

          <ResponsiveContainer
            width="100%"
            height={280}
          >

            <BarChart
              data={categoryData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid)"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill:
                    "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill:
                    "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "var(--surface)",
                  border:
                    "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow:
                    "var(--shadow-lg)",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="var(--accent-2)"
                radius={[
                  7,
                  7,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </ChartCard>

      </div>

      {/* INSIGHTS */}

      <div className="dashboard-grid">

        <InsightsPanel
          insights={insights}
        />

        <RecommendationsPanel
          recommendations={
            recommendations
          }
        />

      </div>

      {/* CONTRIBUTION */}

      <div className="dashboard-grid">

        <RevenueContribution
          data={
            revenueContribution
          }
        />

        <div className="performer-grid">

          <TopPerformerCard
            title="Top Region"
            value={
              topRegion?.name ||
              "N/A"
            }
            amount={
              topRegion
                ? formatCurrency(
                    topRegion.revenue
                  )
                : "-"
            }
            positive
          />

          <TopPerformerCard
            title="Lowest Region"
            value={
              lowestRegion?.name ||
              "N/A"
            }
            amount={
              lowestRegion
                ? formatCurrency(
                    lowestRegion.revenue
                  )
                : "-"
            }
          />

          <TopPerformerCard
            title="Top Category"
            value={
              topCategory?.name ||
              "N/A"
            }
            amount={
              topCategory
                ? formatCurrency(
                    topCategory.revenue
                  )
                : "-"
            }
            positive
          />

          <TopPerformerCard
            title="Lowest Category"
            value={
              lowestCategory?.name ||
              "N/A"
            }
            amount={
              lowestCategory
                ? formatCurrency(
                    lowestCategory.revenue
                  )
                : "-"
            }
          />

        </div>

      </div>

      {/* MINI METRICS */}

      <div className="mini-stats">

        <ReportMetric
          label="Conversion Rate"
          value={formatPercent(
            conversionRate
          )}
          tone="purple"
        />

        <ReportMetric
          label="Bounce Rate"
          value={formatPercent(
            bounceRate
          )}
          tone="orange"
        />

        <ReportMetric
          label="Engagement Rate"
          value={formatPercent(
            engagementRate
          )}
          tone="teal"
        />

      </div>

    </>
  );
}

/* =========================================================
   GROWTH ANALYTICS
========================================================= */

function GrowthAnalyticsPage({
  dateChartData,
  regionData,
  categoryData,
  metric,
  setMetric,
}) {
  const metricKey =
    getMetricKey(metric);

  return (
    <div className="section-stack">

      <ChartCard
        title="Growth Analytics"
        subtitle="Detailed trend analysis"
        large
      >

        <div className="chart-controls">

          <span className="chart-label">
            Metric
          </span>

          <select
            value={metric}
            onChange={(e) =>
              setMetric(
                e.target.value
              )
            }
          >
            <option>Revenue</option>
            <option>Users</option>
            <option>Customers</option>
            <option>Conversions</option>
            <option>Traffic</option>
          </select>

        </div>

        <ResponsiveContainer
          width="100%"
          height={380}
        >

          <LineChart
            data={dateChartData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
            />

            <XAxis
              dataKey="date"
              tick={{
                fill:
                  "var(--muted)",
                fontSize: 12,
              }}
              axisLine={{
                stroke:
                  "var(--border)",
              }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill:
                  "var(--muted)",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background:
                  "var(--surface)",
                border:
                  "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow:
                  "var(--shadow-lg)",
              }}
            />

            <Line
              type="monotone"
              dataKey={metricKey}
              stroke="var(--accent)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </ChartCard>

      <div className="dashboard-grid">

        <ChartCard
          title="Region Analysis"
          subtitle="Regional revenue"
        >

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={regionData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid)"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill:
                    "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill:
                    "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "var(--surface)",
                  border:
                    "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="var(--accent)"
                radius={[
                  7,
                  7,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </ChartCard>

        <ChartCard
          title="Category Analysis"
          subtitle="Category revenue"
        >

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={categoryData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid)"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill:
                    "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill:
                    "var(--muted)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "var(--surface)",
                  border:
                    "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="var(--accent-2)"
                radius={[
                  7,
                  7,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </ChartCard>

      </div>

    </div>
  );
}

/* =========================================================
   CUSTOMERS
========================================================= */

function CustomersPage({
  filteredData,
  search,
  setSearch,
}) {
  return (
    <div className="section-stack">

      <ChartCard
        title="Customer Analytics"
        subtitle="Search and explore customer-related data"
      >

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search region or category..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <div className="table-meta">

          <span>
            Showing{" "}
            <strong>
              {filteredData.length}
            </strong>{" "}
            records
          </span>

        </div>

        <div className="data-table-wrapper">

          <table className="data-table">

            <thead>

              <tr>
                <th>Date</th>
                <th>Region</th>
                <th>Category</th>
                <th>Users</th>
                <th>Customers</th>
                <th>Conversions</th>
              </tr>

            </thead>

            <tbody>

              {filteredData.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="empty-state"
                  >
                    No data found.
                    Try changing
                    your filters.

                  </td>

                </tr>

              ) : (

                filteredData
                  .slice(0, 100)
                  .map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={index}
                      >

                        <td>
                          {
                            item.date
                          }
                        </td>

                        <td>

                          <span className="table-icon">
                            <MapPin
                              size={14}
                            />
                          </span>

                          {
                            item.region
                          }

                        </td>

                        <td>

                          <span className="table-icon">
                            <Package
                              size={14}
                            />
                          </span>

                          {
                            item.category
                          }

                        </td>

                        <td>
                          {formatNumber(
                            item.users
                          )}
                        </td>

                        <td>
                          {formatNumber(
                            item.new_customers
                          )}
                        </td>

                        <td>
                          {formatNumber(
                            item.conversions
                          )}
                        </td>

                      </tr>

                    )
                  )

              )}

            </tbody>

          </table>

        </div>

      </ChartCard>

    </div>
  );
}

/* =========================================================
   GOALS
========================================================= */

function GoalsPage({
  totalRevenue,
  totalCustomers,
  conversionRate,
  performanceScore,
}) {
  const goals = [
    {
      title: "Revenue Goal",
      current: totalRevenue,
      target: Math.max(
        totalRevenue * 1.2,
        100000
      ),
      format: formatCurrency,
      tone: "purple",
    },
    {
      title: "Customer Growth",
      current: totalCustomers,
      target: Math.max(
        totalCustomers * 1.2,
        100
      ),
      format: formatNumber,
      tone: "teal",
    },
    {
      title: "Conversion Rate",
      current: conversionRate,
      target: 10,
      format: (value) =>
        `${value.toFixed(1)}%`,
      tone: "orange",
    },
    {
      title: "Performance Score",
      current: performanceScore,
      target: 100,
      format: (value) =>
        `${value.toFixed(0)}/100`,
      tone: "blue",
    },
  ];

  return (
    <div className="goals-grid">

      {goals.map((goal) => {

        const progress = Math.min(
          100,
          (goal.current /
            goal.target) *
            100
        );

        return (
          <div
            className={`goal-card ${goal.tone}`}
            key={goal.title}
          >

            <div className="goal-header">

              <div>

                <span>
                  {goal.title}
                </span>

                <h3>
                  {goal.format(
                    goal.current
                  )}
                </h3>

              </div>

              <div className="goal-icon">
                <Target
                  size={20}
                />
              </div>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <div className="goal-footer">

              <span>
                {progress.toFixed(
                  0
                )}
                % complete
              </span>

              <span>
                Target:{" "}
                {goal.format(
                  goal.target
                )}
              </span>

            </div>

          </div>
        );
      })}

    </div>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function ReportsPage({
  totalRevenue,
  activeUsers,
  totalCustomers,
  totalConversions,
  conversionRate,
  bounceRate,
  performanceScore,
  performanceLabel,
  downloadReport,
  exportCSV,
}) {
  return (
    <div className="section-stack">

      <div className="report-header">

        <div>

          <div className="section-eyebrow">
            REPORT CENTER
          </div>

          <h2>
            Business Reports
          </h2>

          <p>
            Export filtered analytics
            and generate a
            performance report.
          </p>

        </div>

        <div className="report-actions">

          <button
            className="secondary-button"
            onClick={
              downloadReport
            }
          >
            <FileText
              size={17}
            />
            Download Report
          </button>

          <button
            className="primary-button"
            onClick={exportCSV}
          >
            <Download
              size={17}
            />
            Export CSV
          </button>

        </div>

      </div>

      <div className="report-grid">

        <ReportRow
          label="Total Revenue"
          value={formatCurrency(
            totalRevenue
          )}
        />

        <ReportRow
          label="Active Users"
          value={formatNumber(
            activeUsers
          )}
        />

        <ReportRow
          label="New Customers"
          value={formatNumber(
            totalCustomers
          )}
        />

        <ReportRow
          label="Conversions"
          value={formatNumber(
            totalConversions
          )}
        />

        <ReportRow
          label="Conversion Rate"
          value={formatPercent(
            conversionRate
          )}
        />

        <ReportRow
          label="Bounce Rate"
          value={formatPercent(
            bounceRate
          )}
        />

        <ReportRow
          label="Performance Score"
          value={`${performanceScore.toFixed(
            1
          )}/100`}
        />

        <ReportRow
          label="Performance Status"
          value={
            performanceLabel
          }
        />

      </div>

    </div>
  );
}

/* =========================================================
   ACTIVITY
========================================================= */

function ActivityPage({
  filteredData,
}) {
  const recentData = filteredData
    .slice()
    .reverse()
    .slice(0, 10);

  return (
    <div className="section-stack">

      <ChartCard
        title="Recent Activity"
        subtitle="Latest activity from the selected dataset"
      >

        <div className="activity-list">

          {recentData.length === 0 ? (

            <div className="empty-state">
              No activity available
              for the selected
              filters.
            </div>

          ) : (

            recentData.map(
              (
                item,
                index
              ) => (

                <div
                  className="activity-item"
                  key={index}
                >

                  <div className="activity-icon">
                    <Activity
                      size={18}
                    />
                  </div>

                  <div className="activity-content">

                    <strong>
                      {
                        item.category
                      }{" "}
                      activity
                    </strong>

                    <span>
                      {
                        item.region
                      }{" "}
                      ·{" "}
                      {
                        item.date
                      }
                    </span>

                  </div>

                  <div className="activity-value">

                    {formatCurrency(
                      item.revenue
                    )}

                  </div>

                </div>

              )
            )

          )}

        </div>

      </ChartCard>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  change,
  icon,
  tone = "purple",
}) {
  const positive = change >= 0;

  return (
    <div className="stat-card">

      <div className="stat-top">

        <div
          className={`stat-icon ${tone}`}
        >
          {icon}
        </div>

        <span
          className={
            positive
              ? "change positive"
              : "change negative"
          }
        >

          {positive ? (
            <ArrowUpRight
              size={14}
            />
          ) : (
            <ArrowDownRight
              size={14}
            />
          )}

          {Math.abs(change).toFixed(
            1
          )}
          %

        </span>

      </div>

      <span className="stat-label">
        {title}
      </span>

      <h2>{value}</h2>

      <span className="stat-description">
        Compared with previous
        period
      </span>

    </div>
  );
}

/* =========================================================
   CHART CARD
========================================================= */

function ChartCard({
  title,
  subtitle,
  children,
  large = false,
}) {
  return (
    <div
      className={`chart-card ${
        large ? "large" : ""
      }`}
    >

      <div className="card-header">

        <div>

          <h3>{title}</h3>

          <p>{subtitle}</p>

        </div>

        <div className="card-header-icon">
          <ChevronRight
            size={17}
          />
        </div>

      </div>

      <div className="chart-content">
        {children}
      </div>

    </div>
  );
}

/* =========================================================
   INSIGHTS
========================================================= */

function InsightsPanel({
  insights,
}) {
  return (
    <div className="insight-card">

      <div className="card-header">

        <div>

          <h3>
            Key Insights
          </h3>

          <p>
            Important observations
            from your data
          </p>

        </div>

        <div className="header-colored-icon purple">
          <Lightbulb
            size={18}
          />
        </div>

      </div>

      <div className="insight-list">

        {insights.map(
          (
            insight,
            index
          ) => (

            <div
              className="insight-item"
              key={index}
            >

              <div className="insight-number">
                {index + 1}
              </div>

              <p>
                {insight}
              </p>

            </div>

          )
        )}

      </div>

    </div>
  );
}

/* =========================================================
   RECOMMENDATIONS
========================================================= */

function RecommendationsPanel({
  recommendations,
}) {
  return (
    <div className="insight-card">

      <div className="card-header">

        <div>

          <h3>
            Recommendations
          </h3>

          <p>
            Suggested actions based
            on performance
          </p>

        </div>

        <div className="header-colored-icon teal">
          <Gauge
            size={18}
          />
        </div>

      </div>

      <div className="recommendation-list">

        {recommendations.length === 0 ? (

          <div className="empty-state">
            No recommendations
            available.
          </div>

        ) : (

          recommendations.map(
            (
              item,
              index
            ) => (

              <div
                className="recommendation-item"
                key={index}
              >

                <CheckCircle2
                  size={18}
                />

                <p>
                  {item}
                </p>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}

/* =========================================================
   PERFORMANCE SCORE
========================================================= */

function PerformanceScoreCard({
  score,
  label,
}) {
  const statusClass =
    label
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );

  return (
    <div className="performance-card">

      <div className="card-header">

        <div>

          <h3>
            Performance Score
          </h3>

          <p>
            Overall business health
          </p>

        </div>

        <div className="header-colored-icon blue">
          <Gauge
            size={18}
          />
        </div>

      </div>

      <div className="score-wrapper">

        <div className="score-circle">

          <strong>
            {score.toFixed(0)}
          </strong>

          <span>
            /100
          </span>

        </div>

      </div>

      <div
        className={`score-status ${statusClass}`}
      >
        {label}
      </div>

      <div className="score-description">

        <span>
          <i></i>
          Revenue
        </span>

        <span>
          <i></i>
          Customers
        </span>

        <span>
          <i></i>
          Conversion
        </span>

        <span>
          <i></i>
          Engagement
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   REVENUE CONTRIBUTION
========================================================= */

function RevenueContribution({
  data,
}) {
  return (
    <div className="chart-card">

      <div className="card-header">

        <div>

          <h3>
            Revenue Contribution
          </h3>

          <p>
            Regional share of total
            revenue
          </p>

        </div>

        <div className="header-colored-icon purple">
          <Globe
            size={18}
          />
        </div>

      </div>

      <div className="contribution-list">

        {data.map(
          (item) => (

            <div
              className="contribution-item"
              key={item.name}
            >

              <div className="contribution-header">

                <span>
                  {item.name}
                </span>

                <strong>
                  {item.percentage.toFixed(
                    1
                  )}
                  %
                </strong>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />

              </div>

              <span className="contribution-value">
                {formatCurrency(
                  item.revenue
                )}
              </span>

            </div>

          )
        )}

      </div>

    </div>
  );
}

/* =========================================================
   TOP PERFORMER
========================================================= */

function TopPerformerCard({
  title,
  value,
  amount,
  positive = false,
}) {
  return (
    <div className="performer-card">

      <span>
        {title}
      </span>

      <div className="performer-title">

        <strong>
          {value}
        </strong>

        {positive ? (
          <ArrowUpRight
            size={17}
          />
        ) : (
          <ArrowDownRight
            size={17}
          />
        )}

      </div>

      <p>
        {amount}
      </p>

    </div>
  );
}

/* =========================================================
   REPORT METRIC
========================================================= */

function ReportMetric({
  label,
  value,
  tone = "purple",
}) {
  return (
    <div
      className={`report-metric ${tone}`}
    >

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

/* =========================================================
   REPORT ROW
========================================================= */

function ReportRow({
  label,
  value,
}) {
  return (
    <div className="report-row">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}