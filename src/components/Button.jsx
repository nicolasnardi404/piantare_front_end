import './Button.css';
import PrefetchLink from './PrefetchLink';
import { getResourcesForRoute } from '../config/routeResources';

/**
 * Button Component
 *
 * Available variants:
 * - 'sage-terra': Sage Dark → Terracotta on hover
 * - 'light-dark': Sage Light → Sage Dark on hover
 * - 'terra-dark': Terracotta → Sage Dark on hover
 * - 'outline': Primary Outline (no stroke color change on hover)
 *
 * @param {Object} props
 * @param {string} props.variant - Button style variant (default: 'sage-terra')
 * @param {string} props.to - Route path for Link (if provided, renders as Link instead of button)
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({
  variant = 'sage-terra',
  to,
  onClick,
  children,
  className = '',
  ...props
}) => {
  const baseClass = 'button';
  const variantClass = `button--${variant}`;
  const classes = [baseClass, variantClass, className].filter(Boolean).join(' ');

  // If 'to' prop is provided, render as PrefetchLink
  if (to) {
    const prefetchImages = getResourcesForRoute(to);
    return (
      <PrefetchLink
        to={to}
        prefetchImages={prefetchImages}
        className={classes}
        {...props}
      >
        {children}
      </PrefetchLink>
    );
  }

  // Otherwise render as button
  return (
    <button
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
