/**
 * @fileoverview Query Error Boundary Styles
 * 
 * Apple-inspired glassmorphism design with premium feel
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

export const errorContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    padding: '24px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
    position: 'relative',
    overflow: 'hidden',
};

export const errorContentStyles = {
    maxWidth: '560px',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
};

export const errorCardStyles = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '24px',
    padding: '48px 40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    transition: 'all 0.3s ease',
};

export const iconContainerStyles = {
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'center',
};

export const iconStyles = {
    fontSize: '72px',
    color: '#faad14',
    filter: 'drop-shadow(0 4px 12px rgba(250, 173, 20, 0.25))',
};

export const titleStyles = {
    fontSize: '28px',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: '12px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
};

export const messageStyles = {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '32px',
    fontWeight: 400,
};

export const buttonContainerStyles = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
};

export const primaryButtonStyles = {
    height: '44px',
    minWidth: '140px',
    fontSize: '15px',
    fontWeight: 600,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
    border: 'none',
    boxShadow: '0 4px 16px rgba(0, 102, 255, 0.3)',
    transition: 'all 0.2s ease',
};

export const secondaryButtonStyles = {
    height: '44px',
    minWidth: '140px',
    fontSize: '15px',
    fontWeight: 500,
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    color: '#333',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.2s ease',
};

export const devErrorAlertStyles = {
    marginTop: '28px',
    maxWidth: '100%',
};

export const devAlertStyles = {
    background: 'rgba(230, 247, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(24, 144, 255, 0.2)',
    padding: '16px',
};

export const devAlertDescriptionStyles = {
    fontSize: '13px',
    color: '#333',
    lineHeight: '1.6',
    fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', 'Courier New', monospace",
};
