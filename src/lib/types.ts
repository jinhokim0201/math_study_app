export type Grade = 'Middle1' | 'Middle2' | 'Middle3' | 'High1' | 'High2' | 'High3';

export interface Problem {
    id: string;
    type: string; // Topic ID
    grade: Grade;
    difficulty: 'Basic' | 'Advanced';
    question: string;
    options: string[]; // Array of 4 strings
    correctAnswer: number; // 0-3 index
    explanation: string;
}

export interface CurriculumTopic {
    id: string;
    title: string;
    grade: Grade;
}

export interface QuizState {
    currentGrade: Grade | null;
    problems: Problem[];
    currentIndex: number;
    answers: number[]; // User answers (-1 for skipped/unanswered)
    results: boolean[]; // Correct/Incorrect
    retryCount: number; // Current problem retry count
    isFinished: boolean;
    score: number;
}
