import React, { useEffect, useRef } from 'react';
// import { Line } from "./Line.ts";

export const D3js: React.FC = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current) {
      // const a = new Line(ref.current);
      // console.log(a);
    }
  }, []);

  return <div />;
};
