import { Construction } from "lucide-react";

export default function Home() {
    return (
        <main className="flex flex-col gap-8 w-full items-center py-6">
            <div className="flex gap-2 items-center justify-center">
                <Construction size={48} />{" "}
                <span className="text-3xl">Under Construction</span>
            </div>
            <div>I&apos;m working hard to finish this webapp 😁</div>
        </main>
    );
}
