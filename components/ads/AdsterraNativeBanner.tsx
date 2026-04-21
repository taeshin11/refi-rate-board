'use client';
import { useEffect, useRef } from 'react';

export function AdsterraNativeBanner() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || ref.current.dataset.loaded) return;
    ref.current.dataset.loaded = '1';
    const s = document.createElement('script');
    s.async = true; s.setAttribute('data-cfasync', 'false');
    s.src = 'https://pl29147393.profitablecpmratenetwork.com/dff8e313c169ef76d5d12532b7ab5d2e/invoke.js';
    ref.current.appendChild(s);
  }, []);
  return <div ref={ref} id="container-dff8e313c169ef76d5d12532b7ab5d2e" style={{ margin: '1.5rem 0', minHeight: '90px' }} />;
}
