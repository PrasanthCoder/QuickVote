"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  PlusCircle,
  BarChartBig,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Animations
const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/signin");
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return null;

  return (
    <div className="absolute w-full">
      <motion.nav
        className="bg-blue-950 shadow-md z-50"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
          >
            QuickVote
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-white text-sm font-medium">
                  Welcome{user.displayName ? `, ${user.displayName}` : ", "}!
                </span>

                <Link
                  href="/create"
                  className="flex items-center gap-2 nav-link"
                >
                  <PlusCircle size={16} /> Create Poll
                </Link>

                <Link
                  href="/my-polls"
                  className="flex items-center gap-2 nav-link"
                >
                  <BarChartBig size={16} /> My Polls
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 nav-link"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="flex items-center gap-2 nav-link"
                >
                  <LogIn size={16} /> Sign In
                </Link>

                <Link
                  href="/signup"
                  className="flex items-center gap-2 nav-link"
                >
                  <UserPlus size={16} /> Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded hover:bg-blue-800 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={24} color="white" />
            ) : (
              <Menu size={24} color="white" />
            )}
          </button>
        </div>
      </motion.nav>
      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden origin-top mx-4 mt-2 bg-gradient-to-br from-blue-800 via-blue-900 to-black rounded-xl shadow-lg border border-blue-700 px-6 py-5 space-y-4 z-50"
          >
            {user ? (
              <>
                <div className="text-white text-sm font-medium">
                  Welcome{user.displayName ? `, ${user.displayName}` : ", "}!
                </div>
                <Link
                  href="/create"
                  className="flex items-center gap-2 text-white hover:text-sky-200 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <PlusCircle size={16} /> Create Poll
                </Link>
                <Link
                  href="/my-polls"
                  className="flex items-center gap-2 text-white hover:text-sky-200 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <BarChartBig size={16} /> My Polls
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-white hover:text-sky-200 transition w-full text-left"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="flex items-center gap-2 text-white hover:text-sky-200 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={16} /> Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 text-white hover:text-sky-200 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus size={16} /> Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
