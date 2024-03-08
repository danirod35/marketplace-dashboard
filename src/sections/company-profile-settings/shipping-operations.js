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

import { fData } from 'src/utils/format-number';

import { countries, states } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Label from "../../components/label";

// ----------------------------------------------------------------------

export default function ShippingOperations() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useMockedUser();

  const userStatus = 'active';

  const UpdateUserSchema = Yup.object().shape({
    postalService: Yup.string().required('Postal Service is required'),
    monthlyRevenue: Yup.number().required('Monthly Revenue is required'),
    deliveryTime: Yup.string().required('Delivery Time is required'),
    fulfilmentMethod: Yup.string().required('Fulfilment Method is required'),
    numberOfEmployees: Yup.string().required('Number of Employees is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
  });

  const defaultValues = {
    postalService: user?.postalService || '',
    monthlyRevenue: user?.monthlyRevenue || '',
    deliveryTime: user?.deliveryTime || '',
    fulfilmentMethod: user?.fulfilmentMethod || '',
    numberOfEmployees: user?.numberOfEmployees || '',
    country: user?.country || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
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
            <Typography variant="h6">Shipping & Operations</Typography>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <RHFTextField name="postalService" label="Postal Service Type" />
                </Grid>
                <Grid item xs={4}>
                  <RHFTextField name="monthlyRevenue" label="Monthly Revenue" />
                </Grid>
                <Grid item xs={4}>
                  <RHFAutocomplete
                      name="deliveryTime"
                      label="Average Delivery Time"
                      options={['1-2 days', '3-5 days', '6+ days']} // Example options
                  />
                </Grid>
                <Grid item xs={4}>
                  <RHFAutocomplete
                      name="fulfillmentMethod"
                      label="Fulfillment Method"
                      options={['3PL', 'In-House', 'Other']} // Example options
                  />
                </Grid>
                <Grid item xs={4}>
                  <RHFAutocomplete
                      name="numberOfEmployees"
                      label="Number of Employees"
                      options={['1-10', '11-50', '51-100', '101+']} // Example options
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>


          <Grid item xs={12} mt={3}>
            <Typography variant="h6">Warehouse Location</Typography>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <RHFTextField name="address" label="Address" />
                </Grid>
                <Grid item xs={4}>
                  <RHFTextField name="city" label="City" />
                </Grid>
                <Grid item xs={4}>
                  <RHFAutocomplete
                      name="state"
                      label="State"
                      options={states} // Example options
                  />
                </Grid>
                <Grid item xs={4}>
                  <RHFTextField name="zipCode" label="Zip/Code" />
                </Grid>
                <Grid item xs={4}>
                  <RHFAutocomplete
                      name="country"
                      type="country"
                      label="Country"
                      placeholder="Choose a country"
                      options={countries.map((option) => option.label)}
                      getOptionLabel={(option) => option}
                  />
                </Grid>
                <Grid container item xs={12} justifyContent="flex-end">
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Save Changes
                  </LoadingButton>
                </Grid>
              </Grid>
            </Card>
          </Grid>

        </Grid>
      </FormProvider>
  );
}
