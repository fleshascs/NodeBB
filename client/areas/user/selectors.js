export const getOnlineUsersObj = (state) => state.users.users;

export const getOnlineUsers = (state) => Object.values(state.users.users);

export const isOnline = (state, uid) => {
  if (!uid) return false;
  const users = getOnlineUsersObj(state);
  return !!users[uid];
};
