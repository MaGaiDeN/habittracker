export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">HabitTracker</h1>
              <div className="ml-10 flex items-center space-x-4">
                <a href="/dashboard" className="text-gray-900 hover:text-gray-700">
                  Dashboard
                </a>
                <a href="/dashboard/estadisticas" className="text-gray-500 hover:text-gray-700">
                  Estadísticas
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-gray-500 hover:text-gray-700">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
} 