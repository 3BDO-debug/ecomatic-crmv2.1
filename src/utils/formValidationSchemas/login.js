import * as Yup from 'yup';

export const loginFormDefaults = {
  username: '',
  password: '',
  remember: true
};

export const loginFormValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});
