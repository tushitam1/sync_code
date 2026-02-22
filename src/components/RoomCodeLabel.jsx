function RoomCodeLabel({ roomId }) {
    return (
      <span className="text-sm font-mono text-slate-300">
        Room: {roomId || '—'}
      </span>
    )
  }
  
  export default RoomCodeLabel