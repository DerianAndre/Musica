import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { DarkMode, LightMode } from '../icons';

const ToggleTheme = () => {
  const [theme, setTheme] = useLocalStorage<string>(
    'musica-settings-theme',
    'light',
  ); // Doesn't updates properly...
  const [icon, setIcon] = useState<string>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const Icon = () => (icon === 'light' ? <LightMode /> : <DarkMode />);

  useEffect(() => {
    if (!document || !theme) return;
    document?.querySelector('html')?.setAttribute('data-theme', theme);
    setIcon(theme);
  }, [theme]);

  return (
    <button
      type="button"
      title="Toggle theme"
      className="swap btn-ghost swap-rotate btn-sm btn-circle btn text-xl"
      onClick={toggleTheme}
    >
      <Icon />
    </button>
  );
};

export default ToggleTheme;
