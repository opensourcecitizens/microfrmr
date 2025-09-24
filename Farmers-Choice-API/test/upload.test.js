const request = require('supertest');
const app = require('../src/app');
const path = require('path');
const fs = require('fs');

describe('Upload endpoint', () => {
  test('POST /api/uploads and GET file', async () => {
    // create a small temp file
    const tmp = path.join(__dirname, 'tmp-test-file.txt');
    fs.writeFileSync(tmp, 'hello world');

    const res = await request(app).post('/api/uploads').attach('file', tmp);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('url');

    const fileUrl = res.body.url; // e.g. /uploads/<filename>
    const getRes = await request(app).get(fileUrl);
    expect(getRes.status).toBe(200);
    expect(getRes.text).toBe('hello world');

    fs.unlinkSync(tmp);
  }, 20000);
});
