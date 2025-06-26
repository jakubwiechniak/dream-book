"use client"

import type React from "react"

// This is a simplified version of the toast component
// In a real application, you would use the full shadcn/ui toast component

import { createContext, useContext, useState } from "react"

type ToastProps = {
    title: string
    description: string
    variant?: "default" | "destructive"
}

const ToastContext = createContext<{
    toast: (props: ToastProps) => void
}>({
    toast: () => { },
})

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    const toast = (props: ToastProps) => {
        setToasts((prev) => [...prev, props])
        // Remove toast after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.slice(1))
        }, 3000)
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            {toasts.length > 0 && (
                <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                    {toasts.map((t, i) => (
                        <div
                            key={i}
                            className={`rounded-md p-4 shadow-md ${t.variant === "destructive" ? "bg-red-100 text-red-900" : "bg-white text-black"
                                }`}
                        >
                            <div className="font-semibold">{t.title}</div>
                            <div className="text-sm">{t.description}</div>
                        </div>
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

// Export the type for external use
export type { ToastProps }
