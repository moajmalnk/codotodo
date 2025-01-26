import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

export const useFetchData = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('app-offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('app-offline', handleOffline);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance(url, options);
      
      setData(response.data);
      setError(null);
      
      // If this was cached data and we're back online, refresh
      if (response.fromCache && navigator.onLine) {
        fetchData();
      }
    } catch (err) {
      setError(err);
      // Don't clear existing data on error if we have it
      if (!data) {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, isOffline, refetch };
}; 