import React from 'react';
import { useInView } from 'react-intersection-observer';

interface IProps {
  children: React.ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
  minHeight?: string | number;
  background?: string;
}

const ListIntersection = ({
  children,
  background,
  threshold = 0,
  triggerOnce = true,
  minHeight = '30px',
}: IProps) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  return (
    <div
      ref={ref}
      className={`item ${
        inView ? 'has-loaded forwards animate-fadeIn' : 'is-loading'
      }`}
      style={
        !inView ? { display: 'block', opacity: 0, minHeight, background } : {}
      }
    >
      {inView && children}
    </div>
  );
};

export default ListIntersection;
