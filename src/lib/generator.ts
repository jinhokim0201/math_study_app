import { Grade, Problem } from './types';

// Helper to get random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper to shuffle array
const shuffle = <T>(array: T[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

type GeneratorResult = Omit<Problem, 'id' | 'type' | 'grade'>;

// Helper for advanced problems
const getAdvancedChance = () => Math.random() < 0.7; // 70% chance for advanced

const generators: Record<string, () => GeneratorResult> = {
    // --- Middle 1 ---
    'm1_integer': () => {
        // Simple addition/subtraction of integers
        const a = getRandomInt(-10, 10);
        const b = getRandomInt(-10, 10);
        const op = Math.random() > 0.5 ? '+' : '-';
        const ans = op === '+' ? a + b : a - b;

        const question = `다음 식을 계산하시오: ${a} ${op} (${b})`;
        const options = shuffle([ans, ans + 1, ans - 1, ans + 2]);

        return {
            question,
            options: options.map(String),
            correctAnswer: options.indexOf(ans),
            explanation: `${a} ${op} (${b}) = ${ans}`,
            difficulty: 'Basic'
        };
    },
    'm1_integer_adv': () => {
        // Advanced: -2^2 + (-3) x 4 - (-5)
        const a = getRandomInt(2, 5);
        const b = getRandomInt(2, 5);
        const c = getRandomInt(2, 5);
        const d = getRandomInt(2, 5);

        // Expression: -a^2 + (-b) * c - (-d)
        // Note: -a^2 is -(a^2)
        const val1 = -(a * a);
        const val2 = (-b) * c;
        const val3 = d; // -(-d) = +d

        const ans = val1 + val2 + val3;

        const question = `다음 식을 계산하시오: -${a}² + (-${b}) × ${c} - (-${d})`;
        const options = shuffle([ans, ans + 10, ans - 10, -(ans)].map(String));

        return {
            question,
            options,
            correctAnswer: options.indexOf(String(ans)),
            explanation: `-${a}² = ${val1}, (-${b})×${c} = ${val2}, -(-${d}) = +${d} 이므로 ${val1} + (${val2}) + ${d} = ${ans}`,
            difficulty: 'Advanced'
        };
    },
    'm1_equation': () => {
        // ax + b = c
        const x = getRandomInt(-5, 5);
        const a = getRandomInt(2, 5) * (Math.random() > 0.5 ? 1 : -1);
        const b = getRandomInt(-10, 10);
        const c = a * x + b;

        const question = `다음 일차방정식의 해를 구하시오: ${a}x ${b >= 0 ? '+' : ''}${b} = ${c}`;
        const options = shuffle([x, x + 1, x - 1, -x]);

        return {
            question,
            options: options.map(String),
            correctAnswer: options.indexOf(x),
            explanation: `${a}x = ${c - b} -> x = ${x}`,
            difficulty: 'Basic'
        };
    },
    'm1_equation_adv': () => {
        // Advanced: Application problem
        // A student walked at x km/h for 2 hours, then ran at (x+2) km/h for 1 hour. Total distance 14km.
        const walkSpeed = getRandomInt(3, 5);
        const runSpeed = walkSpeed + 2;
        const totalDist = walkSpeed * 2 + runSpeed * 1;

        const question = `어떤 학생이 시속 ${walkSpeed}km로 2시간 걷고, 시속 (${walkSpeed}+2)km로 1시간 뛰었더니 총 ${totalDist}km를 이동했다. 이때 걷는 속력(x)을 구하는 방정식으로 옳은 것은? (단, x=${walkSpeed})`;
        const ans = `2x + 1(x+2) = ${totalDist}`;
        const wrong1 = `2(x+2) + 1x = ${totalDist}`;
        const wrong2 = `x/2 + (x+2)/1 = ${totalDist}`;
        const wrong3 = `2x - 1(x+2) = ${totalDist}`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `거리 = 속력 × 시간이므로, 걷는 거리(2x) + 뛰는 거리(1(x+2)) = ${totalDist}이다.`,
            difficulty: 'Advanced'
        };
    },
    'm1_function': () => {
        // Quadrant check
        const x = getRandomInt(-10, 10) || 1;
        const y = getRandomInt(-10, 10) || 1;
        let quadrant = '';
        if (x > 0 && y > 0) quadrant = '제1사분면';
        else if (x < 0 && y > 0) quadrant = '제2사분면';
        else if (x < 0 && y < 0) quadrant = '제3사분면';
        else quadrant = '제4사분면';

        const question = `점 (${x}, ${y})는 어느 사분면 위의 점인가?`;
        const options = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];

        return {
            question,
            options,
            correctAnswer: options.indexOf(quadrant),
            explanation: `x좌표가 ${x > 0 ? '양수' : '음수'}이고 y좌표가 ${y > 0 ? '양수' : '음수'}이므로 ${quadrant}이다.`,
            difficulty: 'Basic'
        };
    },

    // --- Middle 2 ---
    'm2_rational': () => {
        // Finite decimal check
        // Which fraction can be represented as a finite decimal?
        // Simplified logic: generate one finite, 3 infinite
        const finite = ['1/2', '1/4', '1/5', '1/8', '1/10'];
        const infinite = ['1/3', '1/6', '1/7', '1/9', '1/11', '1/12'];

        const ans = finite[getRandomInt(0, finite.length - 1)];
        const others = shuffle(infinite).slice(0, 3);
        const options = shuffle([ans, ...others]);

        return {
            question: '다음 중 유한소수로 나타낼 수 있는 분수는?',
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `${ans}는 분모의 소인수가 2나 5뿐이므로 유한소수이다.`,
            difficulty: 'Basic'
        };
    },
    'm2_inequality': () => {
        // ax < b
        // const x = getRandomInt(-5, 5); // Unused
        // const a = getRandomInt(2, 5) * -1; // Unused
        // const b = a * x + getRandomInt(1, 5); // Unused
        // Let's solve ax > b
        // -2x > 4 -> x < -2

        const targetX = getRandomInt(-5, 5);
        const coeff = -2;
        const rhs = coeff * targetX;

        const question = `부등식 ${coeff}x < ${rhs} 의 해는?`;
        const ans = `x > ${targetX}`;
        const wrong1 = `x < ${targetX}`;
        const wrong2 = `x > ${-targetX}`;
        const wrong3 = `x < ${-targetX}`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `양변을 ${coeff}로 나누면 부등호 방향이 바뀌어 ${ans}가 된다.`,
            difficulty: 'Basic'
        };
    },
    'm2_inequality_adv': () => {
        // Advanced: 0.5x - 1/3 > 1/6 x + 1
        // Multiply by 6 -> 3x - 2 > x + 6 -> 2x > 8 -> x > 4
        const question = `일차부등식 0.5x - 1/3 > 1/6 x + 1 의 해는?`;
        const ans = `x > 4`;
        const wrong1 = `x < 4`;
        const wrong2 = `x > -4`;
        const wrong3 = `x < -4`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `양변에 6을 곱하면 3x - 2 > x + 6 이 되고, 정리하면 2x > 8 이므로 x > 4 이다.`,
            difficulty: 'Advanced'
        };
    },
    'm2_linear_function': () => {
        // Slope and y-intercept
        const a = getRandomInt(-5, 5) || 1;
        const b = getRandomInt(-5, 5);

        const question = `일차함수 y = ${a}x ${b >= 0 ? '+' : ''}${b} 의 기울기와 y절편은?`;
        const ans = `기울기: ${a}, y절편: ${b}`;
        const wrong1 = `기울기: ${b}, y절편: ${a}`;
        const wrong2 = `기울기: ${-a}, y절편: ${b}`;
        const wrong3 = `기울기: ${a}, y절편: ${-b}`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `y = ax + b 에서 기울기는 a, y절편은 b이다.`,
            difficulty: 'Basic'
        };
    },
    'm2_linear_function_adv': () => {
        // Advanced: Find area of triangle formed by y = -2x + 4 and axes
        const question = `일차함수 y = -2x + 4 의 그래프와 x축, y축으로 둘러싸인 삼각형의 넓이는?`;
        const ans = '4';
        const wrong1 = '2';
        const wrong2 = '8';
        const wrong3 = '6';

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `x절편은 2, y절편은 4이므로 넓이는 1/2 × 2 × 4 = 4 이다.`,
            difficulty: 'Advanced'
        };
    },

    // --- Middle 3 ---
    'm3_root': () => {
        // Square root calculation
        const base = getRandomInt(2, 9);
        const sq = base * base;

        const question = `√${sq} 의 값은?`;
        const ans = base;
        const options = shuffle([ans, -ans, sq, base * 2].map(String));

        return {
            question,
            options,
            correctAnswer: options.indexOf(String(ans)),
            explanation: `√${sq} = ${base}`,
            difficulty: 'Basic'
        };
    },
    'm3_factorization': () => {
        // x^2 + (a+b)x + ab
        const a = getRandomInt(1, 5);
        const b = getRandomInt(1, 5);
        const sum = a + b;
        const prod = a * b;

        const question = `x² + ${sum}x + ${prod} 을 인수분해하면?`;
        const ans = `(x+${a})(x+${b})`;
        const wrong1 = `(x-${a})(x-${b})`;
        const wrong2 = `(x+${a})(x-${b})`;
        const wrong3 = `(x-${a})(x+${b})`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `합이 ${sum}, 곱이 ${prod}인 두 수는 ${a}, ${b}이다.`,
            difficulty: 'Basic'
        };
    },
    'm3_quadratic': () => {
        // Roots of x^2 - a^2 = 0
        const a = getRandomInt(2, 9);
        const question = `이차방정식 x² - ${a * a} = 0 의 해는?`;
        const ans = `x = ±${a}`;
        const wrong1 = `x = ${a}`;
        const wrong2 = `x = -${a}`;
        const wrong3 = `x = ±${a * a}`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `x² = ${a * a} 이므로 x = ±${a}`,
            difficulty: 'Basic'
        };
    },
    'm3_quadratic_adv': () => {
        // Advanced: Roots of 2x^2 - 5x + 1 = 0 (Formula)
        const question = `이차방정식 2x² - 5x + 1 = 0 의 해는?`;
        const ans = `(5 ± √17) / 4`;
        const wrong1 = `(5 ± √13) / 4`;
        const wrong2 = `(-5 ± √17) / 4`;
        const wrong3 = `(5 ± √21) / 4`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `근의 공식에 대입하면 x = (5 ± √(25 - 8)) / 4 = (5 ± √17) / 4`,
            difficulty: 'Advanced'
        };
    },

    // --- High 1 ---
    'h1_polynomial': () => {
        // Remainder theorem
        // Find remainder when x^3 + ax + b is divided by x-1
        const a = getRandomInt(1, 5);
        const b = getRandomInt(1, 5);
        const f = (x: number) => x * x * x + a * x + b;
        const remainder = f(1);

        const question = `다항식 P(x) = x³ + ${a}x + ${b} 를 x-1로 나눈 나머지는?`;
        const options = shuffle([remainder, remainder + 1, remainder - 1, remainder + 2].map(String));

        return {
            question,
            options,
            correctAnswer: options.indexOf(String(remainder)),
            explanation: `나머지 정리에 의해 P(1) = 1 + ${a} + ${b} = ${remainder}`,
            difficulty: 'Basic'
        };
    },
    'h1_polynomial_adv': () => {
        // Advanced: P(x) divided by (x-1)(x-2) remainder
        const question = `다항식 P(x)를 x-1로 나누면 나머지가 3이고, x-2로 나누면 나머지가 5이다. P(x)를 (x-1)(x-2)로 나누었을 때의 나머지는?`;
        const ans = `2x + 1`;
        const wrong1 = `x + 2`;
        const wrong2 = `2x - 1`;
        const wrong3 = `3x`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `나머지를 ax+b라 하면, a+b=3, 2a+b=5. 연립하면 a=2, b=1.`,
            difficulty: 'Advanced'
        };
    },
    'h1_complex': () => {
        // i^n
        const n = getRandomInt(10, 100);
        const rem = n % 4;
        let ans = '';
        if (rem === 0) ans = '1';
        else if (rem === 1) ans = 'i';
        else if (rem === 2) ans = '-1';
        else ans = '-i';

        const question = `i^${n} 의 값은? (단, i = √-1)`;
        const options = ['1', '-1', 'i', '-i'];

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `i의 거듭제곱은 i, -1, -i, 1 이 반복된다. ${n} = 4k + ${rem} 이므로 답은 ${ans}`,
            difficulty: 'Basic'
        };
    },
    'h1_inequality': () => {
        // |x| < a
        const a = getRandomInt(2, 9);
        const question = `부등식 |x| < ${a} 의 해는?`;
        const ans = `-${a} < x < ${a}`;
        const wrong1 = `x < -${a} 또는 x > ${a}`;
        const wrong2 = `x < ${a}`;
        const wrong3 = `x > -${a}`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `절댓값의 성질에 의해 -${a} < x < ${a} 이다.`,
            difficulty: 'Basic'
        };
    },

    // --- High 2 ---
    'h2_exponent': () => {
        // log_2(8)
        const base = 2;
        const exp = getRandomInt(2, 5);
        const val = Math.pow(base, exp);

        const question = `log₂${val} 의 값은?`;
        const options = shuffle([exp, exp + 1, exp - 1, exp * 2].map(String));

        return {
            question,
            options,
            correctAnswer: options.indexOf(String(exp)),
            explanation: `2^${exp} = ${val} 이므로 log₂${val} = ${exp}`,
            difficulty: 'Basic'
        };
    },
    'h2_trigonometry': () => {
        // sin(30), cos(60), etc.
        const angles = [30, 45, 60];
        const angle = angles[getRandomInt(0, 2)];
        const type = Math.random() > 0.5 ? 'sin' : 'cos';

        let ansVal = '';
        if (type === 'sin') {
            if (angle === 30) ansVal = '1/2';
            if (angle === 45) ansVal = '√2/2';
            if (angle === 60) ansVal = '√3/2';
        } else {
            if (angle === 30) ansVal = '√3/2';
            if (angle === 45) ansVal = '√2/2';
            if (angle === 60) ansVal = '1/2';
        }

        const question = `${type}(${angle}°) 의 값은?`;
        const options = shuffle(['1/2', '√2/2', '√3/2', '1']);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ansVal),
            explanation: `특수각의 삼각비 값을 암기해야 한다.`,
            difficulty: 'Basic'
        };
    },
    'h2_sequence': () => {
        // Arithmetic sequence an = a + (n-1)d
        const a = getRandomInt(1, 5);
        const d = getRandomInt(2, 5);
        const n = getRandomInt(5, 10);
        const an = a + (n - 1) * d;

        const question = `첫째항이 ${a}, 공차가 ${d}인 등차수열의 제${n}항은?`;
        const options = shuffle([an, an + d, an - d, an + 1].map(String));

        return {
            question,
            options,
            correctAnswer: options.indexOf(String(an)),
            explanation: `an = ${a} + (${n}-1)*${d} = ${an}`,
            difficulty: 'Basic'
        };
    },
    'h2_sequence_adv': () => {
        // Advanced: Sum of arithmetic sequence
        const question = `첫째항이 1이고 제10항이 19인 등차수열의 첫째항부터 제10항까지의 합은?`;
        const ans = '100';
        const wrong1 = '90';
        const wrong2 = '110';
        const wrong3 = '95';

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `S10 = 10(1 + 19) / 2 = 100`,
            difficulty: 'Advanced'
        };
    },

    // --- High 3 ---
    'h3_limit': () => {
        // lim n->inf (2n+1)/(n+3)
        const a = getRandomInt(2, 5);
        const b = getRandomInt(1, 5);
        const c = getRandomInt(1, 5);

        const question = `lim(n→∞) (${a}n + ${b}) / (n + ${c}) 의 값은?`;
        const options = shuffle([a, a + 1, 0, 1].map(String));

        return {
            question,
            options,
            correctAnswer: options.indexOf(String(a)),
            explanation: `최고차항의 계수비 ${a}/1 = ${a}`,
            difficulty: 'Basic'
        };
    },
    'h3_differentiation': () => {
        // f(x) = x^n -> f'(x)
        const n = getRandomInt(2, 5);
        const question = `f(x) = x^${n} 일 때, f'(x)는?`;
        const ans = `${n}x^${n - 1}`;
        const wrong1 = `x^${n - 1}`;
        const wrong2 = `${n}x^${n}`;
        const wrong3 = `${n - 1}x^${n}`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `(x^n)' = nx^(n-1)`,
            difficulty: 'Basic'
        };
    },
    'h3_differentiation_adv': () => {
        // Advanced: Slope of tangent at x=1 for y=x^2 + 3x
        const question = `곡선 y = x² + 3x 위의 점 (1, 4)에서의 접선의 기울기는?`;
        const ans = '5';
        const wrong1 = '4';
        const wrong2 = '3';
        const wrong3 = '2';

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `y' = 2x + 3 이므로 x=1 대입하면 2(1) + 3 = 5`,
            difficulty: 'Advanced'
        };
    },
    'h3_integration': () => {
        // Integral x^n dx
        const n = getRandomInt(1, 4);
        const question = `∫ x^${n} dx = ? (단, C는 적분상수)`;
        const ans = `(1/${n + 1})x^${n + 1} + C`;
        const wrong1 = `x^${n + 1} + C`;
        const wrong2 = `${n}x^${n - 1} + C`;
        const wrong3 = `(1/${n})x^${n + 1} + C`;

        const options = shuffle([ans, wrong1, wrong2, wrong3]);

        return {
            question,
            options,
            correctAnswer: options.indexOf(ans),
            explanation: `∫ x^n dx = (1/(n+1))x^(n+1) + C`,
            difficulty: 'Basic'
        };
    },
};

export const generateProblem = (grade: Grade, type: string): Problem => {
    // Check if we should swap to an advanced version
    // If the requested type has an advanced counterpart and we roll the 70% chance
    let targetType = type;
    const advancedType = `${type}_adv`;

    // Only swap if we are NOT explicitly asking for a specific advanced type (e.g. retry)
    // and if an advanced generator exists.
    if (!type.endsWith('_adv') && generators[advancedType]) {
        if (getAdvancedChance()) {
            targetType = advancedType;
        }
    }

    const generator = generators[targetType];
    if (!generator) {
        // Fallback if type not found (try basic if advanced failed?)
        const fallbackGenerator = generators[type];
        if (fallbackGenerator) {
            const result = fallbackGenerator();
            return {
                id: Math.random().toString(36).substr(2, 9),
                type,
                grade,
                ...result,
                difficulty: 'Basic' // Explicitly set basic for fallback
            };
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            type,
            grade,
            difficulty: 'Basic',
            question: '문제 생성 오류',
            options: ['1', '2', '3', '4'],
            correctAnswer: 0,
            explanation: '해당 유형의 문제 생성기가 없습니다.'
        };
    }

    const result = generator();
    return {
        id: Math.random().toString(36).substr(2, 9),
        type: targetType, // Use the actual type generated
        grade,
        ...result
    };
};
