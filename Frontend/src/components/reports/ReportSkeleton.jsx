import React from 'react';

export default function ReportSkeleton() {
  return (
    <div className="w-100 py-2">
      {/* KPI Cards Skeleton */}
      <div className="row g-3 mb-4">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-lg-3">
            <div className="card-solid p-3 d-flex flex-column justify-content-between" style={{ height: '110px' }}>
              <div className="d-flex justify-content-between align-items-start">
                <div className="skeleton-shimmer skeleton-box w-50" style={{ height: '0.75rem' }} />
                <div className="skeleton-shimmer rounded-circle" style={{ width: '28px', height: '28px' }} />
              </div>
              <div>
                <div className="skeleton-shimmer skeleton-box w-75 mb-2" style={{ height: '1.5rem' }} />
                <div className="skeleton-shimmer skeleton-box w-25" style={{ height: '0.6rem' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid Skeleton */}
      <div className="row g-4 mb-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="col-12 col-lg-6">
            <div className="card-solid p-4" style={{ height: '320px' }}>
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <div className="skeleton-shimmer skeleton-box w-75 mb-2" style={{ height: '1rem' }} />
                  <div className="skeleton-shimmer skeleton-box w-50" style={{ height: '0.7rem' }} />
                </div>
                <div className="skeleton-shimmer skeleton-box w-25" style={{ height: '0.85rem' }} />
              </div>
              <div className="flex-grow-1 d-flex align-items-end justify-content-between gap-2 px-2" style={{ height: '180px' }}>
                {[...Array(8)].map((_, bIdx) => (
                  <div
                    key={bIdx}
                    className="skeleton-shimmer rounded-top flex-grow-1"
                    style={{
                      height: `${20 + Math.random() * 80}%`,
                      maxWidth: '40px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tables Grid Skeleton */}
      <div className="row g-4">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="col-12 col-xl-6">
            <div className="card-solid p-4" style={{ minHeight: '380px' }}>
              <div className="skeleton-shimmer skeleton-box w-25 mb-4" style={{ height: '1.2rem' }} />
              <div className="table-responsive">
                <table className="table table-borderless align-middle">
                  <thead>
                    <tr>
                      {[...Array(5)].map((_, hIdx) => (
                        <th key={hIdx}>
                          <div className="skeleton-shimmer skeleton-box w-75" style={{ height: '0.8rem' }} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, rIdx) => (
                      <tr key={rIdx}>
                        {[...Array(5)].map((_, cIdx) => (
                          <td key={cIdx}>
                            <div className="skeleton-shimmer skeleton-box w-100" style={{ height: '0.95rem' }} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
