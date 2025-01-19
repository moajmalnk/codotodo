const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost/CODOToDo/api';
  }
  return 'https://todo.moajmalnk.in/api';
};

export const API_URL = getApiUrl(); 