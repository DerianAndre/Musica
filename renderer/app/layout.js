import styles from "./layout.module.scss";

import Player from "../components/player";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Musica</title>
      </head>
      <body>
        <div className="flex flex-col w-full h-screen">
          <header className={`header grid p-10 pb-0 ${styles.header || ""}`}>
            <h1 className="text-3xl font-bold">Musica</h1>
          </header>
          <main className={`main grid h-full p-10 ${styles.children || ""}`}>
            {children}
          </main>
          <footer className={`bg-neutral text-neutral-content p-3`}>
            <Player />
          </footer>
        </div>
      </body>
    </html>
  );
}
