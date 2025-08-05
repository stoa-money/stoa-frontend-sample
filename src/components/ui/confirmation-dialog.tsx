import React from 'react'
import { Button } from './button'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          iconBg: 'bg-red-50',
          confirmBtn: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'warning':
        return {
          icon: 'text-amber-600',
          iconBg: 'bg-amber-50',
          confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white'
        }
      case 'info':
        return {
          icon: 'text-blue-600',
          iconBg: 'bg-blue-50',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div 
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${styles.iconBg} flex-shrink-0`}>
              <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-4 py-2 font-medium transition-all duration-200 ${styles.confirmBtn}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
} 