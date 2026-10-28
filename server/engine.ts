import scoring from './data/scoring.cjs';
import bank from './data/questions.v4.json' with { type: 'json' };
export type Answers = Record<string,number>;
export function validateAnswers(value: unknown): asserts value is Answers {
 if(!value || typeof value!=='object' || Array.isArray(value)) throw new Error('请提交40道题的答案');
 const answers=value as Answers;
 if(Object.keys(answers).length!==40 || bank.questions.some(q=>!Object.hasOwn(answers,q.id)||!Number.isInteger(answers[q.id])||answers[q.id]<0||answers[q.id]>5)) throw new Error('答案必须包含全部40题，且为0–5的整数');
}
export function evaluate(value:unknown) {validateAnswers(value); const r=scoring.getResult(value); return {version:r.version,questionVersion:r.questionVersion,top:r.top,top3:r.top3,hidden:r.hidden,disclaimer:r.disclaimer};}
