interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'blush' | 'sage' | 'mauve'
  className?: string
}

const variantClasses = {
  default: 'bg-brand-cream-100 text-text-secondary',
  blush:   'bg-accent-blush-light text-rose-600',
  sage:    'bg-accent-sage-light text-emerald-700',
  mauve:   'bg-purple-50 text-purple-600',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
