export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Next.js Sandbox Ready
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Start building with Next.js 14, App Router, and Tailwind CSS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition">
            <h3 className="font-semibold mb-2 text-blue-400">App Router</h3>
            <p className="text-sm text-gray-400">Latest Next.js routing</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition">
            <h3 className="font-semibold mb-2 text-purple-400">JSX</h3>
            <p className="text-sm text-gray-400">Modern JSX syntax</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-pink-500 transition">
            <h3 className="font-semibold mb-2 text-pink-400">Tailwind CSS</h3>
            <p className="text-sm text-gray-400">Utility-first styling</p>
          </div>
        </div>
      </div>
    </main>
  )
}