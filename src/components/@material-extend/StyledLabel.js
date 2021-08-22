import React from 'react';
import PropTypes from 'prop-types';
// material
import { Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

StyledLabel.propTypes = {
  children: PropTypes.node.isRequired
};

function StyledLabel(props) {
  const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1)
  }));

  return <LabelStyle>{props.children}</LabelStyle>;
}

export default StyledLabel;
