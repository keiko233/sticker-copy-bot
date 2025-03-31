"use client";

import dynamic from "next/dynamic";
import { Fragment, PropsWithChildren } from "react";

const Wrapper = ({ children }: PropsWithChildren) => (
  <Fragment>{children}</Fragment>
);

const NoSSRWrapper = dynamic(() => Promise.resolve(Wrapper), {
  ssr: false,
});

export default NoSSRWrapper;
