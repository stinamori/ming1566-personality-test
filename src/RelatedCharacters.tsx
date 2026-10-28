import type {Result} from './service';
import {characterInsights} from './characterInsights';

export function RelatedCharacters({result}: {result: Result}) {
  return <>
    <section className="runners"><h2>你也有他们的影子</h2><div>
      {result.top3.slice(1).map((person, i) => <article key={person.id}>
        <img src={person.avatar} alt={person.name}/>
        <div><small>TOP {i + 2}</small><h3>{person.name}</h3><p>{characterInsights[person.id]?.title || person.title}</p></div>
        <b>{person.similarity}%</b>
      </article>)}
    </div></section>
    {result.hidden && <section className="easter"><img src="/assets/characters/世子.png" alt="世子"/><div><small>隐藏彩蛋已解锁</small><h2>世子 · 赤子之心</h2><p>你的开放、信任与好奇，让你保留了一份未被世故磨平的底色。</p></div></section>}
  </>;
}
