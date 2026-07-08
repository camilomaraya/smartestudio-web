import styles from './Button.module.css'

// Botón reutilizable. variant: "primary" | "ghost".
// Si recibe href renderiza un <a>; si no, un <button>.
export default function Button({ variant = 'primary', href, children, className = '', ...rest }) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim()

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
