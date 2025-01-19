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
  Skeleton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import VideocamIcon from '@mui/icons-material/Videocam';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import { Fade } from '@mui/material';
import { GlobalContext } from '../context/GlobalContext';
import ShareIcon from '@mui/icons-material/Share';
import { API_URL } from '../config/constants';


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
  const [meetingTime, setMeetingTime] = useState(dayjs().add(10, 'minute').format('YYYY-MM-DDTHH:mm'));
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
    fetchMeets();
    return () => setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    const savedMeets = localStorage.getItem('meets');
    if (savedMeets) {
      setMeets(JSON.parse(savedMeets));
    }
  }, []);

  const fetchMeets = async () => {
    try {
      const response = await axios.get(`${API_URL}/meets.php`);
      if (response.data) {
        setMeets(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error details:', error);
      showSnackbar('Error fetching meets', 'error');
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
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      const meetData = {
        meeting_title: meetingTitle,
        meeting_time: dayjs(meetingTime).format('YYYY-MM-DD HH:mm:ss'),
        meet_link: meetLink,
        agenda: agenda || '',
        attendees: attendees || '',
        status: isCompleted
      };

      const response = await fetch(`${API_URL}/meets.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetData)
      });

      if (response.ok) {
        await fetchMeets();
        handleCloseDialog();
        showSnackbar('Meeting added successfully', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Failed to add meeting', 'error');
    }
  };

  const handleEditMeet = async (meetId) => {
    if (!meetingTitle || !meetingTime || !meetLink) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      const meetData = {
        id: meetId,
        meeting_title: meetingTitle,
        meeting_time: dayjs(meetingTime).format('YYYY-MM-DD HH:mm:ss'),
        meet_link: meetLink,
        agenda: agenda || '',
        attendees: attendees || '',
        status: isCompleted
      };

      const response = await fetch(`${API_URL}/meets.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetData)
      });

      const data = await response.json(); // Get the response data

      if (response.ok) {
        await fetchMeets(); // Refresh the list of meetings
        handleCloseDialog(); // Close the dialog
        showSnackbar('Meeting updated successfully', 'success');
      } else {
        throw new Error(data.message || 'Failed to update meeting');
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
      showSnackbar('Failed to update meeting', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (meetToDelete) {
      try {
        const response = await fetch(`${API_URL}/meets.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: meetToDelete.id })
        });

        if (response.ok) {
          await fetchMeets();
          setDeleteConfirmOpen(false);
          setMeetToDelete(null);
          showSnackbar('Meeting deleted successfully', 'success');
        }
      } catch (error) {
        console.error('Error:', error);
        showSnackbar('Failed to delete meeting', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    resetForm();
    setEditMode(false);
    setOpenDialog(false);
  };

  const handleEdit = (meet) => {
    setMeetingTitle(meet.meeting_title);
    setMeetingTime(dayjs(meet.meeting_time).format('YYYY-MM-DDTHH:mm'));
    setMeetLink(meet.meet_link);
    setAgenda(meet.agenda);
    setAttendees(meet.attendees);
    setIsCompleted(meet.status);
    setEditMode(true);
    setMeetToEdit(meet);
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    setSubmitted(true);

    if (!meetingTitle.trim()) {
      showSnackbar('Meeting title is required', 'error');
      return;
    }

    try {
      const updateData = {
        meetLink: meetLink || defaultMeetLink,
        meetingTitle,
        meetingTime: dayjs(meetingTime).format('YYYY-MM-DD HH:mm:ss'),
        attendees,
        agenda
      };

      const response = await axios.put(`${API_URL}/meets.php?id=${editMeetId}`, updateData);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      await createNotification(
        'Meeting Updated',
        `Meeting "${meetingTitle}" has been updated`,
        'medium'
      );
      await playNotificationSound('general');

      showSnackbar('Meeting updated successfully');
      resetForm();
      fetchMeets();
    } catch (error) {
      console.error('Error updating meet:', error);
      showSnackbar(error.message || 'Error updating meet', 'error');
    }
  };

  const handleDeleteClick = (meet) => {
    setMeetToDelete(meet);
    setDeleteConfirmOpen(true);
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    showSnackbar('Meeting link copied to clipboard');
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
    setSortBy(type);
  };

  const getFilteredMeets = () => {
    return meets.filter(meet => {
      const matchesSearch =
        meet.meeting_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meet.agenda?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meet.attendees?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority = priority === 'all' || meet.priority === priority;

      const matchesStatus = status === 'all' ||
        (status === 'completed' && meet.status) ||
        (status === 'pending' && !meet.status);

      const meetDate = dayjs(meet.meeting_time);
      const now = dayjs();

      const matchesDueDate = dueDate === 'all' ||
        (dueDate === 'today' && meetDate.isSame(now, 'day')) ||
        (dueDate === 'week' && meetDate.isAfter(now) && meetDate.isBefore(now.add(7, 'day'))) ||
        (dueDate === 'overdue' && meetDate.isBefore(now));

      return matchesSearch && matchesPriority && matchesStatus && matchesDueDate;
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

  const handleSubmit = async () => {
    if (editMode && meetToEdit) {
      await handleEditMeet(meetToEdit.id);
    } else {
      await handleAddMeet();
    }
    handleCloseDialog();
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
    setMeetingTime(dayjs().add(10, 'minute').format('YYYY-MM-DDTHH:mm'));
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

  // Enhanced filter function with memoization
  const filteredMeets = useMemo(() => {
    return meets.filter(meet => {
      const searchFields = [
        meet.meeting_title,
        meet.agenda,
        meet.attendees,
        meet.meet_link
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesSearch = !searchTerm ||
        searchFields.includes(searchTerm.toLowerCase());

      const matchesPriority = priority === 'all' || meet.priority === priority;

      const matchesStatus = status === 'all' ||
        (status === 'completed' && meet.status) ||
        (status === 'pending' && !meet.status);

      const meetDate = dayjs(meet.meeting_time);
      const now = dayjs();

      const matchesDueDate = dueDate === 'all' ||
        (dueDate === 'today' && meetDate.isSame(now, 'day')) ||
        (dueDate === 'week' && meetDate.isAfter(now) && meetDate.isBefore(now.add(7, 'day'))) ||
        (dueDate === 'overdue' && meetDate.isBefore(now));

      return matchesSearch && matchesPriority && matchesStatus && matchesDueDate;
    });
  }, [meets, searchTerm, priority, status, dueDate]);

  useEffect(() => {
    const handleCreateMeet = () => {
      handleOpenDialog(); // Your existing dialog open function
    };
    
    window.addEventListener('openCreateMeet', handleCreateMeet);
    return () => window.removeEventListener('openCreateMeet', handleCreateMeet);
  }, []);

  const handleShare = async (meet) => {
    try {
      const formattedDate = dayjs(meet.meeting_time).format('DD/MM/YYYY');
      const formattedTime = dayjs(meet.meeting_time).format('hh:mm A');
      const formattedDateTime = dayjs(meet.meeting_time).format('DD/MM/YYYY hh:mm A');
      
      // Email subject format
      const subject = `${meet.meeting_title} - ${formattedDateTime}`;
      
      // Email body format
      const shareText = 
`Meeting Reminder:
Title: ${meet.meeting_title}
🗓 Date: ${formattedDate}
🕛 Time: ${formattedTime}
📍 Google Meet Link: ${meet.meet_link}

Looking forward to your participation!`;

      if (navigator.share) {
        await navigator.share({
          title: subject,
          text: shareText,
          url: meet.meet_link
        });
        showSnackbar('Meeting details shared successfully', 'success');
      } else {
        // For email-like sharing, combine subject and body
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
        window.location.href = mailtoLink;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      showSnackbar('Failed to share meeting details', 'error');
    }
  };

  // Add loading skeleton component
  const LoadingSkeleton = () => (
    <CustomGrid container spacing={2}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <MeetItem elevation={2}>
            <MeetContent>
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={60} />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="rounded" width={100} height={32} />
                <Skeleton variant="rounded" width={100} height={32} />
              </Box>
            </MeetContent>
          </MeetItem>
        </Grid>
      ))}
    </CustomGrid>
  );

  return (
    <Box sx={{ 
      p: 3,
      mt: 8
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
              bgcolor: 'background.default'
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No meetings scheduled
            </Typography>
            <Typography color="text.secondary" align="center">
              Start by creating your first meeting
            </Typography>
            <Button
              variant="contained"
              onClick={handleOpenDialog}
              startIcon={<AddIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 20,
                px: 3
              }}
            >
              Schedule Meeting
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Fade in={true}>
          <CustomGrid container spacing={2}>
            {filteredMeets.map((meet) => (
              <Grid item xs={12} sm={6} md={4} key={meet.id}>
                <MeetItem elevation={2}>
                  <MeetContent>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      mb: 1
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        flexWrap: 'wrap'
                      }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            flex: 1,
                            minWidth: { xs: '100%', sm: 0 },
                            wordBreak: 'break-word',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            lineHeight: 1.3,
                            mb: { xs: 1, sm: 0 }
                          }}
                        >
                          {meet.meeting_title}
                        </Typography>

                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          ml: { xs: 0, sm: 'auto' },
                          order: { xs: -1, sm: 0 }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(meet.meet_link)}
                              sx={{
                                padding: 0.5,
                                color: 'success.main',
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => handleEdit(meet)}
                              sx={{
                                padding: 0.5,
                                color: 'primary.main',
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleShare(meet)}
                              sx={{
                                padding: 0.5,
                                color: 'info.main',
                              }}
                            >
                              <ShareIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(meet)}
                              sx={{
                                padding: 0.5,
                                color: 'error.main',
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          
                        </Box>
                      </Box>

                      <Typography
                        color="text.secondary"
                        sx={{
                          fontSize: '0.875rem',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {meet.agenda || 'No agenda set'}
                      </Typography>

                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Attendees:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {meet.attendees?.split(',').map((attendee, index) => (
                            <Chip
                              key={index}
                              size="small"
                              label={attendee.trim()}
                              sx={{
                                height: '24px',
                                '& .MuiChip-label': {
                                  fontSize: '0.75rem'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Status: {meet.status ? 'Completed' : 'Not Completed'}
                      </Typography>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1,
                      mt: 'auto',
                      pt: 1
                    }}>
                      <Tooltip title={moment(meet.meeting_time).format('MMMM Do YYYY, h:mm a')}>
                        <TimeChip
                          icon={<ScheduleIcon sx={{ fontSize: '0.875rem' }} />}
                          label={moment(meet.meeting_time).fromNow()}
                          size="small"
                          color={moment(meet.meeting_time).isBefore(moment()) ? 'error' : 'primary'}
                          variant="outlined"
                          sx={{
                            height: '28px',
                            '& .MuiChip-label': {
                              fontSize: '0.75rem'
                            }
                          }}
                        />
                      </Tooltip>

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VideocamIcon sx={{ fontSize: '1rem' }} />}
                        onClick={() => window.open(meet.meet_link, '_blank')}
                        color="primary"
                        sx={{
                          borderRadius: '20px',
                          minWidth: { xs: '90px', sm: '110px' },
                          height: '28px',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                      >
                        Join Meet
                      </Button>
                    </Box>
                  </MeetContent>
                </MeetItem>
              </Grid>
            ))}
          </CustomGrid>
        </Fade>
      )}

      {/* Add Meet Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Meet</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Meeting Title"
              fullWidth
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              required
            />
            <TextField
              label="Meeting Time"
              type="datetime-local"
              fullWidth
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Meet Link"
              fullWidth
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              required
            />
            <TextField
              label="Agenda"
              fullWidth
              multiline
              rows={3}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
            />
            <TextField
              label="Attendees (comma separated)"
              fullWidth
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              helperText="Enter email addresses separated by commas"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                />
              }
              label="Completed"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            color="primary"
            sx={{ borderRadius: '20px' }}
          >
            {editMode ? 'Update Meet' : 'Add Meet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Meeting</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this meeting?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Meets;
