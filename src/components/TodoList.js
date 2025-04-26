import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  TextField,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Badge,
  Stack,
  useTheme,
  Menu,
  InputAdornment,
  Skeleton,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Tune as TuneIcon,
  CalendarToday as CalendarTodayIcon,
  PriorityHigh as PriorityHighIcon,
  AutoFixHigh as AutoFixHighIcon,
  Share as ShareIcon,
  ContentCopy as ContentCopyIcon,
  History as HistoryIcon,
  AccessTime as AccessTimeIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Pending as PendingIcon,
  AddTask as AddTaskIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import NotificationCenter from './NotificationCenter';
import DeleteDialog from './DeleteDialog';
import playNotificationSound from '../utils/notificationSound';
import generateDescription from '../utils/aiDescription';
import { 
  Timeline, 
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent 
} from '@mui/lab';
import { API_URL } from '../config/constants';
import { alpha } from '@mui/material/styles';

const CustomGrid = styled(Grid)(({ theme }) => ({
  '@media (min-width: 0px)': {
    '& .MuiGrid-item': {
      paddingTop: '20px'
    }
  }
}));

const TodoItem = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2.5),
  paddingTop: '30px',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease-in-out',
  borderRadius: '16px',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: '30px',
  }
}));

const TodoContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const TodoActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: 'auto',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    '& > *': {
      width: '100%',
    }
  }
}));

const TimeChip = styled(Chip)(({ theme }) => ({
  maxWidth: '100%',
  height: '32px',
  '& .MuiChip-label': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'center'
  }
}));

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'default';
  }
};

const TodoList = () => {
  const theme = useTheme();
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [sort, setSort] = useState('date'); // date, priority

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: moment().add(1, 'day').format('YYYY-MM-DDTHH:mm'),
  });

  const [editTodo, setEditTodo] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [sortOption, setSortOption] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    priority: 'all',
    status: 'all',
    timeFrame: 'all'
  });

  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [statusRemarks, setStatusRemarks] = useState('');
  const [todoToUpdate, setTodoToUpdate] = useState(null);

  const [statusHistory, setStatusHistory] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [dateRange, setDateRange] = useState([null, null]);

  const priorityColors = {
    low: theme.palette.success.main,
    medium: theme.palette.warning.main,
    high: theme.palette.error.main,
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority 🟢', color: priorityColors.low },
    { value: 'medium', label: 'Medium Priority 🟡', color: priorityColors.medium },
    { value: 'high', label: 'High Priority 🔴', color: priorityColors.high },
  ];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const showNotification = (title, message, priority = 'medium') => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }

    // Web app notification
    const event = new CustomEvent('todoAction', {
      detail: {
        title,
        message,
        priority
      }
    });
    window.dispatchEvent(event);
  };

  const fetchTodos = async () => {
    try {
      // Try to get cached data first
      const cachedData = localStorage.getItem('cachedTodos');
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isCacheValid = Date.now() - timestamp < 60000; // 1 minute cache
        if (isCacheValid) {
          setTodos(data);
          setLoading(false);
          // Fetch fresh data in background
          fetchFreshData();
          return;
        }
      }
      
      // If no cache or expired, fetch fresh data
      await fetchFreshData();
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Failed to fetch todos', 'error');
      setLoading(false);
    }
  };

  const fetchFreshData = async () => {
    const response = await axios.get(`${API_URL}/todos.php`);
    if (response.data) {
      setTodos(Array.isArray(response.data) ? response.data : []);
      // Cache the fresh data
      localStorage.setItem('cachedTodos', JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));
    }
    setLoading(false);
    setIsInitialLoad(false);
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/todos.php`, newTodo);

      showNotification(
        '✨ New Todo Added',
        `"${newTodo.title}" has been added to your todo list`,
        newTodo.priority
      );

      setOpen(false);
      fetchTodos();
      setNewTodo({
        title: '',
        description: '',
        priority: 'medium',
        due_date: moment().add(1, 'day').format('YYYY-MM-DDTHH:mm'),
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      showSnackbar('Failed to add todo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (todoId, newStatus) => {
    try {
      await axios.post(`${API_URL}/todos.php`, {
        action: 'updateStatus',
        id: todoId,
        status: newStatus
      });

      // Play completion sound when marking as completed
      if (newStatus === 'completed') {
        playNotificationSound('completion');
      } else {
        playNotificationSound();
      }

      fetchTodos();
    } catch (error) {
      console.error('Error updating todo status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update todo status',
        severity: 'error'
      });
    }
  };

  const handleEditClick = (todo) => {
    setEditTodo({
      ...todo,
      due_date: moment(todo.due_date).format('YYYY-MM-DDTHH:mm')
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTodo.title.trim() || !editTodo.description.trim()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/todos.php`, editTodo);
      if (response.data.message) {
        showNotification(
          '✏️ Todo Updated',
          `"${editTodo.title}" has been updated successfully`,
          editTodo.priority
        );

        showSnackbar('Todo updated successfully!');
        setEditDialogOpen(false);
        setEditTodo(null);
        setOpenDialog(false); // Close the edit dialog
        await fetchTodos(); // Fetch updated todos
        window.location.reload(); // Reload the page after successful edit
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      showSnackbar('Failed to update todo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (todo) => {
    setTodoToDelete(todo);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!todoToDelete || !todoToDelete.id) return;

    try {
      const response = await axios.delete(`${API_URL}/todos.php`, {
        data: { id: todoToDelete.id }
      });

      if (response.data && response.data.message === "Todo deleted successfully.") {
        showNotification(
          '🗑️ Todo Deleted',
          `"${todoToDelete.title}" has been deleted`,
          'medium'
        );

        // Close all relevant dialogs first
        setDeleteDialogOpen(false);
        setDetailsDialog(false);
        setTodoToDelete(null);

        // Update local state
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoToDelete.id));
        
        // Show success message
        setSnackbar({
          open: true,
          message: 'Todo deleted successfully',
          severity: 'success'
        });

        // Reload the page
        window.location.reload();
      } else {
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting todo',
        severity: 'error'
      });
    }
  };

  const checkDueDates = async () => {
    todos.forEach(async (todo) => {
      if (todo.status !== 'completed') {
        const dueDate = moment(todo.due_date);
        const now = moment();
        const hoursUntilDue = dueDate.diff(now, 'hours');

        if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
          try {
            await axios.post(`${API_URL}/notifications.php`, {
              todo_id: todo.id,
              title: `Reminder: "${todo.title}" is due soon`,
              message: `This task is due ${dueDate.fromNow()}`
            });
          } catch (error) {
            console.error('Error creating notification:', error);
          }
        }
      }
    });
  };

  useEffect(() => {
    fetchTodos();
    // Check due dates every 15 minutes
    const interval = setInterval(checkDueDates, 900000);
    return () => clearInterval(interval);
  }, [filter, sort]);

  const getStatusColor = (dueDate, status) => {
    if (status === 'completed') return 'success';
    return moment(dueDate).isBefore(moment()) ? 'error' : 'primary';
  };

  const filteredTodos = useMemo(() => {
    // Guard clause for when todos is undefined or null
    if (!todos) return [];
    
    // Guard clause for when activeFilters is undefined
    if (!activeFilters) return todos;

    let filtered = todos.filter(todo => {
      // Skip any null or undefined todos
      if (!todo) return false;
      // Ensure todo has required properties
      return typeof todo === 'object' && todo.hasOwnProperty('priority');
    });

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(todo =>
        (todo?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(todo => {
        if (!todo?.due_date) return false;
        const todoDate = new Date(todo.due_date);
        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return todoDate >= startDate && todoDate <= endDate;
      });
    }

    // Priority filter
    if (activeFilters?.priority && activeFilters.priority !== 'all') {
      filtered = filtered.filter(todo => {
        if (!todo?.priority) return false;
        return todo.priority.toLowerCase() === activeFilters.priority.toLowerCase();
      });
    }

    // Status filter
    if (activeFilters?.status && activeFilters.status !== 'all') {
      filtered = filtered.filter(todo => {
        if (!todo?.status) return false;
        return todo.status.toLowerCase() === activeFilters.status.toLowerCase();
      });
    }

    // Time frame filter
    if (activeFilters?.timeFrame && activeFilters.timeFrame !== 'all') {
      const now = moment();
      filtered = filtered.filter(todo => {
        if (!todo?.due_date || !todo?.status) return false;
        const dueDate = moment(todo.due_date);
        switch (activeFilters.timeFrame) {
          case 'today':
            return dueDate.isSame(now, 'day');
          case 'thisWeek':
            return dueDate.isSame(now, 'week');
          case 'overdue':
            return dueDate.isBefore(now, 'day') && todo.status !== 'completed';
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [todos, searchQuery, dateRange, activeFilters]);

  useEffect(() => {
    const handleSearch = (event) => {
      console.log('Search event received:', event.detail.searchQuery);
      setSearchQuery(event.detail.searchQuery);
    };

    const handleFilter = (event) => {
      if (!event.detail) return; // Guard against undefined event detail
      
      if (event.detail.type === 'dateRange') {
        setDateRange([event.detail.value.startDate, event.detail.value.endDate]);
      } else {
        setActiveFilters(prev => ({
          ...prev,
          ...event.detail.filters
        }));
      }
    };

    // Add handler for clear all
    const handleClearAll = () => {
      console.log('Clear all filters');
      setSearchQuery('');
      setActiveFilters({
        priority: 'all',
        status: 'all',
        timeFrame: 'all'
      });
    };

    window.addEventListener('searchQueryChange', handleSearch);
    window.addEventListener('filterChange', handleFilter);
    window.addEventListener('clearAllFilters', handleClearAll);  // Add this listener

    return () => {
      window.removeEventListener('searchQueryChange', handleSearch);
      window.removeEventListener('filterChange', handleFilter);
      window.removeEventListener('clearAllFilters', handleClearAll);  // Clean up
    };
  }, []);

  useEffect(() => {
    const handleFilter = (event) => {
      if (event.detail.type === 'dateRange') {
        setDateRange([event.detail.value.startDate, event.detail.value.endDate]);
      }
    };

    window.addEventListener('filterChange', handleFilter);
    return () => window.removeEventListener('filterChange', handleFilter);
  }, []);

  const handleSortChange = (option) => {
    if (sortOption === option) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('asc');
    }
  };

  const handleGenerateDescription = async (title) => {
    if (!title) {
      setSnackbar({
        open: true,
        message: 'Please enter a task title first',
        severity: 'warning'
      });
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const description = await generateDescription(title);
      if (description) {
        setNewTodo(prev => ({
          ...prev,
          description: description
        }));
        setSnackbar({
          open: true,
          message: 'Description generated successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error in handleGenerateDescription:', error);
      setSnackbar({
        open: true,
        message: 'Failed to generate description',
        severity: 'error'
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setOpen(true);
  };

  useEffect(() => {
    const handleCreateTodo = () => {
      handleOpenCreateDialog();
    };

    window.addEventListener('openCreateTodo', handleCreateTodo);
    return () => window.removeEventListener('openCreateTodo', handleCreateTodo);
  }, []);

  const formatTodoContent = (todo) => {
    const formattedDate = moment(todo.due_date).format('DD/MM/YYYY');
    const formattedTime = moment(todo.due_date).format('hh:mm A');
    const priorityEmoji = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
      
    return `📋 Todo Details:
━━━━━━━━━━━━━━━━━━━━━
📌 Title: ${todo.title}
📝 Description: ${todo.description}
${priorityEmoji[todo.priority.toLowerCase()]} Priority: ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
🗓️ Due Date: ${formattedDate}
⏰ Due Time: ${formattedTime}
✅ Status: ${todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
━━━━━━━━━━━━━━━━━━━━━

🎯 Stay focused and complete your tasks!`;
  };

  const handleCopy = async (todo) => {
    try {
    const formattedContent = formatTodoContent(todo);
      await navigator.clipboard.writeText(formattedContent);
      showSnackbar('Todo details copied to clipboard', 'success');
    } catch (error) {
      console.error('Error copying:', error);
      showSnackbar('Failed to copy todo details', 'error');
    }
  };

  const handleShare = async (todo) => {
    try {
      const shareText = formatTodoContent(todo);

    if (navigator.share) {
        await navigator.share({
          title: `Todo: ${todo.title}`,
          text: shareText
        });
        showSnackbar('Todo details shared successfully', 'success');
      } else {
        await navigator.clipboard.writeText(shareText);
        showSnackbar('Todo details copied to clipboard', 'success');
      }
      } catch (error) {
      console.error('Error sharing:', error);
      showSnackbar('Failed to share todo details', 'error');
    }
  };

  const handleCardClick = (todo) => {
    setSelectedTodo(todo);
    fetchStatusHistory(todo.id);
    setDetailsDialog(true);
  };

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setDetailsDialog(false);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/todos.php?action=delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: todo.id })
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Close any open dialogs
        setDetailsDialog(false);
        setStatusUpdateDialog(false);
        
        // Update the todos list immediately
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        
        // Show success message
        showSnackbar('Todo deleted successfully', 'success');
        
        // Clear selected todo
        setSelectedTodo(null);
    } else {
        throw new Error(data.message || 'Failed to delete todo');
      }
      } catch (error) {
      console.error('Error deleting todo:', error);
      showSnackbar('Failed to delete todo', 'error');
    }
  };

  const handleToggleStatus = async (todo) => {
    try {
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
      
      // Log the request data for debugging
      console.log('Updating todo:', {
        action: 'updateStatus',
        id: todo.id,
        status: newStatus
      });

      // Make the API call using axios
      const response = await axios.post(`${API_URL}/todos.php`, {
        action: 'updateStatus',
        id: todo.id,
        status: newStatus
      });

      if (response.data.status === 'success') {
        // Update local state
        setTodos(prevTodos => 
          prevTodos.map(t => 
            t.id === todo.id ? {...t, status: newStatus} : t
          )
        );
        
        if (selectedTodo && selectedTodo.id === todo.id) {
          setSelectedTodo(prev => ({...prev, status: newStatus}));
        }
        
        showSnackbar(`Todo marked as ${newStatus}`, 'success');
        setDetailsDialog(false);
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating todo status:', error);
      showSnackbar('Failed to update todo status', 'error');
    }
  };

  const handleStatusUpdateClick = (todo) => {
    setTodoToUpdate(todo);
    setStatusRemarks('');
    setStatusUpdateDialog(true);
    setDetailsDialog(false); // Close the details dialog
  };

  const handleStatusUpdate = async () => {
    if (!todoToUpdate) return;

    try {
      // Convert status to the correct format
      const newStatus = todoToUpdate.status === 'completed' ? 'pending' : 'completed';
      
      // Create the request payload
      const payload = {
        action: 'updateStatus',
        id: parseInt(todoToUpdate.id), // Ensure ID is a number
        status: newStatus,
        remarks: statusRemarks || ''
      };

      // Debug log
      console.log('Sending status update with payload:', payload);
      
      const response = await axios.post(`${API_URL}/todos.php`, payload);

      // Debug log
      console.log('Received response:', response.data);

      if (response.data.status === 'success') {
        // Update local state
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoToUpdate.id
              ? { ...todo, status: newStatus }
              : todo
          )
        );

        // Show success notification
        showSnackbar(`Todo marked as ${newStatus}`, 'success');

        // Close dialog and reset state
        setStatusUpdateDialog(false);
        setTodoToUpdate(null);
        setStatusRemarks('');
        
        // Refresh todos list
        fetchTodos();
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating todo status:', error);
      console.error('Error details:', error.response?.data || error.message);
      showSnackbar(error.response?.data?.message || 'Failed to update todo status', 'error');
    }
  };

  const fetchStatusHistory = async (todoId) => {
    try {
      const response = await axios.get(`${API_URL}/todos-history.php`, {
        params: { id: todoId },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setStatusHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching status history:', error);
      showSnackbar('Failed to fetch status history', 'error');
      setStatusHistory([]);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ActionButtons = ({ todo, isMobile }) => {
    const buttonProps = {
      size: isMobile ? 'small' : 'medium',
      sx: {
        minWidth: isMobile ? 'auto' : undefined,
        px: isMobile ? 1 : 2,
        '& .MuiButton-startIcon': {
          mr: isMobile ? 0 : 1
        }
      }
    };

    return (
      <Stack 
        direction="row" 
        spacing={1}
        sx={{
          flexWrap: 'nowrap',
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': {
            height: '4px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px'
          }
        }}
      >
        <Tooltip title="Copy">
          <Button
            {...buttonProps}
            startIcon={<ContentCopyIcon />}
            onClick={() => handleCopy(todo)}
            variant="outlined"
            color="success"
          >
            {!isMobile && "Copy"}
          </Button>
        </Tooltip>

        <Tooltip title="Share">
          <Button
            {...buttonProps}
            startIcon={<ShareIcon />}
            onClick={() => handleShare(todo)}
            variant="outlined"
            color="info"
          >
            {!isMobile && "Share"}
          </Button>
        </Tooltip>

        <Tooltip title="Edit">
          <Button
            {...buttonProps}
            startIcon={<EditIcon />}
            onClick={() => handleEdit(todo)}
            variant="outlined"
            color="primary"
          >
            {!isMobile && "Edit"}
          </Button>
        </Tooltip>

        <Tooltip title="Delete">
          <Button
            {...buttonProps}
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(todo)}
            variant="outlined"
            color="error"
          >
            {!isMobile && "Delete"}
          </Button>
        </Tooltip>

        <Tooltip title={todo.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}>
          <Button
            {...buttonProps}
            startIcon={<CheckCircleIcon />}
            onClick={() => handleStatusUpdateClick(todo)}
            variant="contained"
            color={todo.status === 'completed' ? 'success' : 'inherit'}
          >
            {!isMobile && (todo.status === 'completed' ? 'Completed' : 'Complete')}
          </Button>
        </Tooltip>
      </Stack>
    );
  };

  useEffect(() => {
    if (!selectedTodo) {
      setDetailsDialog(false);
      setStatusUpdateDialog(false);
    }
  }, [selectedTodo]);

  // Add loading skeleton component
  const LoadingSkeleton = () => (
    <CustomGrid container spacing={2}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
          <TodoItem elevation={1}>
            {/* Priority Badge */}
            <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
              <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: '16px' }} />
            </Box>

            {/* Title and Description */}
            <Box sx={{ mb: 2, mt: 1 }}>
              <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
            </Box>

            {/* Date and Time */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width={80} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width={60} />
              </Box>
            </Box>

            {/* Status and Creation Time */}
            <Box sx={{ 
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1
            }}>
              <Skeleton variant="rectangular" width={90} height={32} sx={{ borderRadius: '16px' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width={80} />
              </Box>
            </Box>
          </TodoItem>
        </Grid>
      ))}
    </CustomGrid>
  );

  const CreateTodoDialog = ({ open, onClose }) => {
    // Set default values when dialog opens
    const getDefaultFormData = () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add exactly 24 hours in milliseconds
      
      // Format: YYYY-MM-DDTHH:mm
      const formattedDateTime = tomorrow.toISOString().slice(0, 16);
      
      return {
        title: '',
        description: '',
        priority: 'medium', // Default priority
        due_date: formattedDateTime
      };
    };

    // Initialize form data with defaults
    const [formData, setFormData] = useState(getDefaultFormData());

    // Reset form with defaults when dialog opens
    useEffect(() => {
      if (open) {
        setFormData(getDefaultFormData());
      }
    }, [open]);

    // Handle input changes without causing full re-renders
    const handleInputChange = (field) => (event) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    };

    const isValidTodo = () => {
      return (
        formData.title?.trim() !== '' && 
        formData.description?.trim() !== '' && 
        formData.priority && 
        formData.due_date
      );
    };

    const handleCreateTodo = async () => {
      if (!isValidTodo()) return;
      
      try {
        // Send JSON data instead of FormData
        const response = await fetch(`${API_URL}/todos.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            due_date: formData.due_date
          })
        });

        const data = await response.json();
        
        if (data.message === "Todo created successfully.") {
          // Show success message
          showSnackbar('Todo created successfully', 'success');
          
          // Reset form
          setFormData(getDefaultFormData());
          
          // Close the dialog
          onClose();
          
          // Refresh todos list
          await fetchTodos();
        } else {
          throw new Error(data.message || 'Failed to create todo');
        }
      } catch (error) {
        console.error('Error creating todo:', error);
        showSnackbar('Failed to create todo', 'error');
      }
    };

    return (
      <Dialog 
        open={open} 
        onClose={() => {
          setFormData(getDefaultFormData()); // Reset form on close
          onClose();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 3,
          py: 2
        }}>
          <AddTaskIcon />
          Add New Todo
        </DialogTitle>

        <DialogContent sx={{ mt: 2, px: 3, py: 2, pt: '12px'}}>
          <TextField
            fullWidth
            required
            label="Title"
            placeholder="Enter todo title"
            value={formData.title}
            onChange={handleInputChange('title')}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Description"
            placeholder="Add any important details or context"
            value={formData.description}
            onChange={handleInputChange('description')}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                  <DescriptionIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            required
            label="Priority"
            value={formData.priority}
            onChange={handleInputChange('priority')}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlagIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          >
            {priorityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: option.color
                    }}
                  />
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            required
            type="datetime-local"
            label="Due Date"
            value={formData.due_date}
            onChange={handleInputChange('due_date')}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          gap: 1
        }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateTodo}
            disabled={!isValidTodo()}
            sx={{ 
              flex: 1,
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.dark'
              }
            }}
          >
            Add Todo
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  try {
    return (
      <Box sx={{
        p: 3,
        mt: 0  // Changed from mt: 8 to mt: 0
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: 2
        }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 500,
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              mt: 3
            }}
          >
                Todo List
            <Chip
              label={todos.length}
              color="primary"
              size="small"
              sx={{
                borderRadius: '12px',
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '1rem' },
              }}
            />
              </Typography>
        </Box>

        {isInitialLoad ? (
          <LoadingSkeleton />
        ) : loading ? (
          <LoadingSkeleton />
        ) : todos.length === 0 ? (
          <Fade in={true}>
            <Paper
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.default'
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No todos found matching your criteria
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<AddIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 20,
                  px: 3
                }}
              >
                Create Todo
              </Button>
            </Paper>
          </Fade>
        ) : (
          <Fade in={true}>
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ mt: 1 }}>
              {filteredTodos.map((todo) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={todo.id}>
                  <TodoItem 
                    elevation={1}
                    onClick={() => handleCardClick(todo)}
                  >
                    <Chip
                      label={todo.priority}
                      color={getPriorityColor(todo.priority)}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        position: 'absolute',
                        right: { xs: 6, sm: 8 },
                        top: { xs: 6, sm: 8 },
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                        height: { xs: '24px', sm: '32px' },
                        '& .MuiChip-label': {
                          px: { xs: 1.5, sm: 2 }
                        }
                      }}
                    />

                    <Box sx={{ mb: 2, mt: { xs: 0.5, sm: 1 } }}>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"}
                        component="h2"
                        sx={{ 
                          fontWeight: 600,
                          mb: { xs: 0.75, sm: 1 },
                          pr: { xs: 3.5, sm: 4 },
                          fontSize: {
                            xs: '1rem',
                            sm: '1.1rem',
                            md: '1.25rem'
                          },
                          lineHeight: 1.3,
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {todo.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: { xs: '32px', sm: '40px' },
                          fontSize: {
                            xs: '0.8125rem',
                            sm: '0.875rem'
                          },
                          lineHeight: 1.5,
                          opacity: 0.8
                        }}
                      >
                        {todo.description}
                      </Typography>
                    </Box>

                    <Box 
                      sx={{ 
                        display: 'flex',
                        gap: { xs: 1.5, sm: 2 },
                        mb: 2,
                        flexWrap: 'wrap'
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: { xs: 0.5, sm: 0.75 },
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        px: { xs: 1, sm: 1.5 },
                        py: { xs: 0.5, sm: 0.75 },
                        borderRadius: '8px'
                      }}>
                        <CalendarTodayIcon 
                          sx={{
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            color: 'primary.main',
                            opacity: 0.8
                          }}
                        />
                        <Typography 
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            color: 'primary.main',
                            fontWeight: 500
                          }}
                        >
                          {moment(todo.due_date).format('DD/MM/YYYY')}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: { xs: 0.5, sm: 0.75 },
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        px: { xs: 1, sm: 1.5 },
                        py: { xs: 0.5, sm: 0.75 },
                        borderRadius: '8px'
                      }}>
                        <AccessTimeIcon 
                          sx={{
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            color: 'primary.main',
                            opacity: 0.8
                          }}
                        />
                        <Typography 
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            color: 'primary.main',
                            fontWeight: 500
                          }}
                        >
                          {moment(todo.due_date).format('hh:mm A')}
                        </Typography>
                      </Box>
                    </Box>

                    <Box 
                      sx={{ 
                        mt: 'auto',
                        pt: { xs: 1.5, sm: 2 },
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: { xs: 0.75, sm: 1 }
                      }}
                    >
                      <Chip
                        icon={todo.status === 'completed' ? 
                          <CheckCircleIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} /> : 
                          <PendingIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                        }
                        label={todo.status}
                        size={isMobile ? "small" : "medium"}
                        color={todo.status === 'completed' ? 'success' : 'default'}
                        variant="outlined"
                        sx={{ 
                          textTransform: 'capitalize',
                          minWidth: { xs: 80, sm: 90 },
                          height: { xs: '24px', sm: '32px' },
                          '& .MuiChip-label': {
                            px: { xs: 1, sm: 1.5 },
                            fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                          },
                          '& .MuiChip-icon': {
                            ml: { xs: 0.5, sm: 0.75 }
                          }
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: { xs: 0.25, sm: 0.5 },
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          opacity: 0.8
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 'inherit' }} />
                        {moment(todo.created_at).fromNow()}
                      </Typography>
                    </Box>
                  </TodoItem>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}

        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 300
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <CreateTodoDialog
          open={open}
          onClose={() => setOpen(false)}
        />

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          aria-labelledby="edit-todo-title"
          PaperProps={{
            elevation: 0,
            sx: {
              borderRadius: { xs: '12px 12px 0 0', sm: 2 },
              margin: { xs: 0, sm: 2 },
              maxHeight: { xs: '100%', sm: '90vh' },
              position: { xs: 'absolute', sm: 'relative' },
              bottom: { xs: 0, sm: 'auto' },
              width: '100%'
            }
          }}
        >
          <form onSubmit={handleEditSubmit}>
            <DialogTitle 
              id="edit-todo-title"
              sx={{
                background: 'linear-gradient(45deg, #00A389 30%, #00BFA6 90%)',
                color: 'white',
                p: { xs: 2, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                '& .MuiTypography-root': {
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  fontWeight: 500
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EditIcon aria-hidden="true" />
                <span>Edit Todo</span>
              </Box>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                aria-label="Save changes"
                sx={{
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  textTransform: 'none',
                  fontWeight: 500,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'primary.main' }} aria-label="Loading" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogTitle>

            <DialogContent 
              sx={{ 
                p: { xs: 2, sm: 3 },
                height: { xs: 'calc(100vh - 70px)', sm: 'auto' },
                overflowY: 'auto'
              }}
            >
              <TextField
                autoFocus
                fullWidth
                id="edit-todo-title"
                label="Title"
                placeholder="Enter a clear and specific task"
                value={editTodo?.title || ''}
                onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                required
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                helperText="Be specific about what needs to be accomplished"
              />

              <TextField
                fullWidth
                id="edit-todo-details"
                label="Description"
                placeholder="Add any important details or context"
                multiline
                rows={4}
                value={editTodo?.description || ''}
                onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
                required
                helperText="Include any relevant information others might need"
                sx={{
                  mb: { xs: 2, sm: 3 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1, mr: 1 }}>
                      <Tooltip title="Generate AI Description">
                        <IconButton
                          onClick={() => handleGenerateDescription(editTodo?.title)}
                          disabled={isGeneratingDescription || !editTodo?.title}
                          color="primary"
                          size="small"
                          aria-label="Generate AI description"
                          sx={{
                            bgcolor: 'background.paper',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          {isGeneratingDescription ? (
                            <CircularProgress size={20} aria-label="Generating description" />
                          ) : (
                            <AutoFixHighIcon aria-hidden="true" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                select
                fullWidth
                id="edit-todo-priority"
                label="Priority"
                value={editTodo?.priority || 'medium'}
                onChange={(e) => setEditTodo({ ...editTodo, priority: e.target.value })}
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                helperText="Select the urgency level of this task"
              >
                {priorityOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1.5
                    }}
                  >
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: option.color,
                        display: 'inline-block'
                      }}
                    />
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                id="edit-todo-due-date"
                type="datetime-local"
                label="Due Date"
                value={editTodo?.due_date || ''}
                onChange={(e) => setEditTodo({ ...editTodo, due_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText="When should this task be completed?"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </DialogContent>
          </form>
        </Dialog>

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setTodoToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          todoTitle={todoToDelete?.title || ''}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          sx={{
            bottom: { xs: 16, sm: 24 }
          }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: 400 }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog
          open={detailsDialog && selectedTodo !== null} 
          onClose={() => {
            setDetailsDialog(false);
            setSelectedTodo(null);
          }}
          maxWidth="md"
          fullWidth
        >
          {selectedTodo && (
            <>
              <DialogTitle sx={{ 
                borderBottom: '1px solid',
                borderColor: 'divider',
                  bgcolor: selectedTodo.status === 'completed' ? 'success.main' : 'primary.main',
                  color: 'white',
                  display: 'flex',
                justifyContent: 'space-between',
                  alignItems: 'center',
                transition: 'background-color 0.3s ease'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedTodo.status === 'completed' ? 
                    <CheckCircleIcon /> : 
                    <PendingIcon />
                  }
                  Todo Details
                </Box>
                <Chip 
                  label={selectedTodo.status.toUpperCase()}
                  color={selectedTodo.status === 'completed' ? 'success' : 'default'}
                  sx={{ 
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    '& .MuiChip-label': { px: 2 }
                  }}
                />
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                {/* Todo Details Card */}
                <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    {selectedTodo.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {selectedTodo.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarTodayIcon color="action" fontSize="small" />
                        <Typography variant="body2">
                          Due: {moment(selectedTodo.due_date).format('DD/MM/YYYY')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon color="action" fontSize="small" />
                        <Typography variant="body2">
                          Time: {moment(selectedTodo.due_date).format('hh:mm A')}
                    </Typography>
                  </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FlagIcon color="action" fontSize="small" />
                        <Typography variant="body2">
                          Priority: {selectedTodo.priority.toUpperCase()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentTurnedInIcon color="action" fontSize="small" />
                        <Typography variant="body2">
                          Current Status: {selectedTodo.status.toUpperCase()}
                    </Typography>
                  </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Status History Timeline */}
                {statusHistory && statusHistory.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon /> Status History
                  </Typography>
                    <Timeline position="alternate">
                      {statusHistory.map((history, index) => (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent color="text.secondary">
                            {moment(history.updated_at).format('DD/MM/YYYY hh:mm A')}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot 
                              color={history.status === 'completed' ? 'success' : 'primary'}
                              variant={index === 0 ? 'filled' : 'outlined'}
                            >
                              {history.status === 'completed' ? 
                                <CheckCircleIcon fontSize="small" /> : 
                                <PendingIcon fontSize="small" />
                              }
                            </TimelineDot>
                            {index < statusHistory.length - 1 && <TimelineConnector />}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Paper elevation={0} variant="outlined" sx={{ 
                              p: 2,
                              bgcolor: index === 0 ? 'action.hover' : 'transparent'
                            }}>
                              <Typography variant="subtitle2" color="text.primary">
                                Status changed to: <strong>{history.status.toUpperCase()}</strong>
                            </Typography>
                              {history.remarks && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  "{history.remarks}"
                                </Typography>
                              )}
                            </Paper>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </Box>
                  )}
              </DialogContent>
              <DialogActions 
                sx={{ 
                  p: 2, 
                  borderTop: '1px solid', 
                  borderColor: 'divider',
                  bgcolor: 'grey.50',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                <ActionButtons todo={selectedTodo} isMobile={isMobile} />
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleEditSubmit}>
            <DialogTitle sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
              py: 2,
              borderRadius: '8px 8px 0 0'
            }}>
              <Typography variant="h6" component="div">
                Edit Todo
              </Typography>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </DialogTitle>
            <DialogContent sx={{ pt: 2, mt: 2 }}>
              <TextField
                fullWidth
                id="edit-todo-title"
                label="Title"
                value={editTodo?.title || ''}
                onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                required
                sx={{ mb: 2, mt: 2, borderRadius: 2 }}
              />
              <TextField
                fullWidth
                id="edit-todo-details"
                label="Description"
                placeholder="Add any important details or context"
                multiline
                rows={4}
                value={editTodo?.description || ''}
                onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
                required
                helperText="Include any relevant information others might need"
                sx={{
                  mb: { xs: 2, sm: 3 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1, mr: 1 }}>
                      <Tooltip title="Generate AI Description">
                        <IconButton
                          onClick={() => handleGenerateDescription(editTodo?.title)}
                          disabled={isGeneratingDescription || !editTodo?.title}
                          color="primary"
                          size="small"
                          aria-label="Generate AI description"
                          sx={{
                            bgcolor: 'background.paper',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          {isGeneratingDescription ? (
                            <CircularProgress size={20} aria-label="Generating description" />
                          ) : (
                            <AutoFixHighIcon aria-hidden="true" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                select
                fullWidth
                id="edit-todo-priority"
                label="Priority"
                value={editTodo?.priority || 'medium'}
                onChange={(e) => setEditTodo({ ...editTodo, priority: e.target.value })}
                sx={{ mb: 2, borderRadius: 2 }}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                id="edit-todo-due-date"
                label="Due Date"
                type="datetime-local"
                value={editTodo?.due_date || ''}
                onChange={(e) => setEditTodo({ ...editTodo, due_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ borderRadius: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <AccessTimeIcon />
                    </InputAdornment>
                  )
                }}
              />
            </DialogContent>
          </form>
        </Dialog>

        <Dialog
          open={statusUpdateDialog}
          onClose={() => setStatusUpdateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: 'primary.main',
            color: 'white'
          }}>
            Update Todo Status
          </DialogTitle>
          <DialogContent sx={{ mt: 2, pb: 1 }}>
            {todoToUpdate && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Are you sure you want to mark this todo as {todoToUpdate.status === 'completed' ? 'pending' : 'completed'}?
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Todo: {todoToUpdate.title}
                </Typography>
            <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Add remarks (optional)"
              value={statusRemarks}
              onChange={(e) => setStatusRemarks(e.target.value)}
              margin="normal"
                  variant="outlined"
                  placeholder="Enter any additional notes about this status change..."
            />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setStatusUpdateDialog(false)}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              variant="contained"
              color="primary"
              startIcon={<CheckCircleIcon />}
            >
              Confirm Status Change
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  } catch (error) {
    console.error('Error in TodoList:', error);
    return <div>Error loading todos. Please try again.</div>;
  }
};

export default React.memo(TodoList);