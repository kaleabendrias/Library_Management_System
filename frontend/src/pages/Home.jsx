const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">Library Management</h1>
        <div className="space-x-4">
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
          <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">Welcome to the Library</h2>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Browse books, manage loans, and keep track of your library activity easily with our system.
        </p>
        <div className="space-x-4">
          <a
            href="/books"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Browse Books
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Get Started
          </a>
        </div>
      </main>

      <footer className="text-center p-4 bg-white border-t text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Library Management System
      </footer>
    </div>
  );
};

export default Home;
