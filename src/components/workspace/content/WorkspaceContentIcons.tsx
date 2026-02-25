import {
  ArrowRight01Icon,
  Call02Icon,
  GithubIcon,
  InstagramIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  YoutubeIcon,
} from '@hugeicons/core-free-icons';
import type { SocialKey } from '../../../data/workspaceData';
import { Icon } from '../../ui/Icon';

type ContactIconKind = 'email' | 'phone' | 'location' | 'arrow';

export function SocialIcon({ platform }: { platform: SocialKey }) {
  if (platform === 'linkedin') {
    return <Icon icon={Linkedin01Icon} size={16} />;
  }

  if (platform === 'github') {
    return <Icon icon={GithubIcon} size={16} />;
  }

  if (platform === 'youtube') {
    return <Icon icon={YoutubeIcon} size={16} />;
  }

  return <Icon icon={InstagramIcon} size={16} />;
}

export function ContactIcon({ kind }: { kind: ContactIconKind }) {
  if (kind === 'email') {
    return <Icon icon={Mail01Icon} size={16} />;
  }

  if (kind === 'phone') {
    return <Icon icon={Call02Icon} size={16} />;
  }

  if (kind === 'location') {
    return <Icon icon={Location01Icon} size={16} />;
  }

  return <Icon icon={ArrowRight01Icon} size={16} />;
}
