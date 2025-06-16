// src/components/Admin/NewQuestion.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { toast } from 'sonner';
import { formatISO } from 'date-fns';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function NewQuestion({ onSuccess }) {
  const router = useRouter();


  // form state
  const [qid, setQid] = useState('');
  const [heading, setHeading] = useState('');
  const [detailed, setDetailed] = useState('');
  const [summary, setSummary] = useState('');
  const [pubAt, setPubAt] = useState(
    formatISO(new Date(), { representation: 'date' })
  );
  const [user, setUser] = useState('');
  const [assignT, setAssignT] = useState('false');
  const [subcatId, setSubcatId] = useState('not_select'); // Default to "not_select"
  const [subcats, setSubcats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1) load subcategories from your DB
  useEffect(() => {
    async function loadSubcats() {
      setFetching(true);
      const { data, error } = await supabaseAdmin
        .from('Subcategory')
        .select('Subcat_ID, Subcat_Name')
        .order('Subcat_Name', { ascending: true });

      if (error) {
        console.error('Error fetching subcategories:', error);
        toast.error('Failed to load subcategories');
      } else {
        setSubcats(data || []);
      }
      setFetching(false);
    }
    loadSubcats();
  }, []);

  // 2) handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      Q_ID: Number(qid),
      Q_Heading: heading.trim(),
      Ans_Detailed: detailed.trim(),
      Ans_summary: summary.trim() || null,
      Published_At: pubAt,
      Q_User: user.trim() || null,
      Assign_T: assignT === 'true',
      Subcat_ID: subcatId === 'not_select' ? null : Number(subcatId), // Map "not_select" to null
    };

    const { data, error } = await supabaseAdmin
      .from('QnA')
      .insert(payload)
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Insert QnA error:', error);
      toast.error('Failed to save question: ' + error.message);
    } else {
      toast.success('Question saved (Q_ID: ' + data.Q_ID + ')');
      if (onSuccess) return onSuccess(data);
      return router.push('/admin');
    }
  };

  return (
    <div dir="rtl" className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">نیا سوال درج کریں</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Q_ID */}
        <div>
          <Label htmlFor="qid">سلسلہ نمبر (Q_ID)</Label>
          <Input
            id="qid" type="number" required
            value={qid} onChange={e => setQid(e.target.value)}
            placeholder="مثال: 123" className="mt-1"
          />
        </div>

        {/* Heading */}
        <div>
          <Label htmlFor="heading">سوال (Q_Heading)</Label>
          <Input
            id="heading" required
            value={heading} onChange={e => setHeading(e.target.value)}
            placeholder="سوال درج کریں…" className="mt-1"
          />
        </div>

        {/* Detailed */}
        <div>
          <Label htmlFor="detailed">جواب مفصل (Ans_Detailed)</Label>
          <Textarea
            id="detailed" rows={6} required
            value={detailed} onChange={e => setDetailed(e.target.value)}
            placeholder="مکمل جواب لکھیں…" className="mt-1"
          />
        </div>

        {/* Summary */}
        <div>
          <Label htmlFor="summary">جواب کا خلاصہ (Ans_summary)</Label>
          <Textarea
            id="summary" rows={3}
            value={summary} onChange={e => setSummary(e.target.value)}
            placeholder="اختیاری خلاصہ…" className="mt-1"
          />
        </div>

        {/* Published At */}
        <div>
          <Label htmlFor="pubAt">شائع ہونے کی تاریخ (Published_At)</Label>
          <Input
            id="pubAt" type="date" required
            value={pubAt} onChange={e => setPubAt(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Q_User */}
        <div>
          <Label htmlFor="user">مصنف کا نام (Q_User)</Label>
          <Input
            id="user"
            value={user} onChange={e => setUser(e.target.value)}
            placeholder="مثال: ابن حجر…" className="mt-1"
          />
        </div>

        {/* Assign_T */}
        <div>
          <Label htmlFor="assignT">موضوع (Assign_T)</Label>
          <Select
            id="assignT"
            value={assignT}
            onValueChange={setAssignT}
            className="mt-1 w-48"
          >
            <SelectTrigger>
              <SelectValue placeholder="منتخب کریں…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">احکام و مسائل</SelectItem>
              <SelectItem value="true">تحقیق و تخریج</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory */}
        <div>
          <Label htmlFor="subcat">ذیلی زمرہ (Subcat_ID)</Label>
          <Select
            id="subcat"
            value={subcatId}
            onValueChange={setSubcatId}
            className="mt-1 w-full max-w-sm"
            disabled={fetching}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                fetching ? 'لوڈ ہو رہا ہے…' : 'ذیلی زمرہ منتخب کریں'
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_select">Not_Select</SelectItem>
              {subcats.map((sc) => (
                <SelectItem key={sc.Subcat_ID} value={String(sc.Subcat_ID)}>
                  {sc.Subcat_Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'محفوظ کیا جا رہا ہے…' : 'سوال محفوظ کریں'}
          </Button>
        </div>
      </form>
    </div>
  );
}