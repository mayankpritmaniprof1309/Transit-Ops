import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterPanel({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden w-100"
        >
          <div className="glass-effect rounded-4 p-3 mb-4 mt-2">
            <div className="row g-3">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
