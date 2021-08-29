import { useContext, useRef, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { useNavigate } from 'react-router';
// material
import { alpha } from '@material-ui/core/styles';
import { Avatar, Button, Box, Divider, Typography } from '@material-ui/core';
// context
import { AuthContext } from '../../contexts/AuthContext';
// components
import { MIconButton } from '../../components/@material-extend';
import MenuPopover from '../../components/MenuPopover';
import { logoutHandler } from '../../APIs/auth/logout';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useContext(AuthContext).userState;
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar alt="My Avatar" src="/static/mock-images/avatars/avatar_default.jpg" />
      </MIconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 220 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {`${user.first_name} ${user.last_name}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.role}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            onClick={() => {
              logoutHandler()
                .then(() => {
                  setUser(false);
                  navigate('/auth/login');
                  enqueueSnackbar('Log out success', {
                    variant: 'success',
                    action: (key) => (
                      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill} />
                      </MIconButton>
                    )
                  });
                })
                .catch(() =>
                  enqueueSnackbar('Server error', {
                    variant: 'error',
                    action: (key) => (
                      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill} />
                      </MIconButton>
                    )
                  })
                );
            }}
            fullWidth
            color="inherit"
            variant="outlined"
          >
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
