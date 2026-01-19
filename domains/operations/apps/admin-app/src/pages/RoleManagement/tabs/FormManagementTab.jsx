import React, { lazy, Suspense } from 'react';
import { Spin } from 'antd';

// Lazy load the heavy FormBuilder library - only loads when tab is active
const FormBuilderWrapper = lazy(() =>
    import('./FormBuilderWrapper')
);

const FormLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 46px)'
    }}>
        <Spin size="large" tip="Loading Form Builder..." />
    </div>
);

const FormManagementTab = () => {
    return (
        <div style={{ height: 'calc(100vh - 46px)', overflow: 'hidden' }}>
            <Suspense fallback={<FormLoader />}>
                <FormBuilderWrapper />
            </Suspense>
        </div>
    );
};

export default FormManagementTab;
