import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const DeleteDialog = ({ open, onClose, onConfirm, todoTitle }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: 'error.light',
        color: 'error.dark'
      }}>
        <WarningIcon color="error" />
        Confirm Delete
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete this todo?
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mt: 1,
              fontWeight: 'bold',
              color: 'text.secondary'
            }}
          >
            "{todoTitle}"
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained" 
          color="error"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
