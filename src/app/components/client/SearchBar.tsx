'use client'
import React from 'react'
import { useState } from 'react'
import '../../../styles/SearchBar.css'

function SearchBar() {
   const [searchText, setSearchText] = useState("");

   function handleSearch() {
        const regionSelect = document.querySelector('.regionSelect') as HTMLSelectElement | null;
        const regionValue = regionSelect ? regionSelect.value : 'na1';
        const platformValue = regionSelect ? regionSelect.options[regionSelect.selectedIndex].className : 'americas';
        window.location.href = `/profile?search=${encodeURIComponent(searchText)}&platform=${encodeURIComponent(platformValue)}&region=${encodeURIComponent(regionValue)}`;
   }

    return (
        <div className="searchBar" style={{ display: 'flex', alignItems: 'center' }}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" />
            <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search..."
            className="searchInput"
            style={{ flex: 1 }}
            onKeyDown={e => {
                if (e.key === 'Enter') {handleSearch();}
            }}
            />
            <button
            className="searchButton"
            style={{ marginRight: '8px' }}
            onClick={() => {
                handleSearch();
            }}
            >
            <i className="fas fa-search"></i>
            </button>
            <select className="regionSelect" style={{ marginRight: '8px' }}>
            <option value="na1" className='americas'>NA</option>
            <option value="eun1" className='europe'>EUNE</option>
            <option value="euw1" className='europe'>EUW</option>
            <option value="kr" className='asia'>KR</option>
            <option value="jp1" className='asia'>JP</option>
            <option value="vn2" className='sea'>JP</option>
            </select>
        </div>
        )
    }

export default SearchBar
