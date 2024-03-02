// shipping-and-operations.jsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {RHFAutocomplete, RHFTextField} from 'src/components/hook-form';
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import {alpha} from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {countries, states} from "../../assets/data";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../components/iconify";
import LoadingButton from "@mui/lab/LoadingButton";

function ShippingAndOperations({ onNext, onBack, onSubmitFinal, setFormData, formValues }) {
    const methods = useForm({
        defaultValues: formValues.shippingAndOperations // Set default values from formValues
    });

    const handleSubmitFinal = (data) => {
        setFormData({ shippingAndOperations: data });
        onSubmitFinal({ ...formValues, shippingAndOperations: data });
        onNext();
    };

    const onSubmit = (data) => {
        setFormData({ shippingAndOperations: data });
    };

    const handleBack = () => {
        methods.handleSubmit(onSubmit)();
        onBack();
    };

    return (
    <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitFinal)}>
            <Paper
                sx={{
                    p: 3,
                    my: 3,
                    minHeight: 120,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
            >
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant="h6" style={{ textAlign: 'left' }}>Shipping & Operations</Typography>
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
                        <Typography variant="h6" style={{ textAlign: 'left' }}>Warehouse Location</Typography>
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
                            </Grid>
                        </Card>
                    </Grid>

                </Grid>
            </Paper>
            <Button variant="contained" type="submit">
                Submit
            </Button>
        </form>
        <Button variant="contained" onClick={handleBack}>
            Back
        </Button>
    </FormProvider>
    );
}

export default ShippingAndOperations;
