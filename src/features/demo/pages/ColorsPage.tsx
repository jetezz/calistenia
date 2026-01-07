export function ColorsPage() {
  const colors = [
    { name: 'Slate', shades: ['bg-slate-100', 'bg-slate-300', 'bg-slate-500', 'bg-slate-700', 'bg-slate-900'] },
    { name: 'Red', shades: ['bg-red-100', 'bg-red-300', 'bg-red-500', 'bg-red-700', 'bg-red-900'] },
    { name: 'Orange', shades: ['bg-orange-100', 'bg-orange-300', 'bg-orange-500', 'bg-orange-700', 'bg-orange-900'] },
    { name: 'Green', shades: ['bg-green-100', 'bg-green-300', 'bg-green-500', 'bg-green-700', 'bg-green-900'] },
    { name: 'Blue', shades: ['bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-700', 'bg-blue-900'] },
    { name: 'Purple', shades: ['bg-purple-100', 'bg-purple-300', 'bg-purple-500', 'bg-purple-700', 'bg-purple-900'] },
    { name: 'Pink', shades: ['bg-pink-100', 'bg-pink-300', 'bg-pink-500', 'bg-pink-700', 'bg-pink-900'] },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Tailwind Colors Palette</h1>

      <div className="space-y-6">
        {colors.map((color) => (
          <div key={color.name}>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{color.name}</h3>
            <div className="flex gap-2">
              {color.shades.map((shade) => (
                <div
                  key={shade}
                  className={`w-16 h-16 rounded-lg ${shade} flex items-center justify-center shadow-md`}
                >
                  <span className="text-xs font-mono text-white mix-blend-difference">
                    {shade.split('-')[2]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Gradient Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold">
            Cyan → Blue
          </div>
          <div className="h-24 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold">
            Violet → Fuchsia
          </div>
          <div className="h-24 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            Amber → Pink
          </div>
        </div>
      </section>
    </div>
  )
}
