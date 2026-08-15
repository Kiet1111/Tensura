// src/App.tsx
import React from 'react';

// 1. Nhập Layout vừa tạo
import { AppLayout } from './components/AppLayout';

// 2. Nhập các component có sẵn trong thư mục src/components/
import { StatusBoard } from './components/StatusBoard';
import { StoryBanner } from './components/StoryBanner';
import { MainStoryModal } from './components/MainStoryModal';
import { WorldVoiceBanner } from './components/WorldVoiceBanner';
import { MobileHUDBar } from './components/MobileHUDBar';
import { CombatLogPanel } from './components/CombatLogPanel';

export default function App() {
  return (
    <AppLayout
      /* Truyền bảng trạng thái vào cột Status */
      statusContent={
        <div className="space-y-4">
          <MobileHUDBar />
          <StatusBoard />
        </div>
      }

      /* Truyền nội dung truyện & thông báo vào cột Story */
      storyContent={
        <div className="space-y-4">
          <WorldVoiceBanner />
          <StoryBanner />
          <MainStoryModal />
        </div>
      }

      /* Truyền bảng nhật ký giao tranh vào cột Combat */
      combatContent={
        <div className="space-y-4">
          <CombatLogPanel />
        </div>
      }
    />
  );
}
