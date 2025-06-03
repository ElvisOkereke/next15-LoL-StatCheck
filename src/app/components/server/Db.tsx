import 'server-only'
import { MongoClient, ServerApiVersion } from 'mongodb';

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
  const client = await clientPromise;
  return client!.db(dbName);
}

export async function createUser(gameTag: string) {
  try {
    const db = await getDatabase();

    //const fetchData = await fetchProfilefromRiot()

    const userData = {
      gametag: gameTag,
      //...fetchData,
    }

    const result = await db.collection('users').insertOne(userData);
    return result;
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

export const fetchProfilefromRiot = async (platformQuery:string, gameName:string, tagLine:string, API_KEY:string) => {
           
    const response = await fetch(`https://${platformQuery}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`);
    if (!response.ok) {
        throw new Error('Profile fetch failed');
    }
    const data = await response.json();
    return data;
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