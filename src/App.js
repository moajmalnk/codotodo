import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import TodoList from './components/TodoList';
import Meets from './components/Meets';
import Login from './components/Login';
import { GlobalProvider } from './context/GlobalContext';
import './styles.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00b764',
    },
    secondary: {
      main: '#00203f',
    },
    background: {
      default: '#f0f3ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3436',
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 15,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 15,
          textTransform: 'none',
          transition: '0.3s',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#2d3436',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 15,
          '& .MuiTabs-indicator': {
            height: '100%',
            borderRadius: 15,
            backgroundColor: '#ffffff',
            zIndex: 0,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 15,
          zIndex: 1,
          '&.Mui-selected': {
            color: '#2d3436',
            backgroundColor: '#ffffff',
          },
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for login state changes
    window.addEventListener('loginStateChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChange', handleStorageChange);
    };
  }, []);

  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {isLoggedIn && <Navbar />}
          <div className={isLoggedIn ? "blur-content" : ""} style={{ paddingTop: isLoggedIn ? '64px' : 0 }}>
            <Routes>
              <Route 
                path="/login" 
                element={
                  isLoggedIn ? (
                    <Navigate to="/todos" replace />
                  ) : (
                    <Login />
                  )
                } 
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <TodoList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/todos"
                element={
                  <ProtectedRoute>
                    <TodoList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meets"
                element={
                  <ProtectedRoute>
                    <Meets />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="*" 
                element={<Navigate to={isLoggedIn ? "/todos" : "/login"} replace />} 
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </GlobalProvider>
  );
}

export default App;