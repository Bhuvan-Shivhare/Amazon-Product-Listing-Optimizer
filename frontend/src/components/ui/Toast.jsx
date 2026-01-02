import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const variants = {
        info: "bg-surface-900 text-white",
        success: "bg-success-500 text-white",
        error: "bg-danger-500 text-white",
    };

    return (
        <div className={cn(
            "fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-bottom-5 fade-in duration-300",
            variants[type]
        )}>
            {message}
        </div>
    );
};

export { Toast };
