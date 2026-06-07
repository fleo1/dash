import { Routes, Route } from 'react-router-dom'
import DecksPage from './pages/DecksPage.jsx'
import CreateDeckPage from './pages/CreateDeckPage.jsx'
import StudyPage from './pages/StudyPage.jsx'
import EditDeckPage from './pages/EditDeckPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DecksPage />} />
      <Route path="/create" element={<CreateDeckPage />} />
      <Route path="/deck/:id/study" element={<StudyPage />} />
      <Route path="/deck/:id/edit" element={<EditDeckPage />} />
    </Routes>
  )
}
