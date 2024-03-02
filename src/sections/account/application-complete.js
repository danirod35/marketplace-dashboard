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

import { countries, states } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Label from "../../components/label";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../components/iconify";
import {OrderCompleteIllustration} from "../../assets/illustrations";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import {AnimatePresence, m} from "framer-motion";
import Dialog from "@mui/material/Dialog";
import {varFade} from "../../components/animate";
import Paper from "@mui/material/Paper";

// ----------------------------------------------------------------------


function PendingApplication({status}) {

  const renderContent = (
      <Stack
          spacing={5}
          sx={{
            m: 'auto',
            maxWidth: 480,
            textAlign: 'center',
            px: { xs: 2, sm: 0 },
          }}
      >
        <Typography variant="h4">Thank you for your submission!</Typography>

        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item>
            <Typography variant="h5">Status:</Typography>
          </Grid>
          <Grid item>
            <Label
                variant="soft"
                color={
                    (status === 'approved' && 'success') ||
                    (status === 'pending' && 'info') ||
                    'error'
                }
            >
              {status}
            </Label>
          </Grid>
        </Grid>

        <Typography>
          Our team will be in touch with you within 48 hours.
          <br />
          <br />
          We will be looking into your application to see if your business is a good fit for the HeyBuddy Marketplace.
          <br />
          <br />If your application is rejected, feel free to reapply! <br /> <br />
        </Typography>
      </Stack>
  );

  return renderContent;

}

function RejectedApplication({status}) {

    const renderContent = (
        <Stack
            spacing={5}
            sx={{
                m: 'auto',
                maxWidth: 480,
                textAlign: 'center',
                px: { xs: 2, sm: 0 },
            }}
        >
            <Typography variant="h4">Your application has been rejected.</Typography>

            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h5">Status:</Typography>
                </Grid>
                <Grid item>
                    <Label
                        variant="soft"
                        color={
                            (status === 'approved' && 'success') ||
                            (status === 'pending' && 'info') ||
                            'error'
                        }
                    >
                        {status}
                    </Label>
                </Grid>
            </Grid>

            <Stack spacing={2}>
                <Typography>
                    Rejection Reason:
                </Typography>

                <Card sx={{ padding: '20px' }}>
                    <Typography variant="body1">
                        Your application was missing a valid Tax ID. Please resubmit to be considered.
                    </Typography>
                </Card>
            </Stack>
        </Stack>
    );

    return renderContent;

}

export default function ApplicationComplete() {

  const approvalStatus = 'pending'

    if (approvalStatus === 'pending') {
        return <PendingApplication status={approvalStatus}/>
    } else if (approvalStatus === 'rejected') {
        return <RejectedApplication status={approvalStatus}/>
    }

}

