'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGrid, FiChevronDown, FiChevronUp, FiTrash } from 'react-icons/fi';
import { Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function BookmarkAccordion({ item, onDelete }) {
  const [open, setOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(item);
    setIsDeleting(false);
    setShowDialog(false);
  };

  return (
    <li className="bg-white rounded-xl shadow-sm mb-4">
      <div onClick={() => setOpen(v => !v)} className="flex items-center justify-between p-4 cursor-pointer">
        <div className="flex flex-col w-full justify-center items-start gap-2">
          <Link
            href={`/questions/${item.q_id}`}
            className="text-[16px] font-[600] text-[#111928] line-clamp-2 hover:text-primary transition"
          >
            {item.q_heading}
          </Link>
          <span className="text-[13px] line-clamp-2 leading-7 text-gray-500">{item.q_detailed}...</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
          className="p-1 rounded hover:bg-gray-100 transition"
          aria-label={open ? 'Hide details' : 'Show details'}
        >
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {open && (
        <div className="border-t flex pt-2 px-4 pb-4 text-gray-700 items-center text-[14px]">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <div
                onClick={() => setShowDialog(true)}
                className='flex gap-2 hover:bg-gray-100 hover:text-red-600 rounded-lg px-3 py-1.5 text-center items-center cursor-pointer'
              >
                <FiTrash /> حذف
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>کیا آپ واقعی حذف کرنا چاہتے ہیں؟</DialogTitle>
                <DialogDescription>
                  یہ جواب بُک مارک سے ہٹا دیا جائے گا۔ اس عمل کو واپس نہیں کیا جا سکتا۔
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowDialog(false)} disabled={isDeleting}>
                  منسوخ کریں
                </Button>
                <Button onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? 'حذف ہو رہا ہے...' : 'حذف کریں'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </li>
  );
}

export default function BookmarkPanel() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch('/api/bookmark')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load bookmarks');
        return res.json();
      })
      .then(data => {
        setBookmarks(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const deleteBookmark = async (item) => {
    const questionId = item.q_id;
    const res = await fetch('/api/bookmark', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId })
    });
    if (res.ok) {
      toast.success('Bookmark removed');
      setBookmarks(prev => prev.filter(b => b.q_id !== questionId));
    } else {
      toast.error('Failed to remove bookmark');
    }
  };

  return (
    <div className="relative w-full font-arabic mx-auto bg-white rounded-2xl shadow-md h-[600px] p-6 pt-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">محفوظ جوابات</h1>
        <button
          onClick={() => router.push('/ur/bookmark')}
          className="inline-flex items-center gap-1 px-4 py-1.5 border rounded-full hover:bg-gray-100 transition"
        >
          <FiGrid className="text-lg text-primary" /> تمام
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
          <Spinner aria-label="Loading bookmarks" size="md" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500">{error}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        <ul>
          {bookmarks.map((item) => (
            <BookmarkAccordion key={item.q_id} item={item} onDelete={deleteBookmark} />
          ))}
        </ul>
      </div>
    </div>
  );
}
