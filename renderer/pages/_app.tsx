import '../scss/globals.scss';

import { AppProps } from 'next/app';

declare global {
  interface Window {
    electron?: any;
  }
}

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <Component {...pageProps} />;
};

export default App;
