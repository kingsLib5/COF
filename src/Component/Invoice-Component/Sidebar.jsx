// src/Component/Invoice-Component/SideBar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SideBar = ({ basePath = "", menus = [], onExpand, onCollapse, initialOpen = false, onLogout = () => {} }) => {
  const [open, setOpen] = useState(initialOpen);
  const location = useLocation();

  useEffect(() => {
    if (open) onExpand?.();
    else onCollapse?.();
  }, [open, onExpand, onCollapse]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && initialOpen) setOpen(true);
      if (window.innerWidth < 1024 && !initialOpen) setOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialOpen]);

  const fullPath = (p) => {
    if (!p) return basePath || "/";
    if (p.startsWith("/")) return p;
    const base = basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath;
    return `${base}/${p}`.replace(/\/+/g, "/");
  };

  const OPEN_PX = 288;
  const CLOSED_PX = 80;

  const sidebarVariants = {
    open: { width: OPEN_PX, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { width: CLOSED_PX, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.16 } }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) setOpen(true);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024 && !initialOpen) setOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md"
        aria-label="Toggle menu"
      >
        <FiMenu size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && typeof window !== "undefined" && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed top-0 left-0 h-full bg-white text-amber-900 z-50 shadow-lg overflow-hidden flex flex-col border-r"
        variants={sidebarVariants}
        animate={open ? "open" : "closed"}
        initial={false}
        style={{ minWidth: CLOSED_PX }}
      >
        {/* Decorative stripe */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-r from-amber-600 to-amber-700 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-amber-100">
          <div className="w-10 h-10 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold shadow-sm">
            COF
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="flex-1 overflow-hidden"
              >
                <h1 className="text-lg font-semibold">Cloud Of Fragrance</h1>
                <p className="text-xs text-amber-500">Invoice Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="p-4 flex items-center gap-3 border-b border-amber-100">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center text-white font-semibold shadow">
            A
          </div>
          <AnimatePresence>
            {open && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="truncate font-medium">Welcome</div>
                <div className="text-xs text-amber-500 truncate mt-1">Invoice Manager</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto py-3 px-2">
          <ul className="space-y-1">
            {menus.map((m) => {
              const isActive = location.pathname === fullPath(m.path);
              return (
                <li key={m.name}>
                  <motion.div
                    initial={{ backgroundColor: "transparent" }}
                    whileHover={{ backgroundColor: "rgba(183,123,29,0.06)" }}
                    transition={{ duration: 0.12 }}
                    className="rounded-md"
                  >
                    <NavLink
                      to={fullPath(m.path)}
                      className={`group flex items-center gap-3 w-full px-3 py-2 rounded-md transition-all focus:outline-none ${
                        isActive
                          ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow"
                          : "text-amber-900"
                      }`}
                    >
                      <motion.span
                        style={{ color: isActive ? "#fff" : "#b77b1d" }}
                        whileHover={{ scale: 1.12, rotate: 8 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="flex-shrink-0 rounded-md p-1"
                      >
                        {m.icon}
                      </motion.span>

                      <AnimatePresence>
                        {open && (
                          <motion.span
                            key={m.name}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={textVariants}
                            className={`truncate font-medium ${isActive ? "text-white" : "text-amber-900"}`}
                          >
                            {m.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {isActive && (
                        <motion.div
                          className="ml-auto w-1 h-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-700"
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ duration: 0.14 }}
                        />
                      )}
                    </NavLink>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-amber-100">
          <motion.button
            onClick={() => onLogout()}
            whileHover={{ x: 6 }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-amber-900 hover:bg-yellow-50"
          >
            <motion.span style={{ color: "#b77b1d" }} whileHover={{ scale: 1.08 }}>
              {/* You might want to add a logout icon here */}
            </motion.span>
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default SideBar;