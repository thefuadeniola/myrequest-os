"use client"
import React from 'react'
import Link from 'next/link'
import CreateRoom from './CreateRoom'
import add from '@/app/assets/plus.png'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Register from './Register'
import axios from 'axios'

const Navbar = () => {
    const [popup, showPopup] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const showCPopUp = () => showPopup(!popup)
    const showLoginModal = () => setLoginModal(!loginModal)
    const [user, setUser] = useState(null);
    
    useEffect(()=> {
      const checkAuth = async() => {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/me`,
            { withCredentials: true }
          );

          setUser(data);
        } catch (error) {
          setUser(null)
        }
      }

      checkAuth();
    }, [])

    const handleLogout = async() => {
      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/logout`, {}, {withCredentials: true});
        if(data) window.location.reload()
      } catch (error) {
        console.log("Unable to logout.")
      }
    }

    return (
      <div className='px-4 py-5'>
        <div className='border-[#b1a7a6] border-b pb-4 pl-2 flex flex-row items-center justify-between relative'>
            <div className='flex flex-row items-center space-x-2'>
              <Link href='/' className='font-bold font-inter text-lg md:text-2xl text-[#a4161a]'>Myrequest.com</Link>
            </div>

            {
              user ? (

                <button onClick={showCPopUp} className='bg-[#a4161a] w-fit px-3 py-1 rounded-2xl flex flex-row items-center space-x-2 text-white font-inter cursor-pointer'>
                  <span>Create room</span>
                  <Image src={add} height={16} width={16} alt='' />
                </button>

              ) : (

                <button onClick={showLoginModal} className='underline w-fit px-3 py-1 flex items-center space-x-2 font-inter'>
                  <span className='text-[#a4161a]'>login</span>
                </button>

              )
            }
        </div>
        {
          popup && (
            <CreateRoom showPopup={showPopup}/>
          )
        }
        {
          loginModal && (
            <Register setLoginModal={setLoginModal} />
          )
        }

        <footer className='fixed bottom-0 left-0 right-0 w-full z-100 bg-white mt-6 flex items-center justify-center border-t border-1 border-[#d3d3d3] p-4'>
          <p className='text-sm'>{user ?<><span>{`Logged in as ${user?.username}`}</span> <button onClick={handleLogout} className='ml-1 underline text-[#a4161a] bg-white'>Logout</button></> : 'Not logged in. Log in to create a room.'}</p>
        </footer>
      </div>
    )
}

export default Navbar