import RoomCodeLabel from './RoomCodelabel'
import UserStatus from './UserStatus'
import CrossButton from './CrossButton'

function Header({ roomId, username, users = [], typingUsers = [], connected = true, onLeave }) {
  return (
    <header className="shrink-0 px-6 py-4 bg-slate-900 text-white border-b border-slate-700 w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-start items-center gap-3">
          <RoomCodeLabel roomId={roomId} />
          {!connected && (
            <span className="text-xs text-amber-400 italic">Reconnecting...</span>
          )}
        </div>
        <div className="flex-1 flex justify-center">
          <UserStatus username={username} users={users} typingUsers={typingUsers} />
        </div>
        <div className="flex-1 flex justify-end">
          <CrossButton onClick={onLeave} />
        </div>
      </div>
    </header>
  )
}

export default Header