import React, { Suspense } from "react";
import { useInView } from "react-intersection-observer";

const ListIntersection = (props) => {
  const [ref, inView] = useInView({
    threshold: props.threshold || undefined,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`item transition duration-500 ease ${
        inView ? "opacity-100" : "opacity-0"
      }`}
    >
      {inView && props.children}
    </div>
  );
};

export default ListIntersection;
