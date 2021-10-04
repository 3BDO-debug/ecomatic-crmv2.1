import PropTypes from 'prop-types';
// material
/* import { useTheme } from '@material-ui/core/styles';
 */ import { Box } from '@material-ui/core';
import CodeHustleLogo from '../assets/codeHustle';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  /* const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark; */

  return (
    <Box sx={{ width: 70, height: 70, ...sx }}>
      <CodeHustleLogo />
    </Box>
  );
}
