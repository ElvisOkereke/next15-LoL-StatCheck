'use client'
import { MatchProps, ParticipantDto } from '@/app/types/types'
import React, { useState, useMemo } from 'react'
import { 
  getChampionIcon, 
  getItemIcon, 
  getSummonerSpellIcon, 
  getRuneIcon,
  getQueueTypeName,
  getItemName,
  getSummonerSpellName
} from '@/app/utils/iconUtils'
import { useIcons } from '@/app/hooks/useIcons'

function Match({match, id, puuid}:MatchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'builds' | 'timeline'>('overview')
  const { isInitialized } = useIcons()

  // Find the current player's data from the match
  const currentPlayer = useMemo(() => {
    // Add defensive checks for match structure
    if (!match || !match.info || !match.info.participants || !Array.isArray(match.info.participants)) {
      console.warn('Invalid match data structure in Match component:', match)
      return null
    }
    return match.info.participants.find((participant: ParticipantDto) => 
      participant && participant.puuid === puuid.toString()
    )
  }, [match, puuid])

  // Get team data
  const playerTeam = useMemo(() => {
    if (!currentPlayer || !match || !match.info || !match.info.teams || !Array.isArray(match.info.teams)) {
      return null
    }
    return match.info.teams.find(team => team && team.teamId === currentPlayer.teamId)
  }, [match, currentPlayer])

  // Get teammates and enemies
  const { teammates, enemies } = useMemo(() => {
    if (!currentPlayer || !match || !match.info || !match.info.participants || !Array.isArray(match.info.participants)) {
      return { teammates: [], enemies: [] }
    }
    
    const teammates = match.info.participants.filter((p: ParticipantDto) => 
      p && p.teamId === currentPlayer.teamId && p.puuid !== puuid.toString()
    )
    const enemies = match.info.participants.filter((p: ParticipantDto) => 
      p && p.teamId !== currentPlayer.teamId
    )
    
    return { teammates, enemies }
  }, [match, currentPlayer, puuid])

  // Calculate game duration in minutes and seconds
  const gameDuration = useMemo(() => {
    if (!match || !match.info || !match.info.gameDuration) {
      return '0:00'
    }
    const totalSeconds = match.info.gameDuration
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [match])

  // Get game mode display name
  const getGameModeDisplay = (queueId: number) => {
    const queueMap: { [key: number]: string } = {
      400: 'Normal Draft',
      420: 'Ranked Solo/Duo',
      440: 'Ranked Flex',
      450: 'ARAM',
      900: 'URF',
      1020: 'One for All',
      // Add more queue types as needed
    }
    return queueMap[queueId] || `Queue ${queueId}`
  }

  // Calculate KDA ratio
  const kdaRatio = useMemo(() => {
    if (!currentPlayer) return '0.00'
    const { kills, deaths, assists } = currentPlayer
    return deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2)
  }, [currentPlayer])

  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  if (!currentPlayer || !playerTeam) {
    return (
      <div className="match-container error">
        <p>Unable to find player data for this match</p>
      </div>
    )
  }

  const isWin = currentPlayer.win

  return (
    <div className={`match-container ${isWin ? 'win' : 'loss'}`}>
      {/* Match Header - Always Visible */}
      <div className="match-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="match-info">
          <div className="game-result">
            <span className={`result-text ${isWin ? 'win' : 'loss'}`}>
              {isWin ? 'VICTORY' : 'DEFEAT'}
            </span>
            <span className="game-mode">{getGameModeDisplay(match?.info?.queueId || 0)}</span>
            <span className="game-time">{formatDate(match?.info?.gameCreation || 0)}</span>
            <span className="game-duration">{gameDuration}</span>
          </div>
        </div>

        <div className="champion-info">
          <div className="champion-icon">
            {isInitialized && (
              <img 
                src={getChampionIcon(currentPlayer.championName)} 
                alt={currentPlayer.championName}
                className="champion-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling.style.display = 'block'
                }}
              />
            )}
            <span className="champion-name" style={{ display: isInitialized ? 'none' : 'block' }}>
              {currentPlayer.championName}
            </span>
            <span className="champion-level">Level {currentPlayer.level}</span>
          </div>
          <div className="summoner-spells">
            <div className="spell">
              {isInitialized && currentPlayer.spell1Id ? (
                <img 
                  src={getSummonerSpellIcon(currentPlayer.spell1Id)} 
                  alt={getSummonerSpellName(currentPlayer.spell1Id)}
                  className="spell-image"
                  title={getSummonerSpellName(currentPlayer.spell1Id)}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'block'
                  }}
                />
              ) : null}
              <span style={{ display: isInitialized && currentPlayer.spell1Id ? 'none' : 'block', fontSize: '10px' }}>
                {currentPlayer.spell1Id || 'N/A'}
              </span>
            </div>
            <div className="spell">
              {isInitialized && currentPlayer.spell2Id ? (
                <img 
                  src={getSummonerSpellIcon(currentPlayer.spell2Id)} 
                  alt={getSummonerSpellName(currentPlayer.spell2Id)}
                  className="spell-image"
                  title={getSummonerSpellName(currentPlayer.spell2Id)}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'block'
                  }}
                />
              ) : null}
              <span style={{ display: isInitialized && currentPlayer.spell2Id ? 'none' : 'block', fontSize: '10px' }}>
                {currentPlayer.spell2Id || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="kda-info">
          <div className="kda-numbers">
            <span className="kills">{currentPlayer.kills}</span>
            <span className="separator">/</span>
            <span className="deaths">{currentPlayer.deaths}</span>
            <span className="separator">/</span>
            <span className="assists">{currentPlayer.assists}</span>
          </div>
          <div className="kda-ratio">{kdaRatio} KDA</div>
        </div>

        <div className="items">
          {[currentPlayer.item0, currentPlayer.item1, currentPlayer.item2, 
            currentPlayer.item3, currentPlayer.item4, currentPlayer.item5].map((item, idx) => (
            <div key={idx} className="item-slot">
              {item !== 0 ? (
                isInitialized ? (
                  <img 
                    src={getItemIcon(item)} 
                    alt={getItemName(item)}
                    className="item-image"
                    title={getItemName(item)}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'block'
                    }}
                  />
                ) : (
                  <span className="item-id">{item}</span>
                )
              ) : (
                <div className="empty-item" />
              )}
              {item !== 0 && isInitialized && (
                <span className="item-id" style={{ display: 'none', fontSize: '6px' }}>
                  {item}
                </span>
              )}
            </div>
          ))}
          <div className="trinket-slot">
            {currentPlayer.trinket !== 0 ? (
              isInitialized ? (
                <img 
                  src={getItemIcon(currentPlayer.trinket)} 
                  alt={getItemName(currentPlayer.trinket)}
                  className="item-image"
                  title={getItemName(currentPlayer.trinket)}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'block'
                  }}
                />
              ) : (
                <span className="item-id">{currentPlayer.trinket}</span>
              )
            ) : (
              <div className="empty-item" />
            )}
            {currentPlayer.trinket !== 0 && isInitialized && (
              <span className="item-id" style={{ display: 'none', fontSize: '6px' }}>
                {currentPlayer.trinket}
              </span>
            )}
          </div>
        </div>

        <div className="match-stats">
          <div className="cs">CS {currentPlayer.totalCreepScore}</div>
          <div className="vision">Vision {currentPlayer.visionScore}</div>
          <div className="damage">DMG {Math.round(currentPlayer.totalDamageDealtToChampions / 1000)}k</div>
        </div>

        <div className="expand-indicator">
          <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="match-details">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'builds' ? 'active' : ''}`}
              onClick={() => setActiveTab('builds')}
            >
              Builds
            </button>
            <button 
              className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                {/* Team Compositions */}
                <div className="teams-overview">
                  <div className="team-section">
                    <h4 className={`team-header ${isWin ? 'win' : 'loss'}`}>
                      {isWin ? 'Victory' : 'Defeat'} (Your Team)
                    </h4>
                    <div className="team-players">
                      <div className={`player current-player ${isWin ? 'win' : 'loss'}`}>
                        <span className="player-name">{currentPlayer.summonerName}</span>
                        <span className="champion">{currentPlayer.championName}</span>
                        <span className="kda">{currentPlayer.kills}/{currentPlayer.deaths}/{currentPlayer.assists}</span>
                        <span className="cs">{currentPlayer.totalCreepScore} CS</span>
                        <span className="damage">{Math.round(currentPlayer.totalDamageDealtToChampions / 1000)}k</span>
                      </div>
                      {teammates.map((teammate: ParticipantDto, idx: number) => (
                        <div key={idx} className={`player ${teammate.win ? 'win' : 'loss'}`}>
                          <span className="player-name">{teammate.summonerName}</span>
                          <span className="champion">{teammate.championName}</span>
                          <span className="kda">{teammate.kills}/{teammate.deaths}/{teammate.assists}</span>
                          <span className="cs">{teammate.totalCreepScore} CS</span>
                          <span className="damage">{Math.round(teammate.totalDamageDealtToChampions / 1000)}k</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="team-section">
                    <h4 className={`team-header ${!isWin ? 'win' : 'loss'}`}>
                      {!isWin ? 'Victory' : 'Defeat'} (Enemy Team)
                    </h4>
                    <div className="team-players">
                      {enemies.map((enemy: ParticipantDto, idx: number) => (
                        <div key={idx} className={`player ${enemy.win ? 'win' : 'loss'}`}>
                          <span className="player-name">{enemy.summonerName}</span>
                          <span className="champion">{enemy.championName}</span>
                          <span className="kda">{enemy.kills}/{enemy.deaths}/{enemy.assists}</span>
                          <span className="cs">{enemy.totalCreepScore} CS</span>
                          <span className="damage">{Math.round(enemy.totalDamageDealtToChampions / 1000)}k</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Team Objectives */}
                <div className="objectives-section">
                  <h4>Team Objectives</h4>
                  <div className="objectives">
                    <div className="objective">
                      <span>Baron:</span> {playerTeam.baronKills}
                    </div>
                    <div className="objective">
                      <span>Dragon:</span> {playerTeam.dragonKills}
                    </div>
                    <div className="objective">
                      <span>Towers:</span> {playerTeam.towerKills}
                    </div>
                    <div className="objective">
                      <span>Inhibitors:</span> {playerTeam.inhibitorKills}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'builds' && (
              <div className="builds-tab">
                <div className="current-player-build">
                  <h4>Your Build</h4>
                  <div className="build-section">
                    <div className="final-items">
                      <h5>Final Items</h5>
                      <div className="items-grid">
                        {[currentPlayer.item0, currentPlayer.item1, currentPlayer.item2, 
                          currentPlayer.item3, currentPlayer.item4, currentPlayer.item5, currentPlayer.trinket].map((item, idx) => (
                          <div key={idx} className="build-item">
                            {item !== 0 ? <span>Item {item}</span> : <div className="empty-slot">Empty</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="runes-section">
                      <h5>Runes</h5>
                      <div className="runes">
                        <div className="primary-tree">
                          <strong>Primary:</strong> {currentPlayer.perks.primaryStyle}
                        </div>
                        <div className="secondary-tree">
                          <strong>Secondary:</strong> {currentPlayer.perks.subStyle}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="timeline-tab">
                <div className="detailed-stats">
                  <h4>Detailed Statistics</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Gold Earned:</span>
                      <span className="stat-value">{currentPlayer.totalGold.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Gold Per Minute:</span>
                      <span className="stat-value">{currentPlayer.goldPerMinute.toFixed(1)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">CS Per Minute:</span>
                      <span className="stat-value">{currentPlayer.creepScorePerMinute.toFixed(1)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Vision Score:</span>
                      <span className="stat-value">{currentPlayer.visionScore}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Wards Placed:</span>
                      <span className="stat-value">{currentPlayer.wardsPlaced}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Wards Killed:</span>
                      <span className="stat-value">{currentPlayer.wardsKilled}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Damage:</span>
                      <span className="stat-value">{currentPlayer.totalDamageDealtToChampions.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Damage Taken:</span>
                      <span className="stat-value">{(currentPlayer.physicalDamageTaken + currentPlayer.magicDamageTaken + currentPlayer.trueDamageTaken).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .match-container {
          margin: 10px 0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .match-container.win {
          background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%);
          border-color: #4a90e2;
        }
        
        .match-container.loss {
          background: linear-gradient(135deg, #5f1e1e 0%, #a02c2c 100%);
          border-color: #e24a4a;
        }
        
        .match-header {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .match-header:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .match-info {
          flex: 1;
          min-width: 120px;
        }
        
        .game-result {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .result-text {
          font-weight: bold;
          font-size: 14px;
        }
        
        .result-text.win {
          color: #4a90e2;
        }
        
        .result-text.loss {
          color: #e24a4a;
        }
        
        .game-mode, .game-time, .game-duration {
          font-size: 12px;
          color: #ccc;
        }
        
        .champion-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        
        .champion-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .champion-name {
          font-weight: bold;
          color: white;
        }
        
        .champion-level {
          font-size: 12px;
          color: #ccc;
        }
        
        .summoner-spells {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .spell {
          width: 24px;
          height: 24px;
          background: #333;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
        }
        
        .kda-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        
        .kda-numbers {
          font-size: 16px;
          font-weight: bold;
          color: white;
        }
        
        .kills {
          color: #4a90e2;
        }
        
        .deaths {
          color: #e24a4a;
        }
        
        .assists {
          color: #9b59b6;
        }
        
        .separator {
          color: #ccc;
          margin: 0 2px;
        }
        
        .kda-ratio {
          font-size: 12px;
          color: #ccc;
        }
        
        .items {
          display: flex;
          gap: 2px;
          align-items: center;
          flex: 2;
        }
        
        .item-slot, .trinket-slot {
          width: 32px;
          height: 32px;
          background: #333;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #555;
        }
        
        .item-id {
          font-size: 8px;
          color: white;
        }
        
        .empty-item {
          width: 100%;
          height: 100%;
          background: #222;
          border-radius: 3px;
        }
        
        .match-stats {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          font-size: 12px;
          text-align: right;
        }
        
        .cs, .vision, .damage {
          color: #ccc;
        }
        
        .expand-indicator {
          margin-left: 10px;
        }
        
        .arrow {
          transition: transform 0.3s ease;
          color: #ccc;
        }
        
        .arrow.expanded {
          transform: rotate(180deg);
        }
        
        .match-details {
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tab-navigation {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tab {
          background: none;
          border: none;
          color: #ccc;
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }
        
        .tab:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .tab.active {
          color: white;
          border-bottom-color: #4a90e2;
        }
        
        .tab-content {
          padding: 20px;
        }
        
        .teams-overview {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .team-section {
          flex: 1;
        }
        
        .team-header {
          margin: 0 0 10px 0;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .team-header.win {
          background: rgba(74, 144, 226, 0.2);
          color: #4a90e2;
        }
        
        .team-header.loss {
          background: rgba(226, 74, 74, 0.2);
          color: #e24a4a;
        }
        
        .team-players {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .player {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .current-player {
          border: 1px solid #4a90e2;
          background: rgba(74, 144, 226, 0.1);
        }
        
        .player-name {
          font-weight: bold;
          color: white;
        }
        
        .champion {
          color: #ccc;
        }
        
        .objectives-section {
          margin-top: 20px;
        }
        
        .objectives {
          display: flex;
          gap: 20px;
          margin-top: 10px;
        }
        
        .objective {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        .builds-tab h4, .timeline-tab h4 {
          color: white;
          margin-bottom: 15px;
        }
        
        .builds-tab h5 {
          color: #ccc;
          margin: 10px 0 5px 0;
        }
        
        .items-grid {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
        
        .build-item {
          width: 48px;
          height: 48px;
          background: #333;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
          border: 1px solid #555;
        }
        
        .empty-slot {
          color: #666;
        }
        
        .runes-section {
          margin-top: 15px;
        }
        
        .runes {
          display: flex;
          gap: 20px;
        }
        
        .primary-tree, .secondary-tree {
          color: #ccc;
          font-size: 12px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        .stat-label {
          color: #ccc;
          font-size: 12px;
        }
        
        .stat-value {
          color: white;
          font-weight: bold;
          font-size: 12px;
        }
        
        .error {
          background: #333;
          color: #e24a4a;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
        }
        
        .champion-image {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid #555;
          object-fit: cover;
        }
        
        .spell-image {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: cover;
        }
        
        .item-image {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: cover;
        }
      `}</style>
    </div>
  )
}

export default Match
