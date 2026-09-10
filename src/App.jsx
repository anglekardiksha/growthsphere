import { useMemo, useState } from "react";

import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Menu,
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
  MousePointerClick,
  Globe,
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
  Legend,
} from "recharts";

import growthData from "./data/growthData.csv?raw";
import "./App.css";

/* =========================================================
   CSV PARSER
========================================================= */

const parsedGrowthData = growthData
  .trim()
  .split(/\r?\n/)
  .map((row) => row.trim())
  .filter(Boolean)
  .filter((row) => !row.startsWith("date,"))
  .map((row) => {
    const [
      date,
      region,
      category,
      revenue,
      users,
      new_customers,
      conversions,
      traffic,
      bounce_rate,
    ] = row.split(",");

    return {
      date: date.trim(),
      region: region.trim(),
      category: category.trim(),
      revenue: Number(revenue),
      users: Number(users),
      new_customers: Number(new_customers),
      conversions: Number(conversions),
      traffic: Number(traffic),
      bounce_rate: Number(bounce_rate),
    };
  });

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatPercent = (value) =>
  `${Number(value || 0).toFixed(1)}%`;

const calculateChange = (current, previous) => {
  if (!previous) return 0;

  return ((current - previous) / previous) * 100;
};

const sumBy = (data, key) =>
  data.reduce(
    (total, item) => total + Number(item[key] || 0),
    0
  );

const averageBy = (data, key) => {
  if (!data.length) return 0;

  return (
    data.reduce(
      (total, item) =>
        total + Number(item[key] || 0),
      0
    ) / data.length
  );
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
        new_customers: 0,
        conversions: 0,
        traffic: 0,
        bounce_rate_total: 0,
        count: 0,
      };
    }

    grouped[item.date].revenue += item.revenue;
    grouped[item.date].users += item.users;
    grouped[item.date].new_customers +=
      item.new_customers;
    grouped[item.date].conversions +=
      item.conversions;
    grouped[item.date].traffic += item.traffic;
    grouped[item.date].bounce_rate_total +=
      item.bounce_rate;
    grouped[item.date].count += 1;
  });

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      bounce_rate:
        item.bounce_rate_total / item.count,
    }))
    .sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    );
};

const aggregateBy = (data, key) => {
  const grouped = {};

  data.forEach((item) => {
    const group = item[key];

    if (!grouped[group]) {
      grouped[group] = {
        name: group,
        revenue: 0,
        users: 0,
        new_customers: 0,
        conversions: 0,
        traffic: 0,
        bounce_rate_total: 0,
        count: 0,
      };
    }

    grouped[group].revenue += item.revenue;
    grouped[group].users += item.users;
    grouped[group].new_customers +=
      item.new_customers;
    grouped[group].conversions +=
      item.conversions;
    grouped[group].traffic += item.traffic;
    grouped[group].bounce_rate_total +=
      item.bounce_rate;
    grouped[group].count += 1;
  });

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      bounce_rate:
        item.bounce_rate_total /
        item.count,

      conversion_rate:
        item.traffic > 0
          ? (item.conversions /
              item.traffic) *
            100
          : 0,
    }))
    .sort(
      (a, b) => b.revenue - a.revenue
    );
};

/* =========================================================
   APP
========================================================= */

function App() {
  const [page, setPage] =
    useState("Dashboard");

  const [metric, setMetric] =
    useState("Revenue");

  const [dateRange, setDateRange] =
    useState("30 Days");

  const [regionFilter, setRegionFilter] =
    useState("All Regions");

  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [search, setSearch] =
    useState("");

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const regions = useMemo(
    () => [
      "All Regions",
      ...new Set(
        parsedGrowthData.map(
          (item) => item.region
        )
      ),
    ],
    []
  );

  const categories = useMemo(
    () => [
      "All Categories",
      ...new Set(
        parsedGrowthData.map(
          (item) => item.category
        )
      ),
    ],
    []
  );

  /* =======================================================
     DATE RANGE
  ======================================================= */

  const rangeDays = {
    "7 Days": 7,
    "30 Days": 30,
    "90 Days": 90,
  }[dateRange];

  const latestDate = useMemo(() => {
    return new Date(
      Math.max(
        ...parsedGrowthData.map(
          (item) =>
            new Date(item.date).getTime()
        )
      )
    );
  }, []);

  const selectedData = useMemo(() => {
    const cutoff = new Date(
      latestDate
    );

    cutoff.setDate(
      cutoff.getDate() -
        rangeDays +
        1
    );

    return parsedGrowthData.filter(
      (item) => {
        const itemDate = new Date(
          item.date
        );

        return (
          itemDate >= cutoff &&
          itemDate <= latestDate
        );
      }
    );
  }, [rangeDays, latestDate]);

  /* =======================================================
     FILTERED DATA
  ======================================================= */

  const filteredData = useMemo(() => {
    return selectedData.filter(
      (item) => {
        const regionMatch =
          regionFilter ===
            "All Regions" ||
          item.region ===
            regionFilter;

        const categoryMatch =
          categoryFilter ===
            "All Categories" ||
          item.category ===
            categoryFilter;

        const searchMatch =
          !search ||
          item.date
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.region
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.category
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        return (
          regionMatch &&
          categoryMatch &&
          searchMatch
        );
      }
    );
  }, [
    selectedData,
    regionFilter,
    categoryFilter,
    search,
  ]);

  /* =======================================================
     KPI CALCULATIONS
  ======================================================= */

  const totalRevenue = sumBy(
    filteredData,
    "revenue"
  );

  const activeUsers = sumBy(
    filteredData,
    "users"
  );

  const totalTraffic = sumBy(
    filteredData,
    "traffic"
  );

  const totalConversions = sumBy(
    filteredData,
    "conversions"
  );

  const totalCustomers = sumBy(
    filteredData,
    "new_customers"
  );

  const conversionRate =
    totalTraffic > 0
      ? (totalConversions /
          totalTraffic) *
        100
      : 0;

  const bounceRate = averageBy(
    filteredData,
    "bounce_rate"
  );

  const engagementRate =
    100 - bounceRate;

  /* =======================================================
     PREVIOUS PERIOD
  ======================================================= */

  const previousPeriodData =
    useMemo(() => {
      const cutoffEnd = new Date(
        latestDate
      );

      cutoffEnd.setDate(
        cutoffEnd.getDate() -
          rangeDays
      );

      const cutoffStart =
        new Date(cutoffEnd);

      cutoffStart.setDate(
        cutoffStart.getDate() -
          rangeDays +
          1
      );

      return parsedGrowthData.filter(
        (item) => {
          const itemDate = new Date(
            item.date
          );

          const dateMatch =
            itemDate >= cutoffStart &&
            itemDate <= cutoffEnd;

          const regionMatch =
            regionFilter ===
              "All Regions" ||
            item.region ===
              regionFilter;

          const categoryMatch =
            categoryFilter ===
              "All Categories" ||
            item.category ===
              categoryFilter;

          return (
            dateMatch &&
            regionMatch &&
            categoryMatch
          );
        }
      );
    }, [
      latestDate,
      rangeDays,
      regionFilter,
      categoryFilter,
    ]);

  const previousRevenue =
    sumBy(
      previousPeriodData,
      "revenue"
    );

  const previousUsers =
    sumBy(
      previousPeriodData,
      "users"
    );

  const previousCustomers =
    sumBy(
      previousPeriodData,
      "new_customers"
    );

  const previousConversions =
    sumBy(
      previousPeriodData,
      "conversions"
    );

  const revenueChange =
    calculateChange(
      totalRevenue,
      previousRevenue
    );

  const usersChange =
    calculateChange(
      activeUsers,
      previousUsers
    );

  const customerChange =
    calculateChange(
      totalCustomers,
      previousCustomers
    );

  const conversionChange =
    calculateChange(
      totalConversions,
      previousConversions
    );

  /* =======================================================
     CHART DATA
  ======================================================= */

  const dateChartData = useMemo(
    () =>
      aggregateByDate(
        filteredData
      ),
    [filteredData]
  );

  const regionData = useMemo(
    () =>
      aggregateBy(
        filteredData,
        "region"
      ),
    [filteredData]
  );

  const categoryData = useMemo(
    () =>
      aggregateBy(
        filteredData,
        "category"
      ),
    [filteredData]
  );

  /* =======================================================
     PERFORMANCE SCORE
  ======================================================= */

  const revenueScore = Math.min(
    100,
    Math.max(
      0,
      50 + revenueChange
    )
  );

  const customerScore = Math.min(
    100,
    Math.max(
      0,
      50 + customerChange
    )
  );

  const conversionScore =
    Math.min(
      100,
      conversionRate * 3
    );

  const engagementScore =
    Math.min(
      100,
      engagementRate
    );

  const performanceScore = Math.round(
    revenueScore * 0.3 +
      customerScore * 0.25 +
      conversionScore * 0.25 +
      engagementScore * 0.2
  );

  const performanceLabel =
    performanceScore >= 80
      ? "Excellent"
      : performanceScore >= 65
      ? "Healthy"
      : performanceScore >= 50
      ? "Needs Attention"
      : "At Risk";

  /* =======================================================
     TOP / LOW PERFORMERS
  ======================================================= */

  const topRegion =
    regionData[0] || null;

  const lowestRegion =
    regionData.length
      ? [...regionData].sort(
          (a, b) =>
            a.revenue - b.revenue
        )[0]
      : null;

  const topCategory =
    categoryData[0] || null;

  const lowestCategory =
    categoryData.length
      ? [...categoryData].sort(
          (a, b) =>
            a.revenue - b.revenue
        )[0]
      : null;

  /* =======================================================
     REVENUE CONTRIBUTION
  ======================================================= */

  const regionContribution =
    regionData.map((item) => ({
      ...item,
      contribution:
        totalRevenue > 0
          ? (item.revenue /
              totalRevenue) *
            100
          : 0,
    }));

  /* =======================================================
     INSIGHTS
  ======================================================= */

  const insights = useMemo(() => {
    if (!filteredData.length) {
      return [
        "No data is available for the selected filters.",
      ];
    }

    const strongestRegion =
      regionData[0];

    const strongestCategory =
      categoryData[0];

    const highestConversionRegion =
      [...regionData].sort(
        (a, b) =>
          b.conversion_rate -
          a.conversion_rate
      )[0];

    const lowestBounceRegion =
      [...regionData].sort(
        (a, b) =>
          a.bounce_rate -
          b.bounce_rate
      )[0];

    return [
      `${strongestRegion.name} is the strongest region by revenue with ${formatCurrency(
        strongestRegion.revenue
      )} generated during the selected period.`,

      `${strongestCategory.name} is the top-performing category, contributing ${formatCurrency(
        strongestCategory.revenue
      )} in revenue.`,

      `${highestConversionRegion.name} has the highest conversion rate at ${formatPercent(
        highestConversionRegion.conversion_rate
      )}.`,

      `${lowestBounceRegion.name} has the lowest average bounce rate at ${formatPercent(
        lowestBounceRegion.bounce_rate
      )}, indicating stronger engagement.`,
    ];
  }, [
    filteredData,
    regionData,
    categoryData,
  ]);

  /* =======================================================
     RECOMMENDATIONS
  ======================================================= */

  const recommendations = useMemo(() => {
    if (!filteredData.length) {
      return [
        "Adjust your filters to generate business recommendations.",
      ];
    }

    const result = [];

    if (
      lowestRegion &&
      topRegion &&
      lowestRegion.name !==
        topRegion.name
    ) {
      result.push(
        `Review ${lowestRegion.name}'s performance and identify opportunities to replicate the strategies working in ${topRegion.name}.`
      );
    }

    if (
      conversionRate < 15
    ) {
      result.push(
        "Conversion performance has room for improvement. Consider optimizing landing pages, calls-to-action and customer journeys."
      );
    } else {
      result.push(
        "Conversion performance is healthy. Continue monitoring high-performing acquisition channels and customer segments."
      );
    }

    if (bounceRate > 40) {
      result.push(
        "The bounce rate is relatively high. Investigate landing-page relevance, page speed and user experience."
      );
    } else {
      result.push(
        "Engagement is strong based on the current bounce rate. Preserve the experience of high-performing pages."
      );
    }

    if (
      topCategory &&
      lowestCategory &&
      topCategory.name !==
        lowestCategory.name
    ) {
      result.push(
        `${topCategory.name} is outperforming ${lowestCategory.name}. Consider studying its pricing, demand and customer behavior patterns.`
      );
    }

    return result.slice(0, 4);
  }, [
    filteredData,
    lowestRegion,
    topRegion,
    conversionRate,
    bounceRate,
    topCategory,
    lowestCategory,
  ]);

  /* =======================================================
     EXPORT
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

    const rows =
      filteredData.map((item) => [
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
      ...rows.map((row) =>
        row.join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csv],
      { type: "text/csv" }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "growthsphere-filtered-data.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     REPORT
  ======================================================= */

  const downloadReport = () => {
    const report = `
GROWTHSPHERE BUSINESS ANALYTICS REPORT
======================================

DATE RANGE
----------
${dateRange}

FILTERS
-------
Region: ${regionFilter}
Category: ${categoryFilter}

EXECUTIVE SUMMARY
-----------------
Performance Score: ${performanceScore}/100
Business Health: ${performanceLabel}

KEY PERFORMANCE INDICATORS
--------------------------
Revenue: ${formatCurrency(totalRevenue)}
Users: ${formatNumber(activeUsers)}
Traffic: ${formatNumber(totalTraffic)}
New Customers: ${formatNumber(totalCustomers)}
Conversions: ${formatNumber(totalConversions)}
Conversion Rate: ${formatPercent(conversionRate)}
Bounce Rate: ${formatPercent(bounceRate)}
Engagement Rate: ${formatPercent(engagementRate)}

PERFORMANCE CHANGE
------------------
Revenue Growth: ${revenueChange.toFixed(1)}%
User Growth: ${usersChange.toFixed(1)}%
Customer Growth: ${customerChange.toFixed(1)}%
Conversion Growth: ${conversionChange.toFixed(1)}%

TOP PERFORMERS
--------------
Top Region: ${topRegion?.name || "N/A"}
Top Category: ${topCategory?.name || "N/A"}

LOWEST PERFORMERS
-----------------
Lowest Region: ${lowestRegion?.name || "N/A"}
Lowest Category: ${lowestCategory?.name || "N/A"}

BUSINESS INSIGHTS
-----------------
${insights
  .map(
    (item, index) =>
      `${index + 1}. ${item}`
  )
  .join("\n")}

BUSINESS RECOMMENDATIONS
------------------------
${recommendations
  .map(
    (item, index) =>
      `${index + 1}. ${item}`
  )
  .join("\n")}

Generated by GrowthSphere Analytics Dashboard.
`;

    const blob = new Blob(
      [report],
      { type: "text/plain" }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

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
    setCategoryFilter(
      "All Categories"
    );
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
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">
            GS
          </div>

          <div>
            <h2>GrowthSphere</h2>
            <span>
              Analytics Platform
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">

          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <button
                  key={item.name}
                  className={`nav-item ${
                    page ===
                    item.name
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setPage(
                      item.name
                    )
                  }
                >
                  <Icon size={19} />

                  <span>
                    {item.name}
                  </span>

                  {page ===
                    item.name && (
                    <ChevronRight
                      size={16}
                      className="nav-arrow"
                    />
                  )}
                </button>
              );
            }
          )}

        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            <Bell size={19} />
            Notifications
          </button>

          <button className="nav-item">
            <Menu size={19} />
            Settings
          </button>

          <div className="profile-card">
            <div className="avatar">
              DA
            </div>

            <div>
              <strong>
                Data Analyst
              </strong>

              <span>
                Portfolio Project
              </span>
            </div>
          </div>

        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div className="page-heading">
            <span>
              Analytics
            </span>

            <h1>{page}</h1>
          </div>

          <div className="topbar-actions">

            <button
              className="secondary-button"
              onClick={
                downloadReport
              }
            >
              <FileText size={17} />
              Report
            </button>

            <button
              className="primary-button"
              onClick={exportCSV}
            >
              <Download size={17} />
              Export
            </button>

          </div>

        </header>

        <section className="filter-panel">

          <div className="filter-title">
            <Filter size={18} />
            <strong>
              Analytics Filters
            </strong>
          </div>

          <div className="filter-group">

            <label>
              Date Range
            </label>

            <select
              value={dateRange}
              onChange={(event) =>
                setDateRange(
                  event.target.value
                )
              }
            >
              <option>
                7 Days
              </option>

              <option>
                30 Days
              </option>

              <option>
                90 Days
              </option>
            </select>

          </div>

          <div className="filter-group">

            <label>
              Region
            </label>

            <select
              value={regionFilter}
              onChange={(event) =>
                setRegionFilter(
                  event.target.value
                )
              }
            >
              {regions.map(
                (region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>
                )
              )}
            </select>

          </div>

          <div className="filter-group">

            <label>
              Category
            </label>

            <select
              value={
                categoryFilter
              }
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
            >
              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

          </div>

          <button
            className="reset-button"
            onClick={
              resetFilters
            }
          >
            <RotateCcw
              size={16}
            />
            Reset
          </button>

        </section>

        {page ===
          "Dashboard" && (
          <DashboardPage
            totalRevenue={
              totalRevenue
            }
            activeUsers={
              activeUsers
            }
            totalTraffic={
              totalTraffic
            }
            totalCustomers={
              totalCustomers
            }
            conversionRate={
              conversionRate
            }
            bounceRate={
              bounceRate
            }
            revenueChange={
              revenueChange
            }
            usersChange={
              usersChange
            }
            customerChange={
              customerChange
            }
            conversionChange={
              conversionChange
            }
            dateChartData={
              dateChartData
            }
            metric={metric}
            setMetric={
              setMetric
            }
            insights={insights}
            recommendations={
              recommendations
            }
            regionData={
              regionData
            }
            categoryData={
              categoryData
            }
            regionContribution={
              regionContribution
            }
            performanceScore={
              performanceScore
            }
            performanceLabel={
              performanceLabel
            }
          />
        )}

        {page ===
          "Growth Analytics" && (
          <GrowthAnalyticsPage
            dateChartData={
              dateChartData
            }
            regionData={
              regionData
            }
            categoryData={
              categoryData
            }
            metric={metric}
            setMetric={
              setMetric
            }
            insights={insights}
            recommendations={
              recommendations
            }
          />
        )}

        {page ===
          "Customers" && (
          <CustomersPage
            filteredData={
              filteredData
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
            search={search}
            setSearch={
              setSearch
            }
          />
        )}

        {page === "Goals" && (
          <GoalsPage
            totalRevenue={
              totalRevenue
            }
            conversionRate={
              conversionRate
            }
            bounceRate={
              bounceRate
            }
          />
        )}

        {page ===
          "Reports" && (
          <ReportsPage
            totalRevenue={
              totalRevenue
            }
            activeUsers={
              activeUsers
            }
            totalTraffic={
              totalTraffic
            }
            totalCustomers={
              totalCustomers
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
            regionData={
              regionData
            }
            categoryData={
              categoryData
            }
            insights={insights}
            recommendations={
              recommendations
            }
            downloadReport={
              downloadReport
            }
            exportCSV={
              exportCSV
            }
          />
        )}

        {page ===
          "Activity" && (
          <ActivityPage
            filteredData={
              filteredData
            }
          />
        )}

      </main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardPage({
  totalRevenue,
  activeUsers,
  totalTraffic,
  totalCustomers,
  conversionRate,
  bounceRate,
  revenueChange,
  usersChange,
  customerChange,
  conversionChange,
  dateChartData,
  metric,
  setMetric,
  insights,
  recommendations,
  regionData,
  categoryData,
  regionContribution,
  performanceScore,
  performanceLabel,
}) {
  return (
    <div className="page-content">

      <section className="welcome-section">

        <div>
          <p className="eyebrow">
            BUSINESS PERFORMANCE
          </p>

          <h2>
            Executive Growth Overview
          </h2>

          <p>
            Monitor business growth,
            customer activity and
            conversion performance.
          </p>
        </div>

        <div className="health-badge">
          <Gauge size={16} />

          <span>
            Health Score
          </span>

          <strong>
            {performanceScore}/100
          </strong>
        </div>

      </section>

      <section className="stats-grid">

        <StatCard
          title="Revenue"
          value={formatCurrency(
            totalRevenue
          )}
          change={
            revenueChange
          }
          subtitle="vs previous period"
        />

        <StatCard
          title="Users"
          value={formatNumber(
            activeUsers
          )}
          change={
            usersChange
          }
          subtitle="vs previous period"
        />

        <StatCard
          title="Traffic"
          value={formatNumber(
            totalTraffic
          )}
          change={0}
          subtitle="selected period"
        />

        <StatCard
          title="New Customers"
          value={formatNumber(
            totalCustomers
          )}
          change={
            customerChange
          }
          subtitle="vs previous period"
        />

      </section>

      <section className="stats-grid secondary-stats">

        <StatCard
          title="Conversions"
          value={formatNumber(
            dateChartData.reduce(
              (sum, item) =>
                sum +
                item.conversions,
              0
            )
          )}
          change={
            conversionChange
          }
          subtitle="vs previous period"
        />

        <StatCard
          title="Conversion Rate"
          value={formatPercent(
            conversionRate
          )}
          change={
            conversionChange
          }
          subtitle="traffic conversion"
        />

        <StatCard
          title="Bounce Rate"
          value={formatPercent(
            bounceRate
          )}
          change={0}
          subtitle="lower is better"
        />

        <StatCard
          title="Engagement"
          value={formatPercent(
            100 - bounceRate
          )}
          change={0}
          subtitle="estimated engagement"
        />

      </section>

      <section className="dashboard-grid">

        <ChartCard
          title="Growth Trend"
          subtitle="Performance over selected period"
          className="large-card"
        >

          <div className="chart-toolbar">

            <select
              value={metric}
              onChange={(event) =>
                setMetric(
                  event.target.value
                )
              }
            >
              <option>
                Revenue
              </option>

              <option>
                Users
              </option>

              <option>
                New Customers
              </option>

              <option>
                Conversions
              </option>

              <option>
                Traffic
              </option>
            </select>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <AreaChart
              data={
                dateChartData
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(
                  value
                ) =>
                  value.slice(
                    5
                  )
                }
              />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey={
                  metric ===
                  "New Customers"
                    ? "new_customers"
                    : metric.toLowerCase()
                }
                strokeWidth={2}
                fillOpacity={0.18}
              />

            </AreaChart>
          </ResponsiveContainer>

        </ChartCard>

        <PerformanceScoreCard
          score={
            performanceScore
          }
          label={
            performanceLabel
          }
        />

      </section>

      <section className="dashboard-grid">

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
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="revenue"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />

            </BarChart>
          </ResponsiveContainer>

        </ChartCard>

        <InsightsPanel
          insights={insights}
        />

      </section>

      <section className="dashboard-grid">

        <RevenueContribution
          data={
            regionContribution
          }
        />

        <RecommendationsPanel
          recommendations={
            recommendations
          }
        />

      </section>

      <section className="dashboard-grid">

        <ChartCard
          title="Category Performance"
          subtitle="Revenue contribution"
        >

          <ResponsiveContainer
            width="100%"
            height={270}
          >
            <BarChart
              data={categoryData}
              layout="vertical"
            >

              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="name"
                width={80}
              />

              <Tooltip />

              <Bar
                dataKey="revenue"
                radius={[
                  0,
                  6,
                  6,
                  0,
                ]}
              />

            </BarChart>
          </ResponsiveContainer>

        </ChartCard>

        <TopPerformerCard
          regionData={
            regionData
          }
          categoryData={
            categoryData
          }
        />

      </section>

    </div>
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
  insights,
  recommendations,
}) {
  return (
    <div className="page-content">

      <section className="section-intro">

        <p className="eyebrow">
          DEEP DIVE
        </p>

        <h2>
          Growth Analytics
        </h2>

        <p>
          Analyze trends and compare
          performance across business
          dimensions.
        </p>

      </section>

      <div className="analytics-grid">

        <ChartCard
          title="Growth Trend"
          subtitle="Time-series analysis"
          className="wide-card"
        >

          <div className="chart-toolbar">

            <select
              value={metric}
              onChange={(event) =>
                setMetric(
                  event.target.value
                )
              }
            >
              <option>
                Revenue
              </option>

              <option>
                Users
              </option>

              <option>
                New Customers
              </option>

              <option>
                Conversions
              </option>

              <option>
                Traffic
              </option>
            </select>

          </div>

          <ResponsiveContainer
            width="100%"
            height={380}
          >
            <LineChart
              data={
                dateChartData
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
                tickFormatter={(
                  value
                ) =>
                  value.slice(
                    5
                  )
                }
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey={
                  metric ===
                  "New Customers"
                    ? "new_customers"
                    : metric.toLowerCase()
                }
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
              />

            </LineChart>
          </ResponsiveContainer>

        </ChartCard>

        <ChartCard
          title="Regional Revenue"
          subtitle="Compare business regions"
        >

          <ResponsiveContainer
            width="100%"
            height={380}
          >
            <BarChart
              data={regionData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="revenue"
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

      <div className="analytics-grid">

        <ChartCard
          title="Category Performance"
          subtitle="Revenue and customer acquisition"
        >

          <ResponsiveContainer
            width="100%"
            height={330}
          >
            <BarChart
              data={
                categoryData
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="revenue"
                name="Revenue"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />

              <Bar
                dataKey="new_customers"
                name="New Customers"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />

            </BarChart>
          </ResponsiveContainer>

        </ChartCard>

        <RecommendationsPanel
          recommendations={
            recommendations
          }
        />

      </div>

      <InsightsPanel
        insights={insights}
      />

    </div>
  );
}

/* =========================================================
   CUSTOMERS
========================================================= */

function CustomersPage({
  filteredData,
  activeUsers,
  totalCustomers,
  totalConversions,
  conversionRate,
  search,
  setSearch,
}) {
  return (
    <div className="page-content">

      <section className="section-intro">

        <p className="eyebrow">
          CUSTOMER ANALYTICS
        </p>

        <h2>
          Customers & Conversion
        </h2>

        <p>
          Understand customer
          acquisition and conversion
          performance.
        </p>

      </section>

      <section className="stats-grid">

        <StatCard
          title="Users"
          value={formatNumber(
            activeUsers
          )}
          change={0}
          subtitle="selected dataset"
        />

        <StatCard
          title="New Customers"
          value={formatNumber(
            totalCustomers
          )}
          change={0}
          subtitle="acquired"
        />

        <StatCard
          title="Conversions"
          value={formatNumber(
            totalConversions
          )}
          change={0}
          subtitle="completed"
        />

        <StatCard
          title="Conversion Rate"
          value={formatPercent(
            conversionRate
          )}
          change={0}
          subtitle="traffic to conversion"
        />

      </section>

      <section className="content-card">

        <div className="card-header">

          <div>
            <h3>
              Customer Analytics
            </h3>

            <p>
              Detailed performance records
            </p>
          </div>

          <div className="search-box">

            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search region, category..."
            />

          </div>

        </div>

        <div className="table-wrapper">

          <table>

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

              {filteredData.map(
                (item, index) => {
                  const rate =
                    item.traffic >
                    0
                      ? (item.conversions /
                          item.traffic) *
                        100
                      : 0;

                  return (
                    <tr
                      key={`${item.date}-${item.region}-${item.category}-${index}`}
                    >
                      <td>
                        {item.date}
                      </td>

                      <td>
                        <span className="table-badge">
                          <MapPin
                            size={13}
                          />
                          {
                            item.region
                          }
                        </span>
                      </td>

                      <td>
                        <span className="table-badge">
                          <Package
                            size={13}
                          />
                          {
                            item.category
                          }
                        </span>
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

                      <td>
                        {formatPercent(
                          rate
                        )}
                      </td>
                    </tr>
                  );
                }
              )}

              {!filteredData.length && (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-state"
                  >
                    No records found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   GOALS
========================================================= */

function GoalsPage({
  totalRevenue,
  conversionRate,
  bounceRate,
}) {
  const goals = [
    {
      title: "Revenue Goal",
      current:
        totalRevenue,
      target: 1000000,
      displayCurrent:
        formatCurrency(
          totalRevenue
        ),
      displayTarget:
        "₹10,00,000",
    },

    {
      title: "Conversion Goal",
      current:
        conversionRate,
      target: 30,
      displayCurrent:
        formatPercent(
          conversionRate
        ),
      displayTarget:
        "30%",
    },

    {
      title: "Engagement Goal",
      current:
        100 - bounceRate,
      target: 70,
      displayCurrent:
        formatPercent(
          100 - bounceRate
        ),
      displayTarget:
        "70%",
    },
  ];

  return (
    <div className="page-content">

      <section className="section-intro">

        <p className="eyebrow">
          BUSINESS TARGETS
        </p>

        <h2>
          Goals & Targets
        </h2>

        <p>
          Track progress against
          key business objectives.
        </p>

      </section>

      <div className="goals-page">

        {goals.map(
          (goal) => {
            const percentage =
              Math.min(
                100,
                Math.max(
                  0,
                  (goal.current /
                    goal.target) *
                    100
                )
              );

            return (
              <div
                className="goal-card"
                key={
                  goal.title
                }
              >

                <div className="goal-icon">
                  <Target
                    size={20}
                  />
                </div>

                <h3>
                  {goal.title}
                </h3>

                <div className="goal-values">

                  <strong>
                    {
                      goal.displayCurrent
                    }
                  </strong>

                  <span>
                    Target{" "}
                    {
                      goal.displayTarget
                    }
                  </span>

                </div>

                <div className="progress-track">

                  <div
                    className="progress-bar"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

                <div className="goal-footer">

                  <span>
                    {percentage.toFixed(
                      0
                    )}
                    % complete
                  </span>

                  <CheckCircle2
                    size={16}
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function ReportsPage({
  totalRevenue,
  activeUsers,
  totalTraffic,
  totalCustomers,
  conversionRate,
  bounceRate,
  performanceScore,
  performanceLabel,
  regionData,
  categoryData,
  insights,
  recommendations,
  downloadReport,
  exportCSV,
}) {
  return (
    <div className="page-content">

      <section className="report-hero">

        <div>

          <p className="eyebrow">
            EXECUTIVE REPORT
          </p>

          <h2>
            Business Performance Report
          </h2>

          <p>
            Executive summary generated
            from the selected dataset.
          </p>

        </div>

        <div className="report-score">

          <Gauge size={20} />

          <div>
            <span>
              Health Score
            </span>

            <strong>
              {performanceScore}/100
            </strong>
          </div>

          <b>
            {performanceLabel}
          </b>

        </div>

      </section>

      <section className="report-grid">

        <ReportMetric
          title="Revenue"
          value={formatCurrency(
            totalRevenue
          )}
        />

        <ReportMetric
          title="Users"
          value={formatNumber(
            activeUsers
          )}
        />

        <ReportMetric
          title="Traffic"
          value={formatNumber(
            totalTraffic
          )}
        />

        <ReportMetric
          title="Customers"
          value={formatNumber(
            totalCustomers
          )}
        />

      </section>

      <section className="dashboard-grid">

        <div className="content-card">

          <div className="card-header">

            <div>
              <h3>
                Executive Summary
              </h3>

              <p>
                Core business indicators
              </p>
            </div>

          </div>

          <div className="summary-list">

            <ReportRow
              label="Revenue"
              value={formatCurrency(
                totalRevenue
              )}
            />

            <ReportRow
              label="Users"
              value={formatNumber(
                activeUsers
              )}
            />

            <ReportRow
              label="Traffic"
              value={formatNumber(
                totalTraffic
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

          </div>

        </div>

        <div className="content-card">

          <div className="card-header">

            <div>
              <h3>
                Report Actions
              </h3>

              <p>
                Export your analysis
              </p>
            </div>

          </div>

          <div className="report-action-box">

            <button
              className="primary-button"
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
              className="secondary-button"
              onClick={
                exportCSV
              }
            >
              <Download
                size={17}
              />
              Export CSV
            </button>

          </div>

        </div>

      </section>

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

      <div className="dashboard-grid">

        <div className="content-card">

          <div className="card-header">

            <div>
              <h3>
                Top Regions
              </h3>

              <p>
                Ranked by revenue
              </p>
            </div>

          </div>

          <div className="ranking-list">

            {regionData.map(
              (region, index) => (
                <div
                  className="ranking-item"
                  key={
                    region.name
                  }
                >

                  <div className="rank-number">
                    {index + 1}
                  </div>

                  <div className="ranking-info">

                    <strong>
                      {
                        region.name
                      }
                    </strong>

                    <span>
                      {formatNumber(
                        region.users
                      )}{" "}
                      users
                    </span>

                  </div>

                  <strong>
                    {formatCurrency(
                      region.revenue
                    )}
                  </strong>

                </div>
              )
            )}

          </div>

        </div>

        <div className="content-card">

          <div className="card-header">

            <div>
              <h3>
                Top Categories
              </h3>

              <p>
                Ranked by revenue
              </p>
            </div>

          </div>

          <div className="ranking-list">

            {categoryData.map(
              (category, index) => (
                <div
                  className="ranking-item"
                  key={
                    category.name
                  }
                >

                  <div className="rank-number">
                    {index + 1}
                  </div>

                  <div className="ranking-info">

                    <strong>
                      {
                        category.name
                      }
                    </strong>

                    <span>
                      {formatNumber(
                        category.new_customers
                      )}{" "}
                      new customers
                    </span>

                  </div>

                  <strong>
                    {formatCurrency(
                      category.revenue
                    )}
                  </strong>

                </div>
              )
            )}

          </div>

        </div>

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
  const recent =
    [...filteredData]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 8);

  return (
    <div className="page-content">

      <section className="section-intro">

        <p className="eyebrow">
          DATA ACTIVITY
        </p>

        <h2>
          Recent Activity
        </h2>

        <p>
          Recent business performance
          records from the selected
          dataset.
        </p>

      </section>

      <div className="timeline">

        {recent.map(
          (item, index) => (
            <div
              className="timeline-item"
              key={`${item.date}-${item.region}-${index}`}
            >

              <div className="timeline-dot">
                <Activity
                  size={15}
                />
              </div>

              <div className="timeline-content">

                <div>

                  <strong>
                    {
                      item.category
                    }{" "}
                    performance
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

                <div className="timeline-value">
                  {formatCurrency(
                    item.revenue
                  )}
                </div>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({
  title,
  value,
  change,
  subtitle,
}) {
  const positive =
    change >= 0;

  return (
    <div className="stat-card">

      <div className="stat-top">

        <span>
          {title}
        </span>

        <div
          className={`trend-icon ${
            positive
              ? "positive"
              : "negative"
          }`}
        >
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

      </div>

      <strong>
        {value}
      </strong>

      <div className="stat-bottom">

        <span
          className={
            positive
              ? "change-positive"
              : "change-negative"
          }
        >
          {change >= 0
            ? "+"
            : ""}
          {change.toFixed(1)}%
        </span>

        <span>
          {subtitle}
        </span>

      </div>

    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div
      className={`content-card chart-card ${className}`}
    >

      <div className="card-header">

        <div>

          <h3>
            {title}
          </h3>

          <p>
            {subtitle}
          </p>

        </div>

      </div>

      {children}

    </div>
  );
}

function InsightsPanel({
  insights,
}) {
  return (
    <div className="content-card insights-card">

      <div className="card-header">

        <div>

          <div className="insight-title">

            <Lightbulb
              size={18}
            />

            <h3>
              Business Insights
            </h3>

          </div>

          <p>
            Automatically generated
            from the selected data.
          </p>

        </div>

      </div>

      <div className="insight-list">

        {insights.map(
          (insight, index) => (
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

function RecommendationsPanel({
  recommendations,
}) {
  return (
    <div className="content-card recommendations-card">

      <div className="card-header">

        <div>

          <div className="insight-title">

            <Lightbulb
              size={18}
            />

            <h3>
              Business Recommendations
            </h3>

          </div>

          <p>
            Suggested actions based
            on current performance.
          </p>

        </div>

      </div>

      <div className="recommendation-list">

        {recommendations.map(
          (item, index) => (
            <div
              className="recommendation-item"
              key={index}
            >

              <div className="recommendation-icon">
                {index + 1}
              </div>

              <p>
                {item}
              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
}

function PerformanceScoreCard({
  score,
  label,
}) {
  return (
    <div className="content-card score-card">

      <div className="card-header">

        <div>
          <h3>
            Business Health
          </h3>

          <p>
            Overall performance score
          </p>
        </div>

        <Gauge size={20} />

      </div>

      <div className="score-main">

        <div
          className="score-circle"
          style={{
            "--score":
              `${score * 3.6}deg`,
          }}
        >
          <strong>
            {score}
          </strong>

          <span>
            / 100
          </span>
        </div>

        <div>

          <strong className="score-label">
            {label}
          </strong>

          <p>
            Calculated using revenue
            growth, customer growth,
            conversion and engagement.
          </p>

        </div>

      </div>

    </div>
  );
}

function RevenueContribution({
  data,
}) {
  return (
    <div className="content-card">

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

      </div>

      <div className="contribution-list">

        {data.map((item) => (
          <div
            className="contribution-item"
            key={item.name}
          >

            <div className="contribution-top">

              <strong>
                {item.name}
              </strong>

              <span>
                {formatPercent(
                  item.contribution
                )}
              </span>

            </div>

            <div className="contribution-track">

              <div
                className="contribution-bar"
                style={{
                  width: `${item.contribution}%`,
                }}
              />

            </div>

            <small>
              {formatCurrency(
                item.revenue
              )}
            </small>

          </div>
        ))}

      </div>

    </div>
  );
}

function TopPerformerCard({
  regionData,
  categoryData,
}) {
  const topRegion =
    regionData[0];

  const topCategory =
    categoryData[0];

  return (
    <div className="content-card">

      <div className="card-header">

        <div>
          <h3>
            Performance Leaders
          </h3>

          <p>
            Strongest areas in the
            selected period
          </p>
        </div>

      </div>

      <div className="leader-card">

        <div className="leader-icon">
          <Globe size={19} />
        </div>

        <div>

          <span>
            Top Region
          </span>

          <strong>
            {topRegion?.name ||
              "N/A"}
          </strong>

          <small>
            {formatCurrency(
              topRegion?.revenue ||
                0
            )}
          </small>

        </div>

      </div>

      <div className="leader-card">

        <div className="leader-icon">
          <Package size={19} />
        </div>

        <div>

          <span>
            Top Category
          </span>

          <strong>
            {topCategory?.name ||
              "N/A"}
          </strong>

          <small>
            {formatCurrency(
              topCategory?.revenue ||
                0
            )}
          </small>

        </div>

      </div>

    </div>
  );
}

function ReportMetric({
  title,
  value,
}) {
  return (
    <div className="report-metric">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

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

export default App;