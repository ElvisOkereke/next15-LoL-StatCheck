'use client'

// Data Dragon version - you should update this periodically
const DD_VERSION = '14.1.1'
const DD_BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}`

// Champion data mapping
let championData: { [key: string]: any } = {}
let itemData: { [key: string]: any } = {}
let summonerSpellData: { [key: string]: any } = {}
let runeData: { [key: string]: any } = {}

// Cache for icons to avoid repeated fetches
const iconCache = new Map<string, string>()

// Initialize data from Data Dragon
export const initializeDataDragon = async () => {
  try {
    // Fetch champion data
    const championResponse = await fetch(`${DD_BASE_URL}/data/en_US/champion.json`)
    const championJson = await championResponse.json()
    championData = championJson.data

    // Fetch item data
    const itemResponse = await fetch(`${DD_BASE_URL}/data/en_US/item.json`)
    const itemJson = await itemResponse.json()
    itemData = itemJson.data

    // Fetch summoner spell data
    const summonerResponse = await fetch(`${DD_BASE_URL}/data/en_US/summoner.json`)
    const summonerJson = await summonerResponse.json()
    summonerSpellData = summonerJson.data

    // Fetch rune data
    const runeResponse = await fetch(`${DD_BASE_URL}/data/en_US/runesReforged.json`)
    const runeJson = await runeResponse.json()
    runeData = runeJson.reduce((acc: any, tree: any) => {
      tree.slots.forEach((slot: any) => {
        slot.runes.forEach((rune: any) => {
          acc[rune.id] = rune
        })
      })
      return acc
    }, {})

    console.log('Data Dragon initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Data Dragon:', error)
  }
}

// Get champion icon URL by champion name
export const getChampionIcon = (championName: string): string => {
  const cacheKey = `champion_${championName}`
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!
  }

  const champion = Object.values(championData).find((champ: any) => 
    champ.name === championName || champ.id === championName
  ) as any

  const iconUrl = champion 
    ? `${DD_BASE_URL}/img/champion/${champion.image.full}`
    : `${DD_BASE_URL}/img/champion/Aatrox.png` // Fallback

  iconCache.set(cacheKey, iconUrl)
  return iconUrl
}

// Get item icon URL by item ID
export const getItemIcon = (itemId: number | string): string => {
  if (!itemId || itemId === 0) return ''
  
  const cacheKey = `item_${itemId}`
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!
  }

  const item = itemData[itemId.toString()]
  const iconUrl = item 
    ? `${DD_BASE_URL}/img/item/${item.image.full}`
    : `${DD_BASE_URL}/img/item/1001.png` // Fallback to boots

  iconCache.set(cacheKey, iconUrl)
  return iconUrl
}

// Get summoner spell icon URL by spell ID
export const getSummonerSpellIcon = (spellId: number | string): string | null => {
  if (!spellId && spellId !== 0) return null
  
  const cacheKey = `spell_${spellId}`
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!
  }

  const spell = Object.values(summonerSpellData).find((spell: any) => 
    spell && spell.key && spell.key === spellId.toString()
  ) as any

  const iconUrl = spell 
    ? `${DD_BASE_URL}/img/spell/${spell.image.full}`
    : `${DD_BASE_URL}/img/spell/SummonerFlash.png` // Fallback to Flash

  iconCache.set(cacheKey, iconUrl)
  return iconUrl
}

// Get rune icon URL by rune ID
export const getRuneIcon = (runeId: number | string): string => {
  const cacheKey = `rune_${runeId}`
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!
  }

  const rune = runeData[runeId.toString()]
  const iconUrl = rune 
    ? `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`
    : '' // No fallback for runes

  iconCache.set(cacheKey, iconUrl)
  return iconUrl
}

// Get champion name by champion ID
export const getChampionNameById = (championId: number): string => {
  const champion = Object.values(championData).find((champ: any) => 
    parseInt(champ.key) === championId
  ) as any

  return champion ? champion.name : 'Unknown'
}

// Get summoner spell name by spell ID
export const getSummonerSpellName = (spellId: number | string): string => {
  if (!spellId && spellId !== 0) return 'Unknown'
  
  const spell = Object.values(summonerSpellData).find((spell: any) => 
    spell && spell.key && spell.key === spellId.toString()
  ) as any

  return spell ? spell.name : 'Unknown'
}

// Get item name by item ID
export const getItemName = (itemId: number | string): string => {
  if (!itemId || itemId === 0) return ''
  
  const item = itemData[itemId.toString()]
  return item ? item.name : 'Unknown Item'
}

// Preload essential icons for better UX
export const preloadEssentialIcons = async () => {
  const essentialChampions = ['Aatrox', 'Ahri', 'Akali', 'Yasuo', 'Zed'] // Add more as needed
  const essentialItems = ['1001', '1004', '1006', '1011', '1027'] // Basic items
  const essentialSpells = ['1', '4', '6', '7', '11', '12', '13', '14'] // Common summoner spells

  // Preload champion icons
  essentialChampions.forEach(champion => {
    getChampionIcon(champion)
  })

  // Preload item icons
  essentialItems.forEach(item => {
    getItemIcon(item)
  })

  // Preload summoner spell icons
  essentialSpells.forEach(spell => {
    getSummonerSpellIcon(spell)
  })
}

// Get queue type name by queue ID
export const getQueueTypeName = (queueId: number): string => {
  const queueMap: { [key: number]: string } = {
    400: 'Normal Draft',
    420: 'Ranked Solo/Duo',
    440: 'Ranked Flex',
    450: 'ARAM',
    900: 'URF',
    1020: 'One for All',
    1700: 'Arena',
    // Add more queue types as needed
  }
  return queueMap[queueId] || `Custom (${queueId})`
}

// Clear icon cache (useful for memory management)
export const clearIconCache = () => {
  iconCache.clear()
}

// Get cache size for debugging
export const getCacheSize = () => {
  return iconCache.size
}
