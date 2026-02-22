function UserStatus({ username }) {
    const colors = [
      'bg-emerald-500',
      'bg-blue-500',
      'bg-amber-500',
      'bg-violet-500',
    ]
  
    const currentUserInitial = username ? username.charAt(0).toUpperCase() : '?'
    const currentUserColor = colors[0]
  
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">Connected</span>
        <div className="flex -space-x-2">
          <div
            className={`w-8 h-8 rounded-full ${currentUserColor} flex items-center justify-center ring-2 ring-slate-900 shrink-0 text-white font-semibold text-sm`}
            title={username || 'Current user'}
          >
            {currentUserInitial}
          </div>
          {colors.slice(1).map((color, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full ${color} flex items-center justify-center ring-2 ring-slate-900 shrink-0 text-white text-xs opacity-75`}
            >
              +
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default UserStatus