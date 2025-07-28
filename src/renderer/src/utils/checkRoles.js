// pass user object to function to check roles
export function checkRoles(user, requiredRoles) {
  if (!user || !user.role) return false
  return requiredRoles === user.role
}
