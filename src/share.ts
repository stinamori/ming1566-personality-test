import QRCode from 'qrcode';
import type {Result} from './service';
export async function createPoster(result:Result):Promise<string>{
 await document.fonts.load('72px MingDisplay');
 const c=document.createElement('canvas');c.width=900;c.height=1440;const x=c.getContext('2d')!;
 x.fillStyle='#f7f0e3';x.fillRect(0,0,900,1440);x.strokeStyle='#b59a65';x.lineWidth=2;x.strokeRect(38,38,824,1364);
 x.fillStyle='#8f2525';x.fillRect(65,65,770,110);x.fillStyle='#f7f0e3';x.font='28px serif';x.fillText('大 明 人 格  /  1 5 6 6',110,132);
 x.fillStyle='#8f2525';x.font='34px serif';x.fillText('在大明的众生相里，遇见自己',95,245);
 const image=new Image();image.src=result.top.avatar;await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('头像加载失败，请重试'));});const ratio=Math.min(530/image.width,530/image.height);x.drawImage(image,(900-image.width*ratio)/2,290,image.width*ratio,image.height*ratio);
 x.textAlign='center';x.font='72px MingDisplay, serif';x.fillText(result.top.name,450,915);x.font='30px serif';x.fillStyle='#a57a38';x.fillText(result.top.title,450,980);x.fillStyle='#8f2525';x.font='48px serif';x.fillText(`人物匹配度 ${result.top.similarity}%`,450,1060);
 const url=new URL('/',window.location.href).href;const qr=await QRCode.toDataURL(url,{width:150,margin:1,color:{dark:'#8f2525',light:'#f7f0e3'}});const qi=new Image();qi.src=qr;await qi.decode();x.drawImage(qi,650,1165,150,150);x.textAlign='left';x.font='26px serif';x.fillText('测测你最像',95,1210);x.fillText('《大明王朝1566》里的谁',95,1255);x.font='19px sans-serif';x.fillStyle='#887667';x.fillText('娱乐测试 · 匹配分数并非科学概率',95,1350);return c.toDataURL('image/png');
}
