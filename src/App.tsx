import { useState } from 'react';
import { Layout } from './components/Layout';
import { GradeSelector } from './components/GradeSelector';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { useStore } from './lib/store';

function App() {
    const { currentGrade, isFinished } = useStore();

    return (
        <Layout>
            {!currentGrade && <GradeSelector />}
            {currentGrade && !isFinished && <QuizView />}
            {currentGrade && isFinished && <ResultView />}
        </Layout>
    );
}

export default App;
