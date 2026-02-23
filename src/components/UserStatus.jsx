import TypingIndicator from './TypingIndicator'

function UserStatus({ username, players = [] }) {
  return (
    <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-400">
        {players.length > 0 ? `${players.length} connected` : 'Connected'}
      </span>
      <div className="flex -space-x-2">
        {players.length > 0 ? (
          players.map((p) => (
            <div
              key={p.id}
              className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-slate-900 shrink-0 text-white font-semibold text-sm"
              style={{ backgroundColor: p.color || '#6b7280' }}
              title={p.username}
            >
              {p.username ? p.username.charAt(0).toUpperCase() : '?'}
            </div>
          ))
        ) : (
          <div
            className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center ring-2 ring-slate-900 shrink-0 text-white font-semibold text-sm"
            title={username || 'Current user'}
          >
            {username ? username.charAt(0).toUpperCase() : '?'}
          </div>
        )}
      </div>
    </div>
    <TypingIndicator />
    </div>
  )
}
  
  export default UserStatus