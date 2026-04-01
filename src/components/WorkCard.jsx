/**
 * WorkCard Component
 *
 * Reusable card component for displaying work items with icon, title, and description
 */
const WorkCard = ({ icon, title, description, colorClass }) => (
  <div className={`work-card ${colorClass}`}>
    <div className="work-card__icon">
      <img src={icon} alt={title} />
    </div>
    <h3 className="work-card__title">{title}</h3>
    <p className="work-card__description">{description}</p>
  </div>
)

export default WorkCard
