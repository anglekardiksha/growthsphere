# GrowthSphere — Business Growth Analytics Dashboard

GrowthSphere is an interactive business analytics dashboard designed to analyze revenue, customer activity, traffic, conversions, regional performance, and category-level growth.

The project transforms raw business data into actionable insights through interactive visualizations, KPI tracking, filtering, performance scoring, and automated business recommendations.

## Project Overview

Businesses generate large amounts of operational data, but raw data alone does not provide an immediate understanding of business performance.

GrowthSphere provides a centralized analytics dashboard where users can:

* Monitor key business KPIs
* Analyze revenue and growth trends
* Compare regional performance
* Compare product/category performance
* Analyze customer acquisition and conversions
* Filter data by date range, region, and category
* Identify high-performing and underperforming areas
* View revenue contribution
* Evaluate overall business health
* Generate business recommendations
* Export filtered data
* Download an executive business report

## Key Features

### Executive Dashboard

The dashboard provides a high-level overview of business performance through:

* Revenue
* Users
* Traffic
* New Customers
* Conversions
* Conversion Rate
* Bounce Rate
* Engagement Rate

### Growth Analytics

Interactive charts allow users to analyze:

* Revenue trends
* User activity
* Customer acquisition
* Conversion trends
* Traffic trends
* Regional revenue
* Category performance

### Customer Analytics

The customer analytics section provides detailed records containing:

* Date
* Region
* Category
* Users
* New Customers
* Conversions
* Conversion Rate

A search feature allows users to quickly locate relevant records.

### Advanced Filtering

Users can dynamically filter the dashboard using:

* 7 Days
* 30 Days
* 90 Days
* Region
* Category

All major dashboard calculations and visualizations update according to the selected filters.

### Business Health Score

GrowthSphere calculates a synthetic business performance score based on:

* Revenue growth
* Customer growth
* Conversion performance
* Engagement

The score provides a simplified executive-level indicator of overall business health.

> Note: The Business Health Score is a project-specific analytical metric created for this dashboard and is not an industry-standard business KPI.

### Revenue Contribution

The dashboard calculates the percentage contribution of each region to total revenue, making it easier to identify the largest revenue-generating areas.

### Business Insights

GrowthSphere automatically identifies:

* Strongest region
* Strongest category
* Highest-converting region
* Lowest-bounce region

### Business Recommendations

Based on current performance, the dashboard generates recommendations related to:

* Conversion optimization
* User engagement
* Regional performance
* Category performance
* Customer acquisition

### Reports & Export

Users can:

* Export filtered data as CSV
* Download a business performance report
* View an executive summary
* Review key findings
* Review recommended business actions

## Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Data Visualization

* Recharts

### Icons & UI

* Lucide React

### Data

* CSV-based business dataset
* JavaScript data processing

## Dataset

The project uses a structured business dataset containing:

* Date
* Region
* Category
* Revenue
* Users
* New Customers
* Conversions
* Traffic
* Bounce Rate

The dataset is designed for demonstration and portfolio analytics purposes.

## Analytics Methodology

GrowthSphere processes the raw CSV data and calculates:

### Revenue

Total revenue across the selected records.

### Conversion Rate

Conversion rate is calculated as:

Conversion Rate = Conversions / Traffic × 100

### Engagement Rate

A simplified engagement indicator is calculated as:

Engagement Rate = 100 − Bounce Rate

### Revenue Contribution

Revenue contribution is calculated as:

Revenue Contribution = Region Revenue / Total Revenue × 100

### Performance Score

The business health score combines multiple performance indicators into a single dashboard-level score.

The score is intended to demonstrate analytical thinking and KPI modeling rather than represent a standardized business metric.

## Project Structure

```text
growthsphere/
│
├── public/
│
├── src/
│   ├── data/
│   │   └── growthData.csv
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/anglekardiksha/growthsphere.git
```

Navigate into the project:

```bash
cd growthsphere
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Dashboard Workflow

```text
Raw CSV Data
      ↓
Data Parsing
      ↓
Filtering
      ↓
KPI Calculation
      ↓
Data Aggregation
      ↓
Interactive Visualizations
      ↓
Performance Analysis
      ↓
Business Insights
      ↓
Recommendations
      ↓
Executive Report
```

## Future Improvements

Possible future versions could include:

* Database integration
* Real-time business data
* Authentication
* Role-based dashboards
* Power BI/Tableau integration
* Machine-learning based forecasting
* Revenue forecasting
* Customer segmentation
* Anomaly detection
* Cloud deployment
* REST API integration

## Author

**Diksha Anglekar**

B.Tech Data Science
Usha Mittal Institute of Technology (UMIT)
SNDT Women's University

## Project Type

Academic / Portfolio Data Analytics Project
