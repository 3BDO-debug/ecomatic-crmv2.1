import * as Yup from 'yup';

export const addClientDeviceFormDefaults = {
  device: '',
  feedingSource: '',
  purchasingInvoice: null,
  manufacturingDate: null,
  purchasingDate: null,
  expectedWarrantyStartDate: null,
  installationStatus: '',
  installationDate: null,
  warrantyStartDate: null,
  warrantyStatus: null,
  branch: '',
  distributor: '',
  deviceInvoiceOrManufacturingLabel: null
};

export const addClientDeviceFormValidationSchema = Yup.object().shape({
  device: Yup.string().required('Please pick up a device (note: you can search by model number)'),
  feedingSource: Yup.string().required('Device feeding source is required'),

  branch: Yup.string().required('Branch is required'),
  deviceInvoiceOrManufacturingLabel: Yup.mixed().required('Invoice or manufacturing label is required')
});
