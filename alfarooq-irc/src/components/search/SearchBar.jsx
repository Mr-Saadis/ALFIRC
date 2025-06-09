'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchBar({ onSearch }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [pathname, searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onSearch?.({ q: trimmed });
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md md:flex">
      <Input
        dir="rtl"
        placeholder="تلاش کریں..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-full pr-4 rtl:placeholder:text-right"
      />
      <Button type="submit" size="icon" variant="ghost" className="absolute left-1 top-1/2 -translate-y-1/2 text-primary">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
