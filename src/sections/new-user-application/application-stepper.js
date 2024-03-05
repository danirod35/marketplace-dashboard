// ApplicationStepper.jsx
import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Container, Button } from '@mui/material';
import StoreInfo from "./store-info";
import ShippingAndOperations from "./shipping-and-operations";
import ApplicationConfirmation from "./application-confirmation";
import SocialLinks from "./social-links";
import axios from 'axios';


function ApplicationStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState({
        storeInfo: {},
        shippingAndOperations: {},
        socialLinks: {},
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
        axios.post('http://localhost:3000/store-create', [finalFormValues])
            .then(response => {
                console.log('Form submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error submitting form:', error);
            });
    };

    return (
        <Container>
            <Stepper activeStep={activeStep} alternativeLabel>
                <Step>
                    <StepLabel>Company Information</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Social Links</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Shipping and Operations</StepLabel>
                </Step>
                <Step completed={activeStep >= 3}>
                    <StepLabel>Application Complete</StepLabel>
                </Step>
            </Stepper>
            <div>
                {activeStep === 0 && (
                    <StoreInfo onNext={handleNext} setFormData={handleStepFormValues} formValues={formValues}/>
                )}
                {activeStep === 1 && (
                    <SocialLinks
                        onNext={handleNext}
                        setFormData={handleStepFormValues}
                        onBack={handleBack}
                        onSubmitFinal={handleFinalSubmit}
                        formValues={formValues} // Pass formValues to ShippingAndOperations
                    />
                )}
                {activeStep === 2 && (
                    <ShippingAndOperations
                        onNext={handleNext}
                        setFormData={handleStepFormValues}
                        onBack={handleBack}
                        onSubmitFinal={handleFinalSubmit}
                        formValues={formValues} // Pass formValues to ShippingAndOperations
                    />
                )}
                {activeStep === 3 && (
                   <ApplicationConfirmation/>
                )}
            </div>
        </Container>
    );
}

export default ApplicationStepper;
