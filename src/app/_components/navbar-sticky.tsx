"use client";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { menuItems } from "../../components/custom-lists";
const StickyNavbar = () => {
  const pathname = usePathname();
  const params = useParams();
  const [isSticky, setSticky] = useState(false);
  const [anchor, setAnchor] = useState("");
  // const [y, setY] = useState(0);

  useEffect(() => {
    setAnchor(window.location.hash);
  }, [params]);

  const handleStickyNavbar = () => {
    // setY(window.scrollY);
    if (window.scrollY >= 25) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  return (
    <nav className={``}>
      {/* {y} */}
      <div
        className={`hidden md:flex px-28 transition duration-500 ${
          isSticky ? "bg-primary" : "bg-primary"
        } fixed min-w-full gap-2 items-center z-50`}>
        <Link href={"/"}>
          <Logo classes={"h-20"} />
        </Link>
        {menuItems.map((item) => (
          <Link
            href={item.local}
            key={item.id}
            className={`p-4 hover:font-bold ${
              pathname + anchor === item.local && "font-extrabold"
            }`}>
            <span>{item.name}</span>
          </Link>
        ))}
        <Link href={"mailto:contact@sbmi.io"} className="absolute right-28">
        <div className="bg-gold py-2 px-4 rounded-lg font-bold">
          Contact Us
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default StickyNavbar;
