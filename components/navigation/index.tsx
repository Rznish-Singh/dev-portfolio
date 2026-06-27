import { Dock } from "./dock";
import { ScrollTop } from "./scroll-top";

export default function Navigation() {
  return (
    <>
      <Dock className="hidden lg:flex" />
      <ScrollTop />
    </>
  );
}
