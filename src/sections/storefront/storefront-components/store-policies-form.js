import React, {useCallback, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
    RHFTextField,
    RHFUpload,
    RHFAutocomplete,
} from 'src/components/hook-form';
import {_tags} from "../../../_mock";
import Chip from "@mui/material/Chip";
import DiscountSlider from "./discount-slider";
import axios from "axios";
import {country, states} from "../../../assets/data";

export default function StorePoliciesForm() {
    const { enqueueSnackbar } = useSnackbar();

    const [store, setStore] = useState({});
    const [loading, setLoading] = useState(true);

    const methods = useForm();

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
        methods.reset(store);
        console.log('mystore', store)
    }, [store, methods]);


    const {
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const storeId = 1; // Replace 1 with the appropriate storeId value
            const response = await axios.put(`http://localhost:3000/store/update/${storeId}`, { store: data });
            console.log('Store Info updated successfully:', response.data);
            enqueueSnackbar('Update success!');
            console.info('DATA', data);
        } catch (error) {
            console.error('Error updating store info:', error);
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Stack spacing={2}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Save Changes
                            </LoadingButton>
                        </div>
                        <Grid item xs={12}>
                            <Typography variant="h6">Store Policies</Typography>
                        </Grid>
                    </Stack>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <RHFTextField name="returnPolicy" label="Return Policy Link" defaultValue={store.return_policy}/>
                            </Grid>
                            <Grid item xs={12}>
                                <RHFTextField name="shippingPolicy" label="Shipping Policy Link" defaultValue={store.shipping_policy}/>
                            </Grid>
                            <Grid item xs={12}>
                                <RHFTextField name="privacyPolicy" label="Privacy Policy Link" defaultValue={store.privacy_policy}/>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

            </Grid>
        </FormProvider>
    );
}
