import Footer from "./_components/Footer";
import { Heading } from "./_components/Heading";
import { Heroes } from "./_components/Heroes";

const Marketing = () => {
  return (
    <div className="relative flex min-h-full flex-col dark:bg-[#1F1F1F]">
      <div className="absolute inset-0 h-full w-full bg-transparent bg-[radial-gradient(#000000_1px,transparent_1px)] opacity-10 [background-size:16px_16px] dark:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]"></div>

      <div className="z-10 flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center md:justify-start">
        <Heading />
        <Heroes />
        <Footer />
      </div>
    </div>
  );
};
export default Marketing;
