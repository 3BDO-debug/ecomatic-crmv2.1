import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Link, Stack, Avatar, Drawer, Tooltip, Typography, CardActionArea, Button } from '@material-ui/core';
import { Icon } from '@iconify/react';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import useLocales from '../../hooks/useLocales';
// context
import { AuthContext } from '../../contexts/AuthContext';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
//
import { MHidden } from '../../components/@material-extend';
import { DocIllustration } from '../../assets';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.complex
    })
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12]
}));

// ----------------------------------------------------------------------

IconCollapse.propTypes = {
  onToggleCollapse: PropTypes.func,
  collapseClick: PropTypes.bool
};

function IconCollapse({ onToggleCollapse, collapseClick }) {
  return (
    <Tooltip title="Mini Menu">
      <CardActionArea
        onClick={onToggleCollapse}
        sx={{
          width: 18,
          height: 18,
          display: 'flex',
          cursor: 'pointer',
          borderRadius: '50%',
          alignItems: 'center',
          color: 'text.primary',
          justifyContent: 'center',
          border: 'solid 1px currentColor',
          ...(collapseClick && {
            borderWidth: 2
          })
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'currentColor',
            transition: (theme) => theme.transitions.create('all'),
            ...(collapseClick && {
              width: 0,
              height: 0
            })
          }}
        />
      </CardActionArea>
    </Tooltip>
  );
}

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { translate } = useLocales();
  const sidebarConfig = [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: translate('sidebar.general.label'),
      items: [
        {
          title: translate('sidebar.general.children.overview'),
          path: PATH_DASHBOARD.general.overview,
          icon: <Icon icon="grommet-icons:overview" width={24} height={24} />
        }
      ]
    },
    // STORAGE
    // ----------------------------------------------------------------------
    {
      subheader: translate('sidebar.storage.label'),
      items: [
        {
          title: translate('sidebar.storage.children.warehouses'),
          path: PATH_DASHBOARD.storage.warehousesPage,
          icon: <Icon icon="maki:warehouse" width={24} height={24} />
        },
        {
          title: translate('sidebar.storage.children.items.label'),
          path: PATH_DASHBOARD.storage.items.root,
          icon: <Icon icon="carbon:block-storage-alt" width={24} height={24} />,
          children: [
            {
              title: translate('sidebar.storage.children.items.children.createItem'),
              path: PATH_DASHBOARD.storage.items.createItemPage
            },
            {
              title: translate('sidebar.storage.children.items.children.listItems'),
              path: PATH_DASHBOARD.storage.items.listItemsPage
            }
          ]
        },
        {
          title: translate('sidebar.storage.children.spareparts.label'),
          path: PATH_DASHBOARD.storage.spareparts.root,
          icon: <Icon icon="eos-icons:rotating-gear" width={24} height={24} />,
          children: [
            {
              title: translate('sidebar.storage.children.spareparts.children.createSparepart'),
              path: PATH_DASHBOARD.storage.spareparts.createSparepartPage
            },
            {
              title: translate('sidebar.storage.children.spareparts.children.listSpareparts'),
              path: PATH_DASHBOARD.storage.spareparts.listSparepartPage
            }
          ]
        }
      ]
    },
    // STORAGE
    // ----------------------------------------------------------------------
    {
      subheader: translate('sidebar.customerService.label'),
      items: [
        {
          title: translate('sidebar.customerService.children.clients.label'),
          path: PATH_DASHBOARD.customerService.clients.root,
          icon: <Icon icon="fluent:people-audience-24-regular" width={24} height={24} />,
          children: [
            {
              title: translate('sidebar.customerService.children.clients.children.createClient'),
              path: PATH_DASHBOARD.customerService.clients.createClientPage
            },
            {
              title: translate('sidebar.customerService.children.clients.children.listClients'),
              path: PATH_DASHBOARD.customerService.clients.listClientPage
            }
          ]
        },
        {
          title: translate('sidebar.customerService.children.tickets.children.listTickets'),
          path: PATH_DASHBOARD.customerService.tickets.listTicketsPage,
          icon: <Icon icon="akar-icons:ticket" width={24} height={24} />
        }
      ]
    }
  ];
  const user = useContext(AuthContext).userState[0];
  const { pathname } = useLocation();

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && {
            alignItems: 'center'
          })
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
            <Logo />
          </Box>

          <MHidden width="lgDown">
            {!isCollapse && <IconCollapse onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />}
          </MHidden>
        </Stack>

        {isCollapse ? (
          <Avatar alt="My Avatar" src="/static/mock-images/avatars/avatar_default.jpg" sx={{ mx: 'auto', mb: 2 }} />
        ) : (
          <Link underline="none" component={RouterLink} to="#">
            <AccountStyle>
              <Avatar alt="My Avatar" src="/static/mock-images/avatars/avatar_default.jpg" />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  {`${user.first_name} ${user.last_name}`}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {user.role}
                </Typography>
              </Box>
            </AccountStyle>
          </Link>
        )}
      </Stack>

      <NavSection navConfig={sidebarConfig} isShow={!isCollapse} />
      {!isCollapse && (
        <Stack spacing={3} alignItems="center" sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center' }}>
          <DocIllustration sx={{ width: 1 }} />

          <div>
            <Typography gutterBottom variant="subtitle1">
              Hi, {`${user.first_name} ${user.last_name}`}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Likes what you see ?
            </Typography>
          </div>
          <Button href="https://codehustle.live/" target="_blank" variant="contained">
            Check us out
          </Button>
        </Stack>
      )}
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                borderRight: 0,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.88)
              })
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
