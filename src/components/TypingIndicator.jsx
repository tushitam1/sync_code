import { useState, useEffect } from 'react'
import { useAwareness } from '../context/AwarenessContext'

function TypingIndicator() {
  const awareness = useAwareness()
  const [typingUsers, setTypingUsers] = useState([])

  useEffect(() => {
    if (!awareness) {
      setTypingUsers([])
      return
    }
    const update = () => {
      const states = awareness.getStates()
      const names = []
      states.forEach((state, clientID) => {
        if (state.typing && state.user?.name && clientID !== awareness?.clientID) {
          names.push(state.user.name)
        }
      })
      setTypingUsers(names)
    }
    update()
    awareness.on('change', update)
    return () => awareness.off('change', update)
  }, [awareness])

  if (typingUsers.length === 0) return null

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : typingUsers.length === 2
        ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
        : `${typingUsers.length} people are typing...`

  return (
    <span className="text-xs text-slate-500 italic animate-pulse">{text}</span>
  )
}

export default TypingIndicator
