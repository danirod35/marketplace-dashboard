// FormContext.js
import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        storeInfo: {},
        shippingAndOperations: {},
        // Add more steps as needed
    });

    const updateFormData = (step, data) => {
        setFormData(prevData => ({
            ...prevData,
            [step]: data
        }));
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData }}>
            {children}
        </FormContext.Provider>
    );
};
