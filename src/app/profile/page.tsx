'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation';
import { useState, useEffect }  from 'react';
import { getUserbyGametagAction, createUserAction } from '../components/actions/dbActions';


function Profile() {
    const searchParams = useSearchParams();
    const platformQuery = searchParams.get('platform') ? `${searchParams.get('platform')}` : 'americas';
    const regionQuery = searchParams.get('region') ? `${searchParams.get('region')}` : 'na1';
    let searchQuery = searchParams.get('search');

    const tagLine = searchQuery ? searchQuery.split('#')[1].trim() : '';
    const gameName = searchQuery ? searchQuery.split('#')[0].trim() : '';
    //const API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY

    searchQuery = searchQuery ? searchQuery.split('#')[0].trim() + searchQuery.split('#')[1].trim() : '';
    
    
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    //console.log('\nHEEEERRRRREEE\n');

    
    useEffect(() => {
        const fetchUser = async () => { // fetch user from db by gameName and tagLine
            setLoading(true);
            setError(null);
            let userData;
            try {
                userData = await getUserbyGametagAction(searchQuery as string);
                if (userData.data === null) {
                    let createUserResponse = await createUserAction(gameName, tagLine, platformQuery);
                    //console.log('createUserResponse', createUserResponse.success);
                    if (createUserResponse.success) {
                        userData = createUserResponse.data;
                        setProfileData(JSON.parse(userData ?? '{}'));
                    } else {
                        throw new Error(createUserResponse.error);
                    }
                }
                else if (!userData.success) {
                    throw new Error(userData.error);
                }
                else{
                    if (userData.data){
                        //console.log('userData.data', userData.data);
                        setProfileData(userData.data);
                    }
                } 
            } catch (error: any) {
                console.error('Error fetching user:', error);
                setError(error.message);
            } finally {
                    setLoading(false);        
                }           
        }
        
        fetchUser();
        
    }, [searchQuery, platformQuery]); // Re-run when searchQuery or platformQuery changes




    
    if (!searchQuery) {
        return <div style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>No profile found</div>;
    }
    if (loading) {
        return <div style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>Loading...</div>;
    }
    if (error) {
        return <div style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>{error}</div>;
    }
  return (
    <div>   
        <h1 style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>{searchQuery}'s Profile Page ({regionQuery}) </h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <img
            src="./background.jpg"
            alt="Profile"
            style={{ borderRadius: '50%', border: '2px solid White' }}
            width="150"
            height="150"
            />
        </div>
        <div style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>
            <p>Username: {searchQuery}</p>
            <p>Platform: {profileData.platform}</p>
            <p>PUUID: {profileData.puuid}</p>
            {//<p>Game Name: {matchesData}</p>//
            }
        </div>
      
    </div>
  )
}

export default Profile
