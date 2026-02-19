import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react';

type IconProps = {
  icon: HugeiconsIconProps['icon'];
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
};

export function Icon({
  icon,
  size = 18,
  className,
  color = 'currentColor',
  strokeWidth = 1.8,
}: IconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={color}
      className={className}
      strokeWidth={strokeWidth}
    />
  );
}
