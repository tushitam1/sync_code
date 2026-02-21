import RoomCodeLabel from './RoomCodeLabel'
import UserStatus from './UserStatus'
import CrossButton from './CrossButton'

function Header() {
  return (
    <header className="shrink-0 px-6 py-4 bg-slate-900 text-white border-b border-slate-700 w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <RoomCodeLabel />
        </div>
        <div className="flex-1 flex justify-center">
          <UserStatus />
        </div>
        <div className="flex-1 flex justify-end">
          <CrossButton />
        </div>
      </div>
    </header>
  )
}

export default Header