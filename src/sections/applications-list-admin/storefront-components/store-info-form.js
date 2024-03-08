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

export default function StoreInfoForm() {
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


    // Callback function to handle changes in the discount rate
    const handleDiscountRateChange = (newValue) => {
        methods.setValue('discount', newValue);
    };

    const { setValue, handleSubmit, formState: { isSubmitting } } = methods;

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

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const files = methods.getValues('images') || [];

            const newFiles = acceptedFiles.map((file) => Object.assign(file, {
                preview: URL.createObjectURL(file),
            }));

            methods.setValue('images', [...files, ...newFiles], { shouldValidate: true });
        },
        [methods]
    );

    const handleRemoveFile = useCallback(
        (inputFile) => {
            const filtered = methods.getValues('images').filter((file) => file !== inputFile);
            methods.setValue('images', filtered);
        },
        [methods]
    );

    const handleRemoveAllFiles = useCallback(() => {
        methods.setValue('images', []);
    }, [methods]);

    const handleAvatarDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('photoURL', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

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
                            <Typography variant="h6">Store Information</Typography>
                        </Grid>
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
                            <RHFTextField name="storeName" label="Store Name" defaultValue={store.store_name}/>
                            <RHFTextField name="supportEmailAddress" label="Support Email Address" defaultValue={store.support_email_address}/>
                        </Box>

                        <Stack spacing={3} alignItems="flex" sx={{ mt: 3 }}>
                            <RHFTextField name="storeDescription" multiline rows={4} label="Store Description" defaultValue={store.store_description}/>
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : (
                                <DiscountSlider
                                    title="Discount Rate"
                                    ds={store.discount_rate}
                                    onChange={handleDiscountRateChange}
                                />
                            )}
                            <Stack spacing={1}>
                                <Typography variant="body2">What categories does your store fall under?</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    This gives us a general idea of what products you offer, and can help improve visibility.
                                </Typography>
                                {loading ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    <RHFAutocomplete
                                        name="tags"
                                        placeholder="+ Tags"
                                        multiple
                                        freeSolo
                                        options={_tags.map((option) => option)}
                                        getOptionLabel={(option) => option}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option}>
                                                {option}
                                            </li>
                                        )}
                                        renderTags={(selected, getTagProps) =>
                                            selected.map((option, index) => (
                                                <Chip
                                                    {...getTagProps({ index })}
                                                    key={option}
                                                    label={option}
                                                    size="small"
                                                    color="info"
                                                    variant="soft"
                                                />
                                            ))
                                        }
                                        defaultValue={store.store_tags}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </Card>
                    </Stack>
                </Grid>
                </Grid>
        </FormProvider>
    );
}
