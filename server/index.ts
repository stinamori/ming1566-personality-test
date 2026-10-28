import express from 'express';
import path from 'node:path';
import {scoreHandler} from './handler';
const app=express();app.disable('x-powered-by');app.use(express.json({limit:'16kb'}));app.all('/api/score',scoreHandler);app.use(express.static(path.resolve('dist')));app.get('*',(_req,res)=>res.sendFile(path.resolve('dist/index.html')));app.use((err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{res.status(400).json({error:'无效的请求内容'});});app.listen(Number(process.env.PORT)||3001,'0.0.0.0',()=>console.log('Scoring API: http://localhost:3001'));
