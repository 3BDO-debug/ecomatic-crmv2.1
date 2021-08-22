import * as Yup from 'yup';

export const createItemFormDefaults = {
  warehouse: '',
  brand: '',
  category: '',
  modelNumber: '',
  mainDimensions: '',
  cutOffDimensions: '',
  warrantyCoverage: '',
  image: null
};

export const createItemFormValidationSchema = Yup.object().shape({
  warehouse: Yup.string().required('Warehouse is required'),
  brand: Yup.string().required('Brand is required'),
  category: Yup.string().required('Category is required'),
  modelNumber: Yup.string().required('Model number is required'),
  mainDimensions: Yup.string().required('Main dimensions is required'),
  cutOffDimensions: Yup.string().required('Cut off dimensions is required'),
  warrantyCoverage: Yup.number().required('Warranty coverage is required'),
  image: Yup.mixed().required('Image is required')
});
