"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Folder as FolderIcon, FolderOpen } from 'lucide-react';

interface FolderProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  onToggle?: (isOpen: boolean) => void;
}

export const Folder: React.FC<FolderProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    onToggle?.(nextState);
  };

  return (
    <div className={`border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm ${className}`}>
      <button
        onClick={toggle}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 text-white/40" />
        </motion.div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <FolderOpen className="w-5 h-5 text-blue-400" />
          ) : (
            <FolderIcon className="w-5 h-5 text-blue-400" />
          )}
          <span className="font-bold text-lg tracking-tight">{title}</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6 pt-0 border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
