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

export default function ShippingOperationsForm() {
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
                            <Typography variant="h6">Shipping & Operations</Typography>
                        </Grid>
                    </Stack>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <RHFTextField name="postalService" label="Postal Service Type" defaultValue={store.postal_service}/>
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="monthlyRevenue" label="Monthly Revenue" defaultValue={store.monthly_revenue}/>
                            </Grid>
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <Grid item xs={4}>
                                        <RHFAutocomplete
                                            name="deliveryTime"
                                            label="Average Delivery Time"
                                            options={['1-2 days', '3-5 days', '6+ days']}
                                            defaultValue={store.delivery_time}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFAutocomplete
                                            name="fulfillmentMethod"
                                            label="Fulfillment Method"
                                            options={['3PL', 'In-House', 'Other']}
                                            defaultValue={store.fulfill_method}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFAutocomplete
                                            name="employeeCount"
                                            label="Number of Employees"
                                            options={['1-10', '11-50', '51-100', '101+']}
                                            defaultValue={store.employee_count}
                                        />
                                    </Grid>
                                </>
                            )}
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
                                <RHFTextField name="address1" label="Address" defaultValue={store.address1}/>
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="address2" label="Address 2" defaultValue={store.address2}/>
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="city" label="City" defaultValue={store.city}/>
                            </Grid>
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <Grid item xs={4}>
                                        <RHFAutocomplete
                                            name="state"
                                            label="State"
                                            options={states} // Example options
                                            defaultValue={store.state}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFTextField name="zipCode" label="Zip/Code" defaultValue={store.zip_code}/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFAutocomplete
                                            name="country"
                                            label="Country"
                                            options={country} // Example options
                                            defaultValue={store.country}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
