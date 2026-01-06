/**
 * @fileoverview 404 Not Found Page Component
 * 
 * Beautiful 404 page with illustration and helpful messaging
 * when users navigate to non-existent routes or apps.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@zionix/design-system';
import { useStyles } from './NotFoundPage.style';

const { Title, Text } = Typography;

/**
 * 404 Not Found Page Component
 * 
 * Displays a friendly illustration and message when users
 * navigate to a page or app that doesn't exist.
 * 
 * @returns {JSX.Element} Not found page component
 */
const NotFoundPage = () => {
    const { token } = useTheme();
    const styles = useStyles(token);
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <motion.div
                style={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Illustration */}
                <div style={styles.illustrationContainer}>
                    {/* Background decorative elements */}
                    <div style={styles.tree1}>
                        <i className="ri-plant-line" style={styles.treeIcon} />
                    </div>
                    <div style={styles.tree2}>
                        <i className="ri-plant-line" style={styles.treeIcon} />
                    </div>
                    <div style={styles.cloud1}>
                        <i className="ri-cloud-line" style={styles.cloudIcon} />
                    </div>
                    <div style={styles.cloud2}>
                        <i className="ri-cloud-line" style={styles.cloudIcon} />
                    </div>

                    {/* Main character illustration */}
                    <div style={styles.character}>
                        <div style={styles.characterBody}>
                            <i className="ri-search-line" style={styles.searchIcon} />
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div style={styles.decorativeElement1}>
                        <i className="ri-leaf-line" style={styles.leafIcon} />
                    </div>
                    <div style={styles.decorativeElement2}>
                        <i className="ri-leaf-line" style={styles.leafIcon} />
                    </div>
                </div>

                {/* Text Content */}
                <div style={styles.content}>
                    <Title level={2} style={styles.title}>
                        The page you looking for is <span style={styles.highlight}>not found.</span>
                    </Title>
                    <Text style={styles.description}>
                        The link you followed may be broken, or the page may have been removed.
                    </Text>

                    {/* Back to Home Button */}
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleBackToHome}
                        style={styles.button}
                    >
                        Back to Home
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
