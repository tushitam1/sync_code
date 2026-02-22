function UserStatus({ username, users = [], typingUsers = [] }) {
    const colors = [
      'bg-emerald-500',
      'bg-blue-500',
      'bg-amber-500',
      'bg-violet-500',
    ]
  
    const displayUsers = users.slice(0, 4)
    const typingText =
      typingUsers.length === 1
        ? `${typingUsers[0].username} is typing...`
        : typingUsers.length === 2
          ? `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`
          : typingUsers.length > 2
            ? `${typingUsers.length} people are typing...`
            : null
  
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Connected</span>
          <div className="flex -space-x-2">
          {displayUsers.map((user, i) => (
            <div
              key={user.id}
              className={`w-8 h-8 rounded-full ${colors[i % colors.length]} flex items-center justify-center ring-2 ring-slate-900 shrink-0 text-white font-semibold text-sm`}
              title={user.username}
            >
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
          ))}
          {displayUsers.length === 0 && (
            <div
              className={`w-8 h-8 rounded-full ${colors[0]} flex items-center justify-center ring-2 ring-slate-900 shrink-0 text-white font-semibold text-sm`}
              title={username || 'You'}
            >
              {username ? username.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
        </div>
        {typingText && (
          <span className="text-xs text-slate-500 italic animate-pulse">{typingText}</span>
        )}
      </div>
    )
  }
  
  export default UserStatus