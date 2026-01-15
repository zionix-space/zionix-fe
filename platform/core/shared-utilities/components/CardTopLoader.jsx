import React from 'react';
import { theme } from 'antd';

/**
 * CardTopLoader - Indeterminate top edge loader for cards (like login card)
 * Fast-flowing linear animation at the top edge of a card
 * 
 * Usage:
 * <div style={{ position: 'relative' }}>
 *   <CardTopLoader show={isLoading} />
 *   <Card>...</Card>
 * </div>
 */
export const CardTopLoader = ({ show = false }) => {
    const { token } = theme.useToken();

    if (!show) return null;

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: 'transparent',
                    zIndex: 10,
                    overflow: 'hidden',
                    borderTopLeftRadius: token.borderRadiusLG,
                    borderTopRightRadius: token.borderRadiusLG,
                }}
            >
                <div
                    className="card-flow-loader"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '40%',
                        background: `linear-gradient(90deg, transparent, ${token.colorPrimary}, ${token.colorPrimary}, transparent)`,
                        animation: 'cardFlowLoader 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                        boxShadow: `0 0 8px ${token.colorPrimary}`,
                    }}
                />
            </div>
            <style>{`
                @keyframes cardFlowLoader {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(350%);
                    }
                }
            `}</style>
        </>
    );
};

export default CardTopLoader;
