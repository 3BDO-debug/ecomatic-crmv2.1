import { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  FormControl,
  MenuItem,
  ListSubheader,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import { fData } from '../../../utils/formatNumber';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// schemas
import { registerFormDefaults, registerFormValidationSchema } from '../../../utils/formValidationSchemas/register';
// components
import { MIconButton } from '../../@material-extend';
import StyledLabel from '../../@material-extend/StyledLabel';
import { UploadAvatar } from '../../upload';
import { registerHandler } from '../../../APIs/auth/register';

function RegisterForm() {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: registerFormDefaults,
    validationSchema: registerFormValidationSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await registerHandler(values);
        enqueueSnackbar('Register success', {
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
        navigate('/auth/login');
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
    }
  });

  const { dirty, errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      console.log(file);
      if (file) {
        setFieldValue('profilePic', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              onChange={(event) => {
                setFieldValue('firstName', event.target.value);
              }}
              value={values.firstName}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              onChange={(event) => {
                setFieldValue('lastName', event.target.value);
              }}
              value={values.lastName}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              onChange={(event) => {
                setFieldValue('email', event.target.value);
              }}
              value={values.email}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
            <TextField
              fullWidth
              label="Username"
              {...getFieldProps('username')}
              onChange={(event) => {
                setFieldValue('username', event.target.value);
              }}
              value={values.username}
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Phone number"
              {...getFieldProps('phoneNumber')}
              onChange={(event) => {
                setFieldValue('phoneNumber', event.target.value);
              }}
              value={values.phoneNumber}
              error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
            />
            <TextField
              fullWidth
              label="Address"
              {...getFieldProps('address')}
              onChange={(event) => {
                setFieldValue('address', event.target.value);
              }}
              value={values.address}
              error={Boolean(touched.address && errors.address)}
              helperText={touched.address && errors.address}
            />
          </Stack>
          <TextField
            fullWidth
            label="GOV ID"
            {...getFieldProps('govId')}
            onChange={(event) => {
              setFieldValue('govId', event.target.value);
            }}
            value={values.govId}
            error={Boolean(touched.govId && errors.govId)}
            helperText={touched.govId && errors.govId}
          />
          <FormControl sx={{ minWidth: 120, width: '100%', margin: 2 }}>
            <InputLabel htmlFor="grouped-select">Pick Your Role</InputLabel>
            <Select
              defaultValue=""
              id="grouped-select"
              label="Pick Your Role"
              {...getFieldProps('role')}
              onChange={(event) => {
                setFieldValue('role', event.target.value);
              }}
              value={values.role}
              error={Boolean(touched.role && errors.role)}
            >
              <ListSubheader>Customer Service department</ListSubheader>
              <MenuItem value="technical_support">Technical Support</MenuItem>
              <MenuItem value="customer_service_agent">Customer Service Agent</MenuItem>
              <ListSubheader>Follow up department</ListSubheader>
              <MenuItem value="follow_up_agent">Follow up agent</MenuItem>
              <ListSubheader>Maintenance department</ListSubheader>
              <MenuItem value="technicial_supervisor">Technicians Supervisor</MenuItem>
              <MenuItem value="technician">Technician</MenuItem>
              <ListSubheader>Storages department</ListSubheader>
              <MenuItem value="store_keeper">Store Keeper</MenuItem>
            </Select>
          </FormControl>
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
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <Box component="div">
            <StyledLabel>Profile Picture</StyledLabel>

            <UploadAvatar
              accept="image/*"
              file={values.profilePic}
              onDrop={handleDrop}
              error={Boolean(touched.profilePic && errors.profilePic)}
              caption={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
            <FormHelperText error sx={{ px: 2 }}>
              {touched.profilePic && errors.profilePic}
            </FormHelperText>
          </Box>

          <LoadingButton
            disabled={!dirty}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

export default RegisterForm;
