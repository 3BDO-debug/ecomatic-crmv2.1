import * as Yup from 'yup';

export const registerFormDefaults = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  phoneNumber: '',
  address: '',
  govId: '',
  password: '',
  role: '',
  profilePic: null,
  file: null
};

export const registerFormValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required here'),
  email: Yup.string().email().required('Email is required here'),
  username: Yup.string().required('Username is required'),
  phoneNumber: Yup.string().required('Phone number is required here'),
  address: Yup.string().required('Address is required here'),
  govId: Yup.string().required('GOV id is required here'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Too short, password shouldnt be less than 8 characters'),
  role: Yup.string().required('Role is required here'),
  profilePic: Yup.mixed().required('Profile picture is required for your profile creation')
});
