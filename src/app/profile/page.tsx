'use client'
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect }  from 'react';
import { getUserbyGametagAction, createUserAction, getMatchDataListAction, createMatchesAction, getMatchDataListfromDBAction, createMatchesObjAction } from '../components/actions/dbActions';
import SearchBar from '../components/client/SearchBar';
import MatchHistory from '../components/client/MatchHistory'



function Profile() {
    const searchParams = useSearchParams();
    const platformQuery = searchParams.get('platform') ? `${searchParams.get('platform')}` : 'americas';
    const regionQuery = searchParams.get('region') ? `${searchParams.get('region')}` : 'na1';
    let searchQuery = searchParams.get('search');

    const tagLine = searchQuery ? searchQuery.split('#')[1].trim() : '';
    const gameName = searchQuery ? searchQuery.split('#')[0].trim() : '';

    searchQuery = searchQuery ? searchQuery.split('#')[0].trim() + searchQuery.split('#')[1].trim() : '';
    
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [matchData, setMatchData] = useState<any>(null);
    const [matchesLoading, setMatchesLoading] = useState<boolean>(true);
    const [matchesError, setMatchesError] = useState<string | null>(null);
    let renderedMatchesR = 20;
    let renderedMatchesL = 0;


    
    useEffect(() => {
        const fetchUser = async () => { // fetch user from db by gameName and tagLine
            setLoading(true);
            setError(null);
            let userData;
            try {
                userData = await getUserbyGametagAction(searchQuery as string);
                if (userData.success && userData.data === null) {
                    let createUserResponse = await createUserAction(gameName, tagLine, platformQuery);
                    if (createUserResponse.success) {
                        userData = createUserResponse;
                        setProfileData(JSON.parse(userData.data ?? '{}'));
                    } else throw new Error(createUserResponse.error);
                }
                else if (userData.success) setProfileData(userData.data);
                else if (!userData.success) throw new Error(userData.error);   
            } catch (error: any) {
                console.error('Error fetching user:', error);
                setError(error.message);
            } finally {
                    setLoading(false);        
                }           
        }
        
        fetchUser();   
    }, [searchQuery, platformQuery]); // Re-run when searchQuery or platformQuery changes

    useEffect(() => {
        const fetchMatches= async () => { // fetch user from db by gameName and tagLine
            setMatchesLoading(true);
            setMatchesError(null);
            let matchesData;
            
            try {
                if (profileData === null) {
                    setMatchesLoading(true);
                    return;
                }
                matchesData = await getMatchDataListfromDBAction(profileData.matches.slice(renderedMatchesL,renderedMatchesR), platformQuery);
                //console.log('matchesData', matchesData);
                if (matchesData.data === null) {
                    let createMatchesResponse = await createMatchesObjAction(profileData.matches.slice(renderedMatchesL,renderedMatchesR), platformQuery);
                    //console.log('createUserResponse', createUserResponse.success);
                    if (createMatchesResponse.success) {
                        matchesData = createMatchesResponse;
                        const parsedData = JSON.parse(matchesData.data ?? '[]');
                        if (matchData) { //TODO: pagination case, add button to load more matches
                            setMatchData([...matchData, ...parsedData]);
                        }
                        else{
                            setMatchData(parsedData);
                        }
                    } else {
                        throw new Error(createMatchesResponse.error);
                    }
                }
                else if (!matchesData.success) {
                    throw new Error(matchesData.error);
                }
                else{
                    if (matchesData.data){
                        const parsedData = JSON.parse(matchesData.data);
                        setMatchData(parsedData);
                        //console.log('userData.data', matchData);
                        //matchList.push(...(matchesData.data ?? []));
                    }
                }
            } catch (error: any) {
                console.error('Error fetching user:', error);
                setMatchesError(error.message);
            } finally {
                    setMatchesLoading(false);     
                    renderedMatchesL += 20;
                    renderedMatchesR += 20;   
                }           
        }
        
        fetchMatches();
    }, [profileData]);



    
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
    <Suspense fallback={<div style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>Loading...</div>}>
      <div>
        <SearchBar/>   
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
        <div>
            {matchesError && <div style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>{matchesError}</div>}
            {matchesLoading ? (
                <div style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>Loading Matches...</div>
            ) : (
                <div style={{ color: 'White', textAlign: 'center', marginTop: '20px' }}>
                    {Array.isArray(matchData) && matchData.length > 0
                        ? <MatchHistory id={profileData.puuid} matchData={matchData} />
                        : "No matches found."}
                </div>
            )}
        </div>
      </div>
    </Suspense>
  )
}

export default Profile
