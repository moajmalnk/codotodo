const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'https://todobackend.moajmalnk.in/api';
  }
  return 'https://todobackend.moajmalnk.in/api';
};

export const API_URL = getApiUrl(); 