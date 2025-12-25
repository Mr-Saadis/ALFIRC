// // src/components/Admin/NewQuestion.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabaseAdmin } from '@/lib/supabase';
// import { toast } from 'sonner';
// import { formatISO } from 'date-fns';

// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';

// export default function NewQuestion({ onSuccess }) {
//   const router = useRouter();


//   // form state
//   const [qid, setQid] = useState('');
//   const [heading, setHeading] = useState('');
//   const [detailed, setDetailed] = useState('');
//   const [summary, setSummary] = useState('');
//   const [pubAt, setPubAt] = useState(
//     formatISO(new Date(), { representation: 'date' })
//   );
//   const [user, setUser] = useState('');
//   const [assignT, setAssignT] = useState('false');
//   const [subcatId, setSubcatId] = useState('not_select'); // Default to "not_select"
//   const [subcats, setSubcats] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   // 1) load subcategories from your DB
//   useEffect(() => {
//     async function loadSubcats() {
//       setFetching(true);
//       const { data, error } = await supabaseAdmin
//         .from('Subcategory')
//         .select('Subcat_ID, Subcat_Name')
//         .order('Subcat_Name', { ascending: true });

//       if (error) {
//         console.error('Error fetching subcategories:', error);
//         toast.error('Failed to load subcategories');
//       } else {
//         setSubcats(data || []);
//       }
//       setFetching(false);
//     }
//     loadSubcats();
//   }, []);

//   // 2) handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       Q_ID: Number(qid),
//       Q_Heading: heading.trim(),
//       Ans_Detailed: detailed.trim(),
//       Ans_summary: summary.trim() || null,
//       Published_At: pubAt,
//       Q_User: user.trim() || null,
//       Assign_T: assignT === 'true',
//       Subcat_ID: subcatId === 'not_select' ? null : Number(subcatId), // Map "not_select" to null
//     };

//     const { data, error } = await supabaseAdmin
//       .from('QnA')
//       .insert(payload)
//       .select()
//       .single();

//     setLoading(false);

//     if (error) {
//       console.error('Insert QnA error:', error);
//       toast.error('Failed to save question: ' + error.message);
//     } else {
//       toast.success('Question saved (Q_ID: ' + data.Q_ID + ')');
//       if (onSuccess) return onSuccess(data);
//       return router.push('/admin');
//     }
//   };

//   return (
//     <div dir="rtl" className="max-w-3xl mx-auto p-4 font-arabic">
//       <h2 className="text-2xl font-bold mb-6">نیا سوال درج کریں</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Q_ID */}
//         <div>
//           <Label htmlFor="qid">سلسلہ نمبر (Q_ID)</Label>
//           <Input
//             id="qid" type="number" required
//             value={qid} onChange={e => setQid(e.target.value)}
//             placeholder="مثال: 123" className="mt-1"
//           />
//         </div>

//         {/* Heading */}
//         <div>
//           <Label htmlFor="heading">سوال (Q_Heading)</Label>
//           <Input
//             id="heading" required
//             value={heading} onChange={e => setHeading(e.target.value)}
//             placeholder="سوال درج کریں…" className="mt-1"
//           />
//         </div>

//         {/* Detailed */}
//         <div>
//           <Label htmlFor="detailed">جواب مفصل (Ans_Detailed)</Label>
//           <Textarea
//             id="detailed" rows={6} required
//             value={detailed} onChange={e => setDetailed(e.target.value)}
//             placeholder="مکمل جواب لکھیں…" className="mt-1"
//           />
//         </div>

//         {/* Summary */}
//         <div>
//           <Label htmlFor="summary">جواب کا خلاصہ (Ans_summary)</Label>
//           <Textarea
//             id="summary" rows={3}
//             value={summary} onChange={e => setSummary(e.target.value)}
//             placeholder="اختیاری خلاصہ…" className="mt-1"
//           />
//         </div>

//         {/* Published At */}
//         <div>
//           <Label htmlFor="pubAt">شائع ہونے کی تاریخ (Published_At)</Label>
//           <Input
//             id="pubAt" type="date" required
//             value={pubAt} onChange={e => setPubAt(e.target.value)}
//             className="mt-1"
//           />
//         </div>

//         {/* Q_User */}
//         <div>
//           <Label htmlFor="user">مصنف کا سوال (Q_User)</Label>
//           <Textarea
//             id="user" rows={6}
//             value={user} onChange={e => setUser(e.target.value)}
//             placeholder="مثال: سوال …" className="mt-1"
//           />
//         </div>

