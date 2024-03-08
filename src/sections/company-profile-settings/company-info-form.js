import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, {useMemo, useCallback, useEffect, useState} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import {country, states} from 'src/assets/data';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axios from "axios";

// ----------------------------------------------------------------------

export default function CompanyInfoForm() {

    const router = useRouter();
    const [store, setStore] = useState({});
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const storeId = 1; // Replace 1 with the variable or parameter holding the store ID
        const fetchStoreData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/store/get/${storeId}`);
                setStore(response.data[0]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching store:', error);
            }
        };

        fetchStoreData();
    }, []);

    useEffect(() => {
        console.log('mystore', store);
    }, [store]);

    const UserInfoFormSchema = Yup.object().shape({
        companyName: Yup.string().required('Name is required'),
        supportEmailAddress: Yup.string().required('Email is required').email('Email must be a valid email address'),
        companyPhone: Yup.string().required('Phone number is required'),
        storeWebsite: Yup.string().required('Store Website is required'),
        jobTitle: Yup.string().required('Job Title is required'),
        employeeCount: Yup.string().required('Employee Count is required'),
        taxId: Yup.string().required('Tax ID is required'),
        countryInc: Yup.string().required('Country of Incorporation is required'),
    });

    // Initialize form methods with default values
    const methods = useForm({
        resolver: yupResolver(UserInfoFormSchema),
        defaultValues: {
            companyName: '',
            supportEmailAddress: '',
            companyPhone: null,
            storeWebsite: '',
            jobTitle: '',
            employeeCount: '',
            taxId: '',
            countryInc: '',
        },
    });

    // Update default values when the store object is loaded
    useEffect(() => {
        if (store) {
            methods.reset({
                companyName: store.company_name || '',
                supportEmailAddress: store.support_email_address || '',
                companyPhone: store.store_phone_number || null,
                storeWebsite: store.store_website || '',
                jobTitle: store.job_title || '',
                employeeCount: store.employee_count || '',
                taxId: store.tax_id || '',
                countryInc: store.country_inc || '',
            });
        }
    }, [store]);

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = handleSubmit(async (data) => {
    try {
        const storeId = 1; // Replace 1 with the appropriate storeId value
        const response = await axios.put(`http://localhost:3000/store/update/${storeId}`, { store: data });
        console.log('Store Info updated successfully:', response.data);
        enqueueSnackbar('Update Success!');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

    const handlePhoneChange = (e) => {
        let { value } = e.target;
        // Remove any non-digit characters
        value = value.replace(/\D/g, '');
        // Enforce 10-digit limit
        value = value.slice(0, 10);
        // Add dashes
        if (value.length > 3 && value.length <= 6) {
            value = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else if (value.length > 6) {
            value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
        setValue('companyPhone', value);
    };

    const handleEinChange = (e) => {
        let { value } = e.target;
        // Remove any non-digit characters
        value = value.replace(/\D/g, '');
        // Enforce 9-digit limit
        value = value.slice(0, 9);
        // Add dashes
        value = value.replace(/(\d{2})(\d{7})/, '$1-$2');
        setValue('taxId', value);
    };


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>

          <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
                <RHFTextField name="companyName" label="Company Name" required/>
                <RHFTextField name="supportEmailAddress" label="Company Email" required/>
                <RHFTextField
                    name="companyPhone"
                    label="Company Phone Number"
                    required
                    onChange={handlePhoneChange} // Add onChange handler
                />
                <RHFTextField name="storeWebsite" label="Company Website" required/>
                <RHFTextField name="jobTitle" label="Your Job Title" required/>
                {loading ? (
                    <></>
                ) : (
                    <RHFAutocomplete
                        name="employeeCount"
                        label="Number of Employees"
                        options={['1-10', '11-50', '51-100', '101+']} // Example options
                        defaultValue={store.employee_count}
                        required
                    />
                )}
                <RHFTextField name="taxId" label="U.S. Tax ID (EIN)" onChange={handleEinChange} required/>
                {loading ? (
                    <></>
                ) : (
                    <RHFAutocomplete
                        name="country"
                        label="Country"
                        options={country} // Example options
                        required
                        defaultValue={store.country_inc}
                    />
                )}

            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
