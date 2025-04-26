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
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Add a small delay to prevent rapid checks
        await new Promise(resolve => setTimeout(resolve, 50));
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsAuthenticated(isLoggedIn);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return null; // or a loading spinner if you prefer
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const handleStorageChange = async () => {
      try {
        // Add a small delay to prevent rapid state changes
        await new Promise(resolve => setTimeout(resolve, 50));
        const loginState = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loginState);
      } finally {
        setIsInitializing(false);
      }
    };

    // Listen for both storage and custom login state changes
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginStateChange', handleStorageChange);
    
    // Check login state on mount
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChange', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    });
  }, []);

  // Auto-close install banner after 10 seconds
  useEffect(() => {
    if (showInstallBanner) {
      const timer = setTimeout(() => {
        setShowInstallBanner(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showInstallBanner]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // User accepted the install
        }
        setShowInstallBanner(false);
      });
    }
  };

  // Don't render anything while initializing
  if (isInitializing) {
    return null;
  }

  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {isLoggedIn && <Navbar />}
          <div
            className={isLoggedIn ? "blur-content" : ""}
            style={{ 
              paddingTop: isLoggedIn ? (isMobile ? '56px' : '64px') : 0,
              minHeight: isLoggedIn ? `calc(100vh - ${(isMobile ? 56 : 64)}px)` : '100vh',
              background: isMobile ? '#f0f3ff' : undefined
            }}
          >
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
          {showInstallBanner && (
            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, background: '#00A76F', color: 'white', padding: 16, textAlign: 'center', zIndex: 2000
            }}>
              <span>Install CODO Todo for the best experience!</span>
              <button onClick={handleInstallClick} style={{ marginLeft: 16, padding: '8px 16px', background: 'white', color: '#00A76F', border: 'none', borderRadius: 8, fontWeight: 600 }}>
                Install App
              </button>
            </div>
          )}
        </Router>
      </ThemeProvider>
    </GlobalProvider>
  );
}

export default App;