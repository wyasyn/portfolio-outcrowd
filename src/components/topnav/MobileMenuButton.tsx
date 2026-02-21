import { Cancel01Icon, Menu01Icon } from '@hugeicons/core-free-icons';
import { Icon } from '../ui/Icon';

type MobileMenuButtonProps = {
  isMobileNavOpen: boolean;
  onToggle: () => void;
};

export function MobileMenuButton({ isMobileNavOpen, onToggle }: MobileMenuButtonProps) {
  if (isMobileNavOpen) {
    return (
      <button
        className="menu-trigger"
        type="button"
        aria-label="Close menu"
        aria-expanded="true"
        aria-controls="mobile-navigation-drawer"
        onClick={onToggle}
      >
        <Icon icon={Cancel01Icon} size={20} />
      </button>
    );
  }

  return (
    <button
      className="menu-trigger"
      type="button"
      aria-label="Open menu"
      aria-expanded="false"
      aria-controls="mobile-navigation-drawer"
      onClick={onToggle}
    >
      <Icon icon={Menu01Icon} size={20} />
    </button>
  );
}
