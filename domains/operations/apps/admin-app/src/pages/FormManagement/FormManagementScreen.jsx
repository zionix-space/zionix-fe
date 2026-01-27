import React from 'react'
import {
    FormBuilder,
    BuilderView,
    antdComponents,
    AntLocalizationWrapper,
    ltrCssLoader,
    rtlCssLoader,
    zionixlcAntdCssLoader,
    BiDi,
    formDB
} from '@zionix-space/lowcode';
import '@zionix-space/lowcode/styles';
// Create BuilderView with all Ant Design components
// Matches zionixlc's pattern exactly: rSuiteComponents.map(c => c.build())
const builderComponents = antdComponents.map(c => c.build());
const builderView = new BuilderView(builderComponents)
    .withViewerWrapper(AntLocalizationWrapper)
    .withCssLoader(BiDi.LTR, ltrCssLoader)
    .withCssLoader(BiDi.RTL, rtlCssLoader)
    .withCssLoader('common', zionixlcAntdCssLoader);



// Get the currently active form ID
const getCurrentFormId = () => {
    return localStorage.getItem('zionixlc-current-form-id') || null;
};

// Get form by ID from IndexedDB
const getForm = async (formId) => {
    if (!formId) return null;
    const schema = await formDB.getFormSchema(formId);
    return schema ? JSON.stringify(schema) : null;
};

/**
 * FormBuilder page
 * Fully dynamic - loads form based on user selection
 */

const FormManagementScreen = () => {
    const [currentFormId, setCurrentFormId] = React.useState(() => getCurrentFormId());

    // Listen for form selection changes
    React.useEffect(() => {
        const handleStorageChange = () => {
            const newFormId = getCurrentFormId();
            setCurrentFormId(newFormId);
        };

        // Listen for custom event when form is selected
        window.addEventListener('zionixlc-form-selected', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('zionixlc-form-selected', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Custom validators (optional)
    const customValidators = {
        string: {
            isHex: {
                validate: value => /^[0-9A-F]*$/i.test(value)
            }
        }
    };

    // Custom actions (optional)
    const customActions = {
        logEventArgs: (e) => {
            console.log('Custom action - logEventArgs:', e);
        }
    };

    // Form data change handler (optional)
    const handleFormDataChange = ({ data, errors }) => {
        console.log('Form data changed:', { data, errors });
    };

    // Always show FormBuilder - it handles empty state internally
    return (
        <FormBuilder
            key={currentFormId || 'no-form'} // Force remount when form changes
            view={builderView}
            getForm={currentFormId ? () => getForm(currentFormId) : null}
            formName={currentFormId || null}
            initialData={{}}
            validators={customValidators}
            actions={customActions}
            onFormDataChange={handleFormDataChange}
            useLayoutSystem={false}  // Disable layout system - use hardcoded version
        />
    );
};

export default FormManagementScreen;
