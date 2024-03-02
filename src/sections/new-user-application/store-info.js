// store-info.jsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {RHFAutocomplete, RHFTextField} from 'src/components/hook-form';
import { Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {countries} from "../../assets/data";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../components/iconify";
import {alpha} from "@mui/material/styles";
import Paper from "@mui/material/Paper";

function StoreInfo({ onNext, setFormData, formValues }) {
    const methods = useForm({
        defaultValues: formValues.storeInfo // Set default values from formValues
    });
    // Function to handle form submission for Step One
    const onSubmit = (data) => {
        console.log('StoreInfo form data:', data); // Log form data to verify
        setFormData({ storeInfo: data })
        onNext();
    };

    const defaultSocialLinks = '';

    const socialLinks = {
        facebook: defaultSocialLinks.facebook,
        instagram: defaultSocialLinks.instagram,
        twitter: defaultSocialLinks.twitter,
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                            <Typography variant="h6" align="left" sx={{ textAlign: 'left' }}>Company Registration</Typography>
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
                            <Typography variant="h6" align="left" sx={{ textAlign: 'left' }}>Social Links</Typography>
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
                </Paper>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" type="submit">
                        Next
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default StoreInfo;
