import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BaseTable,
    BaseInput,
    BaseButton,
    BaseSpace,
    BaseBadge,
    BaseSelect,
    baseMessage,
    theme
} from '@zionix-space/design-system';
import { useRolesQuery } from '../hooks/useRoleQuery';
import './RoleManagementList.scss';

const { useToken } = theme;

const RoleManagementList = () => {
    const { token } = useToken();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Fetch roles from API
    const { data: roles = [], isLoading, isError, error } = useRolesQuery();

    // Show error message if query fails - use useEffect to avoid side effects during render
    useEffect(() => {
        if (isError) {
            baseMessage.error(error?.message || 'Failed to load roles');
        }
    }, [isError, error]);

    // Handle add role button click
    const handleAddRole = () => {
        navigate('create-role');
    };

    // Handle role selection
    const handleRoleClick = (role) => {
        navigate(`${role.id}`);
    };

    // Filter data based on search and status
    const filteredData = roles.filter(role => {
        const matchesSearch = !searchText ||
            role.role_name?.toLowerCase().includes(searchText.toLowerCase()) ||
            role.role_code?.toLowerCase().includes(searchText.toLowerCase()) ||
            role.description?.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && role.active) ||
            (statusFilter === 'inactive' && !role.active);

        return matchesSearch && matchesStatus;
    });

    // Handle search
    const handleSearch = useCallback((value) => {
        setSearchText(value);
    }, []);

    // Table columns
    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'role_name',
            key: 'role_name',
            sorter: (a, b) => (a.role_name || '').localeCompare(b.role_name || ''),
        },
        {
            title: 'Role Code',
            dataIndex: 'role_code',
            key: 'role_code',
            sorter: (a, b) => (a.role_code || '').localeCompare(b.role_code || ''),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Role Level',
            dataIndex: 'role_level',
            key: 'role_level',
            align: 'center',
            sorter: (a, b) => a.role_level - b.role_level,
        },
        {
            title: 'System Role',
            dataIndex: 'system_role',
            key: 'system_role',
            align: 'center',
            render: (value) => (
                <BaseBadge
                    status={value ? 'processing' : 'default'}
                    text={value ? 'Yes' : 'No'}
                />
            ),
        },
        {
            title: 'Admin',
            dataIndex: 'is_admin',
            key: 'is_admin',
            align: 'center',
            render: (value) => (
                <BaseBadge
                    status={value ? 'success' : 'default'}
                    text={value ? 'Yes' : 'No'}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'active',
            align: 'center',
            render: (value) => (
                <BaseBadge
                    status={value ? 'success' : 'error'}
                    text={value ? 'Active' : 'Inactive'}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <BaseSpace size="small">
                    <BaseButton
                        type="link"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRoleClick(record);
                        }}
                    >
                        View
                    </BaseButton>
                    <BaseButton
                        type="link"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        Edit
                    </BaseButton>
                </BaseSpace>
            ),
        },
    ];

    // Statistics
    const stats = {
        total: roles.length,
        active: roles.filter(r => r.active).length,
        inactive: roles.filter(r => !r.active).length,
        admin: roles.filter(r => r.is_admin).length,
    };

    return (
        <div className="role-list-container" >
            <BaseSpace direction="vertical" style={{ width: '100%' }}>
                {/* Header with Title and Action Buttons */}
                <div className="role-list-header">
                    <h2 className="role-list-title">All Roles</h2>
                    <BaseSpace>
                        {/* <BaseButton  icon={<i className="ri-download-line" />}>
                            Export
                        </BaseButton> */}
                        <BaseButton
                            type="primary"
                            htmlType="button"
                            icon={<i className="ri-add-line" />}
                            onClick={handleAddRole}
                        >
                            Add Role
                        </BaseButton>
                    </BaseSpace>
                </div>

                {/* Search and Filters Row */}
                <div className="role-list-search-row">
                    <BaseSpace.Compact >
                        <BaseInput
                            size="large"
                            className="role-list-search-input"
                            placeholder="Search by name, code, or description"
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            allowClear
                        />
                        <BaseButton size="large" type="primary" icon={<i className="ri-search-line" />} />
                    </BaseSpace.Compact>

                    <BaseSelect
                        className="role-list-status-filter"
                        value={statusFilter}
                        size="large"
                        onChange={setStatusFilter}
                        options={[
                            { label: 'All Status', value: 'all' },
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                        ]}
                    />

                    {/* <BaseButton icon={<i className="ri-filter-line" />}>
                        More Filters
                    </BaseButton> */}
                </div>

                {/* Stats Row */}
                <div className="role-list-stats-row">
                    <div
                        className="role-list-stat-card"
                        style={{
                            background: token.contentBgColor,
                            border: `1px solid ${token.contentBgColor}`
                        }}
                    >
                        <div className="role-list-stat-label" style={{ color: token.colorTextSecondary }}>
                            Total Roles
                        </div>
                        <div className="role-list-stat-value" style={{ color: token.colorText }}>
                            {stats.total}
                        </div>
                    </div>
                    <div
                        className="role-list-stat-card"
                        style={{
                            background: token.contentBgColor,
                            border: `1px solid ${token.contentBgColor}`
                        }}
                    >
                        <div className="role-list-stat-label" style={{ color: token.colorTextSecondary }}>
                            Active
                        </div>
                        <div className="role-list-stat-value" style={{ color: token.colorSuccess }}>
                            {stats.active}
                        </div>
                    </div>
                    <div
                        className="role-list-stat-card"
                        style={{
                            background: token.contentBgColor,
                            border: `1px solid ${token.contentBgColor}`
                        }}
                    >
                        <div className="role-list-stat-label" style={{ color: token.colorTextSecondary }}>
                            Inactive
                        </div>
                        <div className="role-list-stat-value" style={{ color: token.colorWarning }}>
                            {stats.inactive}
                        </div>
                    </div>
                    <div
                        className="role-list-stat-card"
                        style={{
                            background: token.contentBgColor,
                            border: `1px solid ${token.contentBgColor}`
                        }}
                    >
                        <div className="role-list-stat-label" style={{ color: token.colorTextSecondary }}>
                            Admin
                        </div>
                        <div className="role-list-stat-value" style={{ color: token.colorPrimary }}>
                            {stats.admin}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <BaseTable
                    className="role-list-table"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} roles`,
                    }}
                    onRow={(record) => ({
                        onClick: () => handleRoleClick(record),
                        style: { cursor: 'pointer' },
                    })}
                />
            </BaseSpace>
        </div>
    );
};

export default RoleManagementList;
