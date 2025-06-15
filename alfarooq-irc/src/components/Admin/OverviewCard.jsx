'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users, FileText, Clock, Database } from 'lucide-react'

export default function OverviewCards({ stats }) {
  // stats = { totalQuestions, totalLatest, totalApp, totalUsers }
  return (
    <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Questions</CardTitle>
          <Badge variant="secondary" className="px-2">
            {stats.totalQuestions}
          </Badge>
        </CardHeader>
        <CardContent>
          <FileText className="h-6 w-6 text-blue-500" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Latest</CardTitle>
          <Badge variant="secondary" className="px-2">
            {stats.totalLatest}
          </Badge>
        </CardHeader>
        <CardContent>
          <Clock className="h-6 w-6 text-green-500" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">App</CardTitle>
          <Badge variant="secondary" className="px-2">
            {stats.totalApp}
          </Badge>
        </CardHeader>
        <CardContent>
          <Database className="h-6 w-6 text-purple-500" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Users</CardTitle>
          <Badge variant="secondary" className="px-2">
            {stats.totalUsers}
          </Badge>
        </CardHeader>
        <CardContent>
          <Users className="h-6 w-6 text-red-500" />
        </CardContent>
      </Card>
    </div>
  )
}
