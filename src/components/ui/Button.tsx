import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'link';
};

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  const variantClassName =
    variant === 'primary' ? 'btn btn-primary' : variant === 'ghost' ? 'btn btn-ghost' : 'btn btn-link';
  const mergedClassName = className ? `${variantClassName} ${className}` : variantClassName;

  return (
    <button {...props} className={mergedClassName}>
      {children}
    </button>
  );
}
