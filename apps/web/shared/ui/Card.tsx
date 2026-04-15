import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  selected?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable, selected, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'bg-white rounded-card border-2 overflow-hidden',
          selected ? 'border-brand-dark shadow-md scale-[1.01]' : 'border-stone-100',
          hoverable ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'
