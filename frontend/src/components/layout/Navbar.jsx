import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import "../../app.css"
import { Axe, ShieldUser, Verified, LogOut, Sparkles } from 'lucide-react'
import { motion } from "motion/react"
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

function Navbar() {

    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null)

    useEffect(() => {
        setRole(localStorage.getItem("role"));
        setToken(localStorage.getItem("token"))
    }, []);

    const navigate = useNavigate();

    return (
        <nav className='
            sticky top-0 z-50
            flex w-full justify-between items-center
            px-4 md:px-6 py-3
            bg-white/5 backdrop-blur-xl
            border-b border-white/10
            shadow-lg
        '>

            <div
                onClick={() => navigate("/")}
                className='flex items-center gap-2 cursor-pointer group'
            >

                <motion.div
                    initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Axe size={26} className='text-orange-500 group-hover:rotate-12 transition' />
                </motion.div>

                <h1 className='text-lg md:text-xl font-bold tracking-tight'>
                    <span className='bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                        SCi
                    </span>
                    <span className='text-white'>VLab</span>
                </h1>

                <Sparkles className="text-yellow-400 opacity-70" size={16} />

            </div>


            <div className='flex items-center gap-4'>

                {/* STUDENT UI */}
                {role === "student" && token && (
                    <div className='flex items-center gap-3'>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10'>
                                    <Verified className='text-green-400' size={16} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Verified Student</p>
                            </TooltipContent>
                        </Tooltip>

                        <span className='hidden md:block text-sm text-gray-300'>
                            Welcome back 👋
                        </span>

                        {/* <motion.div
                            whileHover={{ scale: 1.08 }}
                            className="cursor-pointer"
                        >
                            <Avatar className="ring-2 ring-white/10 hover:ring-emerald-400 transition">
                                <AvatarImage
                                    src="https://avatars.githubusercontent.com/u/89350768?s=400"
                                    alt="user profile"
                                />
                                <AvatarFallback>ND</AvatarFallback>
                            </Avatar>
                        </motion.div> */}

                    </div>
                )}

                {role !== "student" && token && (
                    <div className='flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-400/20'>
                        <ShieldUser className='text-orange-400' size={18} />
                        <span className='text-sm text-orange-300 hidden md:block'>
                            Admin
                        </span>
                    </div>
                )}

                {token && (
                    <Button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/login";
                        }}
                        className="
                            flex items-center gap-2
                            bg-gradient-to-r from-red-500 to-rose-600
                            hover:opacity-90
                            text-white
                            rounded-xl
                            px-3 py-2
                            shadow-md
                        "
                    >
                        <LogOut size={16} />
                        <span className='hidden md:inline'>Logout</span>
                    </Button>
                )}

            </div>

        </nav>
    )
}

export default Navbar