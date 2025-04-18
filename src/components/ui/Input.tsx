import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, icon, className = '', ...props }, ref) => {
    const inputStyles = `block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
      error ? 'border-red-300' : 'border-gray-300'
    } ${icon ? 'pl-10' : ''}`

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={props.id} className='block text-sm font-medium text-gray-700 mb-1'>
            {label}
          </label>
        )}
        <div className='relative'>
          {icon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              {icon}
            </div>
          )}
          <input ref={ref} className={inputStyles} {...props} />
        </div>
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
