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
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../../components/iconify";

export default function SocialLinksForm() {
    const { enqueueSnackbar } = useSnackbar();

    const [store, setStore] = useState({});
    const [loading, setLoading] = useState(true);

    const socialLinks = {
        facebook: '',
        instagram: '',
        twitter: '',
    }

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
            data = {
                facebook_link: `https://www.facebook.com/${data.facebook || (store.facebook_link && store.facebook_link.split('.com/')[1])}`,
                instagram_link: `https://www.instagram.com/${data.instagram || (store.instagram_link && store.instagram_link.split('.com/')[1])}`,
                twitter_link: `https://www.twitter.com/${data.twitter || (store.twitter_link && store.twitter_link.split('.com/')[1])}`,
            };
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
                            <Typography variant="h6">Social Links</Typography>
                        </Grid>
                        <Stack component={Card} spacing={3} sx={{ p: 3 }}>
                            {Object.keys(socialLinks).map((link) => (
                                <RHFTextField
                                    key={link}
                                    name={link}
                                    defaultValue={
                                        (link === 'facebook' && store.facebook_link && store.facebook_link.split('.com/')[1]) ||
                                        (link === 'instagram' && store.instagram_link && store.instagram_link.split('.com/')[1]) ||
                                        (link === 'twitter' && store.twitter_link && store.twitter_link.split('.com/')[1]) ||
                                        ''
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="end">
                                                <Stack direction="row" spacing={1}>
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
                                                            (link === 'linkedin' && '#006097') ||
                                                            (link === 'twitter' && '#1C9CEA') ||
                                                            ''
                                                        }
                                                    />
                                                    <Typography>https://www.{link}.com/</Typography>
                                                </Stack>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
