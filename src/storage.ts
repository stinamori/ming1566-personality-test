import questions from './questions.json';
import type {Answers} from './service';
const KEY='ming1566:progress:v4';
export function loadProgress():{answers:Answers;index:number}{try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');const answers:Answers={};for(const q of questions){const n=raw.answers?.[q.id];if(Number.isInteger(n)&&n>=0&&n<=5)answers[q.id]=n;}const first=questions.findIndex(q=>answers[q.id]===undefined);return {answers,index:Math.max(0,Math.min(Number.isInteger(raw.index)?raw.index:0,first<0?39:first))};}catch{return {answers:{},index:0};}}
export function saveProgress(answers:Answers,index:number){try{localStorage.setItem(KEY,JSON.stringify({answers,index}));return true;}catch{return false;}}
