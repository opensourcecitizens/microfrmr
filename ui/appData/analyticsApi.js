async function fetchAnalyticsData(apiBaseUrl = '/mfarmapi') {
  const normalizedBaseUrl = (apiBaseUrl || '/mfarmapi').replace(/\/$/, '');

  const pieResponse = await fetch(`${normalizedBaseUrl}/analytics/product-categories`);
  if (!pieResponse.ok) {
    throw new Error('Failed to fetch analytics: product categories request failed');
  }
  const pieJson = await pieResponse.json();

  const ganttResponse = await fetch(`${normalizedBaseUrl}/analytics/farm-timeline`);
  if (!ganttResponse.ok) {
    throw new Error('Failed to fetch analytics: farm timeline request failed');
  }
  const ganttJson = await ganttResponse.json();

  return {
    pieData: pieJson.data || [],
    ganttData: ganttJson.data || []
  };
}

module.exports = { fetchAnalyticsData };
