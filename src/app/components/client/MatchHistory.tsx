'use client'
import React, { useState, useMemo } from 'react'
import { MatchData, MatchHistoryProps, ParticipantDto } from '@/app/types/types'
import Match from './Match'

type SortOption = 'recent' | 'oldest' | 'kda' | 'damage' | 'duration'
type FilterOption = 'all' | 'wins' | 'losses' | 'ranked' | 'normal'

function MatchHistory({matchData, id}: MatchHistoryProps) {
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [expandAll, setExpandAll] = useState(false)
  const [showStats, setShowStats] = useState(true)

  // Debug logging to understand data structure
  console.log('MatchHistory received:', { matchData, id, type: typeof matchData, isArray: Array.isArray(matchData) })
  
  // Early return if no valid data
  if (!matchData || !Array.isArray(matchData) || matchData.length === 0) {
    return (
      <div className="match-history-container">
        <div className="no-matches">
          <h3>No matches found</h3>
          <p>Start playing some games to see your match history!</p>
        </div>
      </div>
    )
  }

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (!matchData || matchData.length === 0) return null

    let totalWins = 0
    let totalKills = 0
    let totalDeaths = 0
    let totalAssists = 0
    let totalDamage = 0
    let totalGold = 0
    let totalCS = 0
    let rankedGames = 0
    let normalGames = 0

    matchData.forEach((match: MatchData) => {
      // Add defensive checks for match structure
      if (!match || !match.info || !match.info.participants || !Array.isArray(match.info.participants)) {
        console.warn('Invalid match data structure:', match)
        return
      }

      const currentPlayer = match.info.participants.find((p: ParticipantDto) => 
        p && p.puuid === id.toString()
      )
      
      if (currentPlayer) {
        if (currentPlayer.win) totalWins++
        totalKills += currentPlayer.kills || 0
        totalDeaths += currentPlayer.deaths || 0
        totalAssists += currentPlayer.assists || 0
        totalDamage += currentPlayer.totalDamageDealtToChampions || 0
        totalGold += currentPlayer.totalGold || 0
        totalCS += currentPlayer.totalCreepScore || 0
        
        if (match.info.queueId === 420 || match.info.queueId === 440) {
          rankedGames++
        } else {
          normalGames++
        }
      }
    })

    const winRate = (totalWins / matchData.length) * 100
    const avgKDA = totalDeaths === 0 ? 'Perfect' : ((totalKills + totalAssists) / totalDeaths).toFixed(2)
    const avgKills = (totalKills / matchData.length).toFixed(1)
    const avgDeaths = (totalDeaths / matchData.length).toFixed(1)
    const avgAssists = (totalAssists / matchData.length).toFixed(1)
    const avgDamage = Math.round(totalDamage / matchData.length / 1000)
    const avgGold = Math.round(totalGold / matchData.length)
    const avgCS = Math.round(totalCS / matchData.length)

    return {
      totalGames: matchData.length,
      wins: totalWins,
      losses: matchData.length - totalWins,
      winRate: winRate.toFixed(1),
      avgKDA,
      avgKills,
      avgDeaths,
      avgAssists,
      avgDamage,
      avgGold,
      avgCS,
      rankedGames,
      normalGames
    }
  }, [matchData, id])

  // Filter and sort matches
  const processedMatches = useMemo(() => {
    if (!matchData) return []

    let filtered = [...matchData]

    // Apply filters
    if (filterBy !== 'all') {
      filtered = filtered.filter((match: MatchData) => {
        // Add defensive checks for match structure
        if (!match || !match.info || !match.info.participants || !Array.isArray(match.info.participants)) {
          return false
        }

        const currentPlayer = match.info.participants.find((p: ParticipantDto) => 
          p && p.puuid === id.toString()
        )
        
        if (!currentPlayer) return false

        switch (filterBy) {
          case 'wins':
            return currentPlayer.win
          case 'losses':
            return !currentPlayer.win
          case 'ranked':
            return match.info.queueId === 420 || match.info.queueId === 440
          case 'normal':
            return match.info.queueId !== 420 && match.info.queueId !== 440
          default:
            return true
        }
      })
    }

    // Apply sorting
    filtered.sort((a: MatchData, b: MatchData) => {
      // Add defensive checks for match structure
      if (!a || !a.info || !a.info.participants || !Array.isArray(a.info.participants) ||
          !b || !b.info || !b.info.participants || !Array.isArray(b.info.participants)) {
        return 0
      }

      const playerA = a.info.participants.find((p: ParticipantDto) => p && p.puuid === id.toString())
      const playerB = b.info.participants.find((p: ParticipantDto) => p && p.puuid === id.toString())
      
      if (!playerA || !playerB) return 0

      switch (sortBy) {
        case 'recent':
          return (b.info.gameCreation || 0) - (a.info.gameCreation || 0)
        case 'oldest':
          return (a.info.gameCreation || 0) - (b.info.gameCreation || 0)
        case 'kda':
          const kdaA = (playerA.deaths || 0) === 0 ? 999 : ((playerA.kills || 0) + (playerA.assists || 0)) / (playerA.deaths || 1)
          const kdaB = (playerB.deaths || 0) === 0 ? 999 : ((playerB.kills || 0) + (playerB.assists || 0)) / (playerB.deaths || 1)
          return kdaB - kdaA
        case 'damage':
          return (playerB.totalDamageDealtToChampions || 0) - (playerA.totalDamageDealtToChampions || 0)
        case 'duration':
          return (b.info.gameDuration || 0) - (a.info.gameDuration || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [matchData, filterBy, sortBy, id])

  if (!matchData || matchData.length === 0) {
    return (
      <div className="match-history-container">
        <div className="no-matches">
          <h3>No matches found</h3>
          <p>Start playing some games to see your match history!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="match-history-container">
      {/* Statistics Overview */}
      {showStats && overallStats && (
        <div className="stats-overview">
          <div className="stats-header">
            <h3>Match History Overview</h3>
            <button 
              className="toggle-stats"
              onClick={() => setShowStats(!showStats)}
            >
              Hide Stats
            </button>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{overallStats.totalGames}</div>
              <div className="stat-label">Total Games</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number" style={{color: '#4a90e2'}}>{overallStats.wins}</div>
              <div className="stat-label">Wins</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number" style={{color: '#e24a4a'}}>{overallStats.losses}</div>
              <div className="stat-label">Losses</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{overallStats.winRate}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{overallStats.avgKDA}</div>
              <div className="stat-label">Avg KDA</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{overallStats.avgKills}/{overallStats.avgDeaths}/{overallStats.avgAssists}</div>
              <div className="stat-label">Avg K/D/A</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{overallStats.avgDamage}k</div>
              <div className="stat-label">Avg Damage</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{overallStats.avgCS}</div>
              <div className="stat-label">Avg CS</div>
            </div>
          </div>
        </div>
      )}

      {!showStats && (
        <div className="collapsed-stats">
          <button 
            className="show-stats"
            onClick={() => setShowStats(true)}
          >
            Show Stats Overview
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="match-controls">
        <div className="control-group">
          <label>Filter:</label>
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="control-select"
          >
            <option value="all">All Games</option>
            <option value="wins">Wins Only</option>
            <option value="losses">Losses Only</option>
            <option value="ranked">Ranked Only</option>
            <option value="normal">Normal Only</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="control-select"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="kda">Best KDA</option>
            <option value="damage">Highest Damage</option>
            <option value="duration">Longest Games</option>
          </select>
        </div>

        <div className="control-group">
          <button 
            className="expand-all-btn"
            onClick={() => setExpandAll(!expandAll)}
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        <div className="results-count">
          Showing {processedMatches.length} of {matchData.length} matches
        </div>
      </div>

      {/* Match List */}
      <div className="matches-list">
        {processedMatches.length === 0 ? (
          <div className="no-filtered-matches">
            <p>No matches found with the selected filters.</p>
            <button onClick={() => {
              setFilterBy('all')
              setSortBy('recent')
            }}>
              Reset Filters
            </button>
          </div>
        ) : (
          processedMatches.map((match: MatchData, idx: number) => (
            <Match 
              key={`${match?.metadata?.matchId || `match-${idx}`}-${idx}`}
              id={idx} 
              puuid={id} 
              match={match}
            />
          ))
        )}
      </div>

      <style jsx>{`
        .match-history-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .stats-overview {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .stats-header h3 {
          color: white;
          margin: 0;
          font-size: 18px;
        }

        .toggle-stats, .show-stats {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.2s ease;
        }

        .toggle-stats:hover, .show-stats:hover {
          background: #357abd;
        }

        .collapsed-stats {
          text-align: center;
          margin-bottom: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 15px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          padding: 15px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: white;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 12px;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .match-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px 20px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-group label {
          color: #ccc;
          font-size: 14px;
          font-weight: 500;
        }

        .control-select {
          background: #333;
          color: white;
          border: 1px solid #555;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
        }

        .control-select:focus {
          outline: none;
          border-color: #4a90e2;
        }

        .expand-all-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }

        .expand-all-btn:hover {
          background: #5a6268;
        }

        .results-count {
          color: #ccc;
          font-size: 14px;
          margin-left: auto;
        }

        .matches-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .no-matches, .no-filtered-matches {
          text-align: center;
          padding: 40px 20px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .no-matches h3 {
          color: white;
          margin-bottom: 10px;
        }

        .no-matches p, .no-filtered-matches p {
          color: #ccc;
          margin-bottom: 20px;
        }

        .no-filtered-matches button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .no-filtered-matches button:hover {
          background: #357abd;
        }

        @media (max-width: 768px) {
          .match-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .control-group {
            justify-content: space-between;
          }

          .results-count {
            margin-left: 0;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}

export default MatchHistory
