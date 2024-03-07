import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import React from "react";

// ----------------------------------------------------------------------

export default function SocialLinksForm() {
  const { enqueueSnackbar } = useSnackbar();

  const socialLinks = {
    facebook: '',
    instagram: '',
    twitter: '',
  }

  const defaultValues = {
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    twitter: socialLinks.twitter,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      data = {
        facebook: `https://www.facebook.com/${data.facebook}`,
        instagram: `https://www.instagram.com/${data.instagram}`,
        twitter: `https://www.twitter.com/${data.twitter}`,
      };
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
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
