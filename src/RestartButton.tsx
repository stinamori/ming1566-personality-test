import {useEffect, useRef, useState} from 'react';
import {saveProgress} from './storage';

export function RestartButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {if (open) dialog.current?.showModal();}, [open]);
  function restart() {
    if (!saveProgress({}, 0)) {setError('暂时无法清除本机进度，请检查浏览器存储设置后重试。'); return;}
    window.location.assign('/quiz');
  }
  return <>
    <button className="restart-button" onClick={() => {setError(''); setOpen(true);}}>重新开始</button>
    {open && <dialog ref={dialog} className="restart-dialog" aria-labelledby="restart-title" onCancel={() => setOpen(false)}>
      <h2 id="restart-title">重新认识一次自己</h2>
      <p>重新开始将清除这次的答案，从第一题开始。</p>
      {error && <p role="alert">{error}</p>}
      <div className="restart-dialog-actions">
        <button autoFocus className="restart-cancel" onClick={() => setOpen(false)}>保留进度</button>
        <button className="primary" onClick={restart}>确认重新开始</button>
      </div>
    </dialog>}
  </>;
}
