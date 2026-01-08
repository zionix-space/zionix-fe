import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, theme } from 'antd';

const { useToken } = theme;

const PWAInstallPrompt = () => {
  const { token } = useToken();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#001968');

  useEffect(() => {
    console.log('🔍 PWA Install Prompt: Component mounted');

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('⚠️ PWA Install Prompt: App already installed');
      return;
    }

    // Check if user dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      console.log('⚠️ PWA Install Prompt: User previously dismissed');
      // Uncomment next line to reset for testing:
      // localStorage.removeItem('pwa-install-dismissed');
      return;
    }

    // Get theme settings
    const savedColor = localStorage.getItem('zionix-theme-primary-color');
    const savedMode = localStorage.getItem('zionix-theme-mode');

    if (savedColor) {
      setPrimaryColor(savedColor);
    }

    if (savedMode === 'dark') {
      setIsDark(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('✅ PWA Install Prompt: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after 3 seconds
      setTimeout(() => {
        console.log('✅ PWA Install Prompt: Showing banner');
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA Install Prompt: App installed successfully');
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    // For testing: Show prompt even without beforeinstallprompt (development only)
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        if (!deferredPrompt) {
          console.log('⚠️ PWA Install Prompt: No beforeinstallprompt event (showing anyway for testing)');
          setShowPrompt(true);
        }
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    console.log('🔘 Install button clicked');

    if (!deferredPrompt) {
      console.error('❌ No deferred prompt available');
      alert('Installation not available. Please use the browser install button in the address bar.');
      return;
    }

    try {
      console.log('📱 Showing install prompt...');
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`✅ User response: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('⚠️ User dismissed the install prompt');
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('❌ Error during installation:', error);
      alert('Installation failed. Please try using the browser install button.');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Styles using Ant Design tokens
  const bannerStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
    padding: token.paddingLG,
    background: isDark
      ? `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}25 100%)`
      : `linear-gradient(135deg, ${primaryColor}10 0%, ${primaryColor}20 100%)`,
    backdropFilter: 'blur(10px)',
    borderTop: `2px solid ${primaryColor}40`,
    boxShadow: token.boxShadowSecondary,
  };

  const contentStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: token.margin,
    flexWrap: 'wrap',
  };

  const textContentStyles = {
    flex: 1,
    minWidth: '200px',
  };

  const titleStyles = {
    margin: `0 0 ${token.marginXXS}px 0`,
    fontSize: token.fontSizeLG,
    fontWeight: token.fontWeightStrong,
    color: isDark ? token.colorTextLightSolid : token.colorText,
  };

  const descriptionStyles = {
    margin: 0,
    fontSize: token.fontSize,
    color: isDark ? token.colorTextDescription : token.colorTextSecondary,
  };

  const buttonGroupStyles = {
    display: 'flex',
    gap: token.marginSM,
    alignItems: 'center',
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          style={bannerStyles}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div style={contentStyles}>
            <div style={textContentStyles}>
              <h3 style={titleStyles}>Install Zionix App</h3>
              <p style={descriptionStyles}>
                Get quick access and a better experience with our app
              </p>
            </div>
            <div style={buttonGroupStyles}>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleInstall}
                  style={{
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    boxShadow: `0 2px 8px ${primaryColor}40`,
                    fontWeight: token.fontWeightStrong,
                  }}
                >
                  Install App
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  size="large"
                  onClick={handleDismiss}
                  style={{
                    background: 'transparent',
                    color: isDark ? token.colorTextDescription : token.colorTextSecondary,
                    borderColor: isDark ? token.colorBorder : token.colorBorder,
                    fontWeight: token.fontWeightStrong,
                  }}
                >
                  Not Now
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
