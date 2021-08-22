import * as Yup from 'yup';

export const createClientFormDefaults = {
  fullname: '',
  phoneNumber1: '',
  phoneNumber2: '',
  landline: '',
  city: '',
  region: '',
  address: '',
  buildingNo: '',
  floorNo: '',
  apartmentNo: '',
  landmark: '',
  category: ''
};

export const createClientFormValidationSchema = Yup.object().shape({
  fullname: Yup.string().required('Full name is required'),
  phoneNumber1: Yup.string().required('Phone number 1 is required'),
  phoneNumber2: Yup.string().required('Phone number 2 is required'),
  landline: Yup.string().required('Landline is required'),
  city: Yup.string().required('City is required'),
  region: Yup.string().required('Region is required'),
  address: Yup.string().required('Address is required'),
  buildingNo: Yup.string().required('Building no is required'),
  floorNo: Yup.string().required('Floor no is required'),
  apartmentNo: Yup.string().required('Apartment no is required'),
  landmark: Yup.string().required('Landmark is required'),
  category: Yup.string().required('Category is required')
});
