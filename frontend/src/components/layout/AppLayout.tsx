import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RightPanel } from '@/components/RightPanel';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Toaster } from '@/components/ui/sonner';
import { useUiStore } from '@/app/store/ui';

export function AppLayout() {
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen);
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar);
  const toggleMobileSidebar = useUiStore((state) => state.toggleMobileSidebar);

  return (
    <div className="app-layout">
      <Sidebar />
      <Drawer direction="left" open={mobileSidebarOpen} onOpenChange={(open) => !open && closeMobileSidebar()}>
        <DrawerContent>
          <DrawerTitle className="sr-only">모바일 메뉴</DrawerTitle>
          <DrawerDescription className="sr-only">주요 화면으로 이동하는 사이드바 메뉴입니다.</DrawerDescription>
          <Sidebar mobileOpen onMobileClose={closeMobileSidebar} />
        </DrawerContent>
      </Drawer>
      <div className="main-content">
        <Header onMenuToggle={toggleMobileSidebar} />
        <main data-main="true" className="main-container">
          <Outlet />
        </main>
      </div>
      <RightPanel />
      <Toaster />
    </div>
  );
}
