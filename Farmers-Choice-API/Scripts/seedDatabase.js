/* eslint-disable no-console */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import your models
const Farm = require('../src/models/farm');
const Item = require('../src/models/item');
const MarketPlaceItem = require('../src/models/marketPlaceItem');
const Reminder = require('../src/models/reminder');

const CONFIG_COLLECTION = 'Config'; // for modalData storage

// Utility to load JSON files
const loadJSON = (filename) =>
  JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'Farmers-Choice-FrontEnd', 'FrontEndappData', filename),
      'utf8'
    )
  );

// Use Docker MONGO_URI or fallback for local dev
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/farmers_choice';

async function connect() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to MongoDB:', MONGO_URI);
}

async function clearCollections() {
  const toClear = [Farm, Item, MarketPlaceItem, Reminder];
  for (const model of toClear) {
    try {
      await model.deleteMany({});
      console.log(`🧹 Cleared ${model.modelName} collection`);
    } catch (err) {
      console.warn(`⚠️ Could not clear ${model.modelName}:`, err.message);
    }
  }

  try {
    await mongoose.connection.db.collection(CONFIG_COLLECTION).deleteMany({});
    console.log(`🧹 Cleared ${CONFIG_COLLECTION} collection`);
  } catch (err) {
    // ignore if doesn't exist
  }
}

// Mapping helpers
function mapCropOrAnimal(c) {
  return {
    name: c.name,
    category: 'crop_or_animal',
    description: '',
    meta: { image: c.image || null },
    frontendId: c.id,
  };
}

function mapCard(card) {
  return {
    name: card.title,
    category: 'card',
    description: Array.isArray(card.details) ? card.details.join(' | ') : card.details,
    meta: { status: card.status || null, image: card.image || null },
    frontendId: card.id,
  };
}

function mapFarm(post) {
  return {
    name: post.farmName,
    location: post.farmAddress,
    description: post.description || post.farmDetails || '',
    profileImage: post.profileImage || null,
    status: post.status || null,
    images: post.images || [],
    crops: [],
    animals: [],
    frontendId: post.id,
  };
}

async function seed() {
  try {
    await connect();

    // Load frontend JSON files
    const dashboard = loadJSON('dashboardData.json');
    const details = loadJSON('detailsScreenData.json');
    const modal = loadJSON('modalData.json');

    // Reset collections
    await clearCollections();

    // 1) Seed cropsAndAnimals → Items
    if (Array.isArray(dashboard.cropsAndAnimals)) {
      const docs = dashboard.cropsAndAnimals.map(mapCropOrAnimal);
      const inserted = await Item.insertMany(docs);
      console.log(`🌱 Inserted ${inserted.length} Item(s) from cropsAndAnimals`);
    }

    // 2) Seed cards → Items
    if (Array.isArray(dashboard.cards)) {
      const docs = dashboard.cards.map(mapCard);
      const inserted = await Item.insertMany(docs);
      console.log(`🃏 Inserted ${inserted.length} Item(s) from cards`);
    }

    // 3) Seed posts → Farms
    if (Array.isArray(details.posts)) {
      const docs = details.posts.map(mapFarm);
      const inserted = await Farm.insertMany(docs);
      console.log(`🌾 Inserted ${inserted.length} Farm(s) from detailsScreenData`);
    }

    // 4) Seed modalData → Config collection
    if (modal && typeof modal === 'object') {
      const configs = Object.keys(modal).map((key) => ({
        key,
        data: modal[key],
        createdAt: new Date(),
      }));
      await mongoose.connection.db.collection(CONFIG_COLLECTION).insertMany(configs);
      console.log(`⚙️ Inserted ${configs.length} Config template(s) from modalData`);
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
