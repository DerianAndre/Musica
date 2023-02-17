import { Suspense } from 'react';

/* eslint-disable @next/next/no-img-element */
const Skeleton = () => {
  return (
    <div
      className="block aspect-[1/1] w-full select-none border  border-base-content/[0.05] bg-base-300 shadow-lg"
      style={{ width }}
    >
      <svg
        class="h-12 w-12 text-gray-200 dark:text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 640 512"
      >
        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
      </svg>
    </div>
  );
};

const ListCover = ({ album = {}, width, rounded = false }) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <div className="list-cover block w-full" style={{ maxWidth: width }}>
        <img
          className={`block aspect-[1/1] w-full select-none border border-base-content/[0.05]  bg-base-300 shadow-lg ${
            rounded && 'rounded-full'
          }`}
          alt={album?.title || ''}
          src={
            album?.cover
              ? // TODO
                `D:\\Websites\\GitHub\\Derian Andre\\Musica\\library\\cache\\${album?.cover}`
              : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
          }
          width={width}
        />
      </div>
    </Suspense>
  );
};

export default ListCover;
