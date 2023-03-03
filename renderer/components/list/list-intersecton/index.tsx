import React from 'react';
import { useInView } from 'react-intersection-observer';

interface IProps {
  children: React.ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
}

const ListIntersection = ({
  children,
  threshold = 0,
  triggerOnce = true,
}: IProps) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  return (
    <div
      ref={ref}
      className={`item ${
        inView
          ? 'has-loaded forwards animate-fadeIn'
          : 'is-loading block min-h-[30px] opacity-0'
      }`}
    >
      {inView && children}
    </div>
  );
};

export default ListIntersection;
