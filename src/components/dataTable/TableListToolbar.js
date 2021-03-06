import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Box, Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@material-ui/core';
// context
import { AuthContext } from '../../contexts';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

TableListToolbar.propTypes = {
  searchPlaceholder: PropTypes.string,
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onSelectAllDelete: PropTypes.func
};

export default function TableListToolbar({
  searchPlaceholder,
  numSelected,
  filterName,

  onFilterName,
  onSelectAllDelete
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const userRole = useContext(AuthContext).userState[0].role;
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder={searchPlaceholder}
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {userRole === 'admin' && numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Icon onClick={onSelectAllDelete} icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Export CSV">
          <IconButton>
            <Icon icon="akar-icons:download" />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
