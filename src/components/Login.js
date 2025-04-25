import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, Email } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #00b764 0%',
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  fontSize: '2rem',
  background: 'linear-gradient(45deg, #00b764 30%, #00203f 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSnackbar } = useContext(GlobalContext);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/todos', { replace: true });
    }
    
    return () => {
      setMounted(false);
    };
  }, [navigate]);

  const showNotification = (message, severity) => {
    if (mounted) {
      setSnackbar({
        open: true,
        message,
        severity
      });
    }
  };

  const handleVerifyEmail = async (e) => {
    e?.preventDefault();
    
    if (!email) {
      showNotification('Please enter your email address', 'warning');
      return;
    }

    setVerifying(true);
    
    try {
      // Minimal delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      setShowOtpField(true);
      showNotification('OTP has been sent to ' + email, 'success');
    } catch (error) {
      showNotification('Error sending OTP', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (!otp) {
      showNotification('Please enter the OTP', 'warning');
      return;
    }

    setLoading(true);
    
    try {
      // Minimal delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      if (otp === VALID_OTP) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        // Dispatch custom event to notify App component
        window.dispatchEvent(new Event('loginStateChange'));
        
        showNotification('Login successful!', 'success');
        navigate('/todos', { replace: true });
      } else {
        showNotification('Invalid OTP', 'error');
      }
    } catch (error) {
      showNotification('Error during login', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!showOtpField) {
        handleVerifyEmail();
      } else {
        handleLogin();
      }
    }
  };

  const VALID_OTP = '995559';

  return (
    <LoginContainer>
      <LoginCard elevation={4}>
        <Logo variant="h4">CODO Todo</Logo>
        
        <form onSubmit={!showOtpField ? handleVerifyEmail : handleLogin}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StyledTextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={showOtpField}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                type="email"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              {!showOtpField && (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!email || verifying}
                  sx={{ 
                    minWidth: 100,
                    bgcolor: '#00b764',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#009053'
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(0, 183, 100, 0.5)',
                    }
                  }}
                >
                  {verifying ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Get OTP'
                  )}
                </Button>
              )}
            </Box>

            {showOtpField && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <StyledTextField
                  fullWidth
                  label="OTP"
                  variant="outlined"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyPress={handleKeyPress}
                  type="number"
                  placeholder="Enter 6-digit OTP"
                  required
                  inputProps={{ 
                    maxLength: 6,
                    pattern: '[0-9]*'
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!otp || loading}
                  sx={{
                    height: 48,
                    bgcolor: '#00b764',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#009053'
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(0, 183, 100, 0.5)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Login'
                  )}
                </Button>
              </Box>
            )}
          </Box>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 