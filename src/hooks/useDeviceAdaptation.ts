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

// Helper tính toán thông tin thiết bị dùng chung
const calculateDeviceInfo = (): DeviceInfo => {
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
};

export function useDeviceAdaptation(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(calculateDeviceInfo);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleResize = () => {
      // Hủy frame cũ nếu người dùng vẫn đang kéo resize liên tục
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      // Chỉ cập nhật state ở khung hình tiếp theo của trình duyệt
      animationFrameId = requestAnimationFrame(() => {
        setDeviceInfo(calculateDeviceInfo());
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}
