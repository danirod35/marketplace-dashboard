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

function ShippingAndOperations({ onNext, onBack, setFormData, formValues }) {
    const methods = useForm({
        defaultValues: formValues.socialLinks // Set default values from formValues
    });

    const onSubmit = (data) => {
        setFormData({ socialLinks: data });
        onNext();
    };

    const onSetFormData = (data) => {
        setFormData({ socialLinks: data });
    };

    const handleBack = () => {
        methods.handleSubmit(onSetFormData)();
        onBack();
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
                        <Typography variant="h6" style={{ textAlign: 'left' }}>Social Links</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ textAlign: 'left', fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                            Add your social media links below.
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Stack component={Card} spacing={3} sx={{ p: 3 }}>
                            {Object.keys(socialLinks).map((link) => (
                                <RHFTextField
                                    key={link}
                                    name={link}
                                    defaultValue={`https://www.${link}.com/`} // Set the default value for each social media platform
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

export default ShippingAndOperations;
