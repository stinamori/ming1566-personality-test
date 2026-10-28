import {useId, useState, type ReactNode} from 'react';
import {characterInsights} from './characterInsights';

const tabs = ['底色', '优势', '相处', '提醒', '相似人物'];
export function CharacterInterpretation({id, fallback, related}: {id: string; fallback: string; related: ReactNode}) {
  const insight = characterInsights[id];
  const [selected, setSelected] = useState(0);
  const uid = useId();
  return <section className="interpretation" aria-labelledby={`${uid}-title`}>
    <h2 id={`${uid}-title`}>你的处世底色</h2>
    {insight && <ul className="personality-tags" aria-label="性格特质">{insight.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
    <div className="detail-tabs" role="tablist" aria-label="人物解读分类">
      {tabs.map((label, i) => <button key={label} type="button" role="tab" id={`${uid}-tab-${i}`} aria-controls={`${uid}-panel-${i}`} aria-selected={selected === i} tabIndex={selected === i ? 0 : -1}
        onClick={() => setSelected(i)} onKeyDown={e => {
          if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
          e.preventDefault();
          const next = e.key === 'Home' ? 0 : e.key === 'End' ? 4 : (selected + (e.key === 'ArrowRight' ? 1 : 4)) % 5;
          setSelected(next);
          (e.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
        }}>{label}</button>)}
    </div>
    <div className="detail-pages">
      <div className={`detail-panel ${selected === 0 ? 'is-active' : ''}`} id={`${uid}-panel-0`} aria-labelledby={`${uid}-tab-0`}>
        <p className="interpretation-overview">{insight?.overview || fallback}</p>
      </div>
      {insight && <>
        <div className={`detail-panel insight-section ${selected === 1 ? 'is-active' : ''}`} id={`${uid}-panel-1`} aria-labelledby={`${uid}-tab-1`}>
          <h3>你身上值得珍惜的优势</h3><ul className="strength-list">{insight.strengths.map(strength => <li key={strength}>{strength}</li>)}</ul>
        </div>
        <div className={`detail-panel insight-section ${selected === 2 ? 'is-active' : ''}`} id={`${uid}-panel-2`} aria-labelledby={`${uid}-tab-2`}><h3>与人相处时的你</h3><p>{insight.relationships}</p></div>
        <aside className={`detail-panel reflection ${selected === 3 ? 'is-active' : ''}`} id={`${uid}-panel-3`} aria-labelledby={`${uid}-tab-3`}><h3>给你的一点小提醒</h3><p>{insight.reflection}</p></aside>
      </>}
      <div className={`detail-panel detail-related ${selected === 4 ? 'is-active' : ''}`} id={`${uid}-panel-4`} aria-labelledby={`${uid}-tab-4`}>{related}</div>
    </div>
    <p className="hint interpretation-note">人物相似描述的是处事倾向，不代表你认同角色的全部行为。这是一面认识自己的镜子，不是对你的定论。</p>
  </section>;
}
