import * as Yup from 'yup';
import { useCallback } from 'react';
import {Controller, useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
    RHFSwitch,
    RHFTextField,
    RHFUploadAvatar,
    RHFUpload,
    RHFAutocomplete,
} from 'src/components/hook-form';
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Label from "../../components/label";
import {_tags, _tourGuides} from "../../_mock";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

export default function AccountGeneral() {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useMockedUser();
    const userStatus = 'active';

    const UpdateUserSchema = Yup.object().shape({
        displayName: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        about: Yup.string().required('About is required'),
        images: Yup.array().min(1, 'Images is required'),
        tags: Yup.array().min(2, 'Must have at least 2 tags'),
    });

    const defaultValues = {
        displayName: user?.displayName || '',
        email: user?.email || '',
        about: user?.about || '',
        images: user?.images || [],
        tags: user?.tags || [],
    };

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const { setValue, handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            enqueueSnackbar('Update success!');
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
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
            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                        {user && (
                            <Label
                                color={
                                    (userStatus === 'active' && 'success') ||
                                    (userStatus === 'banned' && 'error') ||
                                    'warning'
                                }
                                sx={{ position: 'absolute', top: 24, right: 24 }}
                            >
                                {userStatus}
                            </Label>
                        )}

                        <Box sx={{ mb: 5 }}>
                            <RHFUploadAvatar
                                name="photoURL"
                                maxSize={3145728}
                                onDrop={handleAvatarDrop}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 3,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.disabled',
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> max size of {fData(3145728)}
                                    </Typography>
                                }
                            />
                        </Box>

                        {user && (
                            <FormControlLabel
                                labelPlacement="start"
                                control={
                                    <Controller
                                        name="status"
                                        render={({ field }) => (
                                            <Switch
                                                {...field}
                                                checked={field.value !== 'active'}
                                                onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                                            />
                                        )}
                                    />
                                }
                                label={
                                    <>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            Store Status
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Toggle store status to start/stop receiving orders.
                                        </Typography>
                                    </>
                                }
                                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                            />
                        )}
                    </Card>
                </Grid>

                <Grid xs={12} md={8}>
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
                            <RHFTextField name="displayName" label="Store Name" />
                            <RHFTextField name="email" label="Support Email Address" />
                        </Box>

                        <Stack spacing={3} alignItems="flex" sx={{ mt: 3 }}>
                            <RHFTextField name="about" multiline rows={4} label="Store Description" />
                            <RHFUpload
                                multiple
                                thumbnail
                                name="images"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                onRemove={handleRemoveFile}
                                onRemoveAll={handleRemoveAllFiles}
                                onUpload={() => console.info('ON UPLOAD')}
                            />
                            <Stack spacing={1}>
                                <Typography variant="body2">What categories does your store fall under?</Typography>
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
                                />
                            </Stack>

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
