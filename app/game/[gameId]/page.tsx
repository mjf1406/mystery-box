"use client";

import React, { useEffect, useState } from "react";
import { Game } from "@/lib/schemas/databaseSchema";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { useIndexedDB } from "@/lib/hooks/useIndexedDb";
import { Database } from "@/lib/constants";

const GamePage: React.FC = () => {
    const params = useParams();
    const gameIdParam = params.gameId?.[0];
    const gameId = gameIdParam ? parseInt(gameIdParam, 10) : NaN;

    const { getValue, isDBConnecting } = useIndexedDB(Database.name, [
        Database.games,
    ]);
    const { toast } = useToast();

    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGame = async () => {
            if (isNaN(gameId)) {
                setError("Invalid game ID.");
                setLoading(false);
                return;
            }

            if (isDBConnecting) {
                return; // Wait for DB connection
            }

            try {
                const fetchedGame = await getValue(Database.games, gameId);

                if (!fetchedGame) {
                    setError("Game not found.");
                    toast({
                        title: "Error",
                        description: "Game not found in database.",
                        variant: "destructive",
                    });
                    return;
                }

                setGame(fetchedGame);
                setError(null);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred while fetching the game.";
                console.error("Error fetching game:", err);
                setError(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [gameId, getValue, isDBConnecting, toast]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <p className="text-gray-500">Loading game data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <p className="text-gray-500">No game data available.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full justify-center items-center">
            <div className="p-4 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Name: {game.name}</h2>
                <p className="text-gray-700 mb-4">
                    Description: {game.description}
                </p>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                        Created: {new Date(game.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                        Last Played:{" "}
                        {game.lastPlayed
                            ? new Date(game.lastPlayed).toLocaleString()
                            : "never"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GamePage;
