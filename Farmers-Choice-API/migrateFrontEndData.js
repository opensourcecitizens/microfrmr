const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Flexible schemas for each data type
const dashboardSchema = new mongoose.Schema({}, { strict: false });
const detailsSchema = new mongoose.Schema({}, { strict: false });
const imageMapSchema = new mongoose.Schema({}, { strict: false });
const modalSchema = new mongoose.Schema({}, { strict: false });

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
const Details = mongoose.model('Details', detailsSchema);
const ImageMap = mongoose.model('ImageMap', imageMapSchema);
const Modal = mongoose.model('Modal', modalSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://db:27017/farmersdb';

// Helper to read and insert data
async function migrateFile(model, fileName) {
  const filePath = path.join(__dirname, '../Farmers-Choice-FrontEnd/FrontEndappData', fileName);
  let data;
  if (fileName.endsWith('.js')) {
    data = require(filePath);
  } else {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  await model.deleteMany({});
  await model.create(data);
  console.log(`${fileName} migrated!`);
}

async function migrate() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  await migrateFile(Dashboard, 'dashboardData.json');
  await migrateFile(Details, 'detailsScreenData.json');
  await migrateFile(ImageMap, 'imageMap.js');
  await migrateFile(Modal, 'modalData.json');

  await mongoose.disconnect();
  console.log('All data migrated!');
}

migrate().catch(console.error);