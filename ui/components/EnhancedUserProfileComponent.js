import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Stack,
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Typography,
  Chip,
  Rating
} from '@mui/material';

/**
 * EnhancedUserProfileComponent
 * Form for updating farmer/user profile with bio, images, ratings, social links
 */
export function EnhancedUserProfileComponent({
  userId,
  onSave = () => {},
  apiBaseUrl = '/mfarmapi'
}) {
  const [loading, setLoading] = useState(!!userId);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const [formData, setFormData] = useState({
    id: userId,
    name: '',
    email: '',
    phone: '',
    bio: '',
    profileImageCid: null,
    verified: false,
    farmCount: 0,
    ratings: { avg: 0, count: 0 },
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
      website: ''
    }
  });

  // Load existing profile if editing
  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${apiBaseUrl}/enhancedprofile/${userId}`);
          if (!response.ok) throw new Error('Failed to load profile');
          const data = await response.json();
          if (data.success && data.data) {
            setFormData(data.data);
            if (data.data.profileImageCid) {
              setProfileImageUrl(`https://ipfs.io/ipfs/${data.data.profileImageCid}`);
            }
          }
        } catch (error) {
          console.error('[EnhancedUserProfile]', error);
          setMessage(error.message);
          setMessageType('error');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [userId, apiBaseUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
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
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.id || !formData.name || !formData.email) {
      setMessage('Please fill in required fields (name, email)');
      setMessageType('error');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${apiBaseUrl}/enhancedprofile/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Save failed');
      const data = await response.json();

      if (data.success) {
        setMessage('Profile updated successfully');
        setMessageType('success');
        onSave(data.data);
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (error) {
      console.error('[EnhancedUserProfile]', error);
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
        title="Farmer Profile"
        subheader="Update your profile, bio, and social information"
      />
      <CardContent>
        <Stack spacing={3}>
          {message && <Alert severity={messageType}>{message}</Alert>}

          {/* Profile Picture Section */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <Avatar
              src={profileImageUrl}
              sx={{ width: 120, height: 120, marginBottom: '16px' }}
            />
            <Typography variant="caption" color="textSecondary">
              Profile Picture
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Upload via Media Upload component
            </Typography>
            {formData.verified && (
              <Chip
                label="Verified Farmer"
                color="success"
                sx={{ marginTop: '12px' }}
              />
            )}
          </Box>

          {/* Basic Info */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Farm Count"
                name="farmCount"
                type="number"
                value={formData.farmCount}
                onChange={handleInputChange}
                disabled
              />
            </Grid>

            {/* Bio */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio / About You"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Tell us about your farm, products, and farming practices..."
                helperText="Max 500 characters"
              />
            </Grid>

            {/* Ratings Display */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Your Ratings
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Rating
                    value={formData.ratings.avg}
                    readOnly
                    precision={0.5}
                  />
                  <Typography variant="body2">
                    {formData.ratings.avg.toFixed(1)} / 5.0
                    ({formData.ratings.count} reviews)
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            {/* Social Links */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Social Links
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instagram"
                name="socialLinks.instagram"
                value={formData.socialLinks?.instagram || ''}
                onChange={handleInputChange}
                placeholder="@username"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Facebook"
                name="socialLinks.facebook"
                value={formData.socialLinks?.facebook || ''}
                onChange={handleInputChange}
                placeholder="facebook.com/username"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Twitter"
                name="socialLinks.twitter"
                value={formData.socialLinks?.twitter || ''}
                onChange={handleInputChange}
                placeholder="@username"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                name="socialLinks.website"
                value={formData.socialLinks?.website || ''}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
              />
            </Grid>
          </Grid>

          {/* Save Button */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{ flex: 1 }}
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </Button>
          </Stack>

          <Typography variant="caption" color="textSecondary">
            Your profile helps buyers learn about your farm and builds trust in the community
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default EnhancedUserProfileComponent;
