// Handwritten margin note like the reference docs. Wrap the content in <div className="relative"> and put <Note> inside.
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');`}</style>
      <span aria-hidden className="pointer-events-none absolute left-full top-2 ml-6 hidden w-40 -rotate-3 text-[19px] leading-tight text-[#d6397f] xl:block dark:text-[#f472b6]"
        style={{ fontFamily: "'Caveat','Bradley Hand',cursive" }}>
        {children}
      </span>
    </>
  );
}
