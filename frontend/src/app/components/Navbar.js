"use client"
import React from 'react'
import Link from 'next/link'
import CreateRoom from './CreateRoom'
import add from '@/app/assets/plus.png'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Login from './Login'
import Register from './Register'
import axios from 'axios'

const Navbar = () => {
    const [popup, showPopup] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)  
    const showCPopUp = () => showPopup(!popup)

    const openLoginModal = () => {
        setRegisterModal(false);
        setLoginModal(true);
    }

    const openRegisterModal = () => {
        setLoginModal(false);
        setRegisterModal(true);
    }
    
    const [user, setUser] = useState(null);
    
    useEffect(()=> {
      const checkAuth = async() => {
        try {
          const rawApi = process.env.NEXT_PUBLIC_BACKEND_API_URL;
          const API = rawApi && rawApi !== 'undefined' && rawApi !== 'null' ? rawApi : 'http://localhost:8080'
          const { data } = await axios.get(`${API}/api/user/me`, { withCredentials: true });

    useEffect(()=> {
        const checkAuth = async() => {
            try {
                const API = getApiUrl();
                const { data } = await axios.get(`${API}/api/user/me`, { withCredentials: true });
                setUser(data);
            } catch (error) {
                setUser(null)
            }
        }
        checkAuth();
    }, [])

    const handleLogout = async() => {
      try {
        const rawApi = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        const API = rawApi && rawApi !== 'undefined' && rawApi !== 'null' ? rawApi : 'http://localhost:8080'
        const { data } = await axios.post(`${API}/api/user/logout`, {}, {withCredentials: true});
        if(data) window.location.reload()
      } catch (error) {
        console.log("Unable to logout.")
      }
    }

    return (
        <div className='px-4 py-5 font-sans'>
            <div className='border-gray-300 border-b pb-4 pl-2 flex items-center justify-between relative'>
                <div className='flex items-center space-x-2'>
                    <Link href='/' className='font-extrabold text-xl md:text-3xl text-[#a4161a] hover:text-[#8e1417] transition duration-200'>
                        Myrequest.com
                    </Link>
                </div>

                {user ? (
                    <button 
                        onClick={showCPopUp} 
                        className='bg-[#a4161a] hover:bg-[#8e1417] text-white font-semibold px-4 py-2 rounded-full flex items-center space-x-2 shadow-md transition duration-200'
                    >
                        <span>Create room</span>
                        <Image src={add} height={16} width={16} alt='Add' className='filter invert' />
                    </button>
                ) : (
                    <div className='flex items-center space-x-3'>
                        <button 
                            onClick={openLoginModal} 
                            className='border border-[#a4161a] text-[#a4161a] hover:bg-[#a4161a] hover:text-white font-semibold px-4 py-1.5 rounded-lg transition duration-200'
                        >
                            Login
                        </button>
                        <button 
                            onClick={openRegisterModal} 
                            className='bg-[#a4161a] hover:bg-[#8e1417] text-white font-semibold px-4 py-1.5 rounded-lg shadow-md transition duration-200'
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>
            
            {popup && (
                <CreateRoom showPopup={showPopup}/>
            )}
            
            {loginModal && (
                <Login 
                    setLoginModal={setLoginModal} 
                    setRegisterModal={setRegisterModal} 
                />
            )}

            {registerModal && (
                <Register 
                    setRegisterModal={setRegisterModal} 
                    setLoginModal={setLoginModal} 
                />
            )}

            <footer className='fixed bottom-0 left-0 right-0 w-full z-40 bg-white border-t border-gray-200 p-4'>
                <div className='flex items-center justify-center text-sm text-gray-600'>
                    {user ? (
                        <>
                            <span className='font-medium text-gray-700'>
                                {`Logged in as ${user?.username}`}
                            </span>
                            <button 
                                onClick={handleLogout} 
                                className='ml-2 underline text-[#a4161a] hover:text-[#8e1417] font-semibold'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        'Not logged in. Log in to create a room.'
                    )}
                </div>
            </footer>
        </div>
    )
}

export default Navbar