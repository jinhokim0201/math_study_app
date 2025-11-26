import { GRADES } from '../lib/curriculum';
import { useStore } from '../lib/store';
import { GraduationCap, BookOpen, ChevronRight } from 'lucide-react';

export function GradeSelector() {
    const { startSession } = useStore();

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2 py-8">
                <h1 className="text-3xl font-bold text-slate-900">학년을 선택하세요</h1>
                <p className="text-slate-500">학습하고 싶은 학년을 선택하면 진단 평가가 시작됩니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GRADES.map((grade) => (
                    <button
                        key={grade.id}
                        onClick={() => startSession(grade.id)}
                        className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 text-left flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${grade.id.startsWith('Middle')
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-indigo-50 text-indigo-600'
                                }`}>
                                {grade.id.startsWith('Middle') ? <BookOpen className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {grade.label}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    {grade.id.startsWith('Middle') ? '중등 수학 과정' : '고등 수학 과정'}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </button>
                ))}
            </div>
        </div>
    );
}
