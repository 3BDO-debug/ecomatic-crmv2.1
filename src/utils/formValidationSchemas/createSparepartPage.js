import * as Yup from 'yup';

export const createSparepartFormDefaults = {
  warehouse: '',
  modelNumber: '',
  pricePerUnit: '',
  availableQTY: '',
  image: null
};

export const createSparepartFormValidationSchema = Yup.object().shape({
  warehouse: Yup.string().required('Warehouse is required'),
  modelNumber: Yup.string().required('Model number is required'),
  pricePerUnit: Yup.number().required('Price per unit is required'),
  availableQTY: Yup.number().required('Available quantity is required'),
  image: Yup.mixed().required('Image is required')
});
