import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { CircularProgress, Card, CardContent, CardHeader, Grid, Container } from '@mui/material';
import analyticsApi from '../appData/analyticsApi';

/**
 * ProductAnalyticsDashboard
 * Displays analytics with pie chart and Gantt timeline
 * Uses MUI X Charts and Recharts for visualization
 */
export function ProductAnalyticsDashboard({ apiBaseUrl = '/mfarmapi' }) {
  const [pieData, setPieData] = useState([]);
  const [ganttData, setGanttData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const { pieData: nextPieData, ganttData: nextGanttData } = await analyticsApi.fetchAnalyticsData(apiBaseUrl);
        setPieData(nextPieData);
        setGanttData(nextGanttData);
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [apiBaseUrl]);

  if (loading) {
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card style={{ marginTop: '20px' }}>
          <CardContent style={{ color: 'red' }}>
            Error loading analytics: {error}
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Grid container spacing={3}>
        {/* Pie Chart - Product Categories */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Products by Category" subheader="Distribution across categories" />
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} items`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '20px', fontSize: '14px' }}>
                <h4>Category Statistics:</h4>
                {pieData.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        backgroundColor: COLORS[idx % COLORS.length],
                        marginRight: '8px',
                        borderRadius: '2px'
                      }}
                    />
                    <strong>{item.name}:</strong> {item.value} listings,
                    Qty: {item.quantity}, Avg Price: ${item.avgPrice}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart - Products Quantity by Category */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Product Quantity by Category" subheader="Total quantities in stock" />
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={pieData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Farm Production Timeline */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Farm Production Timeline" subheader="Gantt view of products per farm" />
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Farm</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Quantity</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Duration</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ganttData.map((farm, farmIdx) =>
                      farm.tasks && farm.tasks.length > 0 ? (
                        farm.tasks.map((task, taskIdx) => (
                          <tr
                            key={`${farmIdx}-${taskIdx}`}
                            style={{
                              backgroundColor: taskIdx % 2 === 0 ? '#ffffff' : '#f9f9f9',
                              borderBottom: '1px solid #eee'
                            }}
                          >
                            <td style={{ padding: '10px' }}>
                              {taskIdx === 0 ? farm.name : ''}
                            </td>
                            <td style={{ padding: '10px' }}>
                              {taskIdx === 0 ? farm.location : ''}
                            </td>
                            <td style={{ padding: '10px' }}>
                              <strong>{task.name}</strong>
                            </td>
                            <td style={{ padding: '10px' }}>{task.category}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              {task.quantity} {task.unit}
                            </td>
                            <td style={{ padding: '10px', fontSize: '12px' }}>
                              {new Date(task.startDate).toLocaleDateString()} to{' '}
                              {new Date(task.endDate).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '10px' }}>
                              <span
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  backgroundColor:
                                    task.status === 'available'
                                      ? '#4caf50'
                                      : task.status === 'sold'
                                      ? '#ff9800'
                                      : '#f44336',
                                  color: 'white'
                                }}
                              >
                                {task.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key={farmIdx} style={{ borderBottom: '1px solid #eee' }}>
                          <td colSpan="7" style={{ padding: '10px', textAlign: 'center', color: '#999' }}>
                            No products for {farm.name}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductAnalyticsDashboard;
