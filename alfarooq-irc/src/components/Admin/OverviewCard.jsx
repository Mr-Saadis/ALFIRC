// 'use client'

// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Users, FileText, Clock, Database } from 'lucide-react'

// export default function OverviewCards({ stats }) {
//   // stats = { totalQuestions, totalLatest, totalApp, totalUsers }
//   return (
//     <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-sm">Questions</CardTitle>
//           <Badge variant="secondary" className="px-2">
//             {stats.totalQuestions}
//           </Badge>
//         </CardHeader>
//         <CardContent>
//           <FileText className="h-6 w-6 text-blue-500" />
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-sm">Latest</CardTitle>
//           <Badge variant="secondary" className="px-2">
//             {stats.totalLatest}
//           </Badge>
//         </CardHeader>
//         <CardContent>
//           <Clock className="h-6 w-6 text-green-500" />
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-sm">App</CardTitle>
//           <Badge variant="secondary" className="px-2">
//             {stats.totalApp}
//           </Badge>
//         </CardHeader>
//         <CardContent>
//           <Database className="h-6 w-6 text-purple-500" />
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-sm">Users</CardTitle>
//           <Badge variant="secondary" className="px-2">
//             {stats.totalUsers}
//           </Badge>
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, FileText, Calendar, History, BarChart3 } from 'lucide-react'

export default function OverviewCards({ stats }) {
  // Toggle State for the 3rd Card
  const [showWeekly, setShowWeekly] = useState(false); // false = Yesterday, true = Week

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Questions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          <Badge variant="secondary" className="px-2">{stats.totalQuestions}</Badge>
        </CardHeader>
        <CardContent>
          <FileText className="h-6 w-6 text-blue-500" />
        </CardContent>
      </Card>

      {/* 2. Today (With Last ID) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Today</CardTitle>
          <Badge variant={stats.todayCount > 0 ? "default" : "secondary"} className="px-2">
            {stats.todayCount}
          </Badge>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Calendar className="h-6 w-6 text-green-500" />
          {stats.lastQID && (
            <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded font-mono">
              Last ID: <span className="font-bold text-gray-800">{stats.lastQID}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Yesterday / Weekly Switcher */}
      <Card className="transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          {/* Toggle Header */}
          <div className="flex items-center gap-2 text-sm font-medium bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setShowWeekly(false)}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                !showWeekly ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setShowWeekly(true)}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                showWeekly ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Week
            </button>
          </div>
          
          <Badge variant="secondary" className="px-2">
            {/* Show data based on toggle */}
            {showWeekly ? stats.weeklyCount : stats.yesterdayCount}
          </Badge>
        </CardHeader>
        <CardContent>
           {/* Icon changes based on toggle */}
           {showWeekly ? (
             <BarChart3 className="h-6 w-6 text-orange-500" />
           ) : (
             <History className="h-6 w-6 text-purple-500" />
           )}
        </CardContent>
      </Card>

      {/* 4. Total Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Badge variant="secondary" className="px-2">{stats.totalUsers}</Badge>
        </CardHeader>
        <CardContent>
          <Users className="h-6 w-6 text-red-500" />
        </CardContent>
      </Card>

    </div>
  )
}