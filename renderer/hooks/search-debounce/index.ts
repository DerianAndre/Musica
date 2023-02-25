import React, { useEffect, useState } from 'react';

const useSearchDebounce = (delay: number = 350) => {
  const [search, setSearch] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);

  useEffect(() => {
    const delayFn = setTimeout(() => setSearch(searchQuery), delay);
    return () => clearTimeout(delayFn);
  }, [searchQuery, delay]);

  return [search, setSearchQuery];
};

export default useSearchDebounce;
