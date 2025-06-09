'use client'

export default function ProtectedDashboard() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Protected Dashboard</h1>
      <p>Your content here is only visible when signed in.</p>
    </div>
  )
}
