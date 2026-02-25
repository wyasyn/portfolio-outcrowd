import { MotionConfig } from 'motion/react';
import { useShallow } from 'zustand/react/shallow';
import './App.css';
import { NAV_ITEMS, TopNav } from './features/navigation';
import { HeroSection } from './components/HeroSection';
import { useWorkspaceStore, type WindowKind } from './features/workspace';

export default function App() {
  const { requestWindow, closeAllWindows } = useWorkspaceStore(
    useShallow((state) => ({
      requestWindow: state.requestWindow,
      closeAllWindows: state.closeAllWindows,
    })),
  );

  const openWindow = (kind: WindowKind) => {
    requestWindow(kind);
  };

  const handleNavSelect = (item: string) => {
    const lowered = item.toLowerCase();
    if (lowered === 'home') {
      closeAllWindows();
      return;
    }
    if (lowered === 'about' || lowered === 'projects' || lowered === 'contact') {
      openWindow(lowered as WindowKind);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="app-shell">
        <section className="hero-frame">
          <TopNav
            items={NAV_ITEMS}
            brandName="Yasin Walum"
            ctaLabel="Let's work"
            onItemSelect={handleNavSelect}
            onCtaClick={() => openWindow('contact')}
          />
          <HeroSection onExploreClick={() => openWindow('projects')} />
        </section>
      </main>
    </MotionConfig>
  );
}
