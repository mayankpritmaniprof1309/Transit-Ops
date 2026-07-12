import React from 'react';
import { motion } from 'framer-motion';

/**
 * SettingCard standard wrapper.
 * White background, soft shadows, rounded corners, subtle hover lift.
 */
export default function SettingCard({ children, className = '', ...props }) {
  return (
    <motion.div
      className={`premium-card bg-white p-4 mb-4 ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
