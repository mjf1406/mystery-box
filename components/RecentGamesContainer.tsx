"use client";

import { useEffect, useState } from "react";
import { useIndexedDB } from "@/lib/hooks/useIndexedDb";
import { Game } from "@/lib/schemas/databaseSchema";
import { Database } from "@/lib/constants";
import RecentGamesTable from "./RecentGamesTable";

const RecentGamesContainer = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { getAllValue, isDBConnecting } = useIndexedDB(Database.name, [
        Database.games,
    ]);

    useEffect(() => {
        const fetchGames = async () => {
            if (isDBConnecting) {
                return;
            }

            try {
                const fetchedGames = await getAllValue(Database.games);
                setGames(fetchedGames);
                setError(null);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch games";
                console.error("Error fetching games:", err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [getAllValue, isDBConnecting]);

    if (loading || isDBConnecting) {
        return (
            <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">Loading games...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-32">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return <RecentGamesTable games={games} />;
};

export default RecentGamesContainer;
