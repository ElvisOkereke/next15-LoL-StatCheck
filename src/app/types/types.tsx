import React from 'react'

// Message type definition
export type MatchHistoryProps = {
  matchData: Array<MatchData>;
  id: string | number; // Can be either string or number to handle PUUID
  //setActiveChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
  //setChatList: React.Dispatch<React.SetStateAction<Chat[]>>;
}
export type MatchProps = {
  match: MatchData;
  puuid: string | number; // Can be either string or number to handle PUUID
  id: number;
  //setActiveChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
  //setChatList: React.Dispatch<React.SetStateAction<Chat[]>>;
}

/**
 * Represents the data returned by the Riot Games Match v5 API for a single match.
 * Reference: https://developer.riotgames.com/apis#match-v5/GET_getMatch
 */
export interface MatchData {
  /** The metadata for the match. */
  metadata: MatchMetaData;
  /** The information about the match itself. */
  info: MatchInfo;
}

/**
 * Metadata for the match.
 */
export interface MatchMetaData {
  /** The match ID. */
  matchId: string;
  /** The data version of the match. */
  dataVersion: string;
  /** A JSON string of platform IDs associated with the match. */
  platformId: string;
  /** The game creation timestamp in UTC milliseconds. */
  gameCreation: number;
  /** The game duration in seconds. */
  gameDuration: number;
  /** The game start timestamp in UTC milliseconds. */
  gameStartTimestamp: number;
  /** The queue ID for the match. */
  queueId: number;
  /** A JSON string of participant IDs associated with the match. */
  participants: string[];
  /** A JSON string of team IDs associated with the match. */
  teams: string[];
  /** The game version. */
  gameVersion: string;
  /** The season ID. */
  seasonId: number;
  /** The map ID. */
  mapId: number;
  /** The game mode. */
  gameMode: string;
  /** The game type. */
  gameType: string;
  /** The game start timestamp in UTC milliseconds. */
  gameEndTimestamp: number;
  /** The tournament code if it was a tournament game. */
  tournamentCode?: string;
}

/**
 * Information about the match itself.
 */
export interface MatchInfo {
  /** The game ID. */
  gameId: number;
  /** The game creation timestamp in UTC milliseconds. */
  gameCreation: number;
  /** The game duration in seconds. */
  gameDuration: number;
  /** The game start timestamp in UTC milliseconds. */
  gameStartTimestamp: number;
  /** The queue ID for the match. */
  queueId: number;
  /** The season ID. */
  seasonId: number;
  /** The map ID. */
  mapId: number;
  /** The game mode. */
  gameMode: string;
  /** The game type. */
  gameType: string;
  /** The tournament code if it was a tournament game. */
  tournamentCode?: string;
  /** The game version. */
  gameVersion: string;
  /** The participants in the match. */
  participants: ParticipantDto[];
  /** The teams in the match. */
  teams: TeamDto[];
  /** The bans for the match. */
  bans: BanDto[];
  /** The platform ID. */
  platformId: string;
  /** The game end timestamp in UTC milliseconds. */
  gameEndTimestamp: number;
  /** The winning team ID (for supported game modes). */
  winningTeam?: number;
}

/**
 * Represents a participant in a match.
 */
