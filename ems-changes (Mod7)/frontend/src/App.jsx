import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChangesPage from './pages/ChangesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChangesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
