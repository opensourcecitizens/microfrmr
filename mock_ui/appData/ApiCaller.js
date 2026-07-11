import { ERR_100, ERR_200, ERR_300, API_URL, IPFS_URL } from '../constants';

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 4000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });

    if (response.status >= 500) {
      throw new Error(`Server error ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

export async function getImagesWebsocket() {
  return IPFS_URL;
}

export async function getProductSummaryList() {
  try {
    const response = await fetchWithTimeout(`${API_URL}/productlist/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : [];
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to fetch posts'));
  }
}

export async function getProductDetails(productId) {
  if (!productId) throw new Error(ERR_200 + 'productId cannot be empty or null');

  try {
    const response = await fetchWithTimeout(`${API_URL}/productdetails/${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : null;
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to fetch details'));
  }
}

export async function upsertUserProfile(profileObj) {
  if (!profileObj || Object.keys(profileObj).length === 0) {
    throw new Error(ERR_200 + 'profileObj cannot be empty or null');
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}/userprofile/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileObj)
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : null;
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to save profile'));
  }
}

export async function getUserProfile(userId) {
  if (!userId) throw new Error(ERR_200 + 'userId cannot be empty or null');

  try {
    const response = await fetchWithTimeout(`${API_URL}/userprofile/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : null;
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to fetch profile'));
  }
}

export async function getEnhancedUserProfile(userId) {
  if (!userId) throw new Error(ERR_200 + 'userId cannot be empty or null');

  try {
    const response = await fetchWithTimeout(`${API_URL}/enhancedprofile/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : null;
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to fetch enhanced profile'));
  }
}

export async function upsertEnhancedUserProfile(profileObj) {
  if (!profileObj || Object.keys(profileObj).length === 0) {
    throw new Error(ERR_200 + 'profileObj cannot be empty or null');
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}/enhancedprofile/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileObj)
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : null;
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to save profile'));
  }
}

export async function getListingsList() {
  try {
    const response = await fetchWithTimeout(`${API_URL}/listingslist/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : [];
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to fetch listings'));
  }
}

export async function createEnhancedListing(listingObj) {
  if (!listingObj) {
    throw new Error(ERR_200 + 'listingObj cannot be empty or null');
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}/enhancedlisting/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingObj)
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : null;
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to create listing'));
  }
}

export async function uploadMediaFile(fileUri, parentType, parentId, userId) {
  if (!fileUri || !parentType || !parentId || !userId) {
    throw new Error(ERR_200 + 'fileUri, parentType, parentId and userId are required');
  }

  try {
    const fileName = fileUri.split('/').pop() || `upload-${Date.now()}.jpg`;
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'image/jpeg'
    });
    formData.append('userId', userId);

    const response = await fetchWithTimeout(`${API_URL}/media/upload/${parentType}/${parentId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : null;
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to upload media'));
  }
}

export async function getMediaByParent(parentType, parentId) {
  if (!parentType || !parentId) {
    throw new Error(ERR_200 + 'parentType and parentId are required');
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}/media/${parentType}/${parentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(ERR_100 + 'API response was not ok.');
    }

    const res = await response.json();
    return res && res.data ? res.data : [];
  } catch (error) {
    console.error(error);
    throw new Error(ERR_300 + (error?.message || 'Failed to fetch media'));
  }
}