'use client'
import Link from 'next/link'
import { FiHome, FiFileText, FiUsers, FiLogOut } from 'react-icons/fi'
import Topbar from './Topbar'
import SignOutButton from '@/components/auth/SignOutButton'

export default function Sidebar({ open, onClose }) {
  return (
    <div
      className={`
        bg-white border-r border-gray-200
        ${open ? 'block' : 'hidden'} md:block
        w-64 h-full
      `}
    >
      {/* Close button on mobile */}
      <div className="md:hidden text-right p-4">
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          ✕
        </button>
      </div>

      <nav className="px-4 py-6 space-y-2">
        <Topbar
                  onMenuClick={() => setSidebarOpen(true)}
                  className="w-full"
                />
        <Link href="/admin" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <FiHome /> <span>Dashboard</span>
        </Link>
        <Link href="/admin/questions" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <FiFileText /> <span>New Questions</span>
        </Link>
        <Link href="/admin/userquestions" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <FiFileText /> <span>Users Questions</span>
        </Link>
        <Link href="/admin/analytics"  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <FiUsers /> <span>Analytics</span>
        </Link>
        <div className='fixed bottom-0 left-0 p-4'>
          
        <SignOutButton redirectTo="/signin" />
        </div>
      
      </nav>
    </div>
  )
}
