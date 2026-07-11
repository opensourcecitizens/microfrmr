import {
  createEnhancedListing,
  getEnhancedUserProfile,
  getListingsList,
  getMediaByParent,
  uploadMediaFile,
  upsertEnhancedUserProfile
} from './ApiCaller';

let posts = [];
let profile = null;
const listeners = [];

function notifyListeners() {
  listeners.forEach((listener) => listener(getPosts()));
}

function normalizeImages(mediaItems = []) {
  return mediaItems
    .map((item) => item.publicUrl || item.url || item.ipfsCID || null)
    .filter(Boolean);
}

function normalizePost(listing, mediaItems = []) {
  return {
    id: listing.id,
    farmName: listing.title || listing.farmName || 'Live Farm',
    farmAddress: listing.location?.address || listing.storeAddress || '',
    farmDetails: listing.description || listing.storeDetails || '',
    farmerName: listing.listingAgent || listing.farmerName || 'Farm Owner',
    status: listing.availability || listing.status || 'Active',
    images: normalizeImages(mediaItems),
    description: listing.description || '',
    profileImage: listing.profileImageUrl || listing.profile_image || 'Farm',
    raw: listing
  };
}

export function getPosts() {
  return posts;
}

export function getProfile() {
  return profile;
}

export function getPostById(postId) {
  return posts.find((post) => Number(post.id) === Number(postId));
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  };
}

export async function loadPosts() {
  try {
    const listings = await getListingsList();
    const normalizedListings = Array.isArray(listings) ? listings : listings || [];

    const nextPosts = [];
    for (const listing of normalizedListings) {
      const mediaItems = await getMediaByParent('listing', String(listing.id));
      nextPosts.push(normalizePost(listing, mediaItems));
    }

    posts = nextPosts;
    notifyListeners();
    return posts;
  } catch (error) {
    console.error(error);
    return posts;
  }
}

export async function loadProfile(userId = 'demo-user') {
  try {
    const nextProfile = await getEnhancedUserProfile(userId);
    profile = nextProfile || profile;
    return profile;
  } catch (error) {
    console.error(error);
    return profile;
  }
}

export async function saveProfile(profileData, userId = 'demo-user') {
  const nextProfile = {
    id: userId,
    name: profileData.name || profileData.farmName || 'Demo Farmer',
    email: profileData.email || 'farmer@example.com',
    phone: profileData.phone || '',
    admin: false,
    bio: profileData.bio || profileData.farmDetails || '',
    profileImageCid: profileData.profileImageCid || null,
    profileImageUrl: profileData.profileImageUrl || null,
    verified: Boolean(profileData.verified),
    farmCount: profileData.farmCount || 1,
    ratings: profileData.ratings || { avg: 0, count: 0 },
    socialLinks: profileData.socialLinks || {},
    ...profileData
  };

  const savedProfile = await upsertEnhancedUserProfile(nextProfile);
  profile = savedProfile || nextProfile;
  notifyListeners();
  return profile;
}

export async function addPost(postData) {
  const listingId = String(postData.id || Date.now());
  const uploadedUrls = [];

  const initialPayload = {
    id: listingId,
    title: postData.storeName || postData.farmName || 'New Farm',
    description: postData.description || '',
    listingAgent: postData.farmerName || 'Farm Owner',
    farmId: postData.farmId || 'demo-farm',
    category: postData.category || 'general',
    quantity: postData.quantity || 1,
    unit: postData.unit || 'units',
    pricePerUnit: postData.pricePerUnit || 0,
    currency: postData.currency || 'USD',
    images: [],
    availability: postData.status || 'available',
    location: {
      address: postData.storeAddress || postData.farmAddress || '',
      geoId: ''
    },
    updated_by: 'mock-ui'
  };

  await createEnhancedListing(initialPayload);

  for (const image of Array.isArray(postData.images) ? postData.images : []) {
    if (typeof image === 'string' && image.startsWith('http')) {
      uploadedUrls.push(image);
      continue;
    }

    if (typeof image === 'string' && image.length > 0) {
      const mediaResult = await uploadMediaFile(image, 'listing', listingId, 'demo-user');
      if (mediaResult?.publicUrl) {
        uploadedUrls.push(mediaResult.publicUrl);
      }
    }
  }

  const updatedPayload = {
    ...initialPayload,
    images: uploadedUrls
  };

  await createEnhancedListing(updatedPayload);
  await loadPosts();
  return getPostById(listingId);
}

export async function updatePost(postId, updates) {
  const existingPost = getPostById(postId);
  if (!existingPost) {
    return null;
  }

  const nextPost = {
    ...existingPost,
    ...updates,
    id: postId
  };

  posts = posts.map((post) => (Number(post.id) === Number(postId) ? nextPost : post));
  notifyListeners();
  return nextPost;
}
