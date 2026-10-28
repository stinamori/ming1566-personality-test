export type Answers=Record<string,number>;
export type Character={id:string;name:string;title:string;description:string;avatar:string;similarity:number};
export type Result={version:string;questionVersion:string;top:Character;top3:Character[];hidden:boolean;disclaimer:string};
export interface ScoringService {score(answers:Answers,signal?:AbortSignal):Promise<Result>}
export const scoringService:ScoringService={async score(answers,signal){const response=await fetch(import.meta.env.VITE_SCORE_API || '/api/score',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers}),signal});if(!response.ok)throw new Error('暂时无法计算结果，请稍后重试。你的答案已保存在本机。');return response.json();}};
