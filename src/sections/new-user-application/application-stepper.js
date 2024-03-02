// ApplicationStepper.jsx
import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Container, Button } from '@mui/material';
import StoreInfo from "./store-info";
import ShippingAndOperations from "./shipping-and-operations";
import ApplicationConfirmation from "./application-confirmation";

function ApplicationStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState({
        storeInfo: {},
        shippingAndOperations: {},
    });

    const handleStepFormValues = (stepData) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            ...stepData,
        }));
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinalSubmit = (finalFormValues) => {
        console.log('Form submitted:', JSON.stringify(finalFormValues));
    };

    return (
        <Container>
            <Stepper activeStep={activeStep} alternativeLabel>
                <Step>
                    <StepLabel>Company Information</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Shipping and Operations</StepLabel>
                </Step>
                <Step completed={activeStep >= 2}>
                    <StepLabel>Application Complete</StepLabel>
                </Step>
            </Stepper>
            <div>
                {activeStep === 0 && (
                    <StoreInfo onNext={handleNext} setFormData={handleStepFormValues} formValues={formValues}/>
                )}
                {activeStep === 1 && (
                    <ShippingAndOperations
                        onNext={handleNext}
                        setFormData={handleStepFormValues}
                        onBack={handleBack}
                        onSubmitFinal={handleFinalSubmit}
                        formValues={formValues} // Pass formValues to ShippingAndOperations
                    />
                )}
                {activeStep === 2 && (
                   <ApplicationConfirmation/>
                )}
            </div>
        </Container>
    );
}

export default ApplicationStepper;
