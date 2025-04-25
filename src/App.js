import React from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import TodoList from './components/TodoList';
import Meets from './components/Meets';
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

function App() {
  const routes = [
    {
      path: "/",
      element: <TodoList />,
    },
    {
      path: "/todos",
      element: <TodoList />,
    },
    {
      path: "/meets",
      element: <Meets />,
    },
  ];

  const router = createBrowserRouter(routes, {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  });

  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <div className="blur-content" style={{ paddingTop: '64px' }}>
            <Routes>
              <Route path="/" element={<TodoList />} />
              <Route path="/todos" element={<TodoList />} />
              <Route path="/meets" element={<Meets />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </GlobalProvider>
  );
}

export default App;