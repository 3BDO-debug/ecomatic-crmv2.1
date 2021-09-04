import PropTypes from 'prop-types';
// material
import { Box, Step, Paper, Button, Stepper as MaterialStepper, StepLabel } from '@material-ui/core';

// ----------------------------------------------------------------------

Stepper.propTypes = {
  steps: PropTypes.array,
  activeStepState: PropTypes.array,
  finalStepComponent: PropTypes.element,
  nextHandler: PropTypes.func,
  backHandler: PropTypes.func,
  resetHandler: PropTypes.func,
  showNext: PropTypes.bool
};

function Stepper({ steps, activeStepState, nextHandler, backHandler, resetHandler, finalStepComponent, showNext }) {
  const [activeStep, setActiveStep] = activeStepState;
  console.log(showNext, setActiveStep);
  /*
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  }; */

  const currentStepFinder = () => {
    const currentStep = steps.find((step) => step.id === activeStep + 1);
    return currentStep.content;
  };

  return (
    <>
      <MaterialStepper activeStep={activeStep}>
        {steps.map((step, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={index} {...stepProps} completed={step.active}>
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

            <Button variant="text" onClick={nextHandler}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
            {/*             <Button variant="contained" onClick={nextStageHandler}>
              Proceed to next stage
            </Button> */}
          </Box>
        </>
      )}
    </>
  );
}

export default Stepper;
