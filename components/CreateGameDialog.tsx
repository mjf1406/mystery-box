// src/components/CreateGameDialog.tsx

"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"; // Adjust the import path based on your project structure
import { Button } from "@/components/ui/button"; // Adjust the import path
import { Input } from "@/components/ui/input"; // Adjust the import path
import { Textarea } from "@/components/ui/textarea"; // Adjust the import path
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gameSchema, GameInput } from "@/lib/schemas/gameSchema"; // Adjust the import path
import { useIndexedDB } from "@/lib/hooks/useIndexedDb"; // Adjust the import path
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Database } from "@/lib/constants";
import { useRouter } from "next/navigation";

const CreateGameDialog: React.FC = () => {
    const router = useRouter(); // For navigation if needed
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<GameInput>({
        resolver: zodResolver(gameSchema),
    });
    const { toast } = useToast();

    // Initialize the useIndexedDB hook with the 'games' table
    const { putValue, isDBConnecting } = useIndexedDB(Database.name, ["games"]);

    // Handler for form submission
    const onSubmit = async (data: GameInput) => {
        try {
            // Prepare the game object
            const game = {
                name: data.name,
                description: data.description,
                createdAt: new Date().toISOString(),
                lastPlayed: null,
            };

            // Insert the game into IndexedDB
            const id = await putValue("games", game);

            if (id !== undefined) {
                toast({
                    title: "Game Created!",
                    description: "Game created successfully!",
                    variant: "default",
                });
                reset();
                setOpen(false);
                router.push(`/game/${id}`);
            } else {
                throw new Error("Failed to create game. No ID returned.");
            }
        } catch (error: unknown) {
            console.error("Error creating game:", error);
            if (error instanceof Error) {
                toast({
                    title: "Failed to Create Game!",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Failed to Create Game!",
                    description: "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus /> Create Game
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Game</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new game.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* Game Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter game name"
                            {...register("name")}
                            disabled={isDBConnecting || isSubmitting}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Game Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <Textarea
                            id="description"
                            placeholder="Enter game description"
                            {...register("description")}
                            disabled={isDBConnecting || isSubmitting}
                            className={
                                errors.description ? "border-red-500" : ""
                            }
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <DialogFooter>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={isDBConnecting || isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Game"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isDBConnecting || isSubmitting}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
                {/* Display a loading state if the DB is connecting */}
                {isDBConnecting && (
                    <p className="mt-4 text-sm text-gray-500">
                        Connecting to database...
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreateGameDialog;
