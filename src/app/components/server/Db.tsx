import 'server-only'
import { MongoClient, ServerApiVersion } from 'mongodb';
import { use } from 'react';

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
    return client!.db(dbName)
  }catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

export async function createUser(gameTag: string, platformQuery:string) {
  try {
    const db = await getDatabase();

    const fetchData = await fetchProfilefromRiot(gameTag, platformQuery);


    const result = await db.collection('users').insertOne(fetchData);
    if (result.acknowledged) return fetchData;
    throw new Error('Failed to add user to collection');
    

  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserbyGametag(gameTag: string) {
  try {
    const db = await getDatabase();
    const user = await db.collection('users').findOne({ gametag: gameTag });
    return user;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const fetchProfilefromRiot = async (gameTag:string, platformQuery:string, API_KEY:string = process.env.NEXT_PUBLIC_RIOT_API_KEY as string) => {
           
    const tagLine = gameTag.substring(gameTag.length - 4);
    const gameName = gameTag.substring(0, gameTag.length - 5).trim();
    const response = await fetch(`https://${platformQuery}.api.riotgames.com/riot/account/v1
      /accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`);
    if (!response.ok) {
        throw new Error (`Failed to fetch profile for ${gameTag} on ${platformQuery}`)
    }

    const data = await response.json();
    const puuid = data.puuid as string;
    const matchResponse = await fetch(`https://${platformQuery}.api.riotgames.com/lol/
      match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${API_KEY}`);
    if (!matchResponse.ok) {
        throw new Error(`Failed to fetch matches for ${gameTag} on ${platformQuery}`);
    }
    const matches = await matchResponse.json() as string[];
    const userData = {
      gametag: gameTag,
      puuid: puuid,
      matches: matches,
      platform: platformQuery,
    }
    return userData;
};

// Server Component that uses these utilities
export default async function DatabaseManager({ children }: any) {
  // This server component can perform initial setup or checks
  try {
    await clientPromise; // Ensure connection is established
    console.log('MongoDB connection established');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
  
  return (
    <html>
     <body>
        {children}
      </body>
    </html>
  );
}