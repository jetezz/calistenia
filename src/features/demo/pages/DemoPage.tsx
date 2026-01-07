import { Link } from 'react-router-dom'

export function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Demo - Tailwind & Router</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Navigation Test</h2>
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/demo"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Demo
          </Link>
          <Link
            to="/demo/colors"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Colors
          </Link>
          <Link
            to="/not-found-page"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            404 Test
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Typography</h2>
        <div className="space-y-2">
          <p className="text-xs text-slate-600">Extra Small Text (text-xs)</p>
          <p className="text-sm text-slate-600">Small Text (text-sm)</p>
          <p className="text-base text-slate-600">Base Text (text-base)</p>
          <p className="text-lg text-slate-600">Large Text (text-lg)</p>
          <p className="text-xl text-slate-600">Extra Large Text (text-xl)</p>
          <p className="text-2xl font-bold text-slate-800">2XL Bold (text-2xl)</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Flexbox & Grid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg"
            >
              <p className="text-lg font-semibold">Card {num}</p>
              <p className="text-sm opacity-80">Responsive grid item</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spacing & Shadows</h2>
        <div className="flex flex-wrap gap-4">
          <div className="p-4 bg-white shadow-sm rounded-lg">shadow-sm</div>
          <div className="p-4 bg-white shadow rounded-lg">shadow</div>
          <div className="p-4 bg-white shadow-md rounded-lg">shadow-md</div>
          <div className="p-4 bg-white shadow-lg rounded-lg">shadow-lg</div>
          <div className="p-4 bg-white shadow-xl rounded-lg">shadow-xl</div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Hover & Transitions</h2>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:scale-105 hover:bg-slate-900 transition-all duration-300">
            Scale Effect
          </button>
          <button className="px-6 py-3 bg-transparent border-2 border-slate-800 text-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300">
            Fill Effect
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-300">
            Gradient
          </button>
        </div>
      </section>
    </div>
  )
}
