import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';

export function QuizView() {
    const {
        currentGrade,
        problems,
        currentIndex,
        results,
        retryCount,
        submitAnswer,
        nextProblem
    } = useStore();

    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const currentProblem = problems[currentIndex];
    const isAnswered = results[currentIndex] !== undefined;
    const isCorrect = results[currentIndex] === true;
    const isIncorrect = results[currentIndex] === false;

    // Reset local state when problem changes
    useEffect(() => {
        setSelectedOption(null);
        setShowExplanation(false);
    }, [currentProblem.id]);

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        submitAnswer(selectedOption);
        setShowExplanation(true);
    };

    const handleNext = () => {
        nextProblem();
    };

    if (!currentProblem) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header: Progress & Status */}
            <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="font-medium text-slate-900">
                    {currentGrade} 과정
                </div>
                <div className="flex items-center gap-4">
                    <span>문제 {currentIndex + 1} / 20</span>
                    {retryCount > 0 && (
                        <span className="text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            재도전 {retryCount}회차
                        </span>
                    )}
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 leading-relaxed">
                        {currentProblem.question}
                    </h2>
                </div>

                <div className="p-6 space-y-3 bg-slate-50/50">
                    {currentProblem.options.map((option, index) => {
                        let optionStyle = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";

                        if (isAnswered) {
                            if (index === currentProblem.correctAnswer) {
                                optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500";
                            } else if (index === selectedOption && index !== currentProblem.correctAnswer) {
                                optionStyle = "border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500";
                            } else {
                                optionStyle = "border-slate-200 opacity-50";
                            }
                        } else if (selectedOption === index) {
                            optionStyle = "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 text-indigo-700";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(index)}
                                disabled={isAnswered}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${optionStyle}`}
                            >
                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${selectedOption === index || (isAnswered && index === currentProblem.correctAnswer)
                                        ? 'bg-current text-white'
                                        : 'bg-slate-200 text-slate-600'
                                    }`}>
                                    {index + 1}
                                </span>
                                <span className="font-medium text-lg">{option}</span>

                                {isAnswered && index === currentProblem.correctAnswer && (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto" />
                                )}
                                {isAnswered && index === selectedOption && index !== currentProblem.correctAnswer && (
                                    <XCircle className="w-5 h-5 text-rose-600 ml-auto" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Feedback & Actions */}
            <div className="space-y-4">
                {isAnswered && (
                    <div className={`p-4 rounded-xl flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                        }`}>
                        {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                        ) : (
                            <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
                        )}
                        <div>
                            <p className="font-bold mb-1">
                                {isCorrect ? '정답입니다!' : '오답입니다.'}
                            </p>
                            <p className="text-sm opacity-90">
                                {currentProblem.explanation}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    {!isAnswered ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            제출하기
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
                        >
                            {isCorrect ? '다음 문제' : retryCount < 2 ? '다시 도전하기' : '다음 문제로 넘어가기'}
                            {isCorrect ? <ArrowRight className="w-4 h-4" /> : retryCount < 2 ? <RotateCcw className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
