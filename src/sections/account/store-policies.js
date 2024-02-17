import * as Yup from 'yup';
import { useCallback } from 'react';
import {Controller, useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function StorePolicies() {
  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    returnPolicy: Yup.string().required('Return Policy is required'),
    shippingPolicy: Yup.string().required('Shipping Policy is required'),
    privacyPolicy: Yup.string().required('Privacy Policy is required'),
  });

  const defaultValues = {
    returnPolicy: '',
    shippingPolicy: '',
    privacyPolicy: '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <RHFTextField name="returnPolicy" label="Return Policy" multiline rows={3} />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="shippingPolicy" label="Shipping Policy" multiline rows={3} />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="privacyPolicy" label="Privacy Policy" multiline rows={3} />
                </Grid>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
                  Save Changes
                </LoadingButton>
              </Grid>
            </Card>
          </Grid>

        </Grid>
      </FormProvider>
  );
}
