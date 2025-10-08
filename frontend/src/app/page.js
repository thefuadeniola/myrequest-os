"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import EnterRoom from "./components/EnterRoom";
import axios from "axios";

export default function Home() {
  const [allRooms, setAllRooms] = useState([])
  const [popup, showPopup] = useState({ state: false, name: null })

  useEffect(()=>{
    const fetchRooms = async () => {
      try {
        const rawApi = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        const API = rawApi && rawApi !== 'undefined' && rawApi !== 'null' ? rawApi : 'http://localhost:8080'
        const { data } = await axios.get(`${API}/api/room/all`)
        if(data) setAllRooms(data)
      } catch (error) {
        console.log("Error fetching rooms:", error)
      }
    }

    fetchRooms();
  }, [])

  // Auto-seed demo data in development if no rooms were found
  useEffect(() => {
    const seedIfEmpty = async () => {
      try {
        if (process.env.NODE_ENV !== 'production') {
          const base = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080'
          const { data } = await axios.get(`${base}/api/room/all`)
          if (Array.isArray(data) && data.length === 0) {
            await axios.post(`${base}/api/room/seed-demo`)
            const { data: refreshed } = await axios.get(`${base}/api/room/all`)
            if (refreshed) setAllRooms(refreshed)
          }
        }
      } catch (e) {
        // ignore seed errors
        console.log('Seed error (ignored):', e.message)
      }
    }

    seedIfEmpty()
  }, [])

  return (
    <div className="font-inter p-4 lg:pb-20">
      Select a request room to make your request
      {
        allRooms ? (

        allRooms.map((room) => (
        <div className='w-full h-fit relative' key={room._id}>
          <Image src={room.image} height={200} width={200} alt={room.name} className="rounded-md mt-4"  />
          <button 
            onClick={() => showPopup({ state: true, name: room.name })}
            className="absolute bottom-2 left-10 mx-auto shadow-md bg-[#a4161a] text-white font-bold text-md rounded-4xl h-12 px-4"
          >
            Enter room
          </button>
          {
            popup.name === room.name && (
              <EnterRoom showPopup={showPopup} roomName={room.name} roomId={room._id}/>
            )
          }
        </div>

        ))

        ) : (<p className="italic text-gray-500">No rooms to see here.</p>)
      }

      </div>

  );
}
 