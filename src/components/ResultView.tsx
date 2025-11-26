import { useState } from 'react';
import { useStore } from '../lib/store';
import { Trophy, RefreshCw, Home, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, BarChart3, Target } from 'lucide-react';
import { TOPICS } from '../lib/curriculum';

export function ResultView() {
    const { score, reset, currentGrade, problems, results, answers, solveTimes, sessionStartTime } = useStore();
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

    // Calculate metrics
    const totalQuestions = 20;
    const percentage = Math.round((score / totalQuestions) * 100);
    const totalTimeMs = Date.now() - sessionStartTime;
    const totalTimeSec = Math.floor(totalTimeMs / 1000);
    const avgTimeSec = Math.floor(totalTimeSec / totalQuestions);

    // Format time helper
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}분 ${s}초`;
    };

    // Topic Analysis
    const topicStats = problems.reduce((acc, problem, index) => {
        const topicId = problem.type;
        if (!acc[topicId]) {
            // Find topic name
            const topicDef = TOPICS[currentGrade!]?.find(t => t.id === topicId);
            acc[topicId] = {
                name: topicDef ? topicDef.title : topicId,
                total: 0,
                correct: 0
            };
        }
        acc[topicId].total++;
        if (results[index]) acc[topicId].correct++;
        return acc;
    }, {} as Record<string, { name: string, total: number, correct: number }>);

    const topicList = Object.values(topicStats);

    // Message logic
    let message = '';
    if (percentage >= 90) message = '대단해요! 완벽에 가깝습니다.';
    else if (percentage >= 70) message = '잘했어요! 조금만 더 노력하면 되겠어요.';
    else if (percentage >= 50) message = '수고했어요. 기초를 조금 더 다져볼까요?';
    else message = '힘내세요! 꾸준히 하면 실력이 늘 거예요.';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-8 px-4">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                    <Trophy className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">학습 결과 리포트</h1>
                <p className="text-slate-500">
                    {new Date().toLocaleDateString()} • {currentGrade} 과정
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                    <div className="text-slate-500 text-sm font-medium mb-2">총 점수</div>
                    <div className="text-4xl font-bold text-indigo-600 mb-1">{score} <span className="text-lg text-slate-400">/ {totalQuestions}</span></div>
                    <div className={`text-sm font-bold px-3 py-1 rounded-full ${percentage >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        정답률 {percentage}%
                    </div>
                </div>

                {/* Time Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <div className="text-slate-500 text-sm font-medium mb-2">학습 시간</div>
                    <div className="text-2xl font-bold text-slate-800 mb-1">{formatTime(totalTimeSec)}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        문제당 평균 {avgTimeSec}초
                    </div>
                </div>

                {/* Analysis Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                    <div className="text-slate-500 text-sm font-medium mb-2">종합 분석</div>
                    <p className="text-slate-700 font-medium leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>

            {/* Topic Analysis */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-400" />
                    <h3 className="font-bold text-slate-800">단원별 성취도</h3>
                </div>
                <div className="p-6 space-y-4">
                    {topicList.map((topic, idx) => {
                        const topicPct = Math.round((topic.correct / topic.total) * 100);
                        return (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700">{topic.name}</span>
                                    <span className="text-slate-500">{topic.correct}/{topic.total} ({topicPct}%)</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${topicPct >= 80 ? 'bg-emerald-500' : topicPct >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                        style={{ width: `${topicPct}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed Question Review */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-slate-400" />
                    <h3 className="font-bold text-slate-800">문항별 상세 분석</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {problems.map((problem, idx) => {
                        const isCorrect = results[idx];
                        const isExpanded = expandedQuestion === idx;
                        const timeTaken = solveTimes[idx] ? Math.floor(solveTimes[idx] / 1000) : 0;

                        return (
                            <div key={problem.id} className="group">
                                <button
                                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-700">문제 {idx + 1}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                                <span>{TOPICS[currentGrade!]?.find(t => t.id === problem.type.replace('_adv', ''))?.title || problem.type}</span>
                                                {problem.difficulty === 'Advanced' && (
                                                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px]">심화</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-slate-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {timeTaken}초
                                        </div>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="px-4 pb-4 pl-16 bg-slate-50/50">
                                        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                                            <p className="font-medium text-slate-800 text-lg">{problem.question}</p>
                                            <div className="space-y-2">
                                                {problem.options.map((opt, optIdx) => (
                                                    <div
                                                        key={optIdx}
                                                        className={`p-3 rounded-lg border text-sm ${optIdx === problem.correctAnswer
                                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium'
                                                            : optIdx === answers[idx]
                                                                ? 'bg-red-50 border-red-200 text-red-700'
                                                                : 'bg-white border-slate-100 text-slate-500'
                                                            }`}
                                                    >
                                                        <span className="mr-2">{optIdx + 1}.</span>
                                                        {opt}
                                                        {optIdx === problem.correctAnswer && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">정답</span>}
                                                        {optIdx === answers[idx] && optIdx !== problem.correctAnswer && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">내가 쓴 답</span>}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <div className="text-sm font-bold text-indigo-600 mb-1">해설</div>
                                                <p className="text-slate-600 text-sm">{problem.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4 pb-12">
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm"
                >
                    <Home className="w-4 h-4" />
                    홈으로
                </button>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    다시 학습하기
                </button>
            </div>
        </div>
    );
}
