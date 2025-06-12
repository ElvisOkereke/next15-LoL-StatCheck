import 'server-only'
import { MongoClient, ServerApiVersion, WithId } from 'mongodb';


// Extend the global object to include _mongoClientPromise
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
let client;
let clientPromise: Promise<MongoClient> | null = null;


if (!global._mongoClientPromise) {
  client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;
export {clientPromise};



// Database utility functions
export async function getDatabase(dbName = 'opgg') {
  try {
    const client = await clientPromise;
    console.log('MongoDB client connected');
    return client!.db(dbName)
  }catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

export async function getUserbyGametag(gameTag: string) {
  try {
    const db = await getDatabase();
    const user = await db.collection('users').findOne({ gametag: gameTag });
    //console.log('BEFORE IF getUserbyGametag:', user);
    let res;
    if (user !== null) {
      //console.log('getUserbyGametag:', user.puuid, user.gametag, user.platform);
      res = {
      gametag: user.gametag,
      puuid: user.puuid,
      matches: user.matches,
      platform: user.platform
      };
    return res;
    }
  return user;
    
    
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function createUser(gameName: string, tagLine:string, platformQuery:string) {
  try {
    const db = await getDatabase();

    const fetchData = await fetchProfilefromRiot(gameName, tagLine, platformQuery);

    const result = await db.collection('users').insertOne(JSON.parse(fetchData));
    if (result.acknowledged) return fetchData;
    throw new Error('Failed to add user to collection');
    

  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}


export async function getMatchDataListfromDB(matchIdList: string[], platformQuery:string) {
  try {
    const db = await getDatabase();
    let objectList = [];
    let leftovers = []
    for (const matchId of matchIdList) {
      const match = await db.collection('matches').findOne({ "metadata.matchId": matchId });
      if (match === null) {
        leftovers.push(matchId);
        objectList.push(null);
      } else {
        const matchObject = match as WithId<MatchData>;
        objectList.push(matchObject);
      }
    }
    
    if (objectList.every((item) => item === null)) {
      console.log('No matches found in the database, fetching from Riot API');
      return null;
    }
    const fetchData = await fetchMatchesfromRiot(leftovers, platformQuery);

    for (let i = 0; i < objectList.length; i++) {
      if (objectList[i] === null) {
         objectList[i] = fetchData[0];
        fetchData.shift();
      }
    }


  return objectList.filter((item): item is MatchData => item !== null);
    
    
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}


export async function getMatchDataList(matchIdList: string[], platformQuery:string) {
  try {
    const db = await getDatabase();
    let objectList = [];
    let leftovers = []
    for (const matchId of matchIdList) {
      const match = await db.collection('matches').findOne({ "metadata.matchId": matchId });
      if (match === null) {
        leftovers.push(matchId);
        objectList.push(null);
      } else {
        const matchObject = match as WithId<MatchData>;
        objectList.push(matchObject);
      }
    }
    
    if (objectList.every((item) => item === null)) {
      console.log('No matches found in the database, fetching from Riot API');
      return null;
    }
    const fetchData = await fetchMatchesfromRiot(leftovers, platformQuery);

    for (let i = 0; i < objectList.length; i++) {
      if (objectList[i] === null) {
         objectList[i] = fetchData[0];
        fetchData.shift();
      }
    }


  return createMatchElements(objectList.filter((item): item is MatchData => item !== null), platformQuery);
    
    
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function createMatches(matchIdList: string[], platformQuery:string) {
  try {
    const db = await getDatabase();

    const fetchData = await fetchMatchesfromRiot(matchIdList, platformQuery);
    const result = await db.collection('matches').insertMany(fetchData);
    const elementList = await createMatchElements(fetchData, platformQuery);

    
    if (result.acknowledged) return elementList;
    throw new Error('Failed to add matches to collection');

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function createMatchesObj(matchIdList: string[], platformQuery:string) {
  try {
    const db = await getDatabase();

    const fetchData = await fetchMatchesfromRiot(matchIdList, platformQuery);
    const result = await db.collection('matches').insertMany(fetchData);


    
    if (result.acknowledged) return fetchData;
    throw new Error('Failed to add matches to collection');

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

type MatchData = {
  metadata: {
    matchId: string;
  };
  info: {
    gameMode: string;
    gameType: string;
    gameDuration: number;
    participants: Array<{
      puuid: string;
      summonerName: string;
      championName: string;
      kills: number;
      deaths: number;
      assists: number;
    }>;
  };
};

export async function createMatchElements(matchDataList: MatchData[], platformQuery: string) {
  try {
    const db = await getDatabase();
    let matchElements = new Array<React.ReactElement>();
    matchDataList.map((matchData) => {
      const element:React.ReactElement = (
        <div className='match-element' key={matchData.metadata.matchId} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0'}}>
          <h3>Match ID: {matchData.metadata.matchId}</h3>
          <p>Platform: {platformQuery}</p>
          <p>Game Mode: {matchData.info.gameMode}</p>
          <p>Game Type: {matchData.info.gameType}</p>
          <p>Game Duration: {matchData.info.gameDuration} seconds</p>
          <h4>Participants:</h4>
          <ul>
            {matchData.info.participants.map((participant) => (
              <li key={participant.puuid}>
                {participant.summonerName} ({participant.championName}): {participant.kills} kills, {participant.deaths} deaths, {participant.assists} assists
              </li>
            ))}
          </ul>
        </div>
      );
      matchElements.push(element);
    });

    
    return matchElements;
  } catch (error) {
    console.error('Error creating match elements:', error);
    throw error;
  }

}


export const fetchMatchesfromRiot = async (matchList:string[], platformQuery:string, API_KEY:string = process.env.NEXT_PUBLIC_RIOT_API_KEY as string) => {
  let res = new Array<MatchData>();

  for (const matchId of matchList) {
    const response = await fetch(`https://${platformQuery}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`);
    if (!response.ok) {
      console.error(`Failed to fetch match ${matchId} on ${platformQuery}`);
      //throw new Error (`Failed to fetch match`)
      continue;
    }
    const data = await response.json();
    res.push(data);
    //console.log('fetchProfilefromRiot:', userData);
  }
  return res;
}

export const fetchProfilefromRiot = async (gameName:string, tagLine: string,platformQuery:string, API_KEY:string = process.env.NEXT_PUBLIC_RIOT_API_KEY as string) => {
    
    const response = await fetch(`https://${platformQuery}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`);
    if (!response.ok) {
        throw new Error (`Failed to fetch profile for ${gameName+tagLine} on ${platformQuery} @ https://${platformQuery}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`)
    }

    const data = await response.json();
    const puuid = data.puuid as string;
    const matchResponse = await fetch(`https://${platformQuery}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${API_KEY}`);
    if (!matchResponse.ok) {
        throw new Error(`Failed to fetch matches for ${gameName+tagLine} on ${platformQuery}`);
    }
    const matches = await matchResponse.json() as string[];
    const userData = {
      gametag: gameName+tagLine,
      puuid: puuid,
      matches: matches,
      platform: platformQuery
    } 
    //console.log('fetchProfilefromRiot:', userData);
    return JSON.stringify(userData);
};
