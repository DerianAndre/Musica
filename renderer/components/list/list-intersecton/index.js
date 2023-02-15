import React, { Suspense } from "react";
import { useInView } from "react-intersection-observer";

const ListIntersection = (props) => {
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className="item transition duration-350 ease-out">
      <Suspense>{props.children}</Suspense>
    </div>
  );
};

export default ListIntersection;