//         {/* Assign_T */}
//         <div>
//           <Label htmlFor="assignT">موضوع (Assign_T)</Label>
//           <Select
//             id="assignT"
//             value={assignT}
//             onValueChange={setAssignT}
//             className="mt-1 w-48"
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="منتخب کریں…" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="false">احکام و مسائل</SelectItem>
//               <SelectItem value="true">تحقیق و تخریج</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Subcategory */}
//         <div>
//           <Label htmlFor="subcat">ذیلی زمرہ (Subcat_ID)</Label>
//           <Select
//             id="subcat"
//             value={subcatId}
//             onValueChange={setSubcatId}
//             className="mt-1 w-full max-w-sm"
//             disabled={fetching}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder={
//                 fetching ? 'لوڈ ہو رہا ہے…' : 'ذیلی زمرہ منتخب کریں'
//               } />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="not_select">Not_Select</SelectItem>
//               {subcats.map((sc) => (
//                 <SelectItem key={sc.Subcat_ID} value={String(sc.Subcat_ID)}>
//                   {sc.Subcat_Name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Submit */}
//         <div className="flex justify-end">
//           <Button type="submit" disabled={loading}>
//             {loading ? 'محفوظ کیا جا رہا ہے…' : 'سوال محفوظ کریں'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }


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
  const [subcatId, setSubcatId] = useState('not_select');
  
  // Helper states
  const [subcats, setSubcats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1) Load Subcategories
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

  // 2) Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validation Check ---
    // نوٹ: یہاں سے (!user) ہٹا دیا ہے کیونکہ اب یہ لازمی نہیں رہا
    if (!qid || !heading || !detailed || !pubAt) {
        toast.error('براہ کرم وہ تمام خانے پر کریں جن پر (*) لگا ہوا ہے!');
        return; 
    }

    setLoading(true);

    const payload = {
      Q_ID: Number(qid),
      Q_Heading: heading.trim(),
      Ans_Detailed: detailed.trim(),
      Ans_summary: summary.trim() || null,
      Published_At: pubAt,
      Q_User: user.trim() || null, // اگر خالی ہو تو null چلا جائے گا
      Assign_T: assignT === 'true',
      Subcat_ID: subcatId === 'not_select' ? null : Number(subcatId),
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
      toast.success('سوال کامیابی سے محفوظ ہو گیا (Q_ID: ' + data.Q_ID + ')');
      if (onSuccess) return onSuccess(data);
      return router.push('/admin');
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-4xl mx-auto p-3 md:p-6 font-arabic pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            نیا سوال درج کریں
          </h2>
          <span className="text-sm text-gray-500 block mt-1">
            جن فیلڈز کے ساتھ <span className="text-red-500 font-bold">*</span> ہے، وہ پر کرنا لازمی ہیں۔
          </span>
        </div>
        
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="w-full md:w-auto"
        >
          واپس جائیں
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        
        {/* Q_ID */}
        <div>
          <Label htmlFor="qid" className="text-base font-medium">
            سلسلہ نمبر (Q_ID) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="qid" type="number" 
            value={qid} onChange={e => setQid(e.target.value)}
            placeholder="مثال: 123" 
            className="mt-1.5 text-base py-3 md:py-2"
          />
        </div>

        {/* Heading */}
        <div>
          <Label htmlFor="heading" className="text-base font-medium">
            سوال کا عنوان (Q_Heading) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="heading" 
            value={heading} onChange={e => setHeading(e.target.value)}
            placeholder="عنوان درج کریں…" 
            className="mt-1.5 text-base py-3 md:py-2"
          />
        </div>

        {/* Q_User (Optional - No Star) */}
        <div>
          <Label htmlFor="user" className="text-base font-medium">
            سائل کا سوال (Q_User) <span className="text-xs text-gray-400">(اختیاری)</span>
          </Label>
          <Textarea
            id="user" 
            rows={4}
            value={user} onChange={e => setUser(e.target.value)}
            placeholder="سائل کا اصل سوال یہاں درج کریں (اگر موجود ہو)..." 
            className="mt-1.5 text-base"
          />
        </div>

        {/* Detailed Answer */}
        <div>
          <Label htmlFor="detailed" className="text-base font-medium">
            جواب مفصل (Ans_Detailed) <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="detailed" rows={10} 
            value={detailed} onChange={e => setDetailed(e.target.value)}
            placeholder="مکمل جواب لکھیں…" 
            className="mt-1.5 text-base"
          />
        </div>

        {/* Summary Answer (Optional) */}
        <div>
          <Label htmlFor="summary" className="text-base font-medium">
            جواب کا خلاصہ (Ans_summary) <span className="text-xs text-gray-400">(اختیاری)</span>
          </Label>
          <Textarea
            id="summary" rows={3}
            value={summary} onChange={e => setSummary(e.target.value)}
            placeholder="اختیاری خلاصہ…" 
            className="mt-1.5 text-base"
          />
        </div>

        {/* 2 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            
            {/* Published At */}
            <div>
            <Label htmlFor="pubAt" className="text-base font-medium">
                شائع ہونے کی تاریخ <span className="text-red-500">*</span>
            </Label>
            <Input
                id="pubAt" type="date" 
                value={pubAt} onChange={e => setPubAt(e.target.value)}
                className="mt-1.5 py-2.5"
            />
            </div>

            {/* Assign_T */}
            <div>
            <Label htmlFor="assignT" className="text-base font-medium">موضوع (Assign_T)</Label>
            <Select
                value={assignT}
                onValueChange={setAssignT}
            >
                <SelectTrigger className="mt-1.5 w-full py-2.5 h-11">
                <SelectValue placeholder="منتخب کریں…" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="false">احکام و مسائل</SelectItem>
                <SelectItem value="true">تحقیق و تخریج</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

        {/* Subcategory */}
        <div>
          <Label htmlFor="subcat" className="text-base font-medium">ذیلی زمرہ (Subcat_ID)</Label>
          <Select
            value={subcatId}
            onValueChange={setSubcatId}
            disabled={fetching}
          >
            <SelectTrigger className="mt-1.5 w-full h-11">
              <SelectValue placeholder={fetching ? 'لوڈ ہو رہا ہے…' : 'ذیلی زمرہ منتخب کریں'} />
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

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-end pt-6 border-t mt-4 gap-3">
          <Button 
            variant="ghost" 
            type="button" 
            onClick={() => router.back()}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
             منسوخ کریں
          </Button>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto min-w-[150px] order-1 sm:order-2 h-11 sm:h-10 text-base"
          >
            {loading ? 'محفوظ کیا جا رہا ہے…' : 'سوال محفوظ کریں'}
          </Button>
        </div>
      </form>
    </div>
  );
}