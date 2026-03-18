'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error boundary:', error);
  }, [error]);

  return (
    <main className="container py-5">
      <div className="alert alert-warning" role="alert">
        <h2 className="h4">Something went wrong</h2>
        <p className="mb-0">
          We couldn’t load this page. Please try again or go back to the homepage.
        </p>
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
