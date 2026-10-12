export default function PageHeading({ eyebrow, title, subtitle, action, date }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action || (date && <div className="heading-date"><span>LOCAL DATE</span><strong>{date}</strong></div>)}
    </div>
  )
}
