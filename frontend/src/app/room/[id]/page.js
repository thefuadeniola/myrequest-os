'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import RoomGuard from '@/app/components/RoomGuard'
import AllRequests from '@/app/components/AllRequests'
import { usePathname } from 'next/navigation'

const Request = () => {

    const pathname = usePathname();

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

    const [spotifyToken, setSpotifyToken] = useState(null);

    const [searchValue, setSearchValue] = useState("");

    const [resultArray, setResultArray] = useState([]);

    const [requests, setRequests] = useState([]);

    const [requestSuccess, setRequestSuccess] = useState(null)

    const [roomData, setRoomData] = useState([])


    const [blockAccess, setBlockAccess] = useState(false)

    const fetchRoom = async() =>{
        const id = pathname.split("/").slice(-1)[0]
        
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/room/${id}`,
                { withCredentials: true }
            )

            if(data) setRoomData(data)

        } catch (error) {
            setBlockAccess(true)
        }
    }


    useEffect(() => {
        fetchRoom();
    }, [])

    const pushToRequests = async (name, artistes) => {
        if(!name || !artistes) {
            setRequestSuccess(false)
            return
        }


        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/room/add-request`,
                { title: name, artistes },
                { withCredentials: true }
            )

            if(data) {
                setRoomData(data)
                setRequestSuccess(true)
                setResultArray([])

            }

        } catch (error) {
            if (error.response && error.response.status === 409) {
              setRequestSuccess("duplicate");
              setResultArray([])
            } else {
                setResultArray([])

                setRequestSuccess(false);
            }
        }
    }

    function formatQuery(str){
        return str.trim().replace(/\s+/g, "+");
    }

    const spotifySearch = async (val) => {
        let queryString = formatQuery(searchValue)
        try {
            const res = await axios.get(
                `https://api.spotify.com/v1/search?q=${queryString}&type=track`,
                {
                    headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                    },
                }
            );

            setResultArray(res.data.tracks.items)

        } catch (error) {
            console.log("Unable to fetch song:", error)
        }
    }

    useEffect(() => {
        console.log(resultArray)
    }, [resultArray])

    useEffect(() => {
        const clearResults = () => {
            if(searchValue === "") {
                setResultArray([])
            }
        }

        clearResults();
    }, [searchValue])

    useEffect(() => {
        const getToken = async () => {
            const savedToken = Cookies.get("spotify_access_token");

            if(savedToken) {
                setSpotifyToken(savedToken)
                return
            }

            try {
                const res = await axios.post(
                    "https://accounts.spotify.com/api/token",
                    new URLSearchParams({
                        grant_type: "client_credentials",
                        client_id: clientId,
                        client_secret: clientSecret
                    }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )

                const { access_token } = res.data
                const expiryDate = new Date(Date.now() + 55 * 60 * 1000);

                Cookies.set("spotify_access_token", access_token, { expires: expiryDate });

                setSpotifyToken(access_token)
            } catch (error) {
                console.error("Error fetching Spotify token:", error)
            }
        }
        getToken();
    }, [clientId, clientSecret])

  return (
    <>

        <style jsx>
            {
                `
                .bb{
                    border-bottom: 1px solid #d3d3d3
                }
                `
            }
        </style>

        {blockAccess && <RoomGuard roomId={pathname.split("/").slice(-1)[0]} />}
        <div className='px-4 pt-2 font-inter'>
            <h1 className='text-[#0b090a] font-semibold'>{roomData?.name}: search a song to request</h1>
            <div className='w-full flex flex-row items-center space-x-1 mt-3'>
                <input type='text' className='border-1 border-[#d3d3d3] rounded-md pl-2 py-1 h-12 w-4/5 focus:outline-none focus:ring-0' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} placeholder='Search' />
                <button onClick={spotifySearch} className='text-white font-semibold bg-[#a4161a] h-12 px-4 rounded-md flex-1'>Search</button>
            </div>
            {
            resultArray.length > 0 ? (
                <div className='w-full border-1 border-[#b1a7a6] flex flex-col items-center space-y-1 rounded-md mt-2'>
                    {
                        resultArray.map((track) => (
                            <div key={track.id} className='w-full px-2 py-4 bb flex flex-row justify-between'>
                                <div className='flex flex-row items-center'>
                                    <img src={track.album.images[2].url} className="h-[40px] w-[40px] mr-4 rounded-[50%]" alt={track.name} />
                                    <div>
                                        <h1>{track.name}</h1>
                                        <p className='text-xs font-bold'>{track.artists[0].name} {track.artists[1] ? track.artists[1].name : ""} {track.artists[2] ? track.artists[2].name : ""}</p>
                                    </div>

                                </div>
                                <button className='bg-white text-[#a4161a] underline text-xs font-bold px-2 py-4 rounded-2xl' onClick={() => pushToRequests(track.name, track.artists)}>request</button>
                            </div>
                        ))
                    }
                </div> 
            ) : <div className=''></div>
            }
            {
                requestSuccess ? (

                    requestSuccess === "duplicate" ? <div className='text-sm text-gray-500'>Request already exists</div> :
                    <div className='mt-2'>
                        <h1 className='font-inter'>Request successfully sent!</h1>
                    </div>
                ) : requestSuccess === null ? <></> :

                ( 
                    <div className='text-sm text-gray-500'>Couldn&apos;t make that happen, try again.</div> 
                )
                
            }

            <AllRequests requests={roomData.requests} />
        </div>
    </>
  )
}

export default Request 