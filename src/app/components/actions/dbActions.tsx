
'use server';
import { revalidatePath } from 'next/cache';
import {createUser, getUserbyGametag} from '../server/Db';

export async function getUserbyGametagAction(gametag: string) {
  try {
    const user = await getUserbyGametag(gametag);

    if (!user) {
      //createUserAction(gametag);
      
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
/*
export async function createUserAction(formData: FormData) {
  try {
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
    };
    
    const result = await createUser(userData);
    revalidatePath('/users'); // Revalidate the users page
    
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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