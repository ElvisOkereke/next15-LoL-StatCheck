'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation';
import { useState, useEffect }  from 'react';
import { getUserbyGametagAction } from '../components/actions/dbActions';


function Profile() {
    const searchParams = useSearchParams();
    
    const platformQuery = searchParams.get('platform') ? `${searchParams.get('platform')}` : 'americas';
    const regionQuery = searchParams.get('region') ? `${searchParams.get('region')}` : 'na1';
    let searchQuery = searchParams.get('search');
    const tagLine = searchQuery ? searchQuery.split('#')[1].trim() : '';
    const gameName = searchQuery ? searchQuery.split('#')[0].trim() : '';
    searchQuery = searchQuery ? searchQuery.split('#')[0].trim() + searchQuery.split('#')[1].trim() : '';
    const API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY  // Replace with your actual API key
    
    
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    //const [matchesData, setMatchesData] = useState<any>(null);
    //const [puuid, setPuuid] = useState<string | null>(null);

    
    const fetchUser = async () => { // fetch user from db by gameName and tagLine

        let userData = await getUserbyGametagAction(searchQuery as string);
        if (!userData.success) {
            throw new Error(userData.error);
        }

        return userData.data;
    }
    
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://${platformQuery}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`);
                if (!response.ok) {
                    throw new Error('Profile fetch failed');
                }
                const data = await response.json();
                setProfileData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                //setPuuid(profileData.puuid);
                setLoading(false);        
            }
        };
        
        fetchProfile();
    }, [platformQuery, gameName, tagLine, API_KEY]);




    
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
            src="https://via.placeholder.com/150"
            alt="Profile"
            style={{ borderRadius: '50%', border: '2px solid White' }}
            />
        </div>
        <div style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>
            <p>Username: {searchQuery}</p>
            <p>Platform: {platformQuery}</p>
            <p>PUUID: {profileData.puuid}</p>
            {//<p>Game Name: {matchesData}</p>//
            }
        </div>
      
    </div>
  )
}

export default Profile
