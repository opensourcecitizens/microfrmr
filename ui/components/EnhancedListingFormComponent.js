import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';

/**
 * EnhancedListingFormComponent
 * Form for creating/updating listings with categories, pricing, images
 */
export function EnhancedListingFormComponent({
  listingId = null,
  farmId,
  onSave = () => {},
  apiBaseUrl = '/mfarmapi'
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Meat',
    'Poultry',
    'Eggs',
    'Honey',
    'Seeds',
    'Other'
  ];

  const units = ['kg', 'tons', 'bundles', 'units', 'liters', 'dozens'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];
  const availabilityOptions = ['available', 'sold', 'expired'];

  const [formData, setFormData] = useState({
    id: listingId,
    title: '',
    description: '',
    farmId: farmId,
    category: 'Vegetables',
    quantity: 0,
    unit: 'kg',
    pricePerUnit: 0,
    currency: 'USD',
    images: [],
    videos: [],
    availability: 'available',
    location: {
      address: '',
      coordinates: null,
      geoId: ''
    },
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [imageUrls, setImageUrls] = useState([]);

  // Load existing listing if editing
  useEffect(() => {
    if (listingId) {
      const fetchListing = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${apiBaseUrl}/enhancedlisting/${listingId}`);
          if (!response.ok) throw new Error('Failed to load listing');
          const data = await response.json();
          if (data.success && data.data) {
            setFormData(data.data);
            // Map CIDs to URLs
            if (data.data.images && Array.isArray(data.data.images)) {
              setImageUrls(
                data.data.images.map(cid => `https://ipfs.io/ipfs/${cid}`)
              );
            }
          }
        } catch (error) {
          console.error('[EnhancedListingForm]', error);
          setMessage(error.message);
          setMessageType('error');
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [listingId, apiBaseUrl]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    if (name.includes('.')) {
      // Handle nested fields like location.address
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'quantity' || name === 'pricePerUnit' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.farmId || formData.quantity <= 0 || formData.pricePerUnit <= 0) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }

    try {
      setSaving(true);
      const method = listingId ? 'PUT' : 'POST';
      const endpoint = listingId 
        ? `${apiBaseUrl}/enhancedlisting/`
        : `${apiBaseUrl}/listingDetails/`;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Save failed');
      const data = await response.json();

      if (data.success) {
        setMessage(listingId ? 'Listing updated' : 'Listing created');
        setMessageType('success');
        onSave(data.data);
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (error) {
      console.error('[EnhancedListingForm]', error);
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={listingId ? 'Edit Listing' : 'Create Listing'}
        subheader="Add products with categories, pricing, and images"
      />
      <CardContent>
        <Stack spacing={3}>
          {message && <Alert severity={messageType}>{message}</Alert>}

          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Listing Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Fresh Tomatoes"
                required
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Describe the product, quality, sourcing..."
              />
            </Grid>

            {/* Quantity and Unit */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                inputProps={{ step: '0.01' }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  label="Unit"
                >
                  {units.map(unit => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price Per Unit */}
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Price"
                  name="pricePerUnit"
                  type="number"
                  value={formData.pricePerUnit}
                  onChange={handleInputChange}
                  inputProps={{ step: '0.01' }}
                  required
                  sx={{flex: 1}}
                />
                <FormControl sx={{minWidth: 100}}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    label="Currency"
                  >
                    {currencies.map(curr => (
                      <MenuItem key={curr} value={curr}>{curr}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                placeholder="Delivery/pickup location"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Geo ID / Region"
                name="location.geoId"
                value={formData.location.geoId}
                onChange={handleInputChange}
                placeholder="e.g., region code or coordinates"
              />
            </Grid>

            {/* Availability and Expiration */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  label="Availability"
                >
                  {availabilityOptions.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expires At"
                name="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={handleInputChange}
                InputLabelProps={{shrink: true}}
              />
            </Grid>

            {/* Image URLs */}
            {imageUrls.length > 0 && (
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Attached Images:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    {imageUrls.map((url, idx) => (
                      <Chip
                        key={idx}
                        label={`Image ${idx + 1}`}
                        onClick={() => window.open(url)}
                        onDelete={() => {
                          setImageUrls(imageUrls.filter((_, i) => i !== idx));
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx)
                          }));
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Summary */}
          <Box sx={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
            <Typography variant="caption" display="block">
              <strong>Summary:</strong> {formData.quantity} {formData.unit} of {formData.category}
              {' '}@ {formData.currency} {formData.pricePerUnit} per unit
              {' '}({formData.quantity * formData.pricePerUnit} {formData.currency} total)
            </Typography>
          </Box>

          {/* Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{flex: 1}}
            >
              {saving ? 'Saving...' : (listingId ? 'Update Listing' : 'Create Listing')}
            </Button>
          </Stack>

          <Typography variant="caption" color="textSecondary">
            Tip: Upload images using the Media Upload component after creating the listing
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default EnhancedListingFormComponent;
