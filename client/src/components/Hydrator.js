'use client';
import { useEffect } from 'react';
import useStore from '../store/useStore';

export default function Hydrator() {
  const hydrate = useStore((s) => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
  return null;
}
