import React, { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import spinner from '@/app/assets/icons8-spinner.gif'

const Login = ({ setLoginModal, setRegisterModal }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async() => {
        setError('')
        setLoading(true)

        if (!username || !password) {
            setError("Please enter both username and password.");
            setLoading(false)
            return
        }

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/login`, 
                { username, password }, 
                { withCredentials: true }
            )
            if (data) {
                console.log(data)
                window.location.reload()
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please check your credentials and try again."
            );
            setLoading(false);
        }
    }

    const switchToRegister = (e) => {
        e.preventDefault()
        setError('')
        setLoginModal(false)   
        setRegisterModal(true) 
    }

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center font-sans" 
            onClick={() => setLoginModal(false)}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 transition-all transform duration-300 ease-out" 
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
                    Welcome Back
                </h2>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Username
                    </label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Enter your username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a4161a] transition duration-150" 
                    />
                </div>

                <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Password
                    </label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a4161a] transition duration-150" 
                    />
                </div>
                
                {error && (
                    <p className='text-sm text-center text-red-600 mb-4 font-medium'>
                        {error}
                    </p>
                )}

                <button 
                    className={`w-full h-10 flex items-center justify-center font-semibold text-lg rounded-lg transition duration-300 ${
                        loading 
                        ? 'bg-gray-200 text-gray-700 cursor-not-allowed' 
                        : 'bg-[#a4161a] hover:bg-[#8e1417] text-white shadow-md'
                    }`}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <Image src={spinner} alt='Loading' height={24} width={24} unoptimized /> 
                    ) : (
                        <span>Login</span>
                    )}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don&apos;t have an account? 
                    <button 
                        className='text-[#a4161a] hover:text-[#8e1417] font-semibold ml-1 focus:outline-none'
                        onClick={switchToRegister}
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login;