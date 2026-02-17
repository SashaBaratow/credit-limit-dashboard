import {type ButtonHTMLAttributes, memo} from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    isLoading?: boolean;
};

function ButtonComponent(
    {
        variant = 'primary',
        isLoading = false,
        className,
        children,
        disabled,
        ...props
    }: ButtonProps) {
    const baseClasses =
        'rounded-md px-4 py-2 text-sm transition-colors focus:outline-none';

    const variantClasses: Record<ButtonVariant, string> = {
        primary: isLoading
            ? 'bg-blue-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700',

        secondary:
            'border bg-white text-gray-800 hover:bg-gray-50',

        ghost:
            'text-gray-700 hover:bg-gray-100',
    };

    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={[
                baseClasses,
                variantClasses[variant],
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {isLoading ? 'Сохранение...' : children}
        </button>
    );
}

export const Button = memo(ButtonComponent);
