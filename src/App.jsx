import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import HomePage from './components/HomePage'
import EditorPage from './components/EditorPage'

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  )
}

export default App