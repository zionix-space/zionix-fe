import React, { lazy, Suspense } from 'react';
import { BaseSpin } from '@zionix-space/design-system';

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
        <BaseSpin size="large" />
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
