// store-info.jsx
import React from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {RHFAutocomplete, RHFTextField} from 'src/components/hook-form';
import {countries} from "../../assets/data";
import { Button, IconButton, Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {alpha} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ChooseYourIntegration({ onNext, setFormData, formValues, shopifyConnectionStatus }) {
    const methods = useForm({
        defaultValues: '', // Set default values from formValues
    });

    const { handleSubmit, formState: { errors }, setValue } = methods;
    // Function to handle form submission for Step One
    const onSubmit = (data) => {
        console.log('StoreInfo form data:', data); // Log form data to verify
        setFormData({ storeInfo: data })
        onNext();
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
                            <Typography variant="h6" align="left" sx={{ textAlign: 'left' }}>Choose Your Integration</Typography>
                            <Grid item xs={12}>
                                <Typography variant="caption" align="left" sx={{ textAlign: 'left' }}>More integrations are coming soon.</Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            {shopifyConnectionStatus ? (
                                <Card sx={{ p: 3 }}>
                                    <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'background.neutral' }}>
                                                        <Box sx={{ width: 48, height: 48, overflow: 'hidden', position: 'relative' }}>
                                                            <Image src="/assets/images/faqs/ShopifyLogoAvatar.png" alt="Logo" layout="fill" objectFit="contain" />
                                                        </Box>
                                                    </Avatar>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="h4">Shopify</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <CheckCircleIcon sx={{ color: 'success.main', fontSize: '2rem' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1">Connected</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            ) : (
                                <Card sx={{ p: 3 }}>
                                    <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'background.neutral' }}>
                                                        <Box sx={{ width: 48, height: 48, overflow: 'hidden', position: 'relative' }}>
                                                            <Image src="/assets/images/faqs/ShopifyLogoAvatar.png" alt="Logo" layout="fill" objectFit="contain" />
                                                        </Box>
                                                    </Avatar>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="h4">Shopify</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item>
                                                    <IconButton
                                                        aria-label="Shopify Badge"
                                                        sx={{ p: 0, width: 'auto', height: 50 }}
                                                        onClick={() => {
                                                            window.location.href = 'https://admin.shopify.com/store/quickstart-ef261c7c/apps/jan24-app/app';
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/images/Shopify-App-Store-Badge-Final-Black.png"
                                                            alt="Shopify Badge"
                                                            style={{ height: 50, width: 'auto' }}
                                                        />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                            sx={{ p: '10px 20px', width: 'auto', height: 50, backgroundColor: '#4caf50', color: '#fff' }}
                                                            variant='contained'
                                                            onClick={() => {
                                                                window.location.href = 'https://admin.shopify.com/store/quickstart-ef261c7c/apps/jan24-app/app';
                                                            }}
                                                        >
                                                            Connect Now
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" type="submit" disabled={shopifyConnectionStatus === false}>
                        Next
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default ChooseYourIntegration;
