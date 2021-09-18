import React, { useEffect, useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
// material
import { Box, Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useLocales from '../../hooks/useLocales';
// components
import FullScreenDialog from '../FullScreenDialog';
import GasOven from './GasOven';
import Cooker from './Cooker';
import SlimHob from './SlimHob';
import Hood from './Hood';

InstallationRequirements.propTypes = {
  isTriggered: PropTypes.bool,
  triggerHandler: PropTypes.func,
  reviewMode: PropTypes.bool,
  ticketDetails: PropTypes.object,
  triggeredDevice: PropTypes.any,
  saveHandler: PropTypes.func
};

function InstallationRequirements({
  reviewMode,
  isTriggered,
  triggerHandler,
  ticketDetails,
  triggeredDevice,
  saveHandler
}) {
  const { translate } = useLocales();
  const [installationRequirementsForm, setInstallationRequirementsForm] = useState('');
  const [submit, setSubmit] = useState(false);
  const printComponent = useRef();
  const handlePrint = useReactToPrint({
    content: () => printComponent.current
  });
  const handleSubmit = () => {
    if (triggeredDevice) {
      setSubmit(true);
      saveHandler();
    }
  };
  useEffect(() => {
    setInstallationRequirementsForm(triggeredDevice.device_category);
  }, [triggeredDevice]);
  return (
    <FullScreenDialog
      dialogContent={
        <Box padding="30px" ref={printComponent}>
          {installationRequirementsForm === 'gas-oven' && (
            <GasOven
              modelNumber={triggeredDevice.device_model_number}
              feedingSource={triggeredDevice.device_feeding_source}
              clientName={ticketDetails.client_name}
              technicainName={ticketDetails.technician_name}
              saveHandler={handleSubmit}
              submitState={[submit, setSubmit]}
              deviceId={triggeredDevice.id}
              reviewMode={reviewMode}
              triggerHandler={triggerHandler}
            />
          )}
          {installationRequirementsForm === 'cooker' && (
            <Cooker
              modelNumber={triggeredDevice.device_model_number}
              feedingSource={triggeredDevice.device_feeding_source}
              clientName={ticketDetails.client_name}
              technicainName={ticketDetails.technician_name}
              saveHandler={handleSubmit}
              submitState={[submit, setSubmit]}
              deviceId={triggeredDevice.id}
              reviewMode={reviewMode}
              triggerHandler={triggerHandler}
            />
          )}
          {installationRequirementsForm === 'hood' && (
            <Hood
              modelNumber={triggeredDevice.device_model_number}
              feedingSource={triggeredDevice.device_feeding_source}
              clientName={ticketDetails.client_name}
              technicainName={ticketDetails.technician_name}
              saveHandler={handleSubmit}
              deviceId={triggeredDevice.id}
              reviewMode={reviewMode}
              submitState={[submit, setSubmit]}
              triggerHandler={triggerHandler}
            />
          )}
          {installationRequirementsForm === 'slim-hob' && (
            <SlimHob
              modelNumber={triggeredDevice.device_model_number}
              feedingSource={triggeredDevice.device_feeding_source}
              clientName={ticketDetails.client_name}
              technicainName={ticketDetails.technician_name}
              saveHandler={handleSubmit}
              submitState={[submit, setSubmit]}
              deviceId={triggeredDevice.id}
              reviewMode={reviewMode}
              triggerHandler={triggerHandler}
            />
          )}
        </Box>
      }
      saveButton
      saveButtonComponent={
        reviewMode ? (
          <Button
            variant="inherit"
            startIcon={<Icon icon="fluent:print-48-regular" width={30} height={30} />}
            onClick={handlePrint}
          >
            {translate('ticketDetailsPage.installationRequirementsForms.printButton')}
          </Button>
        ) : (
          <LoadingButton onClick={handleSubmit} variant="inherit">
            {translate('ticketDetailsPage.installationRequirementsForms.actionButton')}
          </LoadingButton>
        )
      }
      dialogTitle={`${translate('ticketDetailsPage.installationRequirementsForms.title')} - ${
        triggeredDevice.device_model_number
      }`}
      open={isTriggered}
      closeHandler={triggerHandler}
    />
  );
}

export default InstallationRequirements;
