// ApplicationStepper.jsx
import React, {useEffect, useState} from 'react';
import { Stepper, Step, StepLabel, Container, Button } from '@mui/material';
import StoreInfo from "./store-info";
import ShippingAndOperations from "./shipping-and-operations";
import ApplicationConfirmation from "./application-confirmation";
import SocialLinks from "./social-links";
import axios from 'axios';
import {useAuthContext} from "../../auth/hooks";
import {paths} from "../../routes/paths";
import {useRouter} from "../../routes/hooks";
import {PATH_AFTER_LOGIN} from "../../config-global";


function ApplicationStepper() {
    const { user, updateUser } = useAuthContext();
    const [activeStep, setActiveStep] = useState(0);
    const [store, setStore] = useState('');
    const [storeStatus, setStoreStatus] = useState('')
    const [storeId, setStoreId] = useState(null)
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        storeInfo: {},
        shippingAndOperations: {},
        socialLinks: {},
    });


    useEffect(() => {
        console.log('user', user);

        const fetchStoreData = async () => {
            try {
                console.log('user storedid', user.storeId)
                const response = await axios.get(`http://localhost:3000/store/get/${user.storeId}`);
                const storeData = response?.data[0]
                console.log('my store', response?.data[0])
                console.log(storeData);
                if (storeData.approval_status === 'pending') {
                    setActiveStep(3);
                    setStoreStatus('pending')
                } else if (storeData.approval_status === 'rejected') {
                    setActiveStep(3);
                    setStoreStatus('rejected')
                } else if (storeData.approval_status === 'approved') {
                    router.push(PATH_AFTER_LOGIN);
                }
            } catch (error) {
                console.error('Error fetching store:', error);
            }
        };

        fetchStoreData();
    }, []);


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

    const generateStoreId = () => {
        const length = 16;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let hash = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            hash += characters.charAt(randomIndex);
        }

        return hash;
    };


    const handleFinalSubmit = async (finalFormValues) => {
        try {
            console.log('user in stepper', user);
            const myStoreId = generateStoreId()
            setStoreId(myStoreId);
            console.log('mystoreId', myStoreId);
            finalFormValues.id = myStoreId;
            // Call updateUserDetails function to update user details
            await updateUser?.(user.id, myStoreId);

            // After updating user details, submit the form data to the server
            console.log('finalformvalues', finalFormValues);
            const response = await axios.post('http://localhost:3000/store/create', [finalFormValues]);
            console.log('Form submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
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
                   <ApplicationConfirmation approvalStatus={storeStatus}/>
                )}
            </div>
        </Container>
    );
}

export default ApplicationStepper;
