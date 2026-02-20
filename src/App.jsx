import { useState } from 'react'
import NeighborhoodMap from './components/NeighborhoodMap'
import CommunityBoard from './components/CommunityBoard'
import markersData from './data/markers.json'
import announcementsData from './data/announcements.json'
import boundaryData from './data/boundary.json'

function App() {
  const [markers] = useState(markersData)
  const [announcements] = useState(announcementsData)
  const [boundary] = useState(Array.isArray(boundaryData) ? boundaryData : [])

  return (
    <div
      className="min-h-screen flex flex-col ramadan-bg"
      style={{ background: 'linear-gradient(to bottom, #0d3b2a 0%, #0f5132 50%, #1a5c3e 100%)' }}
    >
      <header
        id="app-header"
        className="flex items-center justify-center gap-4 py-3 px-4 bg-[#0d3b2a] border-b-2 border-[#d4a84b] shadow-md"
      >
        <img
          src="/hara-logo.png"
          alt="شعار الحارة اليمانية"
          className="h-24 w-24 md:h-28 md:w-28 object-contain"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <h1 className="text-xl md:text-2xl font-bold text-[#f5f0e6]">
          الحارة اليمانية
        </h1>
      </header>

      <main className="pt-[120px]">
        <NeighborhoodMap markers={markers} boundary={boundary} />
        <CommunityBoard id="community-board" announcements={announcements} />
      </main>

      <footer className="bg-[#0d3b2a] border-t-2 border-[#d4a84b] py-4 px-4 text-center text-sm text-[#f5f0e6]">
        <p className="font-medium text-[#d4a84b]">الحارة اليمانية</p>
        <p className="text-[#f5f0e6]/90 mt-0.5">رمضان كريم — حيّنا</p>
      </footer>
    </div>
  )
}

export default App
