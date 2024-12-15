import RecentGamesContainer from "@/components/RecentGamesContainer";

export default function Home() {
    return (
        <main className="flex flex-col gap-8 w-full items-center py-6">
            <div className="max-w-lg text-center">
                How fortuitous you&apos;ve arrived! Feel to free to create as
                many Mystery Box Games as you want for free! All the data is
                stored on your computer, so no need to worry about data privacy
                😁 .If you get use out of this site, I would love for you to{" "}
                <a
                    className="link"
                    href="https://ko-fi.com/michaelfitzgerald1406"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    buy me an avocado
                </a>{" "}
                or become a{" "}
                <a
                    className="link"
                    href="https://patreon.com/MichaelFitzgerald?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    patreon
                </a>
                . Enjoy!
            </div>
            <RecentGamesContainer />
        </main>
    );
}
