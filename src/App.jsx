import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Booking from './pages/Booking'
import Confirmation from './pages/Confirmation'
import NotFound from './pages/NotFound'
import Setup from './pages/Setup'
import { hasApiKey } from './services/movieApi'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  if (!hasApiKey) return <Setup />

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/confirmation/:reference" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
