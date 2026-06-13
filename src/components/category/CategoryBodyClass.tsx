'use client';

import { useEffect } from 'react';

export default function CategoryBodyClass() {
  useEffect(() => {
    document.body.classList.add('cat-page');

    return () => {
      document.body.classList.remove('cat-page');
      document.body.style.overflow = '';
    };
  }, []);

  return null;
}
