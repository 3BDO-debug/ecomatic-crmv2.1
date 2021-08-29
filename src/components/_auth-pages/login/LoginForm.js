import React, { useContext, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Stack, Alert, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// context
import { AuthContext } from '../../../contexts/AuthContext';
// components
import { MIconButton } from '../../@material-extend';
import { loginFormDefaults, loginFormValidationSchema } from '../../../utils/formValidationSchemas/login';
import { loginHandler } from '../../../APIs/auth/login';
import { userInfoFetcher } from '../../../APIs/auth/userInfo';
// ----------------------------------------------------------------------

function LoginForm() {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setUser = useContext(AuthContext).userState[1];
  const setIsAuthenticated = useContext(AuthContext).isAuthenticatedState[1];
  const formik = useFormik({
    initialValues: loginFormDefaults,
    validationSchema: loginFormValidationSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        await loginHandler(values);
        userInfoFetcher()
          .then((userInfo) => {
            setUser(userInfo);
            setIsAuthenticated(true);
          })
          .catch((error) => console.log(error));

        enqueueSnackbar('Login success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        resetForm();
        if (isMountedRef.current) {
          setSubmitting(false);
          setErrors({ afterSubmit: error.message });
        }
      }
    }
  });

  const { dirty, errors, values, touched, isSubmitting, setSubmitting, handleSubmit, setFieldValue, getFieldProps } =
    formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            autoComplete="username"
            label="Username"
            onChange={(event) => {
              setFieldValue('username', event.target.value);
            }}
            value={values.username}
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            onChange={(event) => {
              setFieldValue('password', event.target.value);
            }}
            value={values.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />
        </Stack>

        <LoadingButton
          disabled={!dirty}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={() => {
            setSubmitting(true);

            handleSubmit();

            navigate(PATH_DASHBOARD.root);
          }}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

export default LoginForm;
