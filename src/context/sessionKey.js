export const getSessionKey = (user) => {
  if (!user) return 'anon';
  if (user.role === 'guest') return 'guest';
  const id = user.email || user.username || 'unknown';
  return `user_${id.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
};
