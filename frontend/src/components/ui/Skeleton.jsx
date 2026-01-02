import React from 'react';
import { cn } from '../../lib/utils';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-surface-200/80", className)}
            {...props}
        />
    );
};

export { Skeleton };
