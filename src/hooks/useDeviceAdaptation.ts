// src/hooks/useDeviceAdaptation.ts
import { useState, useEffect } from 'react';

export interface DeviceState {
  isMobile: boolean;       // < 768px (Điện thoại)
  isTablet: boolean;       // 768px - 1024px (iPad portrait / Tablet)
  isDesktop: boolean;      // > 1024px (Laptop & PC)
  isTouchDevice: boolean;  // Thiết bị có màn hình cảm ứng
  orientation: 'portrait' | 'landscape';
}

export function useDeviceAdaptation(): DeviceState {
  const [deviceInfo, setDeviceInfo] = useState<DeviceState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    orientation: 'landscape',
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setDeviceInfo({
        isMobile: width < 768,
        isTablet: width >= 768 && width <= 1024,
        isDesktop: width > 1024,
        isTouchDevice: isTouch,
        orientation: width > height ? 'landscape' : 'portrait',
      });
    };

    handleResize(); // Chạy khởi tạo lần đầu
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
}
