import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Custom hook for API calls with loading and error states
export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const config = {
          ...options,
          headers: {
            ...options.headers,
          }
        };

        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get(`${API_URL}${url}`, config);
        setData(response.data);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
}

// Hook for POST/PUT/DELETE requests
export function useMutation(method = 'POST') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (url, data = null) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        method,
        url: `${API_URL}${url}`,
        headers: {}
      };

      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || `${method} request failed`;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}

// Hook for auth state
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return { user, loading, logout };
}
