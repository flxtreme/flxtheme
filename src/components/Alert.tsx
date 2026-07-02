import React from 'react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from '../icons/fi';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ variant = 'info', title, className = '', children, ...props }, ref) => {
        const styles = {
            info: { wrap: 'bg-info/10 border-info/30 text-info', icon: <FiInfo className="shrink-0 mt-0.5" size={16} /> },
            success: { wrap: 'bg-success/10 border-success/30 text-success', icon: <FiCheckCircle className="shrink-0 mt-0.5" size={16} /> },
            warning: { wrap: 'bg-warning/10 border-warning/30 text-warning', icon: <FiAlertTriangle className="shrink-0 mt-0.5" size={16} /> },
            error: { wrap: 'bg-destructive/10 border-destructive/30 text-destructive', icon: <FiXCircle className="shrink-0 mt-0.5" size={16} /> },
        };
        const { wrap, icon } = styles[variant];

        return (
            <div
                ref={ref}
                role="alert"
                className={[
                    'flx-alert flex gap-3 rounded-flx border border-solid px-4 py-3 text-sm',
                    wrap,
                    className,
                ].filter(Boolean).join(' ')}
                {...props}
            >
                {icon}
                <div className="flex flex-col gap-0.5">
                    {title && <p className="font-semibold leading-none">{title}</p>}
                    <div className="leading-snug opacity-90">{children}</div>
                </div>
            </div>
        );
    }
);

Alert.displayName = 'Alert';