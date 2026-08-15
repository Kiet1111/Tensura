// src/components/AppLayout.tsx
import React, { useState } from 'react';
import { useDeviceAdaptation } from '../hooks/useDeviceAdaptation';

interface AppLayoutProps {
  storyContent: React.ReactNode;
  statusContent: React.ReactNode;
  combatContent?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  storyContent,
  statusContent,
  combatContent,
}) => {
  const { isMobile, isTablet, isDesktop } = useDeviceAdaptation();
  const [activeTab, setActiveTab] = useState<'story' | 'status' | 'combat'>('story');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* HEADER: Hiển thị trên mọi thiết bị */}
      <header className="h-14 border-b border-cyan-900/40 bg-slate-900/90 px-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur">
        <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Tensura RPG
        </h1>
        <span className="text-xs px-2 py-1 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
          {isMobile ? 'Mobile Mode' : isTablet ? 'Tablet/iPad Mode' : 'Desktop Mode'}
        </span>
      </header>

      {/* CHẾ ĐỘ LAPTOP / PC (Desktop > 1024px): Bố cục 3 Cột song song */}
      {isDesktop && (
        <main className="flex-1 grid grid-cols-12 gap-4 p-4 max-w-[1600px] w-full mx-auto">
          <section className="col-span-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {statusContent}
          </section>
          <section className="col-span-6 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            {storyContent}
          </section>
          <section className="col-span-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {combatContent || <div className="text-xs text-slate-500">Nhật ký giao tranh</div>}
          </section>
        </main>
      )}

      {/* CHẾ ĐỘ IPAD / TABLET (768px - 1024px): Bố cục 2 Cột linh hoạt */}
      {isTablet && (
        <main className="flex-1 grid grid-cols-12 gap-4 p-4">
          <section className="col-span-5 bg-slate-900/60 p-4 rounded-xl border border-slate-800 overflow-y-auto">
            {statusContent}
          </section>
          <section className="col-span-7 bg-slate-900/40 p-4 rounded-xl border border-slate-800 overflow-y-auto">
            {storyContent}
          </section>
        </main>
      )}

      {/* CHẾ ĐỘ ĐIỆN THOẠI (< 768px): Bố cục 1 Cột + Thanh chuyển Tabs cố định bên dưới */}
      {isMobile && (
        <main className="flex-1 p-3 pb-20">
          {activeTab === 'story' && <div className="space-y-4">{storyContent}</div>}
          {activeTab === 'status' && <div className="space-y-4">{statusContent}</div>}
          {activeTab === 'combat' && <div className="space-y-4">{combatContent}</div>}
        </main>
      )}

      {/* BOTTOM DOCK NAV: Chỉ hiện trên Điện thoại */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex justify-around items-center z-50">
          <button
            onClick={() => setActiveTab('story')}
            className={`flex flex-col items-center text-xs ${activeTab === 'story' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            <span>📖 Truyện</span>
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex flex-col items-center text-xs ${activeTab === 'status' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
          >
            <span>👤 Trạng Thái</span>
          </button>
          <button
            onClick={() => setActiveTab('combat')}
            className={`flex flex-col items-center text-xs ${activeTab === 'combat' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            <span>⚔️ Trận Đánh</span>
          </button>
        </nav>
      )}

    </div>
  );
};
