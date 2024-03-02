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
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function StoreInfo() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useMockedUser();

  const userStatus = 'active';

  const UpdateUserSchema = Yup.object().shape({
    storeName: Yup.string().required('Store Name is required'),
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
    storeName: user?.storeName || '',
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

  const defaultSocialLinks = '';

  const socialLinks = {
    facebook: defaultSocialLinks.facebook,
    instagram: defaultSocialLinks.instagram,
    twitter: defaultSocialLinks.twitter,
  };

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
            <Typography variant="h6">Company Information</Typography>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <RHFTextField name="companyName" label="Company Name" />
                </Grid>
                <Grid item xs={4}>
                  <RHFTextField name="companyEmail" label="Company Email" />
                </Grid>
                <Grid item xs={4}>
                  <RHFTextField name="companyPhone" label="Company Phone Number" />
                </Grid>
                <Grid item xs={4}>
                  <RHFTextField name="companyWebsite" label="Company Website" />
                </Grid>
                <Grid item xs={4}>
                  <RHFTextField name="jobTitle" label="Your Job Title" />
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
            <Typography variant="h6">Company Registration</Typography>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <RHFTextField name="taxId" label="U.S. Tax ID (EIN)" />
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
                <Grid item xs={4}>
                  <RHFTextField name="taxClassification" label="Tax Classification (eg. W9)" />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} mt={3}>
            <Typography variant="h6">Social Links</Typography>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
                  <Stack component={Card} spacing={3} sx={{ p: 3 }}>
                    {Object.keys(socialLinks).map((link) => (
                        <RHFTextField
                            key={link}
                            name={link}
                            defaultValue={'https://www.instagram.com/'}
                            InputProps={{
                              startAdornment: (
                                  <InputAdornment position="start">
                                    <Iconify
                                        width={24}
                                        icon={
                                            (link === 'facebook' && 'eva:facebook-fill') ||
                                            (link === 'instagram' && 'ant-design:instagram-filled') ||
                                            (link === 'twitter' && 'eva:twitter-fill') ||
                                            ''
                                        }
                                        color={
                                            (link === 'facebook' && '#1877F2') ||
                                            (link === 'instagram' && '#DF3E30') ||
                                            (link === 'twitter' && '#1C9CEA') ||
                                            ''
                                        }
                                    />
                                  </InputAdornment>
                              ),
                            }}
                        />
                    ))}
                  </Stack>
            </Card>
          </Grid>

        </Grid>
      </FormProvider>
  );
}
