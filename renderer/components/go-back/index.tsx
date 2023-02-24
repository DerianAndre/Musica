'use client';

import { useRouter } from 'next/navigation';
import { Back } from '../icons';

const GoBack = () => {
  const router = useRouter();

  return (
    <button
      className="btn-sm btn my-2 text-lg"
      title="Go back"
      type="button"
      onClick={() => router.back()}
    >
      <Back />
    </button>
  );
};

export default GoBack;
