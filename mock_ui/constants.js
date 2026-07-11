import { Platform } from 'react-native';

export const ERR_100 = "Error 100: "; //api response error
export const ERR_200 = "Error 200: "; //data missing error
export const ERR_300 = "Error 300: "; //network error

const getBaseApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8099/mfarmapi';
    }

    return `http://${hostname}:8099/mfarmapi`;
  }

  const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${defaultHost}:8099/mfarmapi`;
};

export const IPFS_URL = process.env.EXPO_PUBLIC_IPFS_URL || 'http://localhost:5001';
export const API_URL = getBaseApiUrl();