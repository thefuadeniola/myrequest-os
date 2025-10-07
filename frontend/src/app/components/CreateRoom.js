'use client'
import React from 'react'
import { useState } from 'react'
import { CldUploadButton } from 'next-cloudinary'
import axios from 'axios'
import spinner from '@/app/assets/icons8-spinner.gif'
import Image from 'next/image'


const CreateRoom = ({ showPopup }) => {

    const [roomName, setRoomName] = useState("")
    const [roomPin, setRoomPin] = useState("")
    const [roomImg, setRoomImg] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)
    const [uploadedImg, setUploadedImg] = useState("")

    const [loading, setLoading] = useState(false)

    const handleUpload = (result) => {
        setIsDisabled(true)
        setRoomImg(result.info.url);
        setUploadedImg(`${result.info.original_filename}.${result.info.format}`)
    };
    
    const handleCreateRoom = async () => {
        setLoading(true);
        if(!roomName || !roomPin) {
            setError("Complete the room name and room pin fields!")
            setLoading(false)
            return;
        }
        if(!roomImg || !/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(roomImg)) {
            setError("No image uploaded")
            setLoading(false)
            return;
        }

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/room/create`, 
                {
                    name: roomName, pin: roomPin, image: roomImg
                },
                { withCredentials: true }
            )

            if(data) { 
                setLoading(false) 
                setMessage("Room successfully created! Tap outside this dialog box to close.")
                window.location.reload()
            }
            
        } catch (error) {
            setLoading(false)
            setError(error.response?.data?.message || "Something went wrong. Try again!")
        }

    }
    
    return (
        <div className="fixed top-0 right-0 h-screen w-screen z-10 bg-black/50 flex items-center justify-center" onClick={() => showPopup(false)}>
            <div className="rounded-md bg-white shadow-md h-fit w-4/5 z-100 p-5" onClick={(e) => e.stopPropagation()}>
            <h1 className='text-[#0b090a] font-inter font-bold text-lg'>Create a room</h1>
            <div className='mb-2'>
                <label className='text-sm'>Room Name</label>
                <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="border-1 border-[#d3d3d3] mt-1 rounded-md w-full pl-2 py-1" />
            </div>

            <div className='mb-2'>
                <label className='text-sm'>Room Pin</label>
                <input type="number" value={roomPin} onChange={(e) => setRoomPin(e.target.value)} className="border-1 border-[#d3d3d3] mt-1 rounded-md w-full pl-2 py-1" />
            </div>

            <div>
                <label className='mr-2'>Upload image:</label>
                <CldUploadButton
                    disabled={isDisabled}
                    className='underline mr-2'
                    uploadPreset="tfe_default"
                    onSuccess={handleUpload}
                />
                {uploadedImg}
            </div>
            <button 
                onClick={handleCreateRoom}
                className={`mt-3 ${loading ? 'bg-white' : 'bg-[#a4161a]'} text-white font-bold text-md rounded-md h-8 px-4 cursor-pointer`}
            >
                {loading ?  <Image src={spinner} alt='spinner' height={24} width={24} unoptimized />  : <span>Create</span>}
            </button>
            <br />
                {error && <span className='text-[#a4161a]'>{error}</span>}
                {message && <span className='text-green-700 text-sm mt-2'>{message}</span>}

            </div>
        </div>
    )
}

export default CreateRoom