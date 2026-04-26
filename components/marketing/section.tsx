export function Section({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`py-20 md:py-28 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  )
}
