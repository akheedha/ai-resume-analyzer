function Navbar() {

  return (

    <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800">

      {/* LOGO */}

<h1 className="text-3xl font-extrabold text-white">

  ResumeForge{" "}

  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">

    AI

  </span>

</h1>

      {/* NAV LINKS */}

      <div className="flex gap-8 text-gray-300 font-medium">

<a
  href="/"
  className="text-purple-400 border-b-2 border-purple-400 pb-1"
>
  Dashboard
</a>

<a
  href="#features"
  className="hover:text-purple-400 transition"
>
  Features
</a>

<a
  href="#about"
  className="hover:text-purple-400 transition"
>
  About
</a>

      </div>

      {/* BUTTON */}

<div className="flex items-center gap-4">

  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">

    AK

  </div>

</div>

    </nav>
  );
}

export default Navbar;