import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
// material
import { Box } from '@material-ui/core';
// components
import { MotionContainer } from '../../animate';

AnimatedSection.propTypes = {
  children: PropTypes.node,
  isTriggered: PropTypes.bool
};

function AnimatedSection({ children, isTriggered }) {
  return (
    <MotionContainer open={isTriggered} initial="initial">
      <Box
        component={motion.div}
        variants={{
          animate: {
            y: [720, -24, 12, -4, 0],
            scaleY: [4, 0.9, 0.95, 0.985, 1],
            opacity: [0, 1, 1, 1, 1],
            transition: {
              ...{
                duration: 0.72,
                ease: [0.43, 0.13, 0.23, 0.96]
              }
            }
          },
          exit: {
            ...{
              y: [12, -24, 720],
              scaleY: [0.985, 0.9, 3],
              opacity: [1, 1, 0]
            },
            transition: {
              duration: 0.48,
              ease: [0.43, 0.13, 0.23, 0.96]
            }
          }
        }}
      >
        {children}
      </Box>
    </MotionContainer>
  );
}

export default AnimatedSection;
