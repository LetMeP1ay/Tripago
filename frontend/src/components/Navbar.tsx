"use client";
import React, { useState } from "react";
import Image from "next/image";
import "./Navbar.css"; // Import CSS for styling

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex flex-row bg-white justify-between h-[82px]">
        <Image className="ml-[31px]" src="Map.svg" alt="Map" height={24} width={24}/>
        <Image src="Heart.svg" alt="Map" height={24} width={24}/>
        <Image src="Cart.svg" alt="Map" height={24} width={24}/>
        <Image src="Ticket.svg" alt="Map" height={24} width={24}/>
        <Image className="mr-[31px]" src="User.svg" alt="Map" height={24} width={24}/>
    </nav>
  );
};

export default Navbar;
