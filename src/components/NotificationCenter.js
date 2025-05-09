import React, { useState, useEffect } from 'react';
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    Divider,
    Button,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    NotificationsNone as NotificationsNoneIcon,
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import playNotificationSound from '../utils/notificationSound';

const API_URL = 'https://todobackend.moajmalnk.in/api/notifications.php';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { 'Accept': 'application/json' }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const createNotification = async (title, message, priority = 'medium') => {
        try {
            await axios.post(API_URL, {
                title,
                message,
                priority,
                status: 'unread'
            }, {
                headers: { 'Content-Type': 'application/json' }
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
            if (title && message) {
                createNotification(title, message, priority);
            } else {
                console.warn('Notification event missing title or message:', event.detail);
            }
        };

        window.addEventListener('todoAction', handleTodoAction);

        // Cleanup
        return () => {
            clearInterval(interval);
            window.removeEventListener('todoAction', handleTodoAction);
        };
    }, []);

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(API_URL, { id }, {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(API_URL, { all: true }, {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="large"
                sx={{ ml: '-16px' }}
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
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Notifications</Typography>
                    <Button
                        size="small"
                        variant="text"
                        color="primary"
                        disabled={notifications.filter(n => n.status === 'unread').length === 0}
                        onClick={markAllAsRead}
                        sx={{ ml: 1, fontSize: '0.85rem', textTransform: 'none', fontWeight: 500 }}
                    >
                        Mark All as Read
                    </Button>
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
