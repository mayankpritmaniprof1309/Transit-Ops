import React, { useState } from 'react';
import SettingCard from './SettingCard.jsx';
import ConfirmModal from '../common/ConfirmModal.jsx';
import { FaTrashAlt, FaBan, FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function DangerZone({ onDeleteAccount, onDeactivateAccount, onLogout }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: null, // 'delete' | 'deactivate' | 'logout'
    title: '',
    message: '',
    confirmText: '',
  });

  const triggerModal = (action, title, message, confirmText) => {
    setModalState({
      isOpen: true,
      action,
      title,
      message,
      confirmText,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (modalState.action === 'delete') {
      onDeleteAccount();
    } else if (modalState.action === 'deactivate') {
      onDeactivateAccount();
    } else if (modalState.action === 'logout') {
      onLogout();
    }
  };

  return (
    <div>
      <SettingCard className="border border-danger border-opacity-50">
        <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-danger border-opacity-10">
          <FaExclamationTriangle className="text-danger" size={18} />
          <h5 className="fw-bold text-danger mb-0" style={{ letterSpacing: '-0.01em' }}>Danger Zone</h5>
        </div>
        <p className="text-secondary small mb-4">
          Actions in this section are highly destructive or result in immediate session termination. Please review details carefully.
        </p>

        <div className="d-flex flex-column gap-3">
          {/* Deactivate Account */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center p-3 rounded-3 border border-light bg-light bg-opacity-25">
            <div className="mb-3 mb-sm-0">
              <h6 className="fw-bold text-dark mb-1">Deactivate Account</h6>
              <p className="text-secondary mb-0 small">
                Temporarily disable your profile. You can reactivate by contacting support.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                triggerModal(
                  'deactivate',
                  'Deactivate Profile?',
                  'This will temporarily disable your account, sign you out, and prevent assignments from being sent to you.',
                  'Deactivate'
                )
              }
              className="btn btn-outline-danger btn-premium-secondary d-flex align-items-center gap-2 border-danger text-danger hover-lift"
              style={{ transition: 'all 0.2s' }}
            >
              <FaBan size={13} /> Deactivate
            </button>
          </div>

          {/* Delete Account */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center p-3 rounded-3 border border-danger border-opacity-15 bg-light bg-opacity-10">
            <div className="mb-3 mb-sm-0">
              <h6 className="fw-bold text-dark mb-1">Delete Account Permanent Record</h6>
              <p className="text-secondary mb-0 small">
                Permanently purge all data, settings, credentials, and access keys.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                triggerModal(
                  'delete',
                  'Permanently Delete Account?',
                  'This action cannot be undone. All database records linked to your user profile will be permanently destroyed.',
                  'Delete Account'
                )
              }
              className="btn btn-premium-danger d-flex align-items-center gap-2 hover-lift"
            >
              <FaTrashAlt size={13} /> Delete Account
            </button>
          </div>

          {/* Logout */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center p-3 rounded-3 border border-light bg-light bg-opacity-25">
            <div className="mb-3 mb-sm-0">
              <h6 className="fw-bold text-dark mb-1">Sign Out Session</h6>
              <p className="text-secondary mb-0 small">
                Close the current active user session on this device.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                triggerModal(
                  'logout',
                  'Sign Out Account?',
                  'Are you sure you want to end your active workspace session on this browser device?',
                  'Logout Session'
                )
              }
              className="btn btn-premium-secondary d-flex align-items-center gap-2 hover-lift"
            >
              <FaSignOutAlt size={13} /> Logout Session
            </button>
          </div>
        </div>
      </SettingCard>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText="Cancel"
        isDanger={modalState.action === 'delete' || modalState.action === 'deactivate'}
      />
    </div>
  );
}
