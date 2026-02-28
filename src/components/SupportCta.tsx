type SupportCtaProps = {
  message?: string
  actionLabel?: string
  href?: string
  variant?: 'inline' | 'card'
}

export function SupportCta({
  message = 'Для подключения расширенного функционала напишите в поддержку',
  actionLabel = 'Написать в поддержку',
  href = 'https://t.me/example_support',
  variant = 'card',
}: SupportCtaProps) {
  return (
    <div className={variant === 'card' ? 'support-cta support-cta-card' : 'support-cta'}>
      <p>{message}</p>
      <a className="secondary-button support-link" href={href} target="_blank" rel="noreferrer">
        {actionLabel}
      </a>
    </div>
  )
}
