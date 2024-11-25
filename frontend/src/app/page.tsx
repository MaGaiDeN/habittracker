export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Construye mejores hábitos
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Comienza a rastrear tus hábitos diarios y construye una mejor versión de ti mismo.
        </p>
        <div className="mt-8">
          <a
            href="/registro"
            className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Comenzar Ahora
          </a>
        </div>
      </div>
    </div>
  )
}
