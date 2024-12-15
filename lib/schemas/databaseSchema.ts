// src/lib/schemas/databaseSchema.ts
export interface Game {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    lastPlayed: string;
    questions: Question[]
}

export interface Question {
    question: string;
    answer: string;
}

export interface DatabaseSchema {
    games: Game;
    // Add other tables as needed
}
