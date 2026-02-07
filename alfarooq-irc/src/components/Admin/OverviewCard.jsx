

// 'use client'

// import { useState } from 'react'
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Users, FileText, Calendar, History, BarChart3 } from 'lucide-react'

// export default function OverviewCards({ stats }) {
//   // Toggle State for the 3rd Card
//   const [showWeekly, setShowWeekly] = useState(false); // false = Yesterday, true = Week

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
//       {/* 1. Total Questions */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
//           <Badge variant="secondary" className="px-2">{stats.totalQuestions}</Badge>
//         </CardHeader>
//         <CardContent>
//           <FileText className="h-6 w-6 text-blue-500" />
//         </CardContent>
//       </Card>

//       {/* 2. Today (With Last ID) */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle className="text-sm font-medium">Today</CardTitle>
//           <Badge variant={stats.todayCount > 0 ? "default" : "secondary"} className="px-2">
//             {stats.todayCount}
//           </Badge>
//         </CardHeader>
//         <CardContent className="flex items-center justify-between">
//           <Calendar className="h-6 w-6 text-green-500" />
//           {stats.lastQID && (
//             <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded font-mono">
//               Last ID: <span className="font-bold text-gray-800">{stats.lastQID}</span>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* 3. Yesterday / Weekly Switcher */}
//       <Card className="transition-all duration-200">
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           {/* Toggle Header */}
//           <div className="flex items-center gap-2 text-sm font-medium bg-gray-100 p-1 rounded-md">
//             <button
//               onClick={() => setShowWeekly(false)}
//               className={`px-2 py-0.5 rounded text-xs transition-colors ${
//                 !showWeekly ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'
//               }`}
//             >
//               Yesterday
//             </button>
//             <button
//               onClick={() => setShowWeekly(true)}
//               className={`px-2 py-0.5 rounded text-xs transition-colors ${
//                 showWeekly ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'
//               }`}
//             >
//               Week
//             </button>
//           </div>
          
//           <Badge variant="secondary" className="px-2">
//             {/* Show data based on toggle */}
//             {showWeekly ? stats.weeklyCount : stats.yesterdayCount}
//           </Badge>
//         </CardHeader>
//         <CardContent>
//            {/* Icon changes based on toggle */}
//            {showWeekly ? (
//              <BarChart3 className="h-6 w-6 text-orange-500" />
//            ) : (
//              <History className="h-6 w-6 text-purple-500" />
//            )}
//         </CardContent>
//       </Card>

//       {/* 4. Total Users */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//           <Badge variant="secondary" className="px-2">{stats.totalUsers}</Badge>
//         </CardHeader>
//         <CardContent>
//           <Users className="h-6 w-6 text-red-500" />
//         </CardContent>
//       </Card>

//     </div>
//   )
// }



'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, FileText, Calendar, History, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function OverviewCards({ stats }) {
  const [showWeekly, setShowWeekly] = useState(false); 

  // Reusable Card Component for consistency
  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, trend }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 font-arabic mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors font-mono">
            {value?.toLocaleString() || 0}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
      </div>
      {/* Fake Trend Indicator for "Value" feel */}
      <div className="mt-4 flex items-center gap-2">
         <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
            {trend === 'up' ? '+12%' : '0%'}
         </span>
         <span className="text-xs text-gray-400">from last month</span>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* 1. Total Questions */}
      <StatCard 
        title="کل سوالات (Total)" 
        value={stats.totalQuestions} 
        icon={FileText} 
        colorClass="text-primary" 
        bgClass="bg-blue-50"
        trend="up"
      />

      {/* 2. Today */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 font-arabic mb-1">آج (Today)</p>
                <h3 className="text-3xl font-bold text-gray-900 font-mono">
                    {stats.todayCount}
                </h3>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
                <Calendar size={24} />
            </div>
        </div>
        
        {stats.lastQID && (
            <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Last Q-ID:</span>
                    <span className="font-mono font-bold text-primary bg-blue-50 px-2 py-1 rounded">
                        #{stats.lastQID}
                    </span>
                </div>
            </div>
        )}
      </div>

      {/* 3. Toggle Card (Yesterday/Week) */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-gray-500 font-arabic">
                {showWeekly ? 'گزشتہ ہفتہ' : 'گزشتہ کل'}
            </p>
            {/* Custom Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setShowWeekly(false)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!showWeekly ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Day
                </button>
                <button
                    onClick={() => setShowWeekly(true)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${showWeekly ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Week
                </button>
            </div>
        </div>
        
        <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-gray-900 font-mono">
                {showWeekly ? stats.weeklyCount : stats.yesterdayCount}
            </h3>
            <div className={`p-3 rounded-xl ${showWeekly ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                {showWeekly ? <BarChart3 size={24} /> : <History size={24} />}
            </div>
        </div>
      </div>

      {/* 4. Users */}
      <StatCard 
        title="صارفین (Users)" 
        value={stats.totalUsers} 
        icon={Users} 
        colorClass="text-red-600" 
        bgClass="bg-red-50"
        trend="up"
      />

    </div>
  )
}