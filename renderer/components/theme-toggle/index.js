import React, { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { DarkMode, LightMode } from '../icons';

const ToggleTheme = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button
      className="swap btn-ghost swap-rotate btn-md btn-circle btn text-xl"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <DarkMode /> : <LightMode />}
    </button>
  );
};

export default ToggleTheme;
