import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Game } from "@/lib/schemas/databaseSchema";

interface RecentGamesTableProps {
    games: Game[];
}

const RecentGamesTable = ({ games }: RecentGamesTableProps) => {
    // Sort games by creation date and take the 5 most recent
    const recentGames = [...games]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Last Played</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentGames.map((game) => (
                        <TableRow key={game.id}>
                            <TableCell className="font-medium">
                                {game.name}
                            </TableCell>
                            <TableCell>
                                {game.lastPlayed
                                    ? new Date(
                                          game.lastPlayed
                                      ).toLocaleDateString(undefined, {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                      })
                                    : "Never"}
                            </TableCell>
                            <TableCell>
                                {new Date(game.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {recentGames.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="h-24 text-center"
                            >
                                No games found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default RecentGamesTable;
