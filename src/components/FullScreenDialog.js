import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
// material
import { Slide, Dialog, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

// ----------------------------------------------------------------------

FullScreenDialog.propTypes = {
  dialogContent: PropTypes.node,
  saveButton: PropTypes.bool,
  saveButtonComponent: PropTypes.node,
  dialogTitle: PropTypes.string,
  open: PropTypes.bool,
  closeHandler: PropTypes.func
};

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function FullScreenDialog({ dialogContent, saveButton, saveButtonComponent, dialogTitle, open, closeHandler }) {
  return (
    <Dialog fullScreen open={open} onClose={closeHandler} TransitionComponent={Transition}>
      <AppBar position="relative">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={closeHandler}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
            {dialogTitle}
          </Typography>
          {saveButton && saveButtonComponent}
        </Toolbar>
      </AppBar>
      {dialogContent}
    </Dialog>
  );
}

export default FullScreenDialog;
