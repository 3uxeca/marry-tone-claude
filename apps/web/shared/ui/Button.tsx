import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-brand-dark text-white hover:bg-stone-700 disabled:bg-stone-100 disabled:text-stone-300',
  secondary: 'bg-white text-text-secondary border border-stone-200 hover:bg-stone-50 disabled:opacity-50',
  ghost:     'bg-transparent text-text-secondary hover:bg-brand-cream-100 disabled:opacity-50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'py-2 px-3 text-xs rounded-xl',
  md: 'py-3 px-4 text-sm rounded-2xl',
  lg: 'py-4 px-5 text-base rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, loading, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'font-medium transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 min-h-[44px]',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? <span className="animate-pulse">로딩 중...</span> : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
