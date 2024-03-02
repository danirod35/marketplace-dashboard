import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import {alpha, styled, useTheme} from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import StoreInfo from "../../../account/store-info";
import ShippingOperations from "../../../account/shipping-operations";
import ApplicationComplete from "../../../account/application-complete";

// ----------------------------------------------------------------------

const STEPS = ['Store Information', 'Shipping & Operations', 'Completed'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderRadius: 1,
    borderTopWidth: 3,
    borderColor: theme.palette.divider,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  height: 22,
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.disabled,
  ...(ownerState.active && {
    color: theme.palette.success.main,
  }),
  '& .QontoStepIcon-completedIcon': {
    zIndex: 1,
    fontSize: 18,
    color: theme.palette.success.main,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className, activeStep } = props;

  // Determine if it's the last step
  const isLastStep = activeStep === STEPS.length - 1;

  return (
      <QontoStepIconRoot ownerState={{ active, completed }} className={className}>
        {isLastStep ? (
            <Iconify
                icon="eva:checkmark-fill"
                className="QontoStepIcon-completedIcon"
                width={24}
                height={24}
            />
        ) : completed ? (
            <Iconify
                icon="eva:checkmark-fill"
                className="QontoStepIcon-completedIcon"
                width={24}
                height={24}
            />
        ) : (
            <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      ...bgGradient({
        startColor: theme.palette.error.light,
        endColor: theme.palette.error.main,
      }),
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      ...bgGradient({
        startColor: theme.palette.error.light,
        endColor: theme.palette.error.main,
      }),
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: theme.palette.divider,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  zIndex: 1,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.disabled,
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
  ...(ownerState.active && {
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    color: theme.palette.common.white,
    ...bgGradient({
      startColor: theme.palette.error.light,
      endColor: theme.palette.error.main,
    }),
  }),
  ...(ownerState.completed && {
    color: theme.palette.common.white,
    ...bgGradient({
      startColor: theme.palette.error.light,
      endColor: theme.palette.error.main,
    }),
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;

  const icons = {
    1: <Iconify icon="eva:settings-2-outline" width={24} />,
    2: <Iconify icon="eva:person-add-outline" width={24} />,
    3: <Iconify icon="eva:monitor-outline" width={24} />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.number,
};

function getStepContent(step) {
  switch (step) {
    case 0:
      return <StoreInfo />;
    case 1:
      return <ShippingOperations/>;
    case 2:
      return <ApplicationComplete/>;
    default:
      return 'Unknown step';
  }
}

export default function CustomizedSteppers() {

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const isLastStep = activeStep === STEPS.length - 1;
  const isSecondToLastStep = activeStep === STEPS.length - 2;

  return (
      <>
        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          {STEPS.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={(props) => <QontoStepIcon {...props} activeStep={activeStep} />} icon={index}>
                  {label}
                </StepLabel>
              </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 5 }} />

            <>
              <Paper
                  sx={{
                    p: 3,
                    my: 3,
                    minHeight: 120,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                  }}
              >
                <Typography sx={{ my: 1 }}>{getStepContent(activeStep)}</Typography>
              </Paper>

              <Box sx={{ textAlign: 'right' }}>
                {isSecondToLastStep && (
                    <>
                      <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                      </Button>
                      <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                        Finish
                      </Button>
                    </>
                )}
                {!isSecondToLastStep && !isLastStep && (
                    <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                      Next
                    </Button>
                )}
              </Box>
            </>
      </>
  );
}
