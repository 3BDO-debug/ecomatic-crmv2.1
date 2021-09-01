import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Step, Paper, Button, Stepper as MaterialStepper, StepLabel, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

// ----------------------------------------------------------------------

Stepper.propTypes = {
  steps: PropTypes.array,
  finalStepComponent: PropTypes.element,
  nextHandler: PropTypes.func,
  backHandler: PropTypes.func,
  resetHandler: PropTypes.func,
  showNext: PropTypes.bool,
  nextIsLoading: PropTypes.bool
};

function Stepper({
  steps,
  finalStepComponent,
  nextHandler,
  backHandler,
  resetHandler,
  activeStepState,
  skippedState,
  currentStep,
  showNext,
  nextIsLoading
}) {
  const [activeStep, setActiveStep] = activeStepState;
  const [skipped, setSkipped] = skippedState;

  const isStepSkipped = (step) => skipped.has(step);

  const currentStepFinder = () => {
    const currentStep = steps.find((step) => step.id === activeStep + 1);
    return currentStep.content;
  };

  return (
    <>
      <MaterialStepper activeStep={currentStep}>
        {steps.map((step, index) => {
          const stepProps = {};
          const labelProps = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={index} {...stepProps}>
              <StepLabel {...labelProps}>{step.title}</StepLabel>
            </Step>
          );
        })}
      </MaterialStepper>
      {activeStep === steps.length ? (
        <>
          <Paper sx={{ p: 3, my: 3, minHeight: 120 }}>{finalStepComponent}</Paper>

          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={resetHandler}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          <Paper sx={{ p: 3, my: 3, minHeight: 120 }}>{currentStepFinder()}</Paper>
          <Box sx={{ display: 'flex' }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={backHandler} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flexGrow: 1 }} />

            {showNext && (
              <LoadingButton disabled={nextIsLoading} loading={nextIsLoading} variant="contained" onClick={nextHandler}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </LoadingButton>
            )}
          </Box>
        </>
      )}
    </>
  );
}

export default Stepper;
