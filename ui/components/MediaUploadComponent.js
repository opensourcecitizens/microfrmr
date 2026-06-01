import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  LinearProgress,
  Alert,
  Stack,
  Typography,
  Box
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/**
 * MediaUploadComponent
 * Handles file uploads to IPFS with CID storage
 * Used for user profiles, farms, listings, and products
 */
export function MediaUploadComponent({
  parentType, // 'user', 'farm', 'listing', 'product'
  parentId,
  userId,
  onUploadSuccess = () => {},
  apiBaseUrl = '/mfarmapi',
  maxFileSize = 50 * 1024 * 1024 // 50MB
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info'); // 'success', 'error', 'info'

  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'application/pdf'
  ];

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > maxFileSize) {
      setMessageType('error');
      setMessage(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`);
      return;
    }

    // Validate file type
    if (!allowedMimes.includes(selectedFile.type)) {
      setMessageType('error');
      setMessage('Invalid file type. Allowed: images, videos, PDFs');
      return;
    }

    setFile(selectedFile);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessageType('error');
      setMessage('Please select a file first');
      return;
    }

    if (!parentId || !userId) {
      setMessageType('error');
      setMessage('Parent ID and User ID are required');
      return;
    }

    if (!['user', 'farm', 'listing', 'product'].includes(parentType)) {
      setMessageType('error');
      setMessage('Invalid parent type');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      setMessage(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setMessageType('success');
            setMessage(`Upload successful! CID: ${response.data.ipfsCID.substring(0, 16)}...`);
            setFile(null);
            setProgress(0);
            onUploadSuccess(response.data);
          } else {
            setMessageType('error');
            setMessage(response.error || 'Upload failed');
          }
        } else {
          setMessageType('error');
          setMessage('Upload failed: ' + xhr.statusText);
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setMessageType('error');
        setMessage('Network error during upload');
        setUploading(false);
      });

      xhr.open(
        'POST',
        `${apiBaseUrl}/media/upload/${parentType}/${parentId}`
      );
      xhr.send(formData);
    } catch (error) {
      console.error('[MediaUpload]', error);
      setMessageType('error');
      setMessage(error.message);
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Media Upload"
        subheader="Upload images, videos, or documents to IPFS"
      />
      <CardContent>
        <Stack spacing={2}>
          {/* File Input */}
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: '#f5f5f5'
              }
            }}
            component="label"
          >
            <input
              type="file"
              hidden
              onChange={handleFileSelect}
              disabled={uploading}
              accept={allowedMimes.join(',')}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', marginBottom: '8px' }} />
            <Typography>
              {file ? file.name : 'Click to select file or drag and drop'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Max size: 50MB | Formats: images, videos, PDF
            </Typography>
          </Box>

          {/* Progress Bar */}
          {uploading && (
            <Box>
              <Typography variant="caption">Uploading... {progress}%</Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          {/* Messages */}
          {message && (
            <Alert severity={messageType}>
              {message}
            </Alert>
          )}

          {/* Upload Button */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file || uploading}
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              {uploading ? 'Uploading...' : 'Upload to IPFS'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setFile(null);
                setProgress(0);
                setMessage(null);
              }}
              disabled={uploading || !file}
            >
              Clear
            </Button>
          </Box>

          {/* File Info */}
          {file && (
            <Typography variant="caption" color="textSecondary">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default MediaUploadComponent;
