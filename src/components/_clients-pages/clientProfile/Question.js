import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
// material
import { Grid, Card, Box, Button, Typography } from '@material-ui/core';
// components
import { MotionContainer } from '../../animate';

Question.propTypes = {
  quesiton: PropTypes.string,
  isTriggered: PropTypes.bool,
  onYesHandler: PropTypes.func,
  onNoHandler: PropTypes.func
};

function Question({ quesiton, isTriggered, onYesHandler, onNoHandler }) {
  return (
    <MotionContainer open={isTriggered} initial="initial">
      <Box
        component={motion.div}
        variants={{
          animate: {
            y: [12, -24, 720],
            scaleY: [0.985, 0.9, 3],
            opacity: [1, 1, 0]
          }
        }}
      >
        <Card sx={{ boxShadow: 'none' }} elevation={false} variant="outlined">
          <Box component="div" padding="30px">
            <Grid container justifyContent="center" alignItems="center" direction="column" spacing={3}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography variant="h5">{quesiton}</Typography>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <Button onClick={onNoHandler} color="secondary" variant="outlined">
                  No
                </Button>
                <Button onClick={onYesHandler} sx={{ margin: '10px' }} variant="contained">
                  Yes
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>
    </MotionContainer>
  );
}

export default Question;
