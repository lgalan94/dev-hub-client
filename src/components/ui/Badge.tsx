import React from 'react';

// FIX: Updated BadgeProps to extend React.ComponentPropsWithoutRef<'div'> to allow standard div attributes like `className` and to correctly handle the `key` prop when used in lists.
interface BadgeProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-indigo-600 text-indigo-50 hover:bg-indigo-600/80',
    secondary: 'border-transparent bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50 hover:bg-slate-200/80 dark:hover:bg-slate-700/80',
    destructive: 'border-transparent bg-red-600 text-red-50 hover:bg-red-600/80',
    outline: 'text-slate-900 dark:text-slate-50 border-slate-300 dark:border-slate-700',
    success: 'border-transparent bg-green-600 text-green-50 hover:bg-green-600/80',
  };

  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} {...props} />
  );
}

export default Badge;