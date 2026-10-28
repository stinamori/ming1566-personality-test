import {test} from 'node:test';import assert from 'node:assert/strict';import {loadProgress,saveProgress} from '../src/storage';
let value='';Object.defineProperty(globalThis,'localStorage',{value:{getItem:()=>value,setItem:(_k:string,v:string)=>{value=v}},configurable:true});
test('损坏的本地数据安全回退，不能跳过未完成题',()=>{value='{broken';assert.deepEqual(loadProgress(),{answers:{},index:0});value=JSON.stringify({answers:{Q01:3,Q02:99},index:39});assert.deepEqual(loadProgress(),{answers:{Q01:3},index:1});});
test('0分也正确保存和恢复',()=>{saveProgress({Q01:0},1);assert.deepEqual(loadProgress(),{answers:{Q01:0},index:1});});
