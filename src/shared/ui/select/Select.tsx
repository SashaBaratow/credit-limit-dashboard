import {memo} from "react";

type SelectOption<TValue extends string> = {
    value: TValue;
    label: string;
};

type SelectProps<TValue extends string> = {
    value: TValue;
    options: SelectOption<TValue>[];
    onChange: (value: TValue) => void;
    className?: string;
    ariaLabel?: string;
};

function SelectComponent<TValue extends string>(
    {
        value,
        options,
        onChange,
        className,
        ariaLabel,
    }: SelectProps<TValue>) {
    return (
        <select
            value={value}
            aria-label={ariaLabel}
            onChange={(event) => onChange(event.target.value as TValue)}
            className={
                className ??
                'rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none'
            }
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

export const Select = memo(SelectComponent) as typeof SelectComponent;
