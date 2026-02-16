import { useEffect } from 'react';
import type {ModalProps} from "./types.ts";

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose();
        }

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div className="text-lg font-semibold text-gray-900">{title}</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}
