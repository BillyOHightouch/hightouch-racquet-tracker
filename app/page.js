'use client'

import { useState, useEffect } from 'react'
import { HtEventsBrowser } from '@ht-sdks/events-sdk-js-browser'

export default function Home() {
  const [gameData, setGameData] = useState({
    sportType: 'tennis',
    winner: '',
    loser: ''
  })
  const [lastGame, setLastGame] = useState(null)
  const [htEvents, setHtEvents] = useState(null)

  useEffect(() => {
    // Initialize Hightouch SDK
    // TODO: Replace 'YOUR_WRITE_KEY' with your actual Hightouch write key
    const HT = HtEventsBrowser.load(
      { writeKey: 'YOUR_WRITE_KEY' },
      { apiHost: 'https://us-east-1.hightouch-events.com' }
    )
    setHtEvents(HT)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Generate unique game ID
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const eventData = {
      game_id: gameId,
      sport_type: gameData.sportType,
      winner: gameData.winner,
      loser: gameData.loser,
      timestamp: new Date().toISOString()
    }
    
    // Send event to Hightouch
    if (htEvents) {
      htEvents.track('Match Completed', {
        game_id: eventData.game_id,
        sport_type: eventData.sport_type,
        winner_email: eventData.winner,
        loser_email: eventData.loser
      })
      console.log('Event sent to Hightouch:', eventData)
    } else {
      console.log('Hightouch SDK not initialized yet:', eventData)
    }
    
    // Show confirmation
    setLastGame(eventData)
    
    // Reset form
    setGameData({
      sportType: 'tennis',
      winner: '',
      loser: ''
    })
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🎾 Hightouch Racquet Sports Tracker 🏓
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Log Match Result</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Sport Type
              </label>
              <select 
                value={gameData.sportType}
                onChange={(e) => setGameData({...gameData, sportType: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="tennis">Tennis</option>
                <option value="table_tennis">Table Tennis</option>
                <option value="badminton">Badminton</option>
                <option value="squash">Squash</option>
                <option value="pickleball">Pickleball</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Winner Email
              </label>
              <input
                type="email"
                placeholder="winner@hightouch.com"
                value={gameData.winner}
                onChange={(e) => setGameData({...gameData, winner: e.target.value})}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Loser Email
              </label>
              <input
                type="email"
                placeholder="loser@hightouch.com"
                value={gameData.loser}
                onChange={(e) => setGameData({...gameData, loser: e.target.value})}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Log Match Result
            </button>
          </form>
        </div>
        
        {lastGame && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Match Logged Successfully!</h3>
            <p className="text-sm text-gray-600">
              Game ID: {lastGame.game_id}<br />
              {lastGame.winner} defeated {lastGame.loser} in {lastGame.sport_type.replace('_', ' ')}
            </p>
          </div>
        )}
        
        <div className="mt-8 text-center text-xs text-gray-500">
          {htEvents ? '🟢 Connected to Hightouch' : '🔴 Hightouch SDK Loading...'}
        </div>
      </div>
    </main>
  )
}