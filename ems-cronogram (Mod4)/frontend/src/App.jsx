import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Tasks from './pages/Tasks'
import CCMPage from './pages/CCM'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/ccm" element={<CCMPage />} />
      </Routes>
    </>
  )
}
