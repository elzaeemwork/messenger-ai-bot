// components/ui/skeleton.tsx — shadcn/ui Skeleton component for loading states

import { cn } from '@/lib/utils/cn';

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-muted', className)}
            {...props}
        />
    );
}

export { Skeleton };
