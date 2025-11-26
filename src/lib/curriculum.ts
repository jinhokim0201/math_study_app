import { Grade, CurriculumTopic } from './types';

export const GRADES: { id: Grade; label: string }[] = [
    { id: 'Middle1', label: '중학교 1학년' },
    { id: 'Middle2', label: '중학교 2학년' },
    { id: 'Middle3', label: '중학교 3학년' },
    { id: 'High1', label: '고등학교 1학년' },
    { id: 'High2', label: '고등학교 2학년' },
    { id: 'High3', label: '고등학교 3학년' },
];

export const TOPICS: Record<Grade, CurriculumTopic[]> = {
    Middle1: [
        { id: 'm1_integer', title: '정수와 유리수', grade: 'Middle1' },
        { id: 'm1_equation', title: '일차방정식', grade: 'Middle1' },
        { id: 'm1_function', title: '좌표평면과 그래프', grade: 'Middle1' },
    ],
    Middle2: [
        { id: 'm2_rational', title: '유리수와 순환소수', grade: 'Middle2' },
        { id: 'm2_inequality', title: '일차부등식', grade: 'Middle2' },
        { id: 'm2_linear_function', title: '일차함수', grade: 'Middle2' },
    ],
    Middle3: [
        { id: 'm3_root', title: '제곱근과 실수', grade: 'Middle3' },
        { id: 'm3_factorization', title: '인수분해', grade: 'Middle3' },
        { id: 'm3_quadratic', title: '이차방정식', grade: 'Middle3' },
    ],
    High1: [
        { id: 'h1_polynomial', title: '다항식의 연산', grade: 'High1' },
        { id: 'h1_complex', title: '복소수', grade: 'High1' },
        { id: 'h1_inequality', title: '여러 가지 부등식', grade: 'High1' },
    ],
    High2: [
        { id: 'h2_exponent', title: '지수함수와 로그함수', grade: 'High2' },
        { id: 'h2_trigonometry', title: '삼각함수', grade: 'High2' },
        { id: 'h2_sequence', title: '수열', grade: 'High2' },
    ],
    High3: [
        { id: 'h3_limit', title: '수열의 극한', grade: 'High3' },
        { id: 'h3_differentiation', title: '미분법', grade: 'High3' },
        { id: 'h3_integration', title: '적분법', grade: 'High3' },
    ],
};
