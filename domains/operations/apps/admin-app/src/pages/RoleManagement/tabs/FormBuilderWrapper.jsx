import React from 'react';
import {
    FormBuilder,
    BuilderView,
    antdComponents,
    AntLocalizationWrapper,
    ltrCssLoader,
    rtlCssLoader,
    zionixlcAntdCssLoader,
    BiDi
} from '@zionix-space/lowcode';
import '@zionix-space/lowcode/styles';

// Build components for FormBuilder
const builderComponents = antdComponents.map(c => c.build());
const builderView = new BuilderView(builderComponents)
    .withViewerWrapper(AntLocalizationWrapper)
    .withCssLoader(BiDi.LTR, ltrCssLoader)
    .withCssLoader(BiDi.RTL, rtlCssLoader)
    .withCssLoader('common', zionixlcAntdCssLoader);

const getCurrentFormId = () => {
    return localStorage.getItem('zionixlc-current-form-id') || null;
};

const getForm = async (formId) => {
    if (!formId) return null;
    // Note: formDB should be imported from your database service
    // const schema = await formDB.getFormSchema(formId);
    // return schema ? JSON.stringify(schema) : null;
    return null;
};

const FormBuilderWrapper = () => {
    const [currentFormId, setCurrentFormId] = React.useState(() => getCurrentFormId());

    React.useEffect(() => {
        const handleStorageChange = () => {
            const newFormId = getCurrentFormId();
            setCurrentFormId(newFormId);
        };

        window.addEventListener('zionixlc-form-selected', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('zionixlc-form-selected', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const customValidators = {
        string: {
            isHex: {
                validate: value => /^[0-9A-F]*$/i.test(value)
            }
        }
    };

    const customActions = {
        logEventArgs: (e) => {
            console.log('Custom action - logEventArgs:', e);
        }
    };

    const handleFormDataChange = ({ data, errors }) => {
        console.log('Form data changed:', { data, errors });
    };

    return (
        <FormBuilder
            key={currentFormId || 'no-form'}
            view={builderView}
            getForm={currentFormId ? () => getForm(currentFormId) : null}
            formName={currentFormId || null}
            initialData={{}}
            validators={customValidators}
            actions={customActions}
            onFormDataChange={handleFormDataChange}
            useLayoutSystem={false}
        />
    );
};

export default FormBuilderWrapper;
