import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Paper,
  Button,
  Fade,
  Tooltip,
  Tabs,
  Tab,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VideocamIcon from '@mui/icons-material/Videocam';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Safari support
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
  }
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  display: 'flex',
  alignItems: 'center',
  padding: '2px',
  gap: '4px',
  width: 'auto',
  minWidth: 120,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
  }
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: 32,
    fontSize: '0.875rem',
    padding: '0 8px',
    '& input': {
      padding: '0',
    },
    '& fieldset': {
      border: 'none',
    },
  }
}));

const SearchIconButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  borderRadius: 16,
  backgroundColor: '#00A76F',
  color: 'white',
  '&:hover': {
    backgroundColor: '#018455',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
  }
}));

const ClearIconButton = styled(IconButton)(({ theme }) => ({
  padding: 4,
  marginRight: 4,
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  }
}));

const StyledChip = styled(Chip)(({ theme, isActive }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  ...(isActive && {
    boxShadow: theme.shadows[2],
  })
}));

const TabsWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderRadius: 30,
  padding: '4px',
  display: 'inline-flex',
  boxShadow: `0 0 2px ${alpha(theme.palette.divider, 0.2)}`,
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    overflow: 'auto',
    display: 'flex',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px !important',
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  minHeight: 40,
  [theme.breakpoints.down('sm')]: {
    minHeight: 36,
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 32,
  minWidth: 'auto',
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '6px 16px',
  borderRadius: 16,
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: '#00A76F',
    backgroundColor: alpha('#00A76F', 0.08),
    fontWeight: 600,
  },
  '&:hover': {
    color: '#00A76F',
    backgroundColor: alpha('#00A76F', 0.04),
  },
  '& .MuiTab-iconWrapper': {
    marginRight: theme.spacing(1),
    marginBottom: '0 !important',
    '& svg': {
      fontSize: '1.25rem',
    }
  },
  transition: 'all 0.2s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    padding: '6px 12px',
    fontSize: '0.8125rem',
    '& .MuiTab-iconWrapper': {
      marginRight: theme.spacing(0.75),
      '& svg': {
        fontSize: '1.125rem',
      }
    }
  }
}));

const MobileSearchButton = styled(IconButton)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    marginRight: theme.spacing(1),
  }
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .section-header': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
      color: theme.palette.text.secondary,
    },
    '& .MuiTypography-root': {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
    }
  },
  '& .chips-container': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginLeft: theme.spacing(3.5),
  }
}));

const FilterChip = styled(Chip)(({ theme, color = 'primary', isActive }) => ({
  borderRadius: '20px',
  height: 32,
  padding: '0 12px',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  backgroundColor: isActive ? 
    color === 'primary' ? '#00A76F' :
    color === 'error' ? '#FF5630' :
    color === 'warning' ? '#FFAB00' :
    color === 'success' ? '#36B37E' :
    '#00A76F'
    : 'transparent',
  color: isActive ? '#fff' : 
    color === 'primary' ? '#00A76F' :
    color === 'error' ? '#FF5630' :
    color === 'warning' ? '#FFAB00' :
    color === 'success' ? '#36B37E' :
    '#00A76F',
  border: `1px solid ${
    color === 'primary' ? '#00A76F' :
    color === 'error' ? '#FF5630' :
    color === 'warning' ? '#FFAB00' :
    color === 'success' ? '#36B37E' :
    '#00A76F'
  }`,
  '&:hover': {
    backgroundColor: isActive ? 
      color === 'primary' ? '#018455' :
      color === 'error' ? '#DE4B29' :
      color === 'warning' ? '#DB9200' :
      color === 'success' ? '#2D9769' :
      '#018455'
      : alpha(
        color === 'primary' ? '#00A76F' :
        color === 'error' ? '#FF5630' :
        color === 'warning' ? '#FFAB00' :
        color === 'success' ? '#36B37E' :
        '#00A76F',
        0.08
      ),
  },
  transition: 'all 0.2s ease-in-out',
}));

// Add this new styled component for the close button
const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.text.secondary,
  padding: 8,
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.secondary, 0.08),
  },
}));

const ClearAllButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: 48,
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'none',
  color: '#FF5630',
  backgroundColor: 'transparent',
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  borderRadius: 0,
  marginTop: theme.spacing(2),
  '&:hover': {
    backgroundColor: alpha('#FF5630', 0.08),
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
  }
}));

const Navbar = ({ todos, onFilterChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    priority,
    setPriority,
    status,
    setStatus,
    dueDate,
    setDueDate,
  } = useContext(GlobalContext);

  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Todos', icon: <AssignmentIcon />, path: '/todos' },
    { text: 'Meets', icon: <VideocamIcon />, path: '/meets' },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const path = menuItems[newValue].path;
    navigate(path);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setPriority('all');
    setStatus('all');
    setDueDate('all');
  };

  const isFiltersActive = searchTerm || priority !== 'all' || status !== 'all' || dueDate !== 'all';

  const handleOpenCreateTodo = () => {
    const event = new CustomEvent('openCreateTodo');
    window.dispatchEvent(event);
  };

  const handleOpenCreateMeet = () => {
    const event = new CustomEvent('openCreateMeet');
    window.dispatchEvent(event);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    // Emit search event with the new search term
    window.dispatchEvent(new CustomEvent('searchQueryChange', {
      detail: { 
        searchQuery: searchValue,
        path: location.pathname // Include current path to handle different searches
      }
    }));
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
    emitFilterChange({ priority: value, status, dueDate });
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    emitFilterChange({ priority, status: value, dueDate });
  };

  const handleDueDateChange = (value) => {
    setDueDate(value);
    emitFilterChange({ priority, status, dueDate: value });
  };

  const emitFilterChange = (filters) => {
    window.dispatchEvent(new CustomEvent('filterChange', {
      detail: { 
        filters: {
          priority: filters.priority,
          status: filters.status,
          timeFrame: filters.dueDate
        }
      }
    }));
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setPriority('all');
    setStatus('all');
    setDueDate('all');
    setDateRange([null, null]);
    setShowCustomDate(false);
    setStartDate('');
    setEndDate('');
    
    window.dispatchEvent(new CustomEvent('clearAllFilters'));
    
    window.dispatchEvent(new CustomEvent('searchQueryChange', {
      detail: { searchQuery: '' }
    }));
    
    window.dispatchEvent(new CustomEvent('filterChange', {
      detail: {
        filters: {
          priority: 'all',
          status: 'all',
          timeFrame: 'all'
        }
      }
    }));
  };

  const formatDateRange = (range) => {
    if (!range[0] || !range[1]) return "Custom Range";
    const start = new Date(range[0]).toLocaleDateString();
    const end = new Date(range[1]).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    if (newRange[0] && newRange[1]) {
      const start = startOfDay(newRange[0]);
      const end = endOfDay(newRange[1]);
      const filteredTodos = todos.filter(todo => 
        todo.dueDate && isWithinInterval(new Date(todo.dueDate), { start, end })
      );
      onFilterChange && onFilterChange(filteredTodos);
    }
  };

  const handleDateChange = (type, event) => {
    const value = event.target.value;
    if (type === 'start') {
      setStartDate(value);
      // If end date is before start date, update end date
      if (endDate && value > endDate) {
        setEndDate(value);
      }
    } else {
      setEndDate(value);
      // If start date is after end date, update start date
      if (startDate && value < startDate) {
        setStartDate(value);
      }
    }
  };

  const handleApplyDateRange = () => {
    if (!startDate || !endDate) return;

    // Create and dispatch the filter event
    const event = new CustomEvent('filterChange', {
      detail: {
        type: 'dateRange',
        value: {
          startDate,
          endDate
        }
      }
    });
    window.dispatchEvent(event);

    // Update the dateRange state
    setDateRange([startDate, endDate]);
    
    // Close the custom date picker
    setShowCustomDate(false);
  };

  // Add this function to handle search in the Meets component
  const handleSearch = (searchQuery) => {
    if (!searchQuery) {
      return todos; // Return all todos if no search query
    }

    return todos.filter(todo => 
      todo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar sx={{ 
          minHeight: { xs: 56, sm: 64 }, 
          px: { xs: 1, sm: 2 },
          gap: { xs: 1, sm: 2 }
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              mr: 4,
              fontWeight: 600,
              background: 'linear-gradient(45deg,rgb(33, 243, 138) 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            CODO Todo
          </Typography>

          <TabsWrapper>
            <StyledTabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons={false}
            >
              {menuItems.map((item) => (
                <StyledTab
                  key={item.text}
                  label={item.text}
                  icon={item.icon}
                  iconPosition="start"
                  disableRipple
                  sx={(theme) => ({
                    '& .MuiSvgIcon-root': {
                      color: item.text === 'Home' && activeTab === 0 ? '#00A76F' : 
                             item.text === 'Todos' && activeTab === 1 ? '#00A76F' : 
                             item.text === 'Meets' && activeTab === 2 ? '#00A76F' : 'inherit',
                      transition: 'color 0.2s ease-in-out',
                    }
                  })}
                />
              ))}
            </StyledTabs>
          </TabsWrapper>

          {/* Mobile Search Button */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <SearchButton
              color="inherit"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              {mobileSearchOpen ? (
                <CloseIcon fontSize="small" />
              ) : (
                <SearchIcon fontSize="small" />
              )}
            </SearchButton>
          </Box>

          {/* Search Field */}
          <Box sx={{ 
            display: { 
              xs: mobileSearchOpen ? 'block' : 'none', 
              sm: 'block' 
            },
            flexGrow: 1,
          }}>
            <SearchWrapper>
              <SearchTextField
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
              />
              {searchTerm && (
                <ClearIconButton
                  onClick={() => {
                    setSearchTerm('');
                    handleSearchChange({ target: { value: '' } });
                  }}
                >
                  <CloseIcon />
                </ClearIconButton>
              )}
              <SearchIconButton>
                <SearchIcon />
              </SearchIconButton>
            </SearchWrapper>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 },
            alignItems: 'center'
          }}>
            <Tooltip title="Filters">
              <IconButton 
                color="inherit" 
                onClick={() => setFilterDrawerOpen(true)}
                sx={{
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  borderRadius: '12px',
                  bgcolor: isFiltersActive ? 'primary.main' : 'transparent',
                  color: isFiltersActive ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: isFiltersActive ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <FilterListIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {location.pathname === '/todos' || location.pathname === '/meets' ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={location.pathname === '/todos' ? handleOpenCreateTodo : handleOpenCreateMeet}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: { xs: 2, sm: 3 },
                  height: { xs: 36, sm: 40 },
                  bgcolor: '#00A76F',
                  fontWeight: 500,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#018455',
                    transform: 'translateY(-1px)',
                    boxShadow: theme => theme.shadows[4],
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: { xs: 0.5, sm: 1 }
                  }
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Create</Box>
                {location.pathname === '/todos' ? ' Todo' : ' Meet'}
              </Button>
            ) : null}
          </Box>
        </Toolbar>
        
        {isFiltersActive && (
          <Fade in={true}>
            <Box sx={{ 
              px: { xs: 1, sm: 2 }, 
              pb: 1, 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
            }}>
              {priority !== 'all' && (
                <Chip
                  size="small"
                  label={`Priority: ${priority}`}
                  onDelete={() => setPriority('all')}
                  color="primary"
                  variant="outlined"
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 1,
                    }
                  }}
                />
              )}
              {status !== 'all' && (
                <Chip
                  size="small"
                  label={`Status: ${status}`}
                  onDelete={() => setStatus('all')}
                  color="primary"
                  variant="outlined"
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 1,
                    }
                  }}
                />
              )}
              {dueDate !== 'all' && (
                <Chip
                  size="small"
                  label={`Due: ${dueDate}`}
                  onDelete={() => setDueDate('all')}
                  color="primary"
                  variant="outlined"
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 1,
                    }
                  }}
                />
              )}
              {isFiltersActive && (
                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleClearAll}
                  sx={{ textTransform: 'none' }}
                >
                  Clear All
                </Button>
              )}
            </Box>
          </Fade>
        )}
      </StyledAppBar>

      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 360 },
            maxWidth: '100%',
            p: { xs: 2.5, sm: 3 },
            overflowX: 'hidden',
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            position: 'relative',
            pt: 1,
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '1.125rem', 
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Filters
            </Typography>
            <CloseButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon sx={{ fontSize: '1.1rem' }} />
            </CloseButton>
          </Box>

          <FilterSection>
            <Box className="section-header">
              <PriorityHighIcon />
              <Typography>Priority</Typography>
            </Box>
            <Box className="chips-container">
              <FilterChip
                label="All"
                onClick={() => handlePriorityChange('all')}
                isActive={priority === 'all'}
                color="primary"
              />
              <FilterChip
                label="High"
                onClick={() => handlePriorityChange('high')}
                isActive={priority === 'high'}
                color="error"
              />
              <FilterChip
                label="Medium"
                onClick={() => handlePriorityChange('medium')}
                isActive={priority === 'medium'}
                color="warning"
              />
              <FilterChip
                label="Low"
                onClick={() => handlePriorityChange('low')}
                isActive={priority === 'low'}
                color="success"
              />
            </Box>
          </FilterSection>

          <FilterSection>
            <Box className="section-header">
              <CheckCircleOutlineIcon />
              <Typography>Status</Typography>
            </Box>
            <Box className="chips-container">
              <FilterChip
                label="All"
                onClick={() => handleStatusChange('all')}
                isActive={status === 'all'}
                color="primary"
              />
              <FilterChip
                label="Pending"
                onClick={() => handleStatusChange('pending')}
                isActive={status === 'pending'}
                color="warning"
              />
              <FilterChip
                label="Completed"
                onClick={() => handleStatusChange('completed')}
                isActive={status === 'completed'}
                color="success"
              />
            </Box>
          </FilterSection>

          <FilterSection>
            <Box className="section-header">
              <CalendarTodayIcon />
              <Typography>Time Frame</Typography>
            </Box>
            <Box className="chips-container">
              <FilterChip
                label="All Time"
                onClick={() => {
                  handleDueDateChange('all');
                  setShowCustomDate(false);
                }}
                isActive={dueDate === 'all'}
                color="primary"
              />
              <FilterChip
                label="Today"
                onClick={() => {
                  handleDueDateChange('today');
                  setShowCustomDate(false);
                }}
                isActive={dueDate === 'today'}
                color="primary"
              />
              <FilterChip
                label="This Week"
                onClick={() => {
                  handleDueDateChange('week');
                  setShowCustomDate(false);
                }}
                isActive={dueDate === 'week'}
                color="primary"
              />
              <FilterChip
                label="Overdue"
                onClick={() => {
                  handleDueDateChange('overdue');
                  setShowCustomDate(false);
                }}
                isActive={dueDate === 'overdue'}
                color="error"
              />
              <FilterChip
                label={dateRange[0] && dateRange[1] ? formatDateRange(dateRange) : "Custom Range"}
                onClick={() => setShowCustomDate(!showCustomDate)}
                isActive={showCustomDate}
                color="primary"
                icon={<CalendarMonthIcon sx={{ fontSize: '1rem' }} />}
              />
            </Box>
            
            {/* Custom Date Range Picker */}
            <Collapse in={showCustomDate}>
              <Box sx={{ 
                ml: 3.5, 
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: theme => alpha(theme.palette.primary.main, 0.04),
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange('start', e)}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange('end', e)}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />

                {/* Quick Select Buttons */}
                <Box sx={{ 
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  mt: 1
                }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const today = new Date();
                      const nextWeek = new Date();
                      nextWeek.setDate(today.getDate() + 7);
                      setStartDate(today.toISOString().split('T')[0]);
                      setEndDate(nextWeek.toISOString().split('T')[0]);
                    }}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '0.8125rem'
                    }}
                  >
                    Next 7 Days
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const today = new Date();
                      const nextMonth = new Date();
                      nextMonth.setMonth(today.getMonth() + 1);
                      setStartDate(today.toISOString().split('T')[0]);
                      setEndDate(nextMonth.toISOString().split('T')[0]);
                    }}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '0.8125rem'
                    }}
                  >
                    Next 30 Days
                  </Button>
                </Box>

                {/* Apply Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleApplyDateRange}
                  disabled={!startDate || !endDate}
                  sx={{
                    mt: 1,
                    height: 40,
                    borderRadius: '8px',
                    textTransform: 'none',
                    bgcolor: '#00A76F',
                    '&:hover': {
                      bgcolor: '#018455',
                    }
                  }}
                >
                  Apply
                </Button>
              </Box>
            </Collapse>
          </FilterSection>

          {/* Clear All Button */}
          {isFiltersActive && (
            <ClearAllButton
              startIcon={<ClearIcon />}
              onClick={handleClearAll}
              variant="text"
            >
              Clear All Filters
            </ClearAllButton>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;