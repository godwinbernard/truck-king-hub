import React from 'react';

const ICONS: Record<string, string> = {
  truck: '🚛', money: '💰', shield: '🛡️', clock: '🕐',
  check: '✅', warning: '⚠️', fuel: '⛽', chart: '📊',
  wrench: '🔧', doc: '📋', star: '⭐', phone: '📞',
  map: '🗺️', key: '🔑', fire: '🔥', bolt: '⚡',
  info: 'ℹ️', tip: '💡', people: '👥', package: '📦',
};

export function renderBody(body: string) {
  const paragraphs = body.split(/\n\n+/);
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const trimmed = paragraphs[i].trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-black uppercase mt-12 mb-3 text-white flex items-center gap-3" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.02em' }}>
          <span className="w-1 h-7 shrink-0 rounded-sm" style={{ background: '#F5C518' }} />
          {trimmed.slice(3)}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h3 key={i} className="text-lg font-black uppercase mt-8 mb-2" style={{ fontFamily: 'system-ui, sans-serif', color: '#e5e7eb', letterSpacing: '0.02em' }}>
          {trimmed.slice(2)}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="text-base font-bold mt-6 mb-2" style={{ color: '#F5C518' }}>
          {trimmed.slice(4)}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith('> ')) {
      elements.push(
        <div key={i} className="my-6 p-5 flex gap-4 items-start" style={{ background: 'rgba(245,197,24,0.08)', borderLeft: '4px solid #F5C518' }}>
          <span className="text-xl shrink-0">💡</span>
          <p className="text-sm leading-relaxed font-medium italic" style={{ color: '#e5e7eb' }}>{trimmed.slice(2)}</p>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('!! ')) {
      elements.push(
        <div key={i} className="my-6 p-5 flex gap-4 items-start" style={{ background: 'rgba(220,38,38,0.08)', borderLeft: '4px solid #dc2626' }}>
          <span className="text-xl shrink-0">⚠️</span>
          <p className="text-sm leading-relaxed font-medium" style={{ color: '#fca5a5' }}>{trimmed.slice(3)}</p>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith(':: ')) {
      elements.push(
        <div key={i} className="my-6 p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#F5C518' }}>⚡ Key Takeaway</p>
          <p className="text-base font-bold text-white leading-snug">{trimmed.slice(3)}</p>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('$$')) {
      const parts = trimmed.slice(2).split('|');
      const val = parts[0]?.trim();
      const label = parts[1]?.trim();
      elements.push(
        <div key={i} className="my-4 inline-flex items-center gap-4 px-6 py-4" style={{ background: '#1a1a1a', border: '1px solid rgba(245,197,24,0.3)' }}>
          <span className="font-black text-3xl leading-none" style={{ color: '#F5C518', fontFamily: 'Impact, sans-serif' }}>{val}</span>
          {label && <span className="text-sm font-bold text-white uppercase tracking-wide">{label}</span>}
        </div>
      );
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter((l) => /^\d+\.\s/.test(l));
      elements.push(
        <ol key={i} className="my-4 space-y-3">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 flex items-center justify-center text-xs font-black" style={{ background: '#F5C518', color: '#0d0d0d' }}>{j + 1}</span>
              <span className="text-sm leading-relaxed pt-0.5" style={{ color: '#d1d5db' }}>{item.replace(/^\d+\.\s/, '')}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
      elements.push(
        <ul key={i} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#F5C518' }} />
              <span>{item.slice(2)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (trimmed.startsWith('>>> ')) {
      const rest = trimmed.slice(4);
      const colonIdx = rest.indexOf(':');
      const iconKey = colonIdx > -1 ? rest.slice(0, colonIdx).trim() : 'bolt';
      const text = colonIdx > -1 ? rest.slice(colonIdx + 1).trim() : rest;
      const emoji = ICONS[iconKey] ?? '⚡';
      elements.push(
        <div key={i} className="flex items-start gap-3 my-3 p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <span className="text-xl shrink-0">{emoji}</span>
          <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>{text}</p>
        </div>
      );
      continue;
    }

    if (trimmed === '---') {
      elements.push(<hr key={i} className="my-10" style={{ borderColor: '#2a2a2a' }} />);
      continue;
    }

    const rendered = trimmed
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e5e7eb">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
    elements.push(
      <p key={i} className="text-base leading-relaxed my-4" style={{ color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: rendered }} />
    );
  }

  return elements;
}

export function ArticleBodyRenderer({ body }: { body: string }) {
  return <>{renderBody(body)}</>;
}
