// ApplicationStepper.jsx
import React, {useEffect, useState} from 'react';
import { Stepper, Step, StepLabel, Container, Button, CircularProgress } from '@mui/material';
import StoreInfo from "./store-info";
import ShippingAndOperations from "./shipping-and-operations";
import ApplicationConfirmation from "./application-confirmation";
import SocialLinks from "./social-links";
import ChooseYourIntegration from "./choose-your-integration";
import axios from 'axios';
import {useAuthContext} from "../../auth/hooks";
import {paths} from "../../routes/paths";
import {useRouter} from "../../routes/hooks";
import {PATH_AFTER_LOGIN} from "../../config-global";


function ApplicationStepper() {
    const {user, updateUser, updateUserMetadata} = useAuthContext();
    const [activeStep, setActiveStep] = useState(0);
    const [domain, setDomain] = useState(null); // State to store the shopId
    const [store, setStore] = useState('');
    const [storeStatus, setStoreStatus] = useState('pending')
    const [shopifyConnectionStatus, setShopifyConnectionStatus] = useState(false);
    const [storeId, setStoreId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        storeInfo: {},
        shippingAndOperations: {},
        socialLinks: {},
    });

    useEffect(() => {
        const fetchShopIdAndSetMetadata = async () => {
            try {
                const urlSearchParams = new URLSearchParams(window.location.search);
                const extractedShopId = urlSearchParams.get('shopId');

                if (extractedShopId) {
                    setDomain(extractedShopId);
                    const metadata = { domain: extractedShopId };
                    console.log('domain', extractedShopId);
                    await updateUserMetadata?.(metadata);
                    setShopifyConnectionStatus(true)
                } else if (user.user_metadata.domain !== "null") {
                    setShopifyConnectionStatus(true);
                }
            } catch (error) {
                console.error('Error updating user metadata:', error);
            } finally {
                setIsLoading(false); // Set loading state to false after fetching store data
            }
        };

        fetchShopIdAndSetMetadata();
    }, []);



    useEffect(() => {
        console.log('user', user);

        const fetchStoreData = async () => {
            try {
                console.log('user storedid', user.storeId)
                const response = await axios.get(`http://localhost:3000/store/get/${user.storeId}`);
                const storeData = response?.data[0]
                setStore(storeData);
                console.log('my store', response?.data[0])
                console.log(storeData);
                if (user.user_metadata.application_status === 'incomplete') {
                    setActiveStep(0);
                } else if (storeData.approval_status === 'pending') {
                    setActiveStep(4);
                    setStoreStatus('pending')
                } else if (storeData.approval_status === 'rejected') {
                    setActiveStep(4);
                    setStoreStatus('rejected')
                } else if (storeData.approval_status === 'approved') {
                    router.push(PATH_AFTER_LOGIN);
                }
            } catch (error) {
                console.error('Error fetching store:', error);
            } finally {
                setIsLoading(false); // Set loading state to false after fetching store data
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
            let myStoreId;
            if (user.user_metadata.store_id !== undefined) {
                myStoreId = user.user_metadata.store_id
            } else {
                myStoreId = generateStoreId()
                setStoreId(myStoreId);
                console.log('mystoreId', myStoreId);
            }
                finalFormValues.id = myStoreId;
                finalFormValues.domain = user?.user_metadata?.domain;
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
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <Stepper activeStep={activeStep} alternativeLabel>
                    {/* Steps */}
                    <Step>
                        <StepLabel>Choose Your Integration</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Company Information</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Social Links</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Shipping and Operations</StepLabel>
                    </Step>
                    <Step completed={activeStep >= 4}>
                        <StepLabel>Application Complete</StepLabel>
                    </Step>
                </Stepper>
            )}

            {!isLoading && (
                <div>
                    {/* Conditional rendering based on activeStep */}
                    {activeStep === 0 && (
                        <ChooseYourIntegration onNext={handleNext} setFormData={handleStepFormValues} formValues={formValues} shopifyConnectionStatus={shopifyConnectionStatus}/>
                    )}
                    {activeStep === 1 && (
                        <StoreInfo onNext={handleNext} onBack={handleBack} setFormData={handleStepFormValues} formValues={formValues}/>
                    )}
                    {activeStep === 2 && (
                        <SocialLinks
                            onNext={handleNext}
                            setFormData={handleStepFormValues}
                            onBack={handleBack}
                            onSubmitFinal={handleFinalSubmit}
                            formValues={formValues} // Pass formValues to ShippingAndOperations
                        />
                    )}
                    {activeStep === 3 && (
                        <ShippingAndOperations
                            onNext={handleNext}
                            setFormData={handleStepFormValues}
                            onBack={handleBack}
                            onSubmitFinal={handleFinalSubmit}
                            formValues={formValues} // Pass formValues to ShippingAndOperations
                        />
                    )}
                    {activeStep === 4 && (
                        <ApplicationConfirmation approvalStatus={storeStatus} rejectionMessage={store?.rejection_message}/>
                    )}
                </div>
            )}
        </Container>
    );
}


export default ApplicationStepper;
