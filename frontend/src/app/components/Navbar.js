"use client"
import React from 'react'
import Link from 'next/link'
import CreateRoom from './CreateRoom'
import add from '@/app/assets/plus.png'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Navbar = () => {

    const [authSession, setAuthSession] = useState(null)
    const [user, setUser] = useState('')

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/session-status');
                if (response.data.session) {
                    setAuthSession(response.data.session);
                    setUser(response.data.user);
                } else {
                    setAuthSession(false);
                }
            } catch (error) {
                console.error("Failed to fetch session:", error);
                setAuthSession(false);
            }
        }
        checkAuth();
    }, [])

    console.log(user)

    const [popup, showPopup] = useState(false)
    const showCPopUp = () => showPopup(!popup)

    return (
        <div className='px-4 py-5 font-sans'>
            <div className='border-gray-300 border-b pb-4 pl-2 flex items-center justify-between relative'>
                <div className='flex items-center space-x-2'>
                    <Link href='/' className='font-extrabold text-xl md:text-3xl text-[#a4161a] hover:text-[#8e1417] transition duration-200'>
                        Myrequest.com
                    </Link>
                </div>

                {authSession ? (
                    <button 
                        onClick={showCPopUp} 
                        className='bg-[#a4161a] hover:bg-[#8e1417] text-white font-semibold px-4 py-2 rounded-full flex items-center space-x-2 shadow-md transition duration-200'
                    >
                        <span>Create room</span>
                        <Image src={add} height={16} width={16} alt='Add' className='filter invert' />
                    </button>
                ) : (
                    <div className='flex items-center'>
                        <a href="/auth/login">
                            <button className='border border-[#a4161a] text-[#a4161a] hover:bg-[#a4161a] hover:text-white font-semibold px-4 py-1.5 rounded-lg transition duration-200'>Log in</button>
                        </a>
                    </div>
                )}
            </div>
            
            {popup && (
                <CreateRoom showPopup={showPopup} user={user} />
            )}
            <footer className='fixed bottom-0 left-0 right-0 w-full z-40 bg-white border-t border-gray-200 p-4'>
                <div className='flex items-center justify-center text-sm text-gray-600'>
                    {user ? (
                        <>
                            <span className='font-medium text-gray-700'>
                                {`Logged in as ${user}`}
                            </span>
                            <a href='/auth/logout'>
                                <button 
                                className='ml-2 underline text-[#a4161a] hover:text-[#8e1417] font-semibold'
                                >
                                Logout
                            </button>

                            </a>
                        </>
                    ) : (
                        'Not logged in. Log in to create a room.'
                    )}
                </div>
            </footer>
        </div>
    )
}

export default Navbar;