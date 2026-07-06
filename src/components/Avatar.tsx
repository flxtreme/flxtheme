import React from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

const getInitials = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size = 'md', status, className = '', ...props }, ref) => {
    const [errored, setErrored] = React.useState(false);

    const baseClass =
      'flx-avatar relative inline-flex items-center justify-center shrink-0 rounded-full bg-surface-hover text-foreground font-semibold overflow-hidden select-none';

    const sizeClasses: Record<string, string> = {
      xs: 'flx-avatar--xs w-6 h-6 text-[0.625rem]',
      sm: 'flx-avatar--sm w-8 h-8 text-xs',
      md: 'flx-avatar--md w-10 h-10 text-sm',
      lg: 'flx-avatar--lg w-12 h-12 text-base',
      xl: 'flx-avatar--xl w-16 h-16 text-lg',
    };

    const statusClasses: Record<string, string> = {
      online: 'bg-emerald-500',
      offline: 'bg-gray-400',
      busy: 'bg-destructive',
      away: 'bg-amber-500',
    };

    const statusSizeClasses: Record<string, string> = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
    };

    const classes = cn(baseClass, sizeClasses[size], className);

    return (
      <div ref={ref} className={classes} {...props}>
        {src && !errored ? (
          <img
            src={src}
            alt={alt || name || 'avatar'}
            className="flx-avatar__img w-full h-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <span className="flx-avatar__initials">{getInitials(name)}</span>
        )}
        {status && (
          <span
            className={cn(
              'flx-avatar__status absolute bottom-0 right-0 rounded-full ring-2 ring-white',
              statusClasses[status],
              statusSizeClasses[size]
            )}
            aria-label={status}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarProps['size'];
  children: React.ReactNode;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max = 4, size = 'md', className = '', children, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const visible = items.slice(0, max);
    const overflow = items.length - visible.length;

    const classes = cn('flx-avatar-group flex items-center -space-x-2', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {visible.map((child, i) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, {
                size,
                className: cn('ring-2 ring-white', (child.props as AvatarProps).className),
                key: i,
              })
            : child
        )}
        {overflow > 0 && (
          <Avatar
            name={`+${overflow}`}
            size={size}
            className="ring-2 ring-white bg-surface text-foreground/70"
          />
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
