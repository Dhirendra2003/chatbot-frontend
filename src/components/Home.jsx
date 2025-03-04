import Card from "./Card";

export default function HomePage() {
  const arr=[1,2,3,4,5,6,];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">My Website</h1>
          <ul className="hidden md:flex space-x-6">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to My Website</h2>
        <p className="text-lg text-gray-700">
          This is a simple homepage created with React and Tailwind CSS.
        </p>

        <div className="grid grid-cols-2 gap-4 ">
          { arr.map((item)=>{
            return (<Card key={item}/>)
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        © {new Date().getFullYear()} My Website. All rights reserved.
      </footer>
    </div>
  );
}
