import React, { useEffect, useRef } from 'react';
// import { Line } from "./Line.ts";

export const D3js2: React.FC = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // new Line(ref.current);
      // console.log(a);
    }
  }, []);

  return <div />;
};
