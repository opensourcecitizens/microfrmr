const { expect } = require('chai');

const { fetchAnalyticsData } = require('../appData/analyticsApi');

describe('analyticsApi', () => {
  afterEach(() => {
    delete global.fetch;
  });

  it('fetches category and timeline analytics from the configured API base URL', async () => {
    const requestedUrls = [];
    global.fetch = async (url) => {
      requestedUrls.push(url);

      if (url.endsWith('/analytics/product-categories')) {
        return {
          ok: true,
          json: async () => ({ data: [{ name: 'Vegetables', value: 3, quantity: 12, avgPrice: 2.5 }] })
        };
      }

      if (url.endsWith('/analytics/farm-timeline')) {
        return {
          ok: true,
          json: async () => ({ data: [{ name: 'Green Acres', location: 'Nairobi', tasks: [] }] })
        };
      }

      throw new Error(`Unexpected URL: ${url}`);
    };

    const result = await fetchAnalyticsData('http://localhost:8888/mfarmapi');

    expect(requestedUrls).to.deep.equal([
      'http://localhost:8888/mfarmapi/analytics/product-categories',
      'http://localhost:8888/mfarmapi/analytics/farm-timeline'
    ]);
    expect(result.pieData).to.deep.equal([{ name: 'Vegetables', value: 3, quantity: 12, avgPrice: 2.5 }]);
    expect(result.ganttData).to.deep.equal([{ name: 'Green Acres', location: 'Nairobi', tasks: [] }]);
  });

  it('surfaces a helpful error when the analytics request fails', async () => {
    global.fetch = async () => ({ ok: false, status: 500 });

    try {
      await fetchAnalyticsData('http://localhost:8888/mfarmapi');
      throw new Error('Expected request to fail');
    } catch (error) {
      expect(error.message).to.include('Failed to fetch analytics');
    }
  });
});
