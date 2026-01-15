// GISDashboard.js
import React, { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import MosquitoDetection from "./MosquitoDetection";
import ThemeToggle from "./ThemeToggle";
import ReportGeneration from "./ReportGeneration";
import MosquitoMap from "./Mosquito_Map";
import 'leaflet/dist/leaflet.css';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./GISDashboard.css";

const RegionalStats = ({ data }) => {
  const regionStats = {};
  data.forEach(item => {
    const region = item.RegionName || "Unknown";
    if (!regionStats[region]) regionStats[region] = { total: 0, count: 0 };
    regionStats[region].total += item.Value || 0;
    regionStats[region].count += 1;
  });
  const tableData = Object.entries(regionStats).map(([region, { total, count }]) => ({
    region,
    rate: (total / count).toFixed(2)
  })).sort((a, b) => b.rate - a.rate).slice(0, 10);
  return (
    <div className="chart-section-regional-chart">
      <h2 className="regional-title">Top 10 Regions by Rate (N/100000)</h2>
      <table>
        <thead><tr><th>Region</th><th>Rate</th></tr></thead>
        <tbody>{tableData.map((row, i) => (
          <tr key={i}><td>{row.region}</td><td>{row.rate}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
};

const MonthlyDetectionTrends = ({ data }) => (
  <div className="chart-section-monthly-chart">
    <h2>Average Value per Year (Line Chart)</h2>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const LarvaeCountByMonth = ({ data }) => (
  <div className="chart-section-count-chart">
    <h2>Average Value per Year (Bar Chart)</h2>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const CategoryDistribution = ({ data }) => {
  const categoryCounts = data.reduce((acc, item) => {
    const cat = item.Category || "Unknown";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#8884d8', '#8dd1e1', '#82ca9d', '#ffc658', '#ff8042'];
  return (
    <div className="chart-section-count-chart">
      <h2>Category Distribution</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} label>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const TopRegionsByValue = ({ data }) => {
  const regionStats = {};
  data.forEach(item => {
    const region = item.RegionName || "Unknown";
    if (!regionStats[region]) regionStats[region] = { total: 0, count: 0 };
    regionStats[region].total += item.Value || 0;
    regionStats[region].count += 1;
  });
  const topRegions = Object.entries(regionStats).map(([region, { total, count }]) => ({
    region,
    avgValue: total / count
  })).sort((a, b) => b.avgValue - a.avgValue).slice(0, 10);
  return (
    <div className="chart-section-count-chart">
      <h2>Top 10 Regions by Avg Value</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={topRegions}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgValue" fill="#ff8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const HealthTopicStackedChart = ({ data }) => {
  const topicStats = {};
  data.forEach(item => {
    const topic = item.HealthTopic || "Unknown";
    const year = item.Time?.toString() || "Unknown";
    const key = `${topic}-${year}`;
    if (!topicStats[key]) topicStats[key] = { topic, year, valueSum: 0, count: 0 };
    topicStats[key].valueSum += parseFloat(item.Value) || 0;
    topicStats[key].count += 1;
  });

  const grouped = {};
  Object.values(topicStats).forEach(({ topic, year, valueSum, count }) => {
    if (!grouped[year]) grouped[year] = { year };
    grouped[year][topic] = (valueSum / count).toFixed(2);
  });

  const chartData = Object.values(grouped);

  const uniqueTopics = [...new Set(data.map(d => d.HealthTopic))].filter(Boolean);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

  return (
    <div className="chart-section-count-chart">
      <h2>Avg Value by HealthTopic per Year (Stacked Bar)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {uniqueTopics.map((topic, idx) => (
            <Bar
              key={topic}
              dataKey={topic}
              stackId="a"
              fill={colors[idx % colors.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const Charts = ({ data, rawData }) => (
  <div>
    <RegionalStats data={rawData} />

    <div className="chart-section-charts-row">
      <MonthlyDetectionTrends data={data} />
      <LarvaeCountByMonth data={data} />
    </div>

    <div className="chart-section-charts-row">
      <TopRegionsByValue data={rawData} />
      <CategoryDistribution data={rawData} />
    </div>
v 
    <div className="chart-section-charts-row">
      <HealthTopicStackedChart data={rawData} />
    </div>
  </div>
);

const GISDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [showDetectionPage, setShowDetectionPage] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [detectionData, setDetectionData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState({
    countries: [], years: [], healthtopics: [], populations: [],
    units: [], distributions: [], categories: []
  });
  const [selectedFilters, setSelectedFilters] = useState({
    countries: '', years: '', healthtopics: '', populations: '',
    units: '', distributions: '', categories: ''
  });
  const [rawMosquitoData, setRawMosquitoData] = useState([]);
  const { generateReport } = ReportGeneration();

  const handleGenerateReport = () => generateReport(messages, detectionData);

  const fetchFilterData = async (key, fullUrl) => {
    try {
      const response = await fetch(fullUrl);
      const data = await response.json();
      setFilters(prev => ({ ...prev, [key]: data }));
    } catch (error) {
      console.error(`Failed to fetch ${key}:`, error);
    }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/mosquito");
        const data = await response.json();
        setRawMosquitoData(data);
      } catch (err) {
        console.error("Error fetching mosquito data:", err);
      }
    };
    fetchChartData();
  }, []);

  const filteredData = rawMosquitoData.filter(item =>
    Object.entries(selectedFilters).every(([key, val]) => !val || (
      key === 'countries' ? item.RegionName === val :
      key === 'years' ? item.Time?.toString() === val :
      key === 'healthtopics' ? item.HealthTopic === val :
      key === 'populations' ? item.Population === val :
      key === 'units' ? item.Unit === val :
      key === 'distributions' ? item.Distribution === val :
      key === 'categories' ? item.Category === val : true)));

  const yearlyGrouped = {};
  filteredData.forEach(item => {
    const year = item.Time?.toString() || "Unknown";
    const value = parseFloat(item.Value) || 0;
    if (!yearlyGrouped[year]) yearlyGrouped[year] = { name: year, valueSum: 0, count: 0 };
    yearlyGrouped[year].valueSum += value;
    yearlyGrouped[year].count += 1;
  });
  const filteredChartData = Object.entries(yearlyGrouped).map(([year, { valueSum, count }]) => ({
    name: year, value: valueSum / count
  })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={`dashboard-container ${theme}`}>
      <header className="dashboard-header">
        <h1 className="dashboard-title">Mosquito Surveillance System</h1>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>
      {showDetectionPage ? (
        <MosquitoDetection setShowDetectionPage={setShowDetectionPage} setDetectionData={setDetectionData} />
      ) : (
        <main className="dashboard-content">
          {showMap ? (
            <div className="dashboard-layout">
              <div className="filter-sidebar">
                {["countries", "years", "healthtopics", "populations", "units", "distributions", "categories"].map(key => (
                  <div key={key} className="filter-group">
                    <button
                      className="filter-btn"
                      onClick={() => fetchFilterData(key, `http://localhost:8000/api/mosquito/${key}`)}
                    >{key.charAt(0).toUpperCase() + key.slice(1)}</button>
                    {filters[key].length > 0 && (
                      <select
                        value={selectedFilters[key]}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, [key]: e.target.value }))}>
                        <option value="">All</option>
                        {filters[key].map((val, i) => (
                          <option key={i} value={val}>{val}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
              <div className="main-dashboard-content">
                <MosquitoMap />
                <Charts data={filteredChartData} rawData={filteredData} />
              </div>
            </div>
          ) : (
            <ChatBox
              messages={messages}
              setMessages={setMessages}
              setShowDetectionPage={setShowDetectionPage}
              generateReport={handleGenerateReport}
              setShowMap={setShowMap}
            />
          )}
        </main>
      )}
    </div>
  );
};

export default GISDashboard;
