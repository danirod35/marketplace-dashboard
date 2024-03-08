import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const steps = [
    {
        label: 'Connect to Shopify',
        description: `Please connect your store to Shopify to continue. Install the HeyBuddy Shop Sales Channel App.`,
    },
    {
        label: 'Approve our 10% Transaction Fee',
        description: `You’ll be charged based on how you use this app (to a maximum of $20,000.00 USD per 30 days).`,

    },
];

export default function ConnectToShopifyDialog() {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        console.log(activeStep);
        if (activeStep === 0) {
            connectToShopify()
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const connectToShopify = () => {
        // const shopifyUrl = 'https://apps.shopify.com/tiktok?st_campaign=admin-search&st_source=admin&utm_campaign=admin-search&utm_source=admin';
        // window.open(shopifyUrl, '_blank');
        // Go To Next Step after I receive promise back from shopify that its been connected
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    return (
        <Box sx={{ maxWidth: 400 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === 2 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Typography variant="body2">{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1 ? 'Approve Transaction Fee' : 'Connect To Shopify'}
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {/*{activeStep === steps.length && (*/}
            {/*    <Paper square elevation={0} sx={{ p: 3 }}>*/}
            {/*        <Typography>All steps completed - you&apos;re finished</Typography>*/}
            {/*        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>*/}
            {/*            Reset*/}
            {/*        </Button>*/}
            {/*    </Paper>*/}
            {/*)}*/}
        </Box>
    );
}
