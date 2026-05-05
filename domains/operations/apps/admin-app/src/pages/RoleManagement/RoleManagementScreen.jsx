import { useState, lazy, Suspense, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BaseTabs, BaseSpin, BaseButton, BaseTooltip, theme, useTheme } from '@zionix-space/design-system';
const { useToken } = theme;
// Lazy load components
const RoleManagementTab = lazy(() => import('./tabs/RoleManagementTab'));
const FormManagementTab = lazy(() => import('./tabs/FormManagementTab'));
const ButtonManagementTab = lazy(() => import('./tabs/ButtonManagementTab'));

// Loading fallback component
const TabLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 100px)'
    }}>
        <BaseSpin size="large" />
    </div>
);

const RoleManagementScreen = () => {
    const { token } = useToken();
    const { isMobile } = useTheme();
    const { roleId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('1');
    const [selectedRole, setSelectedRole] = useState(null);

    // Check if we're on create-role path
    const isCreateMode = location.pathname.includes('/create-role');

    // Load role data when URL changes
    useEffect(() => {
        if (isCreateMode) {
            // Create mode - new empty role
            setSelectedRole({
                id: 'new',
                role_name: '',
                role_code: '',
                description: '',
                role_level: 1,
                system_role: false,
                is_admin: false,
                active: true,
                isNew: true,
            });
        } else if (roleId) {
            // Edit mode - fetch role by ID
            // TODO: Fetch role data from API
            // For now, keep the role from navigation state
            if (!selectedRole || selectedRole.id !== roleId) {
                // If no role in state, you should fetch it here
                console.log('Should fetch role with ID:', roleId);
            }
        } else {
            // List mode
            setSelectedRole(null);
        }
    }, [roleId, isCreateMode, selectedRole]);

    // Handle back to list
    const handleBackToList = () => {
        navigate('/apps/adminApp/user-management/roles');
        setSelectedRole(null);
        setActiveTab('1');
    };

    // Show details view with tabs
    const tabItems = [
        {
            key: '1',
            label: 'Role Management',
            children: (
                <Suspense fallback={<TabLoader />}>
                    <RoleManagementTab isMobile={isMobile} selectedRole={selectedRole} />
                </Suspense>
            ),
        },
        {
            key: '2',
            label: 'Form Management',
            children: (
                <Suspense fallback={<TabLoader />}>
                    <FormManagementTab selectedRole={selectedRole} />
                </Suspense>
            ),
        },
        {
            key: '3',
            label: 'Button Management',
            children: (
                <Suspense fallback={<TabLoader />}>
                    <ButtonManagementTab selectedRole={selectedRole} />
                </Suspense>
            ),
        },
    ];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header with back button */}
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
            }}>
                <BaseTooltip title="Back to List" placement="bottom">
                    <BaseButton
                        type="text"
                        icon={<i className="ri-arrow-left-line" style={{ fontSize: '20px' }} />}
                        onClick={handleBackToList}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            color: '#262626',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            margin: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(-3px)';
                            e.currentTarget.style.borderColor = `${token.colorPrimary}`;
                            e.currentTarget.style.color = `${token.colorPrimary}`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                            e.currentTarget.style.color = '#262626';
                        }}
                    />
                </BaseTooltip>
                {selectedRole && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>

                        <div>
                            <span style={{
                                fontWeight: 700,
                                fontSize: '16px',
                                color: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 30, 25, 0.95) 100%)',
                            }}>
                                {selectedRole.isNew ? 'Create New Role' : selectedRole.role_name}
                            </span>
                            {!selectedRole.isNew && (
                                <span style={{
                                    marginLeft: '8px',
                                    color: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 30, 25, 0.95) 100%)',
                                    fontSize: '16px',
                                }}>
                                    ({selectedRole.role_code})
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <BaseTabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                tabBarStyle={{ margin: 0, padding: '0 16px' }}
                destroyOnHidden={true}
            />
        </div>
    );
};

export default RoleManagementScreen;
