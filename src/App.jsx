import Header from './components/Header'
import EditorContainer from './components/EditorContainer'
import Footer from './components/Footer'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <EditorContainer />
      <Footer />
    </div>
  )
}

export default App