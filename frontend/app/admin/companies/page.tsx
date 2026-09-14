'use client';

import { useEffect, useState } from 'react';
import { getAllCompanies } from '@/services/companyService';

type Company = {
  id: number;
  companyName: string;
  email: string;
  isSubscribe: boolean;
};

export default function CompanyManagementPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllCompanies()
      .then(setCompanies)
      .catch(() => setMessage('Could not load companies.'))
      .finally(() => setLoading(false));
  }, []);

  const subscribedCount = companies.filter((c) => c.isSubscribe).length;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-neutral">
        Companies
      </h1>
      <p className="mt-2 text-secondary">
        {companies.length} total · {subscribedCount} subscribed
      </p>

      {message && (
        <div className="mt-4 rounded-lg bg-info/10 px-4 py-3 text-info">{message}</div>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr className="text-secondary">
              <th>Company</th>
              <th>Email</th>
              <th>Subscription</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-secondary">
                  No companies yet.
                </td>
              </tr>
            ) : (
              companies.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium text-neutral">{c.companyName}</td>
                  <td className="text-secondary">{c.email}</td>
                  <td>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        c.isSubscribe
                          ? 'bg-success/15 text-success'
                          : 'bg-base-200 text-secondary'
                      }`}
                    >
                      {c.isSubscribe ? 'Subscribed' : 'Free'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}