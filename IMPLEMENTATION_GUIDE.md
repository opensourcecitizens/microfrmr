# MicroFrmr API Enhancement Implementation

This document outlines the implementation of media uploads (IPFS), enhanced user profiles, listings with analytics, and analytics dashboards for the MicroFrmr platform.

## Overview

The implementation adds the following major features:
1. **Media Upload & IPFS Integration** - Upload images/videos with CID storage
2. **Enhanced User Profiles** - Bio, images, ratings, social links
3. **Enhanced Listings** - Category, quantity, pricing, location, images
4. **Analytics** - Product category pie charts and farm timeline Gantt charts
5. **Frontend Components** - React components for all features using MUI X Charts

## Architecture

### Backend Structure

```
remote_services/api/
├── app.js                           # Express routes and handlers
├── db_persists.js                   # MongoDB operations
├── services/
│   └── mediaService.js              # IPFS upload logic
├── uploads/                         # Temporary file storage
└── package.json                     # Dependencies
```

### Database Collections

1. **users** - Enhanced with bio, profileImageCid, verified, ratings, socialLinks
2. **listings** - Enhanced with category, quantity, unit, pricePerUnit, currency, location, images, videos, availability, expiresAt
3. **media_files** - New collection storing IPFS metadata
4. **farms** - Existing collection (referenced by listings)
5. **products** - Existing collection
6. **connections** - Existing collection
7. **comments** - Existing collection

### Frontend Structure

```
ui/components/
├── ProductAnalyticsDashboard.js     # Charts and analytics
├── MediaUploadComponent.js          # File upload to IPFS
├── EnhancedListingFormComponent.js  # Create/update listings
└── EnhancedUserProfileComponent.js  # User profile management
```

## API Endpoints

### Media Upload Endpoints

**POST** `/mfarmapi/media/upload/:parentType/:parentId`
- Upload a file to IPFS
- Parameters:
  - `parentType`: 'user', 'farm', 'listing', or 'product'
  - `parentId`: ID of the parent entity
- Body: Multipart form with 'file' and 'userId'
- Returns: `{success, data: {ipfsCID, publicUrl, size, fileName}}`

**GET** `/mfarmapi/media/:parentType/:parentId`
- Get all media for a parent entity
- Returns: `{success, data: [...]}`

### Enhanced User Profile Endpoints

**GET** `/mfarmapi/enhancedprofile/:userId`
- Get enhanced user profile

**PUT** `/mfarmapi/enhancedprofile/`
- Update user profile
- Body: User object with all fields

### Enhanced Listing Endpoints

**GET** `/mfarmapi/enhancedlisting/:listingId`
- Get enhanced listing details

**PUT** `/mfarmapi/enhancedlisting/`
- Update enhanced listing
- Body: Listing object with category, quantity, pricing fields

**GET** `/mfarmapi/listings/category/:category`
- Get listings by category
- Query params: `availability` (default: 'available')

### Analytics Endpoints

**GET** `/mfarmapi/analytics/product-categories`
- Returns pie chart data
- Response: `{success, type: 'pie', data: [{name, value, quantity, avgPrice}, ...]}`

**GET** `/mfarmapi/analytics/farm-timeline`
- Returns Gantt chart data for farm production timelines
- Response: `{success, type: 'gantt', data: [{name, location, tasks: [...]}, ...]}`

**GET** `/mfarmapi/analytics/farm/:farmId/stats`
- Get stats for a specific farm's listings

## Setup & Configuration

### Prerequisites

1. **Node.js** 14+ and npm
2. **MongoDB** running and accessible
3. **IPFS** node or proxy service

### Installation

1. **Update dependencies:**
```bash
cd remote_services/api
npm install
```

This installs:
- `multer` - File upload middleware
- `form-data` - FormData for IPFS requests

2. **Set up IPFS** (Docker):
```bash
docker run -d \
  --name ipfs \
  -p 5001:5001 \
  -p 4001:4001 \
  -p 8080:8080 \
  -v ipfs-data:/data/ipfs \
  ipfs/go-ipfs:latest
```

3. **Run the API:**
```bash
npm start -- --mongo_server mongodb://localhost:27017 --ipfs_endpoint http://localhost:5001 --port 8099
```

### Environment Variables / Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `--mongo_server` | mongodb://localhost:27017 | MongoDB connection string |
| `--ipfs_endpoint` | http://ipfs:5001 | IPFS API endpoint |
| `--port` | 8099 | API server port |
| `--corsport` | 8888 | CORS proxy port |
| `--healthport` | 8899 | Health check port |

## Frontend Components

### 1. ProductAnalyticsDashboard

Displays analytics with pie chart and Gantt timeline.

**Import:**
```javascript
import ProductAnalyticsDashboard from './components/ProductAnalyticsDashboard';
```

