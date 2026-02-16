import {type InputHTMLAttributes, memo} from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
};

function InputComponent({ label, className, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm text-gray-700">
                    {label}
                </label>
            )}

            <input
                {...props}
                className={
                    className ??
                    'rounded-md border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none'
                }
            />
        </div>
    );
}

export const Input = memo(InputComponent);
