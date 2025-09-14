/* eslint-disable no-console */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Import your models
import Farm from '../src/models/farm.js';
import Item from '../src/models/item.js';
import MarketPlaceItem from '../src/models/marketPlaceItem.js';
import Reminder from '../src/models/reminder.js';
import Analytics from '../src/models/analytics.js';
import User from '../src/models/user.js';

// Config model for app-wide configs (like imageMap, feature flags, etc.)
import Config from '../src/models/config.js';

const __dirname = path.resolve();

// ---------- Helpers ----------
function loadJSON(fileName) {
  const filePath = path.join(__dirname, 'FrontEndappData', fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Missing file: ${fileName}`);
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.warn(`⚠️ Failed to parse JSON ${fileName}:`, err.message);
    return {};
  }
}

async function loadJS(fileName) {
  const dir = path.join(__dirname, 'FrontEndappData');
  const base = path.basename(fileName, '.js');
  const cjsPath = path.join(dir, `${base}.cjs`);
  const jsPath = path.join(dir, `${base}.js`);

  // 1) Prefer .cjs if present (legacy CommonJS)
  if (fs.existsSync(cjsPath)) {
    try {
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      return require(cjsPath);
    } catch (err) {
      console.warn(`⚠️ Failed to require .cjs (${cjsPath}):`, err.message);
      // fallthrough to other attempts
    }
  }

  // 2) If .js exists, try dynamic ESM import first
  if (fs.existsSync(jsPath)) {
    const fileUrl = pathToFileURL(jsPath).href;
    try {
      const imported = await import(fileUrl);
      return imported.default || imported;
    } catch (esmErr) {
      // 3) If ESM import fails, try requiring it (in case it's actually CommonJS but named .js)
      try {
        const { createRequire } = await import('module');
        const require = createRequire(import.meta.url);
        return require(jsPath);
      } catch (cjsErr) {
        console.warn('⚠️ Failed to load JS file as ESM and as CommonJS:', { esmErr: esmErr.message, cjsErr: cjsErr.message });
        return {};
      }
    }
  }

  console.warn(`⚠️ Missing JS file: ${fileName}`);
  return {};
}

// ---------- Seeder ----------
async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/farmers_choice';
    await mongoose.connect(mongoUri);
    console.log(`✅ Connected to MongoDB: ${mongoUri}`);

    // Clear old data
    await Promise.all([
      Farm.deleteMany({}),
      Item.deleteMany({}),
      MarketPlaceItem.deleteMany({}),
      Reminder.deleteMany({}),
      Analytics.deleteMany({}),
      User.deleteMany({}),
      Config.deleteMany({})
    ]);
    console.log('🧹 Cleared old collections');

    // Load data
    const dashboardData = loadJSON('dashboardData.json');
    const detailsData = loadJSON('detailsScreenData.json');
    const modalData = loadJSON('modalData.json');
    const imageMap = await loadJS('imageMap.js');

    // Insert farms
    if (dashboardData.farms?.length) {
      await Farm.insertMany(dashboardData.farms);
      console.log(`🌱 Seeded ${dashboardData.farms.length} farms`);
    }

    // Insert items
    if (detailsData.items?.length) {
      await Item.insertMany(detailsData.items);
      console.log(`🌱 Seeded ${detailsData.items.length} items`);
    }

    // Insert modalData mappings
    if (modalData.users?.length) {
      await User.insertMany(modalData.users);
      console.log(`👤 Seeded ${modalData.users.length} users`);
    }
    if (modalData.reminders?.length) {
      await Reminder.insertMany(modalData.reminders);
      console.log(`⏰ Seeded ${modalData.reminders.length} reminders`);
    }
    if (modalData.marketplace?.length) {
      await MarketPlaceItem.insertMany(modalData.marketplace);
      console.log(`🛒 Seeded ${modalData.marketplace.length} marketplace items`);
    }
    if (modalData.analytics?.length) {
      await Analytics.insertMany(modalData.analytics);
      console.log(`📊 Seeded ${modalData.analytics.length} analytics records`);
    }

    // Store imageMap & app configs
    if (imageMap && Object.keys(imageMap).length > 0) {
      await Config.create({
        key: 'imageMap',
        value: imageMap,
        createdAt: new Date()
      });
      console.log('🖼️ Seeded imageMap config into Config collection');
    } else {
      console.log('ℹ️ imageMap empty or missing; skipping Config seed');
    }

    console.log('🎉 All seeding completed successfully');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
