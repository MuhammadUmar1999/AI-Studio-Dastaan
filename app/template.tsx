'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
export default function Template({ children }: { children: React.ReactNode }) { const pathname = usePathname(); useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname]); return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3 }}>{children}</motion.div> }
