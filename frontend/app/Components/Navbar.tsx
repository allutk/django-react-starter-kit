import { NavLink } from "react-router";

import { useAuth } from "~/Contexts/useAuth";

export default function Navbar() {
  const { logoutUser, isLoggedIn } = useAuth();

  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <div></div>

        <nav className="hidden md:flex space-x-8">
          {!isLoggedIn() && (
            <NavLink
              className="font-semibold transition-colors duration-200 hover:text-accent"
              to="/login"
            >
              Log In
            </NavLink>
          )}
          {!isLoggedIn() && (
            <NavLink
              className="font-semibold transition-colors duration-200 hover:text-accent"
              to="/register"
            >
              Sign Up
            </NavLink>
          )}
          {isLoggedIn() && (
            <a
              className="cursor-pointer font-semibold transition-colors duration-200 hover:text-accent"
              onClick={logoutUser}
            >
              Sign Out
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
