'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { uploadMediaAction } from '@/lib/actions/storage';

/**
 * Поле для нескольких изображений. Хранит массив URL в локальном state,
 * на каждое — hidden input name="images" (множественный).
 * Cover — отдельный input name="cover", выбирается тиком на одной из миниатюр.
 */
export default function ImagesField({
  initialImages = [],
  initialCover = null,
}: {
  initialImages?: string[];
  initialCover?: string | null;
}) {
  const [images, setImages] = useState<string[]>(initialImages.filter(Boolean));
  const [cover, setCover] = useState<string | null>(
    initialCover || initialImages[0] || null
  );
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;
    setError(null);
    start(async () => {
      for (const file of files) {
        const fd = new FormData();
        fd.set('file', file);
        const res = await uploadMediaAction(fd);
        if (!res.ok) {
          setError(`Не вдалося завантажити: ${res.error}`);
          continue;
        }
        setImages((prev) => {
          const next = [...prev, res.url];
          if (!cover) setCover(res.url);
          return next;
        });
      }
    });
  };

  const remove = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
    if (cover === url) {
      setCover(images.find((u) => u !== url) ?? null);
    }
  };

  const move = (idx: number, dir: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">
        Фото проєкту
      </label>

      <input type="hidden" name="cover" value={cover ?? ''} />
      {images.map((url) => (
        <input key={url} type="hidden" name="images" value={url} />
      ))}

      {images.length === 0 ? (
        <p className="mb-3 border border-dashed border-hair-l p-4 text-[13px] text-ink-2">
          Ще немає завантажених фото.
        </p>
      ) : (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, idx) => (
            <div
              key={url}
              className={`relative border ${cover === url ? 'border-brand' : 'border-hair-l'} bg-paper`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between border-t border-hair-l p-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setCover(url)}
                  className={`font-mono uppercase tracking-[0.12em] ${cover === url ? 'text-brand' : 'text-ink-2 hover:text-ink'}`}
                >
                  {cover === url ? '★ обкл.' : '☆ обкл.'}
                </button>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    className="px-1 text-ink-2 hover:text-ink"
                    aria-label="вгору"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    className="px-1 text-ink-2 hover:text-ink"
                    aria-label="вниз"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(url)}
                    className="px-1 text-brand"
                    aria-label="видалити"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <label
          className={`inline-flex h-10 cursor-pointer items-center justify-center border border-hair-l bg-transparent px-4 font-mono text-[13px] uppercase tracking-[0.12em] text-ink hover:bg-ash ${
            pending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPick}
            disabled={pending}
            className="hidden"
          />
          {pending ? 'Завантаження…' : '+ Додати фото'}
        </label>
        {error ? <span className="text-[12px] text-brand">{error}</span> : null}
      </div>
    </div>
  );
}