export interface ParticipantDto {
  /** The participant's ID. */
  participantId: number;
  /** The team ID the participant belongs to. */
  teamId: number;
  /** The participant's summoner name. */
  summonerName: string;
  /** The participant's summoner ID. */
  summonerId: string;
  /** The participant's PUUID. */
  puuid: string;
  /** The participant's champion ID. */
  championId: number;
  /** The participant's champion name. */
  championName: string;
  /** The participant's spell 1 ID. */
  spell1Id: number;
  /** The participant's spell 2 ID. */
  spell2Id: number;
  /** The participant's primary rune path ID. */
  primaryRunePathId: number;
  /** The participant's primary rune sub-path ID. */
  primaryRuneSubPathId: number;
  /** The participant's secondary rune path ID. */
  secondaryRunePathId: number;
  /** The participant's secondary rune sub-path ID. */
  secondaryRuneSubPathId: number;
  /** The participant's pick turn. */
  pickTurn: number;
  /** The participant's initial role. */
  initialRole: string;
  /** The participant's assigned role. */
  assignedRole: string;
  /** The participant's initial lane. */
  initialLane: string;
  /** The participant's assigned lane. */
  assignedLane: string;
  /** The participant's current gold. */
  currentGold: number;
  /** The participant's total gold earned. */
  totalGold: number;
  /** The participant's level. */
  level: number;
  /** The participant's experience. */
  xp: number;
  /** The participant's current health. */
  currentHealth: number;
  /** The participant's maximum health. */
  maxHealth: number;
  /** The participant's current mana. */
  currentMana: number;
  /** The participant's maximum mana. */
  maxMana: number;
  /** The participant's kills. */
  kills: number;
  /** The participant's deaths. */
  deaths: number;
  /** The participant's assists. */
  assists: number;
  /** The participant's creep score (CS). */
  creepScore: number;
  /** The participant's total creep score (CS). */
  totalCreepScore: number;
  /** The participant's neutral monster kills. */
  neutralMonsterKills: number;
  /** The participant's allied monster kills. */
  allyMonsterKills: number;
  /** The participant's enemy monster kills. */
  enemyMonsterKills: number;
  /** The participant's ward placement. */
  wardsPlaced: number;
  /** The participant's wards killed. */
  wardsKilled: number;
  /** The participant's vision score. */
  visionScore: number;
  /** The participant's item 0. */
  item0: number;
  /** The participant's item 1. */
  item1: number;
  /** The participant's item 2. */
  item2: number;
  /** The participant's item 3. */
  item3: number;
  /** The participant's item 4. */
  item4: number;
  /** The participant's item 5. */
  item5: number;
  /** The participant's item 6. */
  item6: number;
  /** The participant's trinket item. */
  trinket: number;
  /** The participant's goldPerMinute. */
  goldPerMinute: number;
  /** The participant's experiencePerMinute. */
  experiencePerMinute: number;
  /** The participant's creepScorePerMinute. */
  creepScorePerMinute: number;
  /** The participant's damageDealtToChampions. */
  damageDealtToChampions: number;
  /** The participant's damageDealtToObjectives. */
  damageDealtToObjectives: number;
  /** The participant's damageDealtToTurrets. */
  damageDealtToTurrets: number;
  /** The participant's totalDamageDealt. */
  totalDamageDealt: number;
  /** The participant's totalDamageDealtToChampions. */
  totalDamageDealtToChampions: number;
  /** The participant's totalDamageShielded. */
  totalDamageShielded: number;
  /** The participant's totalHeal. */
  totalHeal: number;
  /** The participant's totalPlayerDamage. */
  totalPlayerDamage: number;
  /** The participant's trueDamageDealtToChampions. */
  trueDamageDealtToChampions: number;
  /** The participant's magicDamageDealtToChampions. */
  magicDamageDealtToChampions: number;
  /** The participant's physicalDamageDealtToChampions. */
  physicalDamageDealtToChampions: number;
  /** The participant's trueDamageDealt. */
  trueDamageDealt: number;
  /** The participant's magicDamageDealt. */
  magicDamageDealt: number;
  /** The participant's physicalDamageDealt. */
  physicalDamageDealt: number;
  /** The participant's trueDamageTaken. */
  trueDamageTaken: number;
  /** The participant's magicDamageTaken. */
  magicDamageTaken: number;
  /** The participant's physicalDamageTaken. */
  physicalDamageTaken: number;
  /** The participant's summonerSpell1Id. */
  summonerSpell1Id: number;
  /** The participant's summonerSpell2Id. */
  summonerSpell2Id: number;
  /** The participant's profileIconId. */
  profileIconId: number;
  /** The participant's bot ability upvotes. */
  botAbilityUogrades: number;
  /** The participant's bot player. */
  botPlayer: boolean;
  /** The participant's first blood. */
  firstBlood: boolean;
  /** The participant's first blood kill. */
  firstBloodKill: boolean;
  /** The participant's first blood assist. */
  firstBloodAssist: boolean;
  /** The participant's first tower kill. */
  firstTowerKill: boolean;
  /** The participant's first tower assist. */
  firstTowerAssist: boolean;
  /** The participant's first inhibitor kill. */
  firstInhibitorKill: boolean;
  /** The participant's first inhibitor assist. */
  firstInhibitorAssist: boolean;
  /** The participant's win. */
  win: boolean;
  /** The participant's teamEarlySurrendered. */
  teamEarlySurrendered: boolean;
  /** The participant's challenges. */
  challenges?: ChallengeDto;
  /** The participant's perks. */
  perks: PerkDto;
}

/**
 * Represents the perks chosen by a participant.
 */
export interface PerkDto {
  /** The primary rune path ID. */
  primaryStyle: number;
  /** The primary rune sub-path ID. */
  subStyle: number;
  /** The selected primary runes. */
  perkIds: number[];
  /** The selected stat modifiers. */
  perkStats: PerkStatsDto;
}

/**
 * Represents the stat modifiers chosen by a participant.
 */
export interface PerkStatsDto {
  /** The offense stat modifier. */
  offense: number;
  /** The flex stat modifier. */
  flex: number;
  /** The defense stat modifier. */
  defense: number;
}

/**
 * Represents a team in a match.
 */
export interface TeamDto {
  /** The team ID. */
  teamId: number;
  /** The win status for the team. */
  win: boolean;
  /** The bans for the team. */
  bans: BanDto[];
  /** The baron kills for the team. */
  baronKills: number;
  /** The champion kills for the team. */
  championKills: number;
  /** The dragon kills for the team. */
  dragonKills: number;
  /** The inhibitor kills for the team. */
  inhibitorKills: number;
  /** The tower kills for the team. */
  towerKills: number;
  /** The vilemaw kills for the team. */
  vilemawKills: number;
  /** The riftHerald kills for the team. */
  riftHeraldKills: number;
  /** The first blood status for the team. */
  firstBlood: boolean;
  /** The first tower kill status for the team. */
  firstTowerKill: boolean;
  /** The first inhibitor kill status for the team. */
  firstInhibitorKill: boolean;
  /** The first baron kill status for the team. */
  firstBaronKill: boolean;
  /** The first dragon kill status for the team. */
  firstDragonKill: boolean;
  /** The first rift herald kill status for the team. */
  firstRiftHeraldKill: boolean;
  /** The game's winning team. */
  winningTeam?: number;
}

/**
 * Represents a ban in a match.
 */
export interface BanDto {
  /** The champion ID that was banned. */
  championId: number;
  /** The pick turn during which the champion was banned. */
  pickTurn: number;
}

/**
 * Represents the challenges completed by a participant.
 */
export interface ChallengeDto {
  /** Represents the participant's performance in the game. */
  game?: ChallengeInfo[];
  /** Represents the participant's performance across multiple games. */
  total?: ChallengeInfo[];
}

/**
 * Represents the details of a specific challenge.
 */
export interface ChallengeInfo {
  /** The ID of the challenge. */
  challengeId: number;
  /** The participant's score for this challenge. */
  challengeScore: number;
}