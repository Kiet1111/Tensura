import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'ultrawide';

export interface DeviceInfo {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isUltraWide: boolean;
  isTouch: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
}

export function useDeviceAdaptation(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        deviceType: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isUltraWide: false,
        isTouch: false,
        isLandscape: true,
        screenWidth: 1280,
        screenHeight: 800,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isLandscape = width > height;

    let deviceType: DeviceType = 'desktop';
    if (width < 640) deviceType = 'mobile';
    else if (width < 1024) deviceType = 'tablet';
    else if (width >= 1600) deviceType = 'ultrawide';

    return {
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop' || deviceType === 'ultrawide',
      isUltraWide: deviceType === 'ultrawide',
      isTouch,
      isLandscape,
      screenWidth: width,
      screenHeight: height,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isLandscape = width > height;

      let deviceType: DeviceType = 'desktop';
      if (width < 640) deviceType = 'mobile';
      else if (width < 1024) deviceType = 'tablet';
      else if (width >= 1600) deviceType = 'ultrawide';

      setDeviceInfo({
        deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop' || deviceType === 'ultrawide',
        isUltraWide: deviceType === 'ultrawide',
        isTouch,
        isLandscape,
        screenWidth: width,
        screenHeight: height,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}
