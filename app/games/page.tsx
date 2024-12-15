import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIndexedDB } from "@/lib/hooks/useIndexedDb";
import { Game } from "@/lib/schemas/databaseSchema";
import { Database } from "@/lib/constants";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    MoreVertical,
    Play,
    Edit,
    Trash2,
    Clock,
    Calendar,
} from "lucide-react";

const GamesTablePage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { getAllValue, deleteValue, isDBConnecting } = useIndexedDB(
        Database.name,
        [Database.games]
    );

    // Fetch games
    useEffect(() => {
        const fetchGames = async () => {
            if (isDBConnecting) return;

            try {
                const fetchedGames = await getAllValue(Database.games);
                // Sort by creation date descending
                const sortedGames = fetchedGames.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                setGames(sortedGames);
                setError(null);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch games";
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

        fetchGames();
    }, [getAllValue, isDBConnecting, toast]);

    const handlePlay = (gameId: number) => {
        router.push(`/game/${gameId}`);
    };

    const handleEdit = (gameId: number) => {
        router.push(`/game/${gameId}/edit`);
    };

    const handleDelete = async (gameId: number) => {
        try {
            await deleteValue(Database.games, gameId);
            setGames(games.filter((game) => game.id !== gameId));
            toast({
                title: "Success",
                description: "Game deleted successfully",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to delete game",
                variant: "destructive",
            });
        }
    };

    if (loading || isDBConnecting) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading games...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Your Games</h1>
                <Button onClick={() => router.push("/game/new")}>
                    Create New Game
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Created
                                </div>
                            </TableHead>
                            <TableHead className="w-32">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Last Played
                                </div>
                            </TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {games.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-32 text-center"
                                >
                                    No games found. Create your first game to
                                    get started!
                                </TableCell>
                            </TableRow>
                        ) : (
                            games.map((game) => (
                                <TableRow key={game.id}>
                                    <TableCell className="font-medium">
                                        {game.name}
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {game.description}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            game.createdAt
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            game.lastPlayed
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handlePlay(game.id)
                                                }
                                                title="Play Game"
                                            >
                                                <Play className="h-4 w-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(game.id)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(
                                                                game.id
                                                            )
                                                        }
                                                        className="cursor-pointer text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default GamesTablePage;
