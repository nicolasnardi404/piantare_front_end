// Combines class names, ignoring falsy values
export function cn(...args) {
  return args.filter(Boolean).join(" ");
}
