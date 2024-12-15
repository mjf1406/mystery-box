"use client";

import { useEffect, useState } from "react";
import { useIndexedDB } from "@/lib/hooks/useIndexedDb";
import { Game } from "@/lib/schemas/databaseSchema";
import { Database } from "@/lib/constants";
import RecentGamesTable from "./RecentGamesTable";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Gamepad2 } from "lucide-react";

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

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Gamepad2 className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Recent Games</CardTitle>
                        <CardDescription>
                            Your most recently created mystery box games
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading || isDBConnecting ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-32">
                        <p className="text-red-500 flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                            {error}
                        </p>
                    </div>
                ) : games.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <Gamepad2 className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-gray-500">No games created yet</p>
                    </div>
                ) : (
                    <RecentGamesTable games={games} />
                )}
            </CardContent>
        </Card>
    );
};

export default RecentGamesContainer;
