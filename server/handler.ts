import type {Request,Response} from 'express';
import {evaluate} from './engine';
export function scoreHandler(req:Request,res:Response){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST') {res.setHeader('Allow','POST');res.status(405).json({error:'仅支持POST'});return;}
 try{res.json(evaluate(req.body?.answers));}catch{res.status(400).json({error:'请检查答案：必须完成40题，每题为0–5的整数。'});}
}
