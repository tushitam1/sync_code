import { useLocation } from 'react-router-dom'
import Header from './Header'
import EditorContainer from './EditorContainer'
import Footer from './Footer'

function EditorPage() {
  const location = useLocation()
  const { roomId, username } = location.state || {}

  return (
    <div className="flex flex-col min-h-screen">
      <Header roomId={roomId} username={username} />
      <EditorContainer />
      <Footer />
    </div>
  )
}

export default EditorPage