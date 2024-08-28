/**
 * Represents the navigation bar component.
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.isMobile - Indicates if the device is mobile.
 * @returns {JSX.Element} The rendered navigation bar.
 */

import { useState, useContext, useEffect } from "react";
import { BsSun } from "react-icons/bs";
import { HiOutlineMenu } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthContext } from '../../AuthDetails';
import { ref, onValue } from 'firebase/database'; 
import { database } from '../../../firebase/firebase';

interface NavBarProps {
  isMobile: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isMobile }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { authUser, userSignOut } = useContext(AuthContext);

  useEffect(() => {
    if (authUser?.uid) {
      setLoading(true);
      const databaseRef = ref(database, `users/${authUser.uid}/privileges`);
      onValue(databaseRef, (snapshot) => {
        const privilege = snapshot.val();
        setIsAdmin(["admin", "Admin", "owner", "Owner"].includes(privilege));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [authUser]);

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleSignOut = () => {
    userSignOut(() => {
      console.log("Logged out successfully");
    });
  };

  return (
    <nav className="flex items-center">
      <div className="flex">
        <li className="mx-2"><Link to="/">Home</Link></li>
        <li className="mx-2"><Link to="/premium">Subscribe</Link></li>
        <li className="mx-2"><Link to="/tester">Map Tester</Link></li>
        <li className="mx-2"><Link to="/about us">About Us</Link></li>
        <li className="mx-2"><Link to="/flights">Flights</Link></li>
        <li className="mx-2"><Link to="/hotels">Hotels</Link></li>
        {authUser ? (
          <>
            {isAdmin && (
              <li className="mx-2"><Link to="/admin">Admin Panel</Link></li>
            )}
            <li className="mx-2"><Link to="/profile">{authUser.email}</Link></li>
            <li className="mx-2"><Link to="/" onClick={handleSignOut}>Sign Out</Link></li>
          </>
        ) : (
          <>
            <li className="mx-2"><Link to="/SignIn">Sign In</Link></li>
            <li className="mx-3"><Link to="/SignUp">Sign Up</Link></li>
          </>
        )}
      </div>

      {openMenu && (
        <div className="fixed right-2 bg-slate-100 p-8 text-center text-13 text-black">
          <li><Link to="/" onClick={handleMenu}>Home</Link></li>
          <li><Link to="/price" onClick={handleMenu}>Price</Link></li>
          <li><Link to="/about" onClick={handleMenu}>About</Link></li>
          {authUser ? (
            <>
              {isAdmin && (
                <li className="mx-2"><Link to="/admin">Admin Panel</Link></li>
              )}
              <li className="mx-2"><Link to="/profile">{authUser.email}</Link></li>
              <li className="mx-2"><Link to="/" onClick={handleSignOut}>Sign Out</Link></li>
            </>
          ) : (
            <>
              <li className="mx-2"><Link to="/sign-in" onClick={handleMenu}>Sign In</Link></li>
              <li className="mx-3"><Link to="/sign-up" onClick={handleMenu}>Sign Up</Link></li>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;

