function UserStatus() {
  const colors = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-amber-500',
    'bg-violet-500',
  ]

  const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )

  return (
    <div className="flex items-center gap-3">
     
      <div className="flex -space-x-2">
        {colors.map((color, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full ${color} flex items-center justify-center ring-2 ring-slate-900 shrink-0`}
          >
            <ProfileIcon />
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserStatus