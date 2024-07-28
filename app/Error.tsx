"use client";

import Image from "next/image";

const Error = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src={"/error.png"}
        height={300}
        width={300}
        alt="Error"
        className="dark:hidden"
      />
      <Image
        src={"/error-dark.png"}
        height={300}
        width={300}
        alt="Error"
        className="hidden dark:block"
      />
    </div>
  );
};
export default Error;
