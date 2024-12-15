import { Button } from "@/components/ui/button";
import { Gamepad2, Gift, Plus } from "lucide-react";
import Link from "next/link";

const Header = () => {
    // Define the links with label in plain English
    const links = [
        {
            href: "/games",
            label: "My Games",
            icon: <Gamepad2 className="h-4 w-4" />,
        },
    ];

    return (
        <header className="flex w-full items-center justify-between gap-6 bg-accent px-6 py-3 absolute top-0">
            <h1 className="text-4xl flex gap-2 justify-center items-center">
                <Gift size={48} /> Mystery Box
            </h1>
            <nav className="flex justify-center items-center">
                {links.map(({ href, label, icon }) => (
                    <Link
                        href={href}
                        key={href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant={"link"}
                            className="text-foreground"
                        >
                            {icon}
                            <span>{label}</span>
                        </Button>
                    </Link>
                ))}
                <Link href={"/create"}>
                    <Button>
                        <Plus className="h-4 w-4" /> Create Game
                    </Button>
                </Link>
            </nav>
        </header>
    );
};

export default Header;
