"use client";
import Logo from "@/components/Logo";
import ContactModal from "@/components/ContactModal";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { menuItems } from "../../components/custom-lists";

const CloseSVG = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
        />
    </svg>
);

const MenuSVG = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
    </svg>
);

const MobileNavbar = () => {
    const pathname = usePathname();
    const params = useParams();
    const [anchor, setAnchor] = useState("");
    const [isMobileMenuHidden, setIsMobileMenuHidden] = useState(true);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        setAnchor(window.location.hash);
    }, [params]);

    return (
        <div>
            <button
                onClick={() => setIsMobileMenuHidden(!isMobileMenuHidden)}
                className="fixed p-4 right-0 md:hidden z-50">
                <MenuSVG />
            </button>
            <nav
                className={`fixed flex flex-col h-screen transition duration-300 bg-black w-7/12 ${isMobileMenuHidden ? "-translate-x-full" : "translate-x-0"
                    } md:hidden z-50`}>
                <div className="border-white border-b-2 py-2 flex items-center">
                    <Link href={"/"} onClick={() => setIsMobileMenuHidden(true)}>
                        <Logo classes={"h-16"} />
                    </Link>
                    <button
                        onClick={() => {
                            setIsContactModalOpen(true);
                            setIsMobileMenuHidden(true);
                        }}
                        className="bg-gold py-2 px-4 rounded-lg font-bold">
                        Contact Us
                    </button>
                </div>
                {menuItems.map((item) => (
                    <Link
                        href={item.local}
                        key={item.id}
                        className={`p-4 ${pathname + anchor === item.local && "font-extrabold"
                            }`}
                        onClick={() => setIsMobileMenuHidden(true)}>
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Contact Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </div>
    );
};

export default MobileNavbar;
