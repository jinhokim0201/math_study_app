import { create } from 'zustand';
import { Grade, Problem, QuizState } from './types';
import { generateProblem } from './generator';
import { TOPICS } from './curriculum';

interface Store extends QuizState {
    startSession: (grade: Grade) => void;
    submitAnswer: (answerIndex: number) => void;
    nextProblem: () => void;
    reset: () => void;
    // Time tracking
    sessionStartTime: number;
    solveTimes: number[]; // Time taken for each problem index (ms)
    problemStartTimes: number[]; // Start time for each problem index
}

export const useStore = create<Store>((set, get) => ({
    currentGrade: null,
    problems: [],
    currentIndex: 0,
    answers: [],
    results: [],
    retryCount: 0,
    isFinished: false,
    score: 0,
    sessionStartTime: 0,
    solveTimes: [],
    problemStartTimes: [],

    startSession: (grade: Grade) => {
        // Generate initial problem
        const topics = TOPICS[grade];
        const initialProblem = generateProblem(grade, topics[0].id); // Start with first topic or random

        set({
            currentGrade: grade,
            problems: [initialProblem],
            currentIndex: 0,
            answers: [],
            results: [],
            retryCount: 0,
            isFinished: false,
            score: 0,
            sessionStartTime: Date.now(),
            solveTimes: [],
            problemStartTimes: [Date.now()],
        });
    },

    submitAnswer: (answerIndex: number) => {
        const { problems, currentIndex, results, problemStartTimes } = get();
        const currentProblem = problems[currentIndex];
        const isCorrect = answerIndex === currentProblem.correctAnswer;
        const now = Date.now();
        const startTime = problemStartTimes[currentIndex] || now;
        const duration = now - startTime;

        // Update answers and results
        // Note: We only record the *final* result for scoring, but here we might want to track attempts.
        // For simplicity, let's say we track the result of the *current* attempt.

        // If already answered correctly, ignore
        if (results[currentIndex] === true) return;

        set((state) => {
            const newAnswers = [...state.answers];
            newAnswers[currentIndex] = answerIndex; // Store last answer

            const newResults = [...state.results];
            newResults[currentIndex] = isCorrect;

            const newSolveTimes = [...state.solveTimes];
            // Only record time for the first attempt or accumulate?
            // Let's just record the time when they submit an answer. 
            // If they retry, we might want to add to it, but for now let's just store the last one or sum?
            // Simple approach: Store the duration of the *successful* or *final* attempt for that slot?
            // Actually, for a report, we want "Time spent on Question X".
            // So we should probably accumulate time if they retry?
            // But `problemStartTimes` is reset on retry? No, let's check nextProblem.

            // Let's just store the duration calculated from start of this problem instance.
            newSolveTimes[currentIndex] = duration;

            return {
                answers: newAnswers,
                results: newResults,
                solveTimes: newSolveTimes,
            };
        });
    },

    nextProblem: () => {
        const {
            currentGrade,
            problems,
            currentIndex,
            results,
            retryCount,
            score
        } = get();

        if (!currentGrade) return;

        const isCorrect = results[currentIndex];
        const currentProblem = problems[currentIndex];

        // Logic:
        // 1. If Correct -> Next problem (New Type)
        // 2. If Incorrect -> 
        //    If retryCount < 2 (Total 3 attempts: 0, 1, 2) -> Retry (Same Type, Different Numbers)
        //    If retryCount >= 2 -> Next problem (New Type) (Mark as failed)

        let nextProblem: Problem | null = null;
        let nextRetryCount = 0;
        let nextIndex = currentIndex + 1;
        let newScore = score;

        if (isCorrect) {
            // Correct!
            newScore += 1; // Simple scoring
            // Generate NEW TYPE
            // Pick a random topic from the grade
            const topics = TOPICS[currentGrade];
            const randomTopic = topics[Math.floor(Math.random() * topics.length)];
            nextProblem = generateProblem(currentGrade, randomTopic.id);
        } else {
            // Incorrect
            if (retryCount < 2) {
                // Retry same type, different numbers
                nextProblem = generateProblem(currentGrade, currentProblem.type);
                nextRetryCount = retryCount + 1;
                // We stay at the same index? 
                // The user request says: "If incorrect 3 times, move to next problem".
                // "If incorrect, same type but different numbers".
                // This implies we present a *new* problem instance but it counts towards the *same* slot?
                // OR does it mean we just keep adding problems?
                // "1회 평가 시 총 20문제" -> Total 20 problems.
                // If I retry, does it count as one of the 20?
                // Usually, "retry" means you get another chance at the *same* question slot.
                // But "different numbers" means it's technically a new problem.
                // Let's assume: The user has to solve 20 *stages*.
                // In each stage, they have up to 3 attempts.
                // Attempt 1: Problem A. Fail.
                // Attempt 2: Problem A' (Same type, diff nums). Fail.
                // Attempt 3: Problem A'' (Same type, diff nums). Fail.
                // Move to Stage 2.

                // So we should REPLACE the current problem in the array? Or just update the view?
                // To keep history, maybe we should just update the `problems` array at `currentIndex`.

                nextIndex = currentIndex; // Stay on same index
            } else {
                // Failed 3 times. Move to next stage.
                // Generate NEW TYPE for next stage
                const topics = TOPICS[currentGrade];
                const randomTopic = topics[Math.floor(Math.random() * topics.length)];
                nextProblem = generateProblem(currentGrade, randomTopic.id);
            }
        }

        // Check if we reached 20 problems
        // If we are moving to next index and nextIndex >= 20 -> Finish
        if (nextIndex >= 20) {
            set({ isFinished: true, score: newScore });
            return;
        }

        set((state) => {
            const newProblems = [...state.problems];
            if (nextIndex === state.currentIndex) {
                // Retrying: Replace current problem
                newProblems[nextIndex] = nextProblem!;
                // Reset result for this index so user can answer again
                const newResults = [...state.results];
                newResults[nextIndex] = undefined as any; // Reset result
                const newAnswers = [...state.answers];
                newAnswers[nextIndex] = undefined as any; // Reset answer

                const newProblemStartTimes = [...state.problemStartTimes];
                newProblemStartTimes[nextIndex] = Date.now(); // Reset start time for retry

                return {
                    problems: newProblems,
                    retryCount: nextRetryCount,
                    results: newResults,
                    answers: newAnswers,
                    problemStartTimes: newProblemStartTimes,
                };
            } else {
                // Next Stage
                newProblems.push(nextProblem!);
                const newProblemStartTimes = [...state.problemStartTimes];
                newProblemStartTimes[nextIndex] = Date.now();

                return {
                    problems: newProblems,
                    currentIndex: nextIndex,
                    retryCount: 0,
                    score: newScore,
                    problemStartTimes: newProblemStartTimes,
                };
            }
        });
    },

    reset: () => {
        set({
            currentGrade: null,
            problems: [],
            currentIndex: 0,
            answers: [],
            results: [],
            retryCount: 0,
            isFinished: false,
            score: 0,
            sessionStartTime: 0,
            solveTimes: [],
            problemStartTimes: [],
        });
    }
}));
