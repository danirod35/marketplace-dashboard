// store-info.jsx
import React from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {RHFAutocomplete, RHFTextField} from 'src/components/hook-form';
import {countries} from "../../assets/data";
import { Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {alpha} from "@mui/material/styles";
import Paper from "@mui/material/Paper";

function StoreInfo({ onNext, onBack, setFormData, formValues }) {
    const methods = useForm({
        defaultValues: formValues.storeInfo, // Set default values from formValues
    });

    const onSetFormData = (data) => {
        setFormData({ socialLinks: data });
    };

    const handleBack = () => {
        methods.handleSubmit(onSetFormData)();
        onBack();
    };

    const { handleSubmit, formState: { errors }, setValue } = methods;
    // Function to handle form submission for Step One
    const onSubmit = (data) => {
        console.log('StoreInfo form data:', data); // Log form data to verify
        setFormData({ storeInfo: data })
        onNext();
    };

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
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            <Typography variant="h6" align="left" sx={{ textAlign: 'left' }}>Company Information</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Card sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={4}>
                                        <RHFTextField name="companyName" label="Company Name" required/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFTextField name="companyEmail" label="Company Email" required/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFTextField
                                            name="companyPhone"
                                            label="Company Phone Number"
                                            required
                                            onChange={handlePhoneChange} // Add onChange handler
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFTextField name="companyWebsite" label="Company Website" required/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFTextField name="jobTitle" label="Your Job Title" required/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFAutocomplete
                                            name="employeeCount"
                                            label="Number of Employees"
                                            options={['1-10', '11-50', '51-100', '101+']} // Example options
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>


                        <Grid item xs={12} mt={3}>
                            <Typography variant="h6" align="left" sx={{ textAlign: 'left' }}>Company Registration</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Card sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={4}>
                                        <RHFTextField name="taxId" label="U.S. Tax ID (EIN)" onChange={handleEinChange} required/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RHFAutocomplete
                                            name="countryInc"
                                            type="country"
                                            label="Country"
                                            placeholder="Choose a country"
                                            options={countries.map((option) => option.label)}
                                            getOptionLabel={(option) => option}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" onClick={handleBack}>
                        Back
                    </Button>
                    <div style={{ textAlign: 'right' }}>
                        <Button variant="contained" type="submit">
                            Next
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default StoreInfo;
