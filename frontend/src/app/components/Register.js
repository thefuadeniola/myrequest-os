import React, { useState } from 'react'
import spinner from '@/app/assets/icons8-spinner.gif'
import Image from 'next/image'
import axios from 'axios'


const Register = ({ setLoginModal }) => {

    const api = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRegister = async () => {
        setLoading(true)

        if(!username || !password) {
            setError("No username or password!");
            setLoading(false)
            return
        }
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/register`, 
                { username, password },
                { withCredentials: true }
            )
            if(data) console.log(data)
            setLoading(false)
            window.location.reload()
        } catch (error) {
            setError(
                error.response?.data?.message || "Something went wrong. Try again!"
            );
            setLoading(false);
        }
    }

    const handleLogin = async() => {
        setLoading(true)

        if(!username || !password) {
            setError("No username or password!");
            setLoading(false)
            return
        }
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/login`, 
                { username, password }, 
                { withCredentials: true }
            )
            if(data) console.log(data)
            setLoading(false)
            window.location.reload()
        } catch (error) {
            setError(
                error.response?.data?.message || "Something went wrong. Try again!"
            );
            setLoading(false);
        }

    }

    return (
        <div className="fixed top-0 right-0 h-screen w-screen z-10 bg-black/50 flex items-center justify-center font-inter" onClick={() => setLoginModal(false)}>
            <div className="rounded-md bg-white shadow-md h-fit w-4/5 z-100 p-5" onClick={(e) => e.stopPropagation()}>
            <h1 className='text-[#0b090a] font-inter font-bold text-lg'>Register or Login</h1>
            <div className='mb-2'>
                <label className='text-sm'>Username</label>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} className="border-1 border-[#d3d3d3] mt-1 rounded-md w-full pl-2 py-1" />
            </div>

            <div className='mb-2'>
                <label className='text-sm'>Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="border-1 border-[#d3d3d3] mt-1 rounded-md w-full pl-2 py-1" />
            </div>
            
            <button 
                className={`mt-3 ${loading ? 'bg-white' : 'bg-[#a4161a]'} text-white font-bold text-md rounded-md h-8 px-4`}
                onClick={handleLogin}
            >
                {loading ?  <Image src={spinner} alt='spinner' height={24} width={24} unoptimized />  : <span>Login</span>}
            </button>

            <p className="mt-2 text-sm">If you don&apos;t have an account, fill the same form but click:</p>
            <button 
                className={`mt-0 bg-white font-bold text-md rounded-md h-8`}
                onClick={handleRegister}
            >
                {loading ?  <Image src={spinner} alt='spinner' height={24} width={24} unoptimized />  : <span className='underline'>Register</span>}
            </button> <br />


            {error && <span className='text-[#a4161a]'>{error}</span>}
            </div>
        </div>
    )
}

export default Register