import React from 'react';
import PropTypes from 'prop-types';
// material
import { Box } from '@material-ui/core';
// components
import FullScreenDialog from '../../FullScreenDialog';
import Spareparts from './Spareparts';
import Services from './Services';

SparepartsServices.propTypes = {
  open: PropTypes.bool,
  closeHandler: PropTypes.func
};

function SparepartsServices({ open, closeHandler }) {
  return (
    <FullScreenDialog
      open={open}
      closeHandler={closeHandler}
      dialogTitle="Add spareparts &amp; services"
      dialogContent={
        <Box padding="30px">
          <Spareparts />
          <Services />
        </Box>
      }
    />
  );
}

export default SparepartsServices;
