import React, { useState, useEffect } from 'react';
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    Divider,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    NotificationsNone as NotificationsNoneIcon,
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import playNotificationSound from '../utils/notificationSound';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('https://todobackend.moajmalnk.in/api/notifications.php');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const createNotification = async (title, message, priority = 'medium') => {
        try {
            await axios.post('https://todobackend.moajmalnk.in/api/notifications.php', {
                title,
                message,
                priority,
                status: 'unread'
            });
            await playNotificationSound();
            fetchNotifications();
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchNotifications();
        
        // Set up polling interval
        const interval = setInterval(fetchNotifications, 30000);
        
        // Event listener for todo actions
        const handleTodoAction = (event) => {
            const { title, message, priority } = event.detail;
            createNotification(title, message, priority);
        };

        window.addEventListener('todoAction', handleTodoAction);

        // Cleanup
        return () => {
            clearInterval(interval);
            window.removeEventListener('todoAction', handleTodoAction);
        };
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markAsRead = async (id) => {
        try {
            await axios.put('https://todobackend.moajmalnk.in/api/notifications.php', { id });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="large"
                sx={{ ml: 2 }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        maxHeight: 400,
                        width: '300px',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Notifications</Typography>
                </Box>
                <Divider />

                {notifications.length === 0 ? (
                    <MenuItem>
                        <Typography variant="body2" color="text.secondary">
                            No notifications
                        </Typography>
                    </MenuItem>
                ) : (
                    notifications.map((notification) => (
                        <MenuItem
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            sx={{
                                whiteSpace: 'normal',
                                bgcolor: notification.status === 'unread'
                                    ? (notification.priority === 'high' ? 'error.lighter' : 'action.hover')
                                    : 'inherit',
                                '&:hover': {
                                    bgcolor: notification.priority === 'high' ? 'error.light' : 'action.selected'
                                }
                            }}
                        >
                            <Box sx={{ py: 1 }}>
                                <Typography variant="subtitle2">
                                    {notification.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {notification.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {moment(notification.created_at).fromNow()}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationCenter;
