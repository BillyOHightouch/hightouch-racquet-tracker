'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

export default function Home() {
  const [gameData, setGameData] = useState({
    sportType: 'tennis',
    winner: '',
    loser: ''
  })
  const [lastGame, setLastGame] = useState(null)
  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    // Check when SDK is ready
    const checkSDK = setInterval(() => {
      if (window.htevents && window.htevents.initialized) {
        setSdkReady(true)
        clearInterval(checkSDK)
        console.log('Hightouch SDK is ready')
      }
    }, 100)

    // Cleanup
    return () => clearInterval(checkSDK)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Generate unique game ID
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const eventData = {
      game_id: gameId,
      sport_type: gameData.sportType,
      winner_email: gameData.winner,
      loser_email: gameData.loser,
      timestamp: new Date().toISOString()
    }
    
    // Send event to Hightouch
    if (window.htevents) {
      try {
        // Track the match completion event
        window.htevents.track('Match Completed', {
          game_id: eventData.game_id,
          sport_type: eventData.sport_type,
          winner_email: eventData.winner_email,
          loser_email: eventData.loser_email,
          timestamp: eventData.timestamp
        })
        
        console.log('Event sent to Hightouch:', eventData)
      } catch (error) {
        console.error('Failed to send event:', error)
      }
    } else {
      console.log('Hightouch SDK not available:', eventData)
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
    <>
      <Script
        id="hightouch-sdk"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(){var e=window.htevents=window.htevents||[];if(!e.initialize)if(e.invoked)window.console&&console.error&&console.error("Hightouch snippet included twice.");else{e.invoked=!0,e.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"],e.factory=function(t){return function(){var n=Array.prototype.slice.call(arguments);return n.unshift(t),e.push(n),e}};for(var t=0;t<e.methods.length;t++){var n=e.methods[t];e[n]=e.factory(n)}e.load=function(t,n){var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src="https://cdn.hightouch-events.com/browser/release/v1-latest/events.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(o,r),e._loadOptions=n,e._writeKey=t},e.SNIPPET_VERSION="0.0.1",
            e.load('a741bfca11a44b56515085b1cee2ec388daaeb215628da5c9b15860ce0428b85',{apiHost:'us-east-1.hightouch-events.com'}),
            e.page()}}();
          `
        }}
      />
      
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
                {lastGame.winner_email} defeated {lastGame.loser_email} in {lastGame.sport_type.replace('_', ' ')}
              </p>
            </div>
          )}
          
          <div className="mt-8 text-center text-xs text-gray-500">
            {sdkReady ? '🟢 Connected to Hightouch' : '🔴 Hightouch SDK Loading...'}
          </div>
        </div>
      </main>
    </>
  )
}