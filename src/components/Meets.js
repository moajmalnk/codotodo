import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Paper,
  Snackbar,
  Alert,
  Tooltip,
  Chip,
  InputAdornment,
  CircularProgress,
  Autocomplete,
  Avatar,
  Grid,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  Menu,
  MenuItem,
  Skeleton,
  Link,
  Stack,
  AvatarGroup,
  useMediaQuery
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import VideocamIcon from '@mui/icons-material/Videocam';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isBetween from 'dayjs/plugin/isBetween';
import TuneIcon from '@mui/icons-material/Tune';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import playNotificationSound from '../utils/notificationSound';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import GroupIcon from '@mui/icons-material/Group';
import { blue, green, orange, purple } from '@mui/material/colors';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AddCircleOutline } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import { Fade } from '@mui/material';
import { GlobalContext } from '../context/GlobalContext';
import ShareIcon from '@mui/icons-material/Share';
import { API_URL } from '../config/constants';
import { alpha } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingIcon from '@mui/icons-material/Pending';
import { useTheme } from '@mui/material/styles';
import {
  Timeline as MUITimeline,
  TimelineItem as MUITimelineItem,
  TimelineSeparator as MUITimelineSeparator,
  TimelineConnector as MUITimelineConnector,
  TimelineContent as MUITimelineContent,
  TimelineDot as MUITimelineDot,
  TimelineOppositeContent as MUITimelineOppositeContent
} from '@mui/lab';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HistoryIcon from '@mui/icons-material/History';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import LinkIcon from '@mui/icons-material/Link';
import { useLocation } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';

// Initialize dayjs plugins
dayjs.extend(weekOfYear);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);

// Styled components
const MeetItem = styled(Paper)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const MeetContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const TimeChip = styled(Chip)(({ theme }) => ({
  borderRadius: '16px',
  '& .MuiChip-label': {
    paddingLeft: theme.spacing(0.5),
  },
}));

const CustomGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
  },
}));

// Styled components for better reusability and consistency
const FilterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 200,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const FilterHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
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

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[2],
    },
    '&.Mui-focused': {
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[3],
    }
  }
}));

// Add these enhanced styled components
const MeetCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2.5),
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  borderRadius: '16px',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  }
}));

const PriorityBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: '12px',
  right: '12px',
  height: '24px',
  padding: '0 8px',
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.error.main, 0.1),
  color: theme.palette.error.main,
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase'
}));

// Add LoadingSkeleton component
const LoadingSkeleton = () => (
  <Grid container spacing={3}>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
        <MeetCard elevation={1}>
          {/* Priority Badge */}
          <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: '12px' }} />
          </Box>

          {/* Title */}
          <Box sx={{ mb: 2, pr: 4 }}>
            <Skeleton variant="text" height={28} width="90%" />
            <Skeleton variant="text" height={28} width="70%" />
          </Box>

          {/* Date and Time */}
          <Box sx={{ mb: 2 }}>
            <Skeleton
              variant="rectangular"
              width={120}
              height={32}
              sx={{
                borderRadius: 1,
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1)
              }}
            />
          </Box>

          {/* Status and Time */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: '12px' }} />
            <Skeleton variant="text" width={100} />
          </Box>

          {/* Description/Agenda */}
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </Box>

          {/* Attendees Section */}
          <Box sx={{
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton variant="circular" width={28} height={28} />
            </Box>
            <Skeleton variant="text" width={80} />
          </Box>
        </MeetCard>
      </Grid>
    ))}
  </Grid>
);

// Add new styled components
const DetailDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '800px',
    width: '100%',
    margin: theme.spacing(2),
    background: theme.palette.background.paper,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      maxHeight: '95vh'
    }
  }
}));

const DetailHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3, 4),
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'rgba(255,255,255,0.1)'
  }
}));

const DetailContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  },
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 200px)',
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.light,
    borderRadius: '4px'
  }
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateX(4px)'
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    fontSize: '1.5rem'
  }
}));

const StatusHistoryItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  marginBottom: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.default, 0.9),
    transform: 'translateX(4px)'
  }
}));

// Add new styled component for action buttons
const ActionButtonsContainer = styled(Stack)(({ theme }) => ({
  flexWrap: 'nowrap',
  overflowX: 'auto',
  paddingBottom: theme.spacing(1),
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
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  padding: '6px 16px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[2],
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  }
}));

const MeetStatusChip = styled(Chip)(({ theme, statusvalue }) => ({
  borderRadius: '12px',
  height: '24px',
  backgroundColor: statusvalue === 1
    ? theme.palette.success.light
    : theme.palette.warning.light,
  color: statusvalue === 1
    ? theme.palette.success.dark
    : theme.palette.warning.dark,
  '& .MuiChip-label': {
    fontSize: '0.75rem',
    fontWeight: 500,
    padding: '0 8px'
  }
}));

// Add these styled components
const StatusTimelineContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(3)
  }
}));

const StatusTimelineHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    padding: theme.spacing(1),
    borderRadius: '50%',
    fontSize: '1.5rem'
  }
}));

// Add these styled components
const AddMeetingDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1)
    }
  }
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem'
  }
}));

const FormContainer = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}));

// Add these styled components
const AddMeetingButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.5, 3),
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(1.2, 2),
    fontSize: '0.9rem',
  }
}));

const AddMeetingIcon = styled(AddIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  fontSize: '1.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  }
}));

// Add this styled component
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    }
  },
  '& .MuiInputAdornment-root': {
    '& .MuiSvgIcon-root': {
      fontSize: '1.3rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1.5, 2),
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.2, 1.5),
      fontSize: '0.9rem',
    }
  }
}));

// Add ErrorBoundary component at the top
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return <Box sx={{ p: 3 }}>Something went wrong. Please refresh the page.</Box>;
    }
    return this.props.children;
  }
}

const Meets = () => {
  const {
    searchTerm,
    setSearchTerm,
    priority,
    setPriority,
    status,
    setStatus,
    dueDate,
    setDueDate,
    setSnackbar
  } = useContext(GlobalContext);
  const [meets, setMeets] = useState([]);
  const [meetLink, setMeetLink] = useState('https://meet.google.com/oas-nfxr-bvf');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingTime, setMeetingTime] = useState(new Date());
  const [attendees, setAttendees] = useState('');
  const [agenda, setAgenda] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editMeetId, setEditMeetId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [meetToDelete, setMeetToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isGeneratingAgenda, setIsGeneratingAgenda] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [dueDateAnchorEl, setDueDateAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    dueDate: 'all'
  });
  const [sortBy, setSortBy] = useState('date');
  const [attendeesList, setAttendeesList] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [meetToEdit, setMeetToEdit] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sort, setSort] = useState('date');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMeet, setSelectedMeet] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const theme = useTheme();
  const matches = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const [dateRange, setDateRange] = useState([null, null]);

  const suggestedAttendees = [
    {
      name: 'AJMAL NK',
      email: 'moajmalnk@gmail.com',
      role: 'Project Manager',
      department: 'Management',
      color: blue[500]
    },
    {
      name: 'Ayishath Lubaba',
      email: 'ayishathlubabka@gmail.com',
      role: 'Developer',
      department: 'Engineering',
      color: green[500]
    },
    {
      name: 'Shihal CK',
      email: 'shihalckmo@gmail.com',
      role: 'Developer',
      department: 'Engineering',
      color: purple[500]
    },
    {
      name: 'Ajmal P',
      email: 'info.ajmalp@gmail.com',
      role: 'Developer',
      department: 'Engineering',
      color: orange[500]
    }
  ];

  const defaultMeetLink = 'https://meet.google.com/oas-nfxr-bvf';

  useEffect(() => {
    fetchMeets(true);
    return () => setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    const savedMeets = localStorage.getItem('meets');
    if (savedMeets) {
      setMeets(JSON.parse(savedMeets));
    }
  }, []);

  const fetchMeets = async (showLoadingState = false, isLoadMore = false) => {
    try {
      if (showLoadingState && !isLoadMore) {
        setLoading(true);
      }

      const response = await axios.get(`${API_URL}/meets.php`);

      if (response.data) {
        const formattedMeets = Array.isArray(response.data) ? response.data : [];
        setMeets(formattedMeets);

        // Update cache
        localStorage.setItem('cachedMeets', JSON.stringify({
          data: formattedMeets,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const createNotification = async (title, message, priority = 'medium') => {
    try {
      const event = new CustomEvent('todoAction', {
        detail: { title, message, priority }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleAddMeet = async () => {
    if (!meetingTitle || !meetingTime || !meetLink) {
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Please fill in all required fields',
          type: 'error',
          icon: 'Error'
        }
      });
      window.dispatchEvent(event);
      return;
    }

    try {
      // Clean up the data before sending
      const cleanMeetingTitle = meetingTitle.replace(/window\.dispatch.*?\)/, '').trim();
      const cleanAgenda = agenda.replace(/window\.dispatch.*?\)/, '').trim();

      const meetData = {
        meeting_title: cleanMeetingTitle,
        meeting_time: dayjs(meetingTime).format('YYYY-MM-DD HH:mm:ss'),
        meet_link: meetLink || defaultMeetLink,
        agenda: cleanAgenda,
        attendees: attendees || '',
        status: 0
      };

      const response = await axios.post(`${API_URL}/meets.php`, meetData);

      if (response.data) {
        // System notification
        showNotification(
          '✨ Meet Created',
          `"${cleanMeetingTitle}" has been created`,
          'medium'
        );

        // Close all dialogs first
        setOpenDialog(false);
        setViewDialogOpen(false);
        setSelectedMeet(null);

        // Reset form
        setMeetingTitle('');
        setMeetingTime(new Date());
        setMeetLink(defaultMeetLink);
        setAgenda('');
        setAttendees('');

        // Bottom popup notification
        const event = new CustomEvent('showToast', {
          detail: {
            message: 'Meet created successfully',
            type: 'success',
            icon: 'CheckCircle'
          }
        });
        window.dispatchEvent(event);

        // Fetch updated data immediately
        await fetchMeets(true);
      }
    } catch (error) {
      console.error('Error:', error);
      const event = new CustomEvent('showToast', {
        detail: {
          message: error.message || 'Failed to create meet',
          type: 'error',
          icon: 'Error'
        }
      });
      window.dispatchEvent(event);
    }
  };

  const handleEdit = (meet) => {
    // Set all the form fields with the meet data
    setMeetingTitle(meet.meeting_title || '');
    setMeetingTime(meet.meeting_time ? new Date(meet.meeting_time) : new Date());
    setMeetLink(meet.meet_link || defaultMeetLink);
    setAgenda(meet.agenda || '');
    setAttendees(meet.attendees || '');

    // Set edit mode and selected meet
    setEditMode(true);
    setSelectedMeet(meet);

    // Close view dialog and open edit dialog
    setViewDialogOpen(false);
    setOpenDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      if (!selectedMeet?.id || !meetingTitle || !meetingTime || !meetLink) {
        throw new Error('Please fill in all required fields');
      }

      const meetData = {
        id: selectedMeet.id,
        meeting_title: meetingTitle,
        meeting_time: dayjs(meetingTime).format('YYYY-MM-DD HH:mm:ss'),
        meet_link: meetLink || defaultMeetLink,
        agenda: agenda || '',
        attendees: attendees || '',
        status: selectedMeet.status || 0
      };

      const response = await axios.put(`${API_URL}/meets.php`, meetData);

      if (response.data?.success) {
        setMeets(prevMeets =>
          prevMeets.map(meet =>
            meet.id === selectedMeet.id ? { ...meet, ...meetData } : meet
          )
        );

        showNotification(
          '📝 Meet Updated',
          `"${meetingTitle}" has been updated`,
          'medium'
        );

        resetFormAndClose();
        await fetchMeets(true);
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMeet || !selectedMeet.id) return;

    try {
      const response = await axios.delete(`${API_URL}/meets.php`, {
        params: { id: selectedMeet.id }
      });

      if (response.data && response.data.status === 'success') {
        // System notification
        showNotification(
          '🗑️ Meet Deleted',
          `"${selectedMeet.meeting_title}" has been deleted`,
          'medium'
        );

        // Close all relevant dialogs first
        setDeleteConfirmOpen(false);
        setViewDialogOpen(false);
        setSelectedMeet(null);

        // Update local state
        setMeets(prevMeets => prevMeets.filter(meet => meet.id !== selectedMeet.id));

        // Bottom popup notification (Snackbar)
        const event = new CustomEvent('showToast', {
          detail: {
            message: 'Meet deleted successfully',
            type: 'success',
            icon: 'CheckCircle'
          }
        });
        window.dispatchEvent(event);

        // Fetch updated data immediately
        await fetchMeets(true);
      } else {
        throw new Error('Failed to delete meet');
      }
    } catch (error) {
      console.error('Error deleting meet:', error);

      // Error bottom popup notification
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Error deleting meet',
          type: 'error',
          icon: 'Error'
        }
      });
      window.dispatchEvent(event);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setViewDialogOpen(false);
    setEditMode(false);
    setMeetToEdit(null);
    resetForm();
  };

  const handleDeleteClick = (meet) => {
    setMeetToDelete(meet);
    setDeleteConfirmOpen(true);
  };

  const handleCopy = async (meet) => {
    try {
      const formattedContent = formatMeetContent(meet);
      await navigator.clipboard.writeText(formattedContent);
      showSnackbar('Meeting details copied to clipboard', 'success');
    } catch (error) {
      console.error('Error copying:', error);
      showSnackbar('Failed to copy meeting details', 'error');
    }
  };

  const handleJoinMeet = (link) => {
    window.open(link, '_blank');
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleDueDateClick = (event) => {
    setDueDateAnchorEl(event.currentTarget);
  };

  const handleDueDateClose = () => {
    setDueDateAnchorEl(null);
  };

  const handleDueDateFilter = (filter) => {
    setFilters({ ...filters, dueDate: filter });
    handleDueDateClose();
  };

  const handleSortChange = (type) => {
    setSort(type);
  };

  const getFilteredMeets = () => {
    return meets.filter(meet => {
      const meetDate = dayjs(meet.meeting_time);
      const now = dayjs();
      const searchFields = [
        meet.meeting_title,
        meet.agenda,
        meet.attendees
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesSearch = !searchTerm ||
        searchFields.includes(searchTerm.toLowerCase());

      const matchesDueDate = dueDate === 'all' ||
        (dueDate === 'today' && meetDate.isSame(now, 'day')) ||
        (dueDate === 'week' && meetDate.isAfter(now) && meetDate.isBefore(now.add(7, 'day'))) ||
        (dueDate === 'overdue' && meetDate.isBefore(now));

      return matchesSearch && matchesDueDate;
    });
  };

  const generateAIAgenda = async (title) => {
    if (!title.trim()) {
      showSnackbar('Please enter a meeting title first', 'warning');
      return;
    }

    setIsGeneratingAgenda(true);
    try {
      const response = await axios.post(`${API_URL}/openai.php`, {
        prompt: `Generate a professional meeting agenda for a meeting titled "${title}". Include key discussion points and time allocations.`
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setAgenda(response.data.trim());

      await createNotification(
        'AI Agenda Generated',
        `Agenda generated for meeting "${title}"`,
        'medium'
      );
      await playNotificationSound('completion');

      showSnackbar('AI Agenda generated successfully', 'success');
    } catch (error) {
      console.error('Error generating agenda:', error);
      showSnackbar('Failed to generate AI agenda', 'error');
    } finally {
      setIsGeneratingAgenda(false);
    }
  };

  const handleOpenDialog = () => {
    resetForm();
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode && selectedMeet) {
      await handleUpdate(e);
    } else {
      await handleAddMeet();
    }
  };

  const isUpcoming = (meetingTime) => {
    const now = dayjs();
    const meetTime = dayjs(meetingTime);
    return meetTime.isAfter(now);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAttendeeChange = (event, newValue) => {
    if (newValue.length > 10) {
      showSnackbar('Maximum 10 attendees allowed', 'warning');
      return;
    }

    // Remove duplicates by email
    const uniqueAttendees = Array.from(new Set(
      newValue.map(attendee => {
        const email = typeof attendee === 'string' ? attendee : attendee.email;
        return email.toLowerCase().trim();
      })
    )).map(email => ({
      email: email,
      color: getRandomColor()
    }));

    setAttendeesList(uniqueAttendees);
    setAttendees(uniqueAttendees.map(a => a.email).join(', '));
  };

  const handleInputChange = (event, value) => {
    setInputValue(value);
    if (value.length > 1) {
      setIsLoadingSuggestions(true);
      setTimeout(() => {
        setIsLoadingSuggestions(false);
      }, 500);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = () => {
    const colors = [blue[500], green[500], orange[500], purple[500]];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const resetForm = () => {
    setMeetingTitle('');
    setMeetingTime(new Date());
    setMeetLink('https://meet.google.com/oas-nfxr-bvf');
    setAgenda('');
    setAttendees('');
  };

  const copyToClipboard = (meetLink) => {
    navigator.clipboard.writeText(meetLink)
      .then(() => {
        showSnackbar('Link copied to clipboard!', 'success');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        showSnackbar('Failed to copy link', 'error');
      });
  };

  // Add search filtering logic
  const filteredMeets = useMemo(() => {
    let filtered = [...meets];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(meet =>
        meet.meeting_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meet.agenda?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meet.attendees?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(meet => {
        const meetDate = new Date(meet.meeting_time);
        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        // Set time to start and end of day for proper comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return meetDate >= startDate && meetDate <= endDate;
      });
    }

    // Add other filters if needed (priority, status, etc.)
    if (priority !== 'all') {
      filtered = filtered.filter(meet => meet.priority === priority);
    }

    if (status !== 'all') {
      filtered = filtered.filter(meet =>
        status === 'completed' ? meet.status === 1 : meet.status === 0
      );
    }

    return filtered;
  }, [meets, searchQuery, dateRange, priority, status]);

  // Add search event listener
  useEffect(() => {
    const handleSearch = (event) => {
      if (location.pathname === '/meets') {  // Only handle search if we're on meets page
        console.log('Search event received in Meets:', event.detail);
        setSearchQuery(event.detail.searchQuery || '');
      }
    };

    const handleFilter = (event) => {
      if (location.pathname === '/meets') {
        console.log('Filter event received in Meets:', event.detail);
        // Handle any filter changes if needed
      }
    };

    const handleClearAll = () => {
      if (location.pathname === '/meets') {
        console.log('Clear all filters in Meets');
        setSearchQuery('');
        setPriority('all');
        setStatus('all');
        setDueDate('all');
      }
    };

    window.addEventListener('searchQueryChange', handleSearch);
    window.addEventListener('filterChange', handleFilter);
    window.addEventListener('clearAllFilters', handleClearAll);

    return () => {
      window.removeEventListener('searchQueryChange', handleSearch);
      window.removeEventListener('filterChange', handleFilter);
      window.removeEventListener('clearAllFilters', handleClearAll);
    };
  }, [location.pathname]);

  // Enhanced notification system
  const createEnhancedNotification = async (config) => {
    const {
      title,
      message,
      priority = 'medium',
      type = 'info',
      duration = 5000,
      sound = true
    } = config;

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'meet-notification',
        renotify: true,
        silent: !sound
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // In-app notification
    const event = new CustomEvent('todoAction', {
      detail: {
        title,
        message,
        priority,
        type,
        duration
      }
    });
    window.dispatchEvent(event);

    if (sound) {
      await playNotificationSound(type);
    }
  };

  // Enhanced meeting status management
  const handleStatusUpdate = async (meetId) => {
    try {
      const meetToUpdate = meets.find(meet => meet.id === meetId);
      if (!meetToUpdate) return;

      const newStatus = meetToUpdate.status === 1 ? 0 : 1;

      // First update the local state immediately
      setMeets(prevMeets =>
        prevMeets.map(meet =>
          meet.id === meetId ? { ...meet, status: newStatus } : meet
        )
      );

      const response = await axios.put(`${API_URL}/meets.php`, {
        id: meetId,
        status: newStatus,
        meeting_title: meetToUpdate.meeting_title,
        meeting_time: meetToUpdate.meeting_time,
        meet_link: meetToUpdate.meet_link,
        agenda: meetToUpdate.agenda,
        attendees: meetToUpdate.attendees
      });

      if (!response.data?.success) {
        // Revert the local state if API call fails
        setMeets(prevMeets =>
          prevMeets.map(meet =>
            meet.id === meetId ? { ...meet, status: meetToUpdate.status } : meet
          )
        );
        throw new Error('Failed to update status');
      }

      // Show success notification
      const event = new CustomEvent('showToast', {
        detail: {
          message: `Meet marked as ${newStatus === 1 ? 'completed' : 'pending'}`,
          type: 'success',
          icon: 'CheckCircle'
        }
      });
      window.dispatchEvent(event);

      // Close any open dialogs
      setViewDialogOpen(false);
      setOpenDialog(false);

    } catch (error) {
      console.error('Error updating meet status:', error);
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Failed to update meet status',
          type: 'error',
          icon: 'Error'
        }
      });
      window.dispatchEvent(event);
    }
  };

  // Update the handleCompletedClick to be more robust
  const handleCompletedClick = async (meet) => {
    if (!meet || !meet.id) {
      console.error('Invalid meet object');
      return;
    }

    try {
      await handleStatusUpdate(meet.id);
    } catch (error) {
      console.error('Error handling completed click:', error);
    }
  };

  // Enhanced meeting reminder system
  const checkUpcomingMeetings = async () => {
    const now = moment();

    meets.forEach(async (meet) => {
      if (!meet.status) {
        const meetingTime = moment(meet.meeting_time);
        const minutesUntilMeeting = meetingTime.diff(now, 'minutes');

        // Different notification times
        const notificationTimes = [
          { minutes: 1440, message: '24 hours' }, // 24 hours
          { minutes: 60, message: '1 hour' },     // 1 hour
          { minutes: 15, message: '15 minutes' }   // 15 minutes
        ];

        const matchingTime = notificationTimes.find(
          time => Math.abs(minutesUntilMeeting - time.minutes) < 1
        );

        if (matchingTime) {
          await createEnhancedNotification({
            title: `Upcoming Meeting Reminder`,
            message: `"${meet.meeting_title}" starts in ${matchingTime.message}`,
            priority: 'high',
            type: 'warning',
            sound: true
          });
        }
      }
    });
  };

  // Enhanced share functionality
  const handleShare = async (meet) => {
    try {
      const shareData = {
        title: `Meeting: ${meet.meeting_title}`,
        text: formatMeetContent(meet),
        url: meet.meet_link
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        await createEnhancedNotification({
          title: 'Shared Successfully',
          message: 'Meeting details have been shared',
          type: 'success',
          sound: false
        });
      } else {
        await navigator.clipboard.writeText(shareData.text);
        showSnackbar('Meeting details copied to clipboard', 'success');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      showSnackbar('Failed to share meeting details', 'error');
    }
  };

  // Add formatMeetContent function
  const formatMeetContent = (meet) => {
    const formattedDate = moment(meet.meeting_time).format('DD/MM/YYYY');
    const formattedTime = moment(meet.meeting_time).format('hh:mm A');

    return `📅 Meeting Details
━━━━━━━━━━━━━━━━━━━━━
📌 Title: ${meet.meeting_title}
📝 Agenda: ${meet.agenda || 'No agenda set'}
👥 Attendees: ${meet.attendees || 'No attendees set'}
🔗 Meet Link: ${meet.meet_link}
🗓️ Date: ${formattedDate}
⏰ Time: ${formattedTime}
━━━━━━━━━━━━━━━━━━━━━

🎯 Don't forget to join on time!`;
  };

  // Add new function for handling status update
  const handleStatusUpdateClick = (meet) => {
    setMeetToEdit(meet);
    handleStatusUpdate(meet.id);
  };

  // Update renderViewDialog to include ActionButtons
  const renderViewDialog = () => (
    <DetailDialog
      open={viewDialogOpen}
      onClose={handleViewClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Fade}
      transitionDuration={400}
    >
      {selectedMeet && (
        <>
          <DetailHeader>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography
                variant="overline"
                sx={{
                  opacity: 0.9,
                  letterSpacing: '0.1em',
                  fontWeight: 500
                }}
              >
                Meeting Details
              </Typography>
              <MeetStatusChip
                label={selectedMeet.status === 1 ? "Completed" : "Pending"}
                statusvalue={selectedMeet.status}
                size="small"
                sx={{
                  borderRadius: '12px',
                  px: 2,
                  '& .MuiChip-label': {
                    fontWeight: 600
                  }
                }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                lineHeight: 1.3,
                mb: 1
              }}
            >
              {selectedMeet.meeting_title}
            </Typography>
          </DetailHeader>

          <DetailContent>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={8}>
                {/* Main Details */}
                <DetailItem>
                  <AccessTimeIcon />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Schedule
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{
                        wordBreak: 'break-word',
                        [theme.breakpoints.down('sm')]: {
                          fontSize: '0.875rem'
                        }
                      }}
                    >
                      {moment(selectedMeet.meeting_time).format('MMMM D, YYYY [at] h:mm A')}
                    </Typography>
                  </Box>
                </DetailItem>

                <DetailItem>
                  <AssignmentIcon />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Agenda
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        [theme.breakpoints.down('sm')]: {
                          fontSize: '0.875rem'
                        }
                      }}
                    >
                      {selectedMeet.agenda || 'No agenda set'}
                    </Typography>
                  </Box>
                </DetailItem>

                <DetailItem>
                  <VideocamIcon />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Meet Link
                    </Typography>
                    <Link
                      href={selectedMeet.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        wordBreak: 'break-all',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        },
                        [theme.breakpoints.down('sm')]: {
                          fontSize: '0.875rem'
                        }
                      }}
                    >
                      {selectedMeet.meet_link}
                      <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                    </Link>
                  </Box>
                </DetailItem>
              </Grid>

              <Grid item xs={12} md={4}>
                {/* Attendees Section */}
                <Paper sx={{
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: 'background.default',
                  borderRadius: 2
                }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary'
                    }}
                  >
                    <PeopleAltIcon sx={{ fontSize: '1.2rem' }} />
                    Attendees
                  </Typography>
                  <Stack
                    spacing={1}
                    sx={{
                      maxHeight: { xs: '150px', sm: '200px' },
                      overflowY: 'auto',
                      pr: 1
                    }}
                  >
                    {selectedMeet.attendees?.split(',')
                      .filter(attendee => attendee && attendee.trim())
                      .map((attendee, index) => {
                        const trimmedAttendee = attendee.trim();
                        const initial = trimmedAttendee ? trimmedAttendee[0].toUpperCase() : '?';

                        return (
                          <Chip
                            key={index}
                            label={trimmedAttendee}
                            size="small"
                            avatar={
                              <Avatar sx={{
                                bgcolor: `primary.${index % 3 ? 'light' : 'main'}`,
                                width: { xs: 24, sm: 32 },
                                height: { xs: 24, sm: 32 }
                              }}>
                                {initial}
                              </Avatar>
                            }
                            sx={{
                              borderRadius: '8px',
                              '& .MuiChip-label': {
                                px: 1,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                              }
                            }}
                          />
                        );
                      })}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {/* Status History Section */}
            <StatusTimelineContainer>
              <StatusTimelineHeader>
                <HistoryIcon />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Status History
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    Track all status changes
                  </Typography>
                </Box>
              </StatusTimelineHeader>

              <Timeline
                sx={{
                  p: 0,
                  m: 0,
                  '& .MuiTimelineItem-root:before': {
                    flex: 0,
                    padding: 0
                  }
                }}
              >
                {statusHistory.map((history, index) => (
                  <TimelineItem
                    key={index}
                    sx={{
                      minHeight: 'auto',
                      '&:last-child .MuiTimelineConnector-root': {
                        display: 'none'
                      }
                    }}
                  >
                    <TimelineSeparator>
                      <TimelineDot
                        sx={{
                          margin: '6px 0',
                          padding: '4px',
                          boxShadow: 'none',
                          ...(history.status === 'COMPLETED'
                            ? {
                              bgcolor: 'success.light',
                              borderColor: 'success.main'
                            }
                            : {
                              bgcolor: 'warning.light',
                              borderColor: 'warning.main'
                            }
                          )
                        }}
                      >
                        {history.status === 'COMPLETED'
                          ? <CheckCircleIcon sx={{ fontSize: '1rem', color: 'success.main' }} />
                          : <PendingIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />
                        }
                      </TimelineDot>
                      <TimelineConnector
                        sx={{
                          bgcolor: 'divider',
                          width: '1px'
                        }}
                      />
                    </TimelineSeparator>

                    <TimelineContent
                      sx={{
                        py: '12px',
                        px: 2,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 0.5, sm: 2 }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          minWidth: { sm: '140px' }
                        }}
                      >
                        <Chip
                          label={`Status: ${history.status}`}
                          size="small"
                          sx={{
                            borderRadius: '6px',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            bgcolor: history.status === 'COMPLETED'
                              ? alpha(theme.palette.success.main, 0.1)
                              : alpha(theme.palette.warning.main, 0.1),
                            color: history.status === 'COMPLETED'
                              ? 'success.main'
                              : 'warning.main',
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: '1rem' }} />
                        {moment(history.timestamp).format('MMM D, YYYY [at] h:mm A')}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>

              {statusHistory.length === 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'text.secondary'
                  }}
                >
                  <HistoryIcon sx={{ fontSize: '2rem', opacity: 0.5, mb: 1 }} />
                  <Typography variant="body2">
                    No status changes recorded yet
                  </Typography>
                </Box>
              )}
            </StatusTimelineContainer>
          </DetailContent>

          {/* Action Buttons */}
          <DialogActions 
            sx={{
              p: { xs: 1, sm: 1.5, md: 2 },
              bgcolor: 'background.default',
              borderTop: '1px solid',
              borderColor: 'divider',
              gap: { xs: 0.5, sm: 0.75, md: 1 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflowX: 'auto',
              overflowY: 'hidden',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              '& .MuiButton-root': {
                minWidth: { xs: '40px', sm: 'auto' },
                height: { xs: '36px', sm: '38px', md: '40px' },
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.8125rem',
                  md: '0.875rem'
                },
                px: {
                  xs: 1,
                  sm: 1.5,
                  md: 2
                },
                whiteSpace: 'nowrap',
                flex: { xs: '0 0 auto', md: '1 1 auto' },
                '& .MuiSvgIcon-root': {
                  fontSize: {
                    xs: '1.1rem',
                    sm: '1.2rem',
                    md: '1.25rem'
                  },
                  mr: { xs: '-3px', sm: 0.75, md: 1 }
                }
              }
            }}
          >
            <ActionButton
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={() => handleCloseDialog()}
              sx={{
                '& .MuiButton-startIcon': {
                  display: 'flex',
                  mr: { xs: '-3px', sm: 0.5, md: 0.75 }
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Close</Box>
            </ActionButton>

            <ActionButton
              variant="outlined"
              color="inherit"
              startIcon={<ContentCopyIcon />}
              onClick={() => handleCopy(selectedMeet)}
              sx={{
                color: 'text.secondary',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'grey.100',
                  borderColor: 'grey.400'
                },
                '& .MuiButton-startIcon': {
                  display: 'flex',
                  mr: { xs: '-3px', sm: 0.5, md: 0.75 }
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Copy</Box>
            </ActionButton>

            <ActionButton
              variant="outlined"
              color="info"
              startIcon={<ShareIcon />}
              onClick={() => handleShare(selectedMeet)}
              sx={{
                '& .MuiButton-startIcon': {
                  display: 'flex',
                  mr: { xs: '-3px', sm: 0.5, md: 0.75 }
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Share</Box>
            </ActionButton>

            <ActionButton
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => {
                handleEdit(selectedMeet);
              }}
              sx={{
                '& .MuiButton-startIcon': {
                  display: 'flex',
                  mr: { xs: '-3px', sm: 0.5, md: 0.75 }
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Edit</Box>
            </ActionButton>

            <ActionButton
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteClick(selectedMeet)}
              sx={{
                '& .MuiButton-startIcon': {
                  display: 'flex',
                  mr: { xs: '-3px', sm: 0.5, md: 0.75 }
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Delete</Box>
            </ActionButton>

            <ActionButton
              variant={selectedMeet.status === 1 ? "contained" : "outlined"}
              color={selectedMeet.status === 1 ? "success" : "inherit"}
              startIcon={selectedMeet.status === 1 ? <PendingIcon /> : <CheckCircleIcon />}
              onClick={() => handleCompletedClick(selectedMeet)}
              sx={{
                '& .MuiButton-startIcon': {
                  display: 'flex',
                  mr: { xs: '-3px', sm: 0.5, md: 0.75 }
                },
                ...(selectedMeet.status === 1 ? {
                  bgcolor: 'success.main',
                  '&:hover': {
                    bgcolor: 'success.dark'
                  }
                } : {})
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {selectedMeet.status === 1 ? "Pending" : "Completed"}
              </Box>
            </ActionButton>

            <ActionButton
              variant="contained"
              color="primary"
              startIcon={<VideocamIcon />}
              onClick={() => window.open(selectedMeet.meet_link, '_blank')}
              sx={{
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
                '& .MuiButton-startIcon': {
                  display: 'flex',
                  mr: { xs: '-3px', sm: 0.5, md: 0.75 }
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Join</Box>
            </ActionButton>
          </DialogActions>
        </>
      )}
    </DetailDialog>
  );

  // Update renderMeetCard to remove action buttons
  const renderMeetCard = (meet) => (
    <MeetCard elevation={1} onClick={() => handleViewOpen(meet)}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Priority Badge */}
        {meet.priority === 'high' && (
          <PriorityBadge label="HIGH" />
        )}

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 600,
            mb: 2,
            pr: 4, // Space for priority badge
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3
          }}
        >
          {meet.meeting_title}
        </Typography>

        {/* Date and Time */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            p: 1,
            borderRadius: 1,
            width: 'fit-content'
          }}
        >
          <CalendarTodayIcon
            sx={{
              fontSize: '1rem',
              color: 'success.main'
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: 'success.main',
              fontWeight: 500
            }}
          >
            {moment(meet.meeting_time).format('DD/MM/YYYY')}
          </Typography>
        </Box>

        {/* Status Chip */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            icon={<PendingIcon sx={{ fontSize: '1rem !important' }} />}
            label={meet.status === 1 ? "Completed" : "Pending"}
            size="small"
            sx={{
              backgroundColor: meet.status === 1
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.warning.main, 0.1),
              color: meet.status === 1
                ? theme.palette.success.main
                : theme.palette.warning.main,
              fontWeight: 500,
              fontSize: '0.75rem',
              '& .MuiChip-icon': {
                color: 'inherit'
              }
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {moment(meet.meeting_time).fromNow()}
          </Typography>
        </Box>

        {/* Description/Agenda */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}
        >
          {meet.agenda || 'No agenda set'}
        </Typography>

        {/* Attendees */}
        {meet.attendees && (
          <Box sx={{
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <AvatarGroup
              max={3}
              sx={{
                '& .MuiAvatar-root': {
                  width: 28,
                  height: 28,
                  fontSize: '0.875rem',
                  borderColor: 'background.paper'
                }
              }}
            >
              {meet.attendees.split(',')
                .filter(attendee => attendee && attendee.trim())
                .map((attendee, index) => {
                  const trimmedAttendee = attendee.trim();
                  const initial = trimmedAttendee ? trimmedAttendee[0].toUpperCase() : '?';

                  return (
                    <Avatar
                      key={index}
                      sx={{
                        bgcolor: theme => `${theme.palette.primary.main}${index % 2 ? '99' : 'CC'}`
                      }}
                    >
                      {initial}
                    </Avatar>
                  );
                })}
            </AvatarGroup>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <PeopleAltIcon sx={{ fontSize: '1rem' }} />
              {meet.attendees.split(',').filter(a => a && a.trim()).length} attendees
            </Typography>
          </Box>
        )}
      </Box>
    </MeetCard>
  );

  // Add view dialog handlers
  const handleViewOpen = async (meet) => {
    setSelectedMeet(meet);
    setViewDialogOpen(true);

    // Fetch status history if needed
    fetchStatusHistory(meet.id);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedMeet(null);
    setStatusHistory([]);
  };

  const fetchStatusHistory = async (meetId) => {
    try {
      const response = await axios.get(`${API_URL}/meets-history.php`, {
        params: { id: meetId },
      });

      if (response.data) {
        setStatusHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching status history:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch status history',
        severity: 'error'
      });
    }
  };

  // Add showNotification function
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

  // Update the dialog title based on edit mode
  const renderDialogTitle = () => (
    <DialogHeader>
      {editMode ? <EditIcon /> : <AddCircleOutline />}
      <Typography variant="h6" component="div">
        {editMode ? 'Edit Meeting' : 'Add New Meeting'}
      </Typography>
    </DialogHeader>
  );

  // Update the dialog submit button
  const renderSubmitButton = () => (
    <Button
      variant="contained"
      color="primary"
      onClick={editMode ? handleUpdate : handleAddMeet}
      startIcon={editMode ? <EditIcon /> : <AddIcon />}
    >
      {editMode ? 'Update Meeting' : 'Add Meeting'}
    </Button>
  );

  // Add utility functions to reduce code duplication
  const resetFormAndClose = () => {
    setEditMode(false);
    setSelectedMeet(null);
    setOpenDialog(false);
    setViewDialogOpen(false);
    setMeetingTitle('');
    setMeetingTime(new Date());
    setMeetLink(defaultMeetLink);
    setAgenda('');
    setAttendees('');
  };

  const showErrorToast = (message) => {
    const event = new CustomEvent('showToast', {
      detail: {
        message: message || 'An error occurred',
        type: 'error',
        icon: 'Error'
      }
    });
    window.dispatchEvent(event);
  };

  // Add event listener for create meet button
  useEffect(() => {
    const handleCreateMeetEvent = () => {
      resetForm();
      setEditMode(false);
      setOpenDialog(true);
    };

    window.addEventListener('openCreateMeet', handleCreateMeetEvent);

    return () => {
      window.removeEventListener('openCreateMeet', handleCreateMeetEvent);
    };
  }, []); // Empty dependency array since we don't need any dependencies

  useEffect(() => {
    const handleFilter = (event) => {
      if (event.detail.type === 'dateRange') {
        setDateRange([event.detail.value.startDate, event.detail.value.endDate]);
      }
    };

    window.addEventListener('filterChange', handleFilter);
    return () => window.removeEventListener('filterChange', handleFilter);
  }, []);

  return (
    <ErrorBoundary>
      <Box sx={{
        p: 3,
        mt: 0,
        '& *::before, & *::after': {
          borderTop: 'none !important',
          borderBottom: 'none !important'
        }
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
            Meet List
            <Chip
              label={meets.length}
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
        ) : meets.length === 0 ? (
          <Fade in={true}>
            <Paper
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.default',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No meetings scheduled
              </Typography>
              <Typography color="text.secondary" align="center">
                Start by creating your first meeting
              </Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: { xs: 'stretch', sm: 'flex-start' },
                mb: { xs: 2, sm: 3 },
                mt: { xs: 1, sm: 2 },
                mx: { xs: 2, sm: 0 }
              }}>
                <AddMeetingButton
                  onClick={handleOpenDialog}
                  startIcon={<AddMeetingIcon />}
                  fullWidth={matches}
                >
                  Add New Meeting
                </AddMeetingButton>
              </Box>
            </Paper>
          </Fade>
        ) : (
          <Fade in={true}>
            <Grid container spacing={3}>
              {filteredMeets.map((meet) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={meet.id}>
                  {renderMeetCard(meet)}
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}

        {/* Add/Edit Meeting Dialog */}
        <AddMeetingDialog
          open={openDialog}
          onClose={() => {
            handleCloseDialog();
            setEditMode(false);
            setSelectedMeet(null);
          }}
          fullWidth
          maxWidth="md"
          TransitionComponent={Fade}
        >
          {renderDialogTitle()}
          <FormContainer>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Meeting Title */}
              <Grid item xs={12}>
                <StyledTextField
                  label="Meeting Title"
                  required
                  fullWidth
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VideocamIcon
                          color="primary"
                          sx={{
                            opacity: 0.8,
                            transition: 'opacity 0.2s',
                            '&:hover': { opacity: 1 }
                          }}
                        />
                      </InputAdornment>
                    )
                  }}
                  placeholder="Enter meeting title"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    mb: { xs: 1, sm: 2 }
                  }}
                />
                {/* Optional helper text */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    ml: 1,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  Give your meeting a clear and descriptive title
                </Typography>
              </Grid>

              {/* Meeting Time */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Meeting Time"
                    value={meetingTime}
                    onChange={(newValue) => setMeetingTime(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px'
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Meet Link */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Meet Link"
                  required
                  fullWidth
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Grid>

              {/* Agenda */}
              <Grid item xs={12}>
                <TextField
                  label="Agenda"
                  multiline
                  rows={4}
                  fullWidth
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <AssignmentIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Grid>

              {/* Attendees */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={suggestedAttendees}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.email
                  }
                  value={attendees.split(',').filter(a => a.trim())}
                  onChange={(_, newValue) => {
                    setAttendees(
                      newValue
                        .map(v => typeof v === 'string' ? v : v.email)
                        .join(', ')
                    )
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Attendees"
                      placeholder="Enter email addresses"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <PeopleAltIcon color="primary" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px'
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option, state) => {
                    // Remove the key from props and pass it directly to li
                    const { key, ...otherProps } = props;
                    return (
                      <li key={key} {...otherProps}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: typeof option === 'string' ? 'primary.main' : option.color
                            }}
                          >
                            {typeof option === 'string'
                              ? option[0].toUpperCase()
                              : option.name[0].toUpperCase()
                            }
                          </Avatar>
                          <Box>
                            {typeof option === 'string' ? option : (
                              <>
                                <Typography variant="body2">{option.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.email}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>
                      </li>
                    );
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          {...tagProps}
                          label={option}
                          size="small"
                          avatar={
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {option[0].toUpperCase()}
                            </Avatar>
                          }
                          sx={{
                            borderRadius: '8px',
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      );
                    })
                  }
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Enter email addresses separated by commas
                </Typography>
              </Grid>
            </Grid>
          </FormContainer>

          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            {renderSubmitButton()}
          </DialogActions>
        </AddMeetingDialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="xs"
          fullWidth
          TransitionComponent={Fade}
          transitionDuration={300}
          PaperProps={{
            elevation: 0,
            sx: {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{
            bgcolor: '#dc3545',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: '1.1rem',
            fontWeight: 500
          }}>
            <DeleteIcon fontSize="small" />
            Delete Meeting
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Are you sure you want to delete this meeting?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={{
            px: 3,
            pb: 3,
            gap: 1
          }}>
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 3,
                py: 1,
                color: 'text.primary',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'text.primary',
                  bgcolor: 'action.hover'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 3,
                py: 1,
                bgcolor: '#dc3545',
                '&:hover': {
                  bgcolor: '#c82333'
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {renderViewDialog()}
      </Box>
    </ErrorBoundary>
  );
};

export default Meets;
