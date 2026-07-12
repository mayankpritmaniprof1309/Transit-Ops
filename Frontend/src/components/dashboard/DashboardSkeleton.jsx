import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardSkeleton() {
  const pulseTransition = {
    repeat: Infinity,
    duration: 1.2,
    ease: 'easeInOut',
    repeatType: 'reverse'
  };

  return (
    <div className="d-flex flex-column gap-4 w-100">
      {/* Welcome Banner Placeholder */}
      <motion.div
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={pulseTransition}
        className="w-100 bg-secondary bg-opacity-10"
        style={{ height: '140px', borderRadius: '18px' }}
      />

      {/* KPI Cards Placeholder Grid */}
      <div className="row g-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="col-12 col-sm-6 col-xl-3">
            <div className="glass-effect rounded-4 p-4 d-flex align-items-center gap-3">
              <motion.div
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={pulseTransition}
                className="bg-secondary bg-opacity-20 rounded-3"
                style={{ width: '48px', height: '48px' }}
              />
              <div className="flex-grow-1 d-flex flex-column gap-2">
                <motion.div
                  animate={{ opacity: [0.35, 0.65, 0.35] }}
                  transition={pulseTransition}
                  className="bg-secondary bg-opacity-15 rounded-2"
                  style={{ height: '12px', width: '60%' }}
                />
                <motion.div
                  animate={{ opacity: [0.35, 0.65, 0.35] }}
                  transition={pulseTransition}
                  className="bg-secondary bg-opacity-25 rounded-2"
                  style={{ height: '24px', width: '40%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Placeholder Grid */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="premium-card p-4 d-flex flex-column gap-3" style={{ height: '360px' }}>
            <motion.div
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={pulseTransition}
              className="bg-secondary bg-opacity-15 rounded-2"
              style={{ height: '16px', width: '30%' }}
            />
            <motion.div
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={pulseTransition}
              className="bg-secondary bg-opacity-10 rounded-3 w-100 flex-grow-1"
            />
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="premium-card p-4 d-flex flex-column gap-3" style={{ height: '360px' }}>
            <motion.div
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={pulseTransition}
              className="bg-secondary bg-opacity-15 rounded-2"
              style={{ height: '16px', width: '50%' }}
            />
            <div className="d-flex align-items-center justify-content-center flex-grow-1">
              <motion.div
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={pulseTransition}
                className="bg-secondary bg-opacity-15 rounded-circle"
                style={{ width: '180px', height: '180px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Charts / Table Placeholder Grid */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="premium-card p-4 d-flex flex-column gap-3" style={{ height: '320px' }}>
            <motion.div
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={pulseTransition}
              className="bg-secondary bg-opacity-15 rounded-2"
              style={{ height: '16px', width: '40%' }}
            />
            <motion.div
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={pulseTransition}
              className="bg-secondary bg-opacity-10 rounded-3 w-100 flex-grow-1"
            />
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="premium-card p-4 d-flex flex-column gap-3" style={{ height: '320px' }}>
            <motion.div
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={pulseTransition}
              className="bg-secondary bg-opacity-15 rounded-2"
              style={{ height: '16px', width: '40%' }}
            />
            <div className="d-flex flex-column gap-2 mt-1">
              {Array.from({ length: 4 }).map((_, r) => (
                <div key={r} className="d-flex justify-content-between py-2 border-bottom border-opacity-10">
                  <motion.div
                    animate={{ opacity: [0.35, 0.65, 0.35] }}
                    transition={pulseTransition}
                    className="bg-secondary bg-opacity-15 rounded-2"
                    style={{ height: '14px', width: '45%' }}
                  />
                  <motion.div
                    animate={{ opacity: [0.35, 0.65, 0.35] }}
                    transition={pulseTransition}
                    className="bg-secondary bg-opacity-15 rounded-2"
                    style={{ height: '14px', width: '20%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
