'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { setLeadStatusAction, deleteLeadAction, type LeadStatus } from '@/lib/actions/leads';
import { Button, Table, Td, Th } from '@/components/admin/ui';

export type Lead = {
  id: string;
  name: string | null;
  phone: string;
  comment: string | null;
  locale: string | null;
  page: string | null;
  status: LeadStatus;
  created_at: string;
};

const STATUSES: { value: LeadStatus; label: string; cls: string }[] = [
  { value: 'new', label: 'Нова', cls: 'bg-brand text-white border-brand' },
  { value: 'in_progress', label: 'В роботі', cls: 'bg-ink text-white border-ink' },
  { value: 'done', label: 'Закрита', cls: 'bg-ash text-ink border-hair-l' },
];

function StatusButton({
  current,
  onSet,
}: {
  current: LeadStatus;
  onSet: (s: LeadStatus) => void;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-1">
      {STATUSES.map((s) => (
        <button
          key={s.value}
          type="button"
          disabled={pending}
          onClick={() => start(() => onSet(s.value))}
          aria-pressed={current === s.value}
          className={`h-6 border px-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-opacity ${
            current === s.value
              ? s.cls
              : 'border-hair-l bg-paper text-ink-2 hover:text-ink'
          } ${pending ? 'opacity-50 cursor-wait' : ''}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function LeadsClient({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initial);
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [newCount, setNewCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Supabase Realtime ──
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('leads-admin')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          const row = payload.new as Lead;
          setLeads((prev) => {
            if (prev.some((l) => l.id === row.id)) return prev;
            return [row, ...prev];
          });
          setNewCount((n) => n + 1);
          // мягкий «дзынь» через WebAudio (без зависимостей)
          try {
            const ctx = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g);
            g.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = 880;
            g.gain.setValueAtTime(0.04, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
          } catch {}
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => {
          const row = payload.new as Lead;
          setLeads((prev) => prev.map((l) => (l.id === row.id ? row : l)));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'leads' },
        (payload) => {
          const id = (payload.old as { id: string }).id;
          setLeads((prev) => prev.filter((l) => l.id !== id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return leads;
    return leads.filter((l) => l.status === filter);
  }, [leads, filter]);

  const counts = useMemo(() => {
    const out: Record<LeadStatus | 'all', number> = {
      all: leads.length,
      new: 0,
      in_progress: 0,
      done: 0,
    };
    for (const l of leads) out[l.status]++;
    return out;
  }, [leads]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(['all', 'new', 'in_progress', 'done'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`h-8 border px-3 font-mono text-[11px] uppercase tracking-[0.14em] ${
              filter === f
                ? 'border-ink bg-ink text-white'
                : 'border-hair-l bg-paper text-ink hover:bg-ash'
            }`}
          >
            {f === 'all' ? 'Усі' : STATUSES.find((s) => s.value === f)?.label}
            <span className="ml-2 text-[10px] text-ink-2">{counts[f]}</span>
          </button>
        ))}
        {newCount > 0 ? (
          <button
            type="button"
            onClick={() => setNewCount(0)}
            className="ml-auto h-8 border border-brand bg-brand/10 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-brand"
          >
            +{newCount} нових · скинути
          </button>
        ) : null}
      </div>

      <Table>
        <thead>
          <tr>
            <Th className="w-[140px]">Дата</Th>
            <Th className="w-[180px]">Телефон</Th>
            <Th className="w-[160px]">Імʼя</Th>
            <Th>Коментар</Th>
            <Th className="w-[80px]">Стор.</Th>
            <Th className="w-[260px]">Статус</Th>
            <Th className="w-[120px] text-right">Дії</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <Td className="text-center text-ink-2">Поки немає заявок.</Td>
              <Td /><Td /><Td /><Td /><Td /><Td />
            </tr>
          ) : (
            filtered.map((l) => (
              <tr key={l.id} className={l.status === 'new' ? 'bg-brand/5' : ''}>
                <Td className="font-mono text-[12px] text-ink-2 tabular-nums whitespace-nowrap">
                  {formatDate(l.created_at)}
                </Td>
                <Td>
                  <a
                    href={`tel:${l.phone.replace(/\s/g, '')}`}
                    className="font-mono text-[13px] hover:text-brand"
                  >
                    {l.phone}
                  </a>
                </Td>
                <Td>{l.name || <span className="text-ink-2">—</span>}</Td>
                <Td className="max-w-[420px] whitespace-pre-wrap text-[13px] text-ink">
                  {l.comment || <span className="text-ink-2">—</span>}
                </Td>
                <Td className="font-mono text-[11px] text-ink-2">
                  {l.locale ? `${l.locale} ` : ''}
                  {l.page ?? ''}
                </Td>
                <Td>
                  <StatusButton
                    current={l.status}
                    onSet={async (s) => {
                      // оптимистично
                      setLeads((prev) =>
                        prev.map((x) => (x.id === l.id ? { ...x, status: s } : x))
                      );
                      try {
                        await setLeadStatusAction(l.id, s);
                      } catch {
                        // откатываем
                        setLeads((prev) =>
                          prev.map((x) => (x.id === l.id ? { ...x, status: l.status } : x))
                        );
                      }
                    }}
                  />
                </Td>
                <Td className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-brand hover:bg-brand/10"
                    onClick={() => {
                      if (!window.confirm('Видалити цю заявку?')) return;
                      setLeads((prev) => prev.filter((x) => x.id !== l.id));
                      deleteLeadAction(l.id).catch(() => {
                        // при ошибке вернём — но проще обновить страницу
                      });
                    }}
                  >
                    ✕
                  </Button>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
