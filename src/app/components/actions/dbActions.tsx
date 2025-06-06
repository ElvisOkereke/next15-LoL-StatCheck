
'use server';
import { platform } from 'os';
import {createUser, getUserbyGametag, getMatchDataList, createMatches} from '../server/Db';

export async function getUserbyGametagAction(gametag: string) {
  try {
    const user = await getUserbyGametag(gametag); //null if not user found in db
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function createUserAction(gameName: string, tagLine: string, platformQuery: string) {
  try {
    const result = await createUser(gameName, tagLine, platformQuery);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getMatchDataListAction(matchIdList: string[], platformQuery: string) {
  try {
    const result = await getMatchDataList(matchIdList, platformQuery);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function createMatchesAction(matchIdList: string[], platformQuery: string) {
  try {
    const result = await createMatches(matchIdList, platformQuery);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/*
export async function getUserAction(userId) {
  try {
    const user = await getUserById(userId);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Server Component that provides data
export async function UserDataProvider({ children } : { children: (props: { initialUser: any, actions: any }) => React.ReactNode }) {
  const initialUser = await getUserbyGametag('example-gametag'); // Replace with actual gametag or logic to get it
  
  return (
    <html>
        <body>
            <div>
            // Pass initial data and actions to children 
            {children({ 
                initialUser,
                actions: {
                //fetchUsers: fetchUsersAction,
                //createUser: createUserAction,
                //getUser: getUserAction
                }
            })}
            </div>
        </body>
    </html>
  );
}
*/