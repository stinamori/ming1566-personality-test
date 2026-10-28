/** V4 pilot scoring, CommonJS for Node/WeChat cloud function; no external dependencies.
 * This is a fiction-character resemblance index, NOT a statistical probability.
 */
const bank = require('./questions.v4.json');
const chars = require('./characters.v4.json');
const clamp = (x,lo,hi) => Math.max(lo,Math.min(hi,x));
const normalized = (answer,direction) => direction === -1 ? 5-answer : answer;
const DIM_KEYS = Object.keys(bank.meta.dimensions);
const FEAT_KEYS = Object.keys(bank.meta.features);
function calculateScores(answers) {
  const dimNumer = Object.fromEntries(DIM_KEYS.map(k=>[k,0]));
  const dimDenom = Object.fromEntries(DIM_KEYS.map(k=>[k,0]));
  const featNumer = Object.fromEntries(FEAT_KEYS.map(k=>[k,0]));
  const featDenom = Object.fromEntries(FEAT_KEYS.map(k=>[k,0]));
  for(const q of bank.questions) {
    const val=answers[q.id];
    if(!Number.isInteger(val) || val<0 || val>5) throw new Error('无效或缺失答案: '+q.id);
    for(const s of q.scoring){
      const isDim=s.key.startsWith('D');
      const num=isDim?dimNumer:featNumer, den=isDim?dimDenom:featDenom;
      num[s.key]+=normalized(val,s.direction)*s.weight;
      den[s.key]+=s.weight;
    }
  }
  const dimensions=Object.fromEntries(DIM_KEYS.map(k=>[k,dimDenom[k]?dimNumer[k]/dimDenom[k]:null]));
  const features=Object.fromEntries(FEAT_KEYS.map(k=>[k,featDenom[k]?featNumer[k]/featDenom[k]:null]));
  return {dimensions,features,dimension_coverage:dimDenom,feature_coverage:featDenom};
}
function scoreCharacter(profile, character){
  // Shared-coverage dimensional distance; score gives a readable 0..100 resemblance index.
  let sq=0, weight=0;
  for(const k of DIM_KEYS){
    if(profile.dimensions[k]===null) continue;
    const w=1; // Future validation may supply per-character weights, not yet claimed valid.
    sq+=w*(profile.dimensions[k]-character.dimensions[k])**2;
    weight+=w;
  }
  const dimSimilarity=clamp(100-20*Math.sqrt(sq/weight),0,100);
  // Small secondary calibration only. Undefined character traits use neutral 2.5,
  // not 0, so an undocumented feature is not treated as absence of a trait.
  let fsq=0,fw=0;
  for(const k of FEAT_KEYS){
    if(k==='F6' || profile.features[k]===null) continue;
    const target=Object.prototype.hasOwnProperty.call(character.features,k)?character.features[k]:2.5;
    fsq+=(profile.features[k]-target)**2;fw++;
  }
  const featureSimilarity=fw?clamp(100-20*Math.sqrt(fsq/fw),0,100):dimSimilarity;
  const similarity=Math.round(0.9*dimSimilarity+0.1*featureSimilarity);
  return {id:character.id,name:character.name,title:character.title,description:character.description,avatar:character.avatar,similarity};
}
function hiddenEligible(profile) {
  // F6 requires Q38 and Q40 both at least 4, and compatible low-control/low-ambition
  // scores. Symbolic, not a peer ranked against 21 adult characters.
  return profile.features.F6>=4 && profile.dimensions.D2<=2.0 && profile.dimensions.D7<=2.0 && profile.dimensions.D8>=3.5;
}
function getResult(answers){
  const profile=calculateScores(answers);
  const ranking=chars.characters.filter(c=>!c.is_hidden).map(c=>scoreCharacter(profile,c)).sort((a,b)=>b.similarity-a.similarity);
  const hidden=hiddenEligible(profile);
  // Hidden can be shown as optional Easter egg, while regular top3 remain visible.
  return {version:chars.version,questionVersion:bank.meta.version,top:ranking[0],top3:ranking.slice(0,3),hidden,profile,disclaimer:bank.meta.notice};
}
module.exports={calculateScores,scoreCharacter,getResult,hiddenEligible};
