'use client';
import { useEffect } from 'react';

export function AdSocialBar() {
  useEffect(() => {
    const srcs = ["https://pl29147392.profitablecpmratenetwork.com/70/27/81/70278129ba7115f3ce78669aff751c45.js", "https://pl29147395.profitablecpmratenetwork.com/14/4f/a9/144fa9b4502a3bbafda1b3d1dd382e90.js"];
    const scripts = srcs.map((src) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      document.head.appendChild(s);
      return s;
    });
    return () => scripts.forEach((s) => s.parentNode?.removeChild(s));
  }, []);
  return null;
}
