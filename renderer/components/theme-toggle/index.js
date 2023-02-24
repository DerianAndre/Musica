import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { DarkMode, LightMode } from '../icons';

const ToggleTheme = () => {
  const [theme, setTheme] = useLocalStorage('musica-settings-theme', 'light'); // Doesn't updates properly...
  const [icon, setIcon] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
    setIcon(theme);
  }, [theme]);

  return (
    <button
      className="swap btn-ghost swap-rotate btn-sm btn-circle btn text-xl"
      onClick={toggleTheme}
    >
      {icon === 'light' ? <LightMode /> : <DarkMode />}
    </button>
  );
};

export default ToggleTheme;