**Usage:**
```javascript
<ProductAnalyticsDashboard 
  apiBaseUrl="/mfarmapi"
/>
```

**Features:**
- Pie chart: Product distribution by category
- Bar chart: Quantity by category
- Table: Farm production timeline with status badges

### 2. MediaUploadComponent

Handles file uploads to IPFS with progress tracking.

**Import:**
```javascript
import MediaUploadComponent from './components/MediaUploadComponent';
```

**Usage:**
```javascript
<MediaUploadComponent
  parentType="listing"     // 'user', 'farm', 'listing', 'product'
  parentId={listingId}
  userId={currentUserId}
  onUploadSuccess={(data) => {
    console.log('CID:', data.ipfsCID);
  }}
  apiBaseUrl="/mfarmapi"
  maxFileSize={50 * 1024 * 1024}  // 50MB
/>
```

**Features:**
- Drag & drop or click to upload
- Progress bar with percentage
- File type and size validation
- Error handling
- Success feedback with CID

### 3. EnhancedListingFormComponent

Form for creating/updating listings with categories and pricing.

**Import:**
```javascript
import EnhancedListingFormComponent from './components/EnhancedListingFormComponent';
```

**Usage:**
```javascript
<EnhancedListingFormComponent
  listingId={listingId}      // null for create, id for update
  farmId={farmId}
  onSave={(data) => {
    console.log('Listing saved:', data);
  }}
  apiBaseUrl="/mfarmapi"
/>
```

**Features:**
- Category dropdown (Vegetables, Fruits, etc.)
- Quantity and unit selection
- Price per unit with currency
- Location address and geo ID
- Availability status (available, sold, expired)
- Expiration date
- Cost calculation display
- Auto-loads existing data for updates

### 4. EnhancedUserProfileComponent

Form for updating farmer profiles.

**Import:**
```javascript
import EnhancedUserProfileComponent from './components/EnhancedUserProfileComponent';
```

**Usage:**
```javascript
<EnhancedUserProfileComponent
  userId={userId}
  onSave={(data) => {
    console.log('Profile saved:', data);
  }}
  apiBaseUrl="/mfarmapi"
/>
```

**Features:**
- Profile picture display (from IPFS CID)
- Bio/description textarea
- Rating display
- Social media links (Instagram, Facebook, Twitter, Website)
- Verified badge display
- Farm count tracking

## Usage Workflows

### Workflow 1: Create a Listing with Images

1. **Create the listing:**
```javascript
const listing = await fetch('/mfarmapi/enhancedlisting/', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    title: 'Fresh Tomatoes',
    farmId: 'farm123',
    category: 'Vegetables',
    quantity: 100,
    unit: 'kg',
    pricePerUnit: 2.50,
    currency: 'USD',
    availability: 'available'
  })
});
const listingData = await listing.json();
const listingId = listingData.data.id;
```

2. **Upload images:**
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('userId', userId);

const upload = await fetch(`/mfarmapi/media/upload/listing/${listingId}`, {
  method: 'POST',
  body: formData
});
const uploadData = await upload.json();
console.log('CID:', uploadData.data.ipfsCID);
```

3. **Update listing with image CID:**
```javascript
await fetch('/mfarmapi/enhancedlisting/', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    id: listingId,
    images: [uploadData.data.ipfsCID],
    // ... other fields
  })
});
```

### Workflow 2: View Analytics

1. **Get pie chart data:**
```javascript
const pie = await fetch('/mfarmapi/analytics/product-categories');
const pieData = await pie.json();
// pieData.data = [{name: 'Vegetables', value: 45, quantity: 1000, avgPrice: 2.50}, ...]
```

2. **Get timeline data:**
```javascript
const timeline = await fetch('/mfarmapi/analytics/farm-timeline');
const timelineData = await timeline.json();
// timelineData.data = [{name: 'Farm A', location: 'Region X', tasks: [...]}, ...]
```

3. **Display in React:**
```javascript
<ProductAnalyticsDashboard apiBaseUrl="/mfarmapi" />
```

### Workflow 3: Update Farmer Profile

1. **Load and update profile:**
```javascript
<EnhancedUserProfileComponent
  userId={userId}
  onSave={(data) => {
    console.log('Profile updated:', data);
  }}
/>
```

2. **Upload profile picture:**
```javascript
<MediaUploadComponent
  parentType="user"
  parentId={userId}
  userId={userId}
  onUploadSuccess={(data) => {
    // Update profile with profileImageCid
    updateUserProfile({
      profileImageCid: data.ipfsCID
    });
  }}
/>
```

## Data Models

### Enhanced User Profile

```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  admin: boolean,
  bio: string,
  profileImageCid: string | null,
  profileImageUrl: string | null,
  verified: boolean,
  farmCount: number,
  ratings: {
    avg: number,      // 0-5
    count: number
  },
  socialLinks: {
    instagram: string,
    facebook: string,
    twitter: string,
    website: string
  },
  update_timestamp: timestamp,
  created_timestamp: timestamp
}
```

### Enhanced Listing

```javascript
{
  id: string,
  title: string,
  description: string,
  listingAgent: string,
  products: string[],
  farmId: string,
  category: string,
  quantity: number,
  unit: string,
  pricePerUnit: number,
  currency: string,
  images: string[],        // IPFS CIDs
  videos: string[],        // IPFS CIDs
  availability: 'available' | 'sold' | 'expired',
  expiresAt: timestamp,
  location: {
    geoId: string,
    address: string,
    coordinates: [latitude, longitude] | null
  },
  update_timestamp: timestamp,
  updated_by: string,
  created_timestamp: timestamp,
  authorized_to: string[]
}
```

### Media File

```javascript
{
  id: string,
  parentId: string,
  parentType: 'user' | 'farm' | 'listing' | 'product',
  ipfsCID: string,
  fileName: string,
  mimeType: string,
  fileSize: number,
  uploadedAt: timestamp,
  uploadedBy: string,
  publicUrl: string,
  pinned: boolean
}
```

## Performance Optimization

### Database Indexes

Create these indexes for optimal query performance:

```javascript
// For category and availability filtering
db.listings.createIndex({ category: 1, availability: 1, farmId: 1 });

// For media queries
db.media_files.createIndex({ parentType: 1, parentId: 1, uploadedAt: -1 });

// For analytics aggregations
db.listings.createIndex({ farmId: 1, availability: 1 });
db.listings.createIndex({ category: 1, created_timestamp: -1 });
```

### Pagination

For large result sets, add pagination support:

```javascript
// Example: Get listings with pagination
const page = 1;
const pageSize = 20;
const skip = (page - 1) * pageSize;

const listings = await db.collection('listings')
  .find({category, availability: 'available'})
  .sort({update_timestamp: -1})
  .skip(skip)
  .limit(pageSize)
  .toArray();
```

## Error Handling

Common error responses:

```javascript
// Validation error
{
  success: false,
  error: "Please fill in all required fields"
}

// File upload error
{
  success: false,
  error: "File size exceeds 50MB limit"
}

// IPFS error
{
  success: false,
  error: "Failed to connect to IPFS endpoint"
}

// Database error
{
  success: false,
  error: "Database operation failed"
}
```

## Security Considerations

1. **File Validation**
   - Max file size: 50MB
   - Allowed types: images, videos, PDF
   - Scan files if processing user uploads

2. **Authentication**
   - Add JWT middleware to all endpoints
   - Validate userId matches authenticated user

3. **Rate Limiting**
   - Limit file uploads (e.g., 10 per minute)
   - Limit analytics queries to prevent DOS

4. **Input Sanitization**
   - Validate all text inputs
   - Use parameterized queries (MongoDB driver handles this)

## Testing

### API Testing

```bash
# Test media upload
curl -X POST \
  -F "file=@image.jpg" \
  -F "userId=user123" \
  http://localhost:8099/mfarmapi/media/upload/listing/listing123

# Test analytics
curl http://localhost:8099/mfarmapi/analytics/product-categories

# Test listing creation
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{"title":"Tomatoes","farmId":"farm1","category":"Vegetables","quantity":100,"unit":"kg","pricePerUnit":2.50,"currency":"USD"}' \
  http://localhost:8099/mfarmapi/enhancedlisting/
```

### Unit Tests

Create tests in `remote_services/api/tests/`:

```javascript
// tests/mediaService.test.js
const MediaService = require('../services/mediaService');

describe('MediaService', () => {
  it('should upload file to IPFS', async () => {
    const service = new MediaService();
    const result = await service.uploadToIpfs('./test-file.jpg');
    expect(result.cid).toBeDefined();
    expect(result.url).toContain('ipfs.io');
  });
});
```

## Next Steps

1. **Add authentication** - Implement JWT verification on all endpoints
2. **Add rate limiting** - Prevent abuse with express-rate-limit
3. **Add logging** - Implement structured logging with Winston or Pino
4. **Add Redis caching** - Cache analytics results for performance
5. **Add search** - Implement full-text search for listings and products
6. **Add notifications** - Notify users of listing updates, messages
7. **Add image processing** - Resize/optimize images before upload
8. **Add pinning service** - Use Pinata/Infura for IPFS pinning

## Support

For issues or questions:
1. Check error messages in API response
2. Review logs: `logs/app.log`
3. Verify IPFS connection: `curl http://localhost:5001/api/v0/version`
4. Check MongoDB connection: `mongosh localhost:27017`
