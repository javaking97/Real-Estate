import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RightPanel } from '@/components/RightPanel';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Toaster } from '@/components/ui/sonner';
import { useUiStore } from '@/app/store/ui';

export function AppLayout() {
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen);
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar);
  const toggleMobileSidebar = useUiStore((state) => state.toggleMobileSidebar);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif', background: '#F0F3F9', overflow: 'hidden' }}>
      <Sidebar />
      <Drawer direction="left" open={mobileSidebarOpen} onOpenChange={(open) => !open && closeMobileSidebar()} dismissible={false}>
        <DrawerContent>
          <Sidebar mobileOpen onMobileClose={closeMobileSidebar} />
        </DrawerContent>
      </Drawer>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header onMenuToggle={toggleMobileSidebar} />
        <main data-main="true" style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 20px' }}>
          <Outlet />
        </main>
      </div>
      <RightPanel />
      <Toaster />
    </div>
  );
}
