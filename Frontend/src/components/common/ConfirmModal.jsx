import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-40"
            style={{ zIndex: 1060 }}
          />

          {/* Modal Dialog Card */}
          <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 1070, width: '90%', maxWidth: '440px' }}>
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="card border-0 shadow-lg p-4"
              style={{ borderRadius: '18px' }}
            >
              <h2 className="h5 fw-bold text-dark mb-2">{title}</h2>
              <p className="text-secondary mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.45' }}>
                {message}
              </p>
              
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-premium-secondary"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`btn ${isDanger ? 'btn-premium-danger' : 'btn-premium-primary'}`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
