import '../scss/globals.scss';

declare global {
  interface Window {
    electron?: any;
  }
}

const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
