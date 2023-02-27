'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Back, Home } from '../icons';

const GoBack = () => {
  const router = useRouter();

  return (
    <div className="mt-5 mb-4 flex gap-2">
      <button
        className="btn-ghost btn-sm btn-circle btn bg-base-content/[0.1] text-lg"
        title="Go back"
        type="button"
        onClick={() => router.back()}
      >
        <Back />
      </button>
      <Link
        href="/"
        title="Go Home"
        className="btn-ghost btn-sm btn-circle btn bg-base-content/[0.1] text-lg"
      >
        <Home />
      </Link>
    </div>
  );
};

export default GoBack;
