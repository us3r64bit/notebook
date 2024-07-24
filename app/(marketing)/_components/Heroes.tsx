import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
      <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[500px] md:w-[500px]">
        <Image
          src="/heroPage.png"
          fill
          className="object-contain dark:hidden"
          alt="Notebook"
        />
        <Image
          src="/heroPage-dark.png"
          fill
          className="object-contain hidden dark:block"
          alt="Notebook"
        />
      </div>
    </div>
  );
};
