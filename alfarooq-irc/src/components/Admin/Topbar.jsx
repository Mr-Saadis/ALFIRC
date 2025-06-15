'use client'
import { FiMenu } from 'react-icons/fi'

export default function Topbar({ onMenuClick, className = '' }) {
  return (
    <header className={`${className} bg-white shadow px-4 py-3 flex items-center justify-between`}>
      <div className="md:hidden">
        <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900">
          <FiMenu size={24}/>
        </button>
      </div>
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div>
        {/* optional right side controls */}
      </div>
    </header>
  )
}
