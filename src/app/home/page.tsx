import React from 'react'
import SearchBar from '../components/client/SearchBar'

//lAYOUT COMPONENTS RSC

function Home() {
  return (
    <html>
        <body>
    <div
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%), url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        color: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{ marginBottom: '24px' }}>Welcome to the Home Page</h1>
      <SearchBar />
    </div>
    </div>
    </body>
    </html>
  )
}

export default Home
