import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ children, className }) => {
    return (
        <div className={cn("bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden", className)}>
            {children}
        </div>
    );
};

const CardHeader = ({ title, action, className }) => {
    return (
        <div className={cn("px-6 py-4 border-b border-surface-100 flex justify-between items-center bg-surface-50/50", className)}>
            <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
            {action && <div>{action}</div>}
        </div>
    );
};

const CardContent = ({ children, className }) => {
    return (
        <div className={cn("p-6", className)}>
            {children}
        </div>
    );
};

export { Card, CardHeader, CardContent };
