// // src/components/Admin/UpdateQuestion.jsx

// 'use client'

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { supabaseAdmin } from '@/lib/supabase';
// import { toast } from 'sonner';
// import { formatISO } from 'date-fns';

// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';

// export default function UpdateQuestion() {
//   const router = useRouter();
//   const { id } = useParams(); // Get the question ID from the URL params

//   // Form state
//   const [qid, setQid] = useState('');
//   const [heading, setHeading] = useState('');
//   const [detailed, setDetailed] = useState('');
//   const [summary, setSummary] = useState('');
//   const [pubAt, setPubAt] = useState(formatISO(new Date(), { representation: 'date' }));
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

//   // Fetch question data to prefill the form when page loads
//   useEffect(() => {
//     async function fetchData() {
//       const { data, error } = await supabaseAdmin
//         .from('QnA')
//         .select('*')
//         .eq('Q_ID', id)
//         .single();
      
//       if (error) {
//         console.error('Error fetching question:', error);
//         toast.error('Failed to fetch question');
//         return;
//       }

//       setQid(data.Q_ID);
//       setHeading(data.Q_Heading);
//       setDetailed(data.Ans_Detailed);
//       setSummary(data.Ans_summary);
//       setPubAt(data.Published_At);
//       setUser(data.Q_User);
//       setAssignT(data.Assign_T ? 'true' : 'false');
//       setSubcatId(data.Subcat_ID ?? 'not_select');
//     }

//     if (id) {
//       fetchData();
//     }
//   }, [id]);

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
//       .update(payload)
//       .eq('Q_ID', qid) // Update the record with the matching Q_ID
//       .select()
//       .single();

//     setLoading(false);

//     if (error) {
//       console.error('Update QnA error:', error);
//       toast.error('Failed to update question: ' + error.message);
//     } else {
//       toast.success('Question updated (Q_ID: ' + data.Q_ID + ')');
//       router.push('/admin');
//     }
//   };

//   return (
//     <div dir="rtl" className="max-w-3xl mx-auto p-4 font-arabic">
//       <h2 className="text-2xl font-bold mb-6">سوال کو اپڈیٹ کریں</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Q_ID */}
//         <div>
//           <Label htmlFor="qid">سلسلہ نمبر (Q_ID)</Label>
//           <Input
//             id="qid" type="number" required
//             value={qid} onChange={(e) => setQid(e.target.value)}
//             placeholder="مثال: 123" className="mt-1"
//           />
//         </div>

//         {/* Heading */}
//         <div>
//           <Label htmlFor="heading">سوال (Q_Heading)</Label>
//           <Input
//             id="heading" required
//             value={heading} onChange={(e) => setHeading(e.target.value)}
//             placeholder="سوال درج کریں…" className="mt-1"
//           />
//         </div>

//         {/* Detailed */}
//         <div>
//           <Label htmlFor="detailed">جواب مفصل (Ans_Detailed)</Label>
//           <Textarea
//             id="detailed" rows={6} required
//             value={detailed} onChange={(e) => setDetailed(e.target.value)}
//             placeholder="مکمل جواب لکھیں…" className="mt-1"
//           />
//         </div>

//         {/* Summary */}
//         <div>
//           <Label htmlFor="summary">جواب کا خلاصہ (Ans_summary)</Label>
//           <Textarea
//             id="summary" rows={3}
//             value={summary} onChange={(e) => setSummary(e.target.value)}
//             placeholder="اختیاری خلاصہ…" className="mt-1"
//           />
//         </div>

//         {/* Published At */}
//         <div>
//           <Label htmlFor="pubAt">شائع ہونے کی تاریخ (Published_At)</Label>
//           <Input
//             id="pubAt" type="date" required
//             value={pubAt} onChange={(e) => setPubAt(e.target.value)}
//             className="mt-1"
//           />
//         </div>

//         {/* Q_User */}
//         <div>
//           <Label htmlFor="user">مصنف کا نام (Q_User)</Label>
//           <Input
//             id="user"
//             value={user} onChange={(e) => setUser(e.target.value)}
//             placeholder="مثال: ابن حجر…" className="mt-1"
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

// // src/components/Admin/UpdateQuestion.jsx
// 'use client'

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { supabaseAdmin } from '@/lib/supabase';
// import { toast } from 'sonner';
// import { formatISO } from 'date-fns';

// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';

// export default function UpdateQuestion() {
//   const router = useRouter();
//   const { id } = useParams();

//   // Form States
//   const [qid, setQid] = useState('');
//   const [heading, setHeading] = useState('');
//   const [detailed, setDetailed] = useState('');
//   const [summary, setSummary] = useState('');
//   const [pubAt, setPubAt] = useState(formatISO(new Date(), { representation: 'date' }));
//   const [user, setUser] = useState('');
//   const [assignT, setAssignT] = useState('false');
//   const [subcatId, setSubcatId] = useState('not_select');
  
//   // Helper States
//   const [subcats, setSubcats] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   // Original Data State (for comparing changes)
//   const [originalData, setOriginalData] = useState(null);

//   // 1) Load Subcategories
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

//   // 2) Fetch Question Data
//   useEffect(() => {
//     async function fetchData() {
//       if (!id) return;

//       const { data, error } = await supabaseAdmin
//         .from('QnA')
//         .select('*')
//         .eq('Q_ID', id)
//         .single();
      
//       if (error) {
//         console.error('Error fetching question:', error);
//         toast.error('Failed to fetch question');
//         return;
//       }

//       // Prepare values
//       const _heading = data.Q_Heading || '';
//       const _detailed = data.Ans_Detailed || '';
//       const _summary = data.Ans_summary || '';
//       const _pubAt = data.Published_At;
//       const _user = data.Q_User || ''; 
//       const _assignT = data.Assign_T ? 'true' : 'false';
//       const _subcatId = data.Subcat_ID ? String(data.Subcat_ID) : 'not_select';

//       // Set Form States
//       setQid(data.Q_ID);
//       setHeading(_heading);
//       setDetailed(_detailed);
//       setSummary(_summary);
//       setPubAt(_pubAt);
//       setUser(_user);
//       setAssignT(_assignT);
//       setSubcatId(_subcatId);

//       // Set Original Data
//       setOriginalData({
//         heading: _heading,
//         detailed: _detailed,
//         summary: _summary,
//         pubAt: _pubAt,
//         user: _user,
//         assignT: _assignT,
//         subcatId: _subcatId
//       });
//     }

//     fetchData();
//   }, [id]);

//   // 3) Check for Changes
//   const isChanged = originalData && (
//     heading !== originalData.heading ||
//     detailed !== originalData.detailed ||
//     summary !== originalData.summary ||
//     pubAt !== originalData.pubAt ||
//     user !== originalData.user ||
//     assignT !== originalData.assignT ||
//     subcatId !== originalData.subcatId
//   );

//   // 4) Handle Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       Q_Heading: heading.trim(),
//       Ans_Detailed: detailed.trim(),
//       Ans_summary: summary.trim() || null,
//       Published_At: pubAt,
//       Q_User: user.trim() || null,
//       Assign_T: assignT === 'true',
//       Subcat_ID: subcatId === 'not_select' ? null : Number(subcatId),
//     };

//     const { data, error } = await supabaseAdmin
//       .from('QnA')
//       .update(payload)
//       .eq('Q_ID', id)
//       .select()
//       .single();

//     setLoading(false);

//     if (error) {
//       console.error('Update QnA error:', error);
//       toast.error('Failed to update: ' + error.message);
//     } else {
//       toast.success('Question updated successfully!');
//       setOriginalData({
//         heading: heading,
//         detailed: detailed,
//         summary: summary,
//         pubAt: pubAt,
//         user: user,
//         assignT: assignT,
//         subcatId: subcatId
//       });
//     }
//   };

//   return (
//     // Mobile: p-3, Desktop: p-6
//     <div dir="rtl" className="w-full max-w-4xl mx-auto p-3 md:p-6 font-arabic pb-20">
      
//       {/* Header Section: Stack on mobile (flex-col), Row on desktop (md:flex-row) */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-xl md:text-2xl font-bold text-gray-800">
//             سوال اپ ڈیٹ کریں
//           </h2>
//           <span className="text-sm text-gray-500 block mt-1">
//              ID: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{id}</span>
//           </span>
//         </div>
        
//         <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={() => router.back()}
//             className="w-full md:w-auto" // Mobile: Full width
//         >
//           واپس جائیں
//         </Button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-5 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        
//         {/* Q_ID (Read Only) */}
//         <div>
//           <Label htmlFor="qid" className="text-gray-500 text-sm">سلسلہ نمبر (Q_ID)</Label>
//           <Input
//             id="qid" 
//             value={qid} 
//             disabled 
//             className="mt-1.5 bg-gray-50 border-gray-200 cursor-not-allowed font-mono text-left"
//           />
//         </div>

//         {/* Heading */}
//         <div>
//           <Label htmlFor="heading" className="text-base font-medium">سوال کا عنوان (Q_Heading)</Label>
//           <Input
//             id="heading" required
//             value={heading} onChange={(e) => setHeading(e.target.value)}
//             placeholder="عنوان درج کریں…" 
//             className="mt-1.5 text-base py-3 md:py-2" // Taller input for touch
//           />
//         </div>

//         {/* Q_User */}
//         <div>
//           <Label htmlFor="user" className="text-base font-medium">سائل کا سوال (Q_User)</Label>
//           <Textarea
//             id="user"
//             rows={4}
//             value={user} 
//             onChange={(e) => setUser(e.target.value)}
//             placeholder="سائل کا اصل سوال..." 
//             className="mt-1.5 text-base"
//           />
//         </div>

//         {/* Detailed Answer */}
//         <div>
//           <Label htmlFor="detailed" className="text-base font-medium">جواب مفصل (Ans_Detailed)</Label>
//           <Textarea
//             id="detailed" rows={10} required
//             value={detailed} onChange={(e) => setDetailed(e.target.value)}
//             placeholder="مکمل جواب لکھیں…" 
//             className="mt-1.5 text-base"
//           />
//         </div>

//         {/* Summary Answer */}
//         <div>
//           <Label htmlFor="summary" className="text-base font-medium">جواب کا خلاصہ (Ans_summary)</Label>
//           <Textarea
//             id="summary" rows={3}
//             value={summary} onChange={(e) => setSummary(e.target.value)}
//             placeholder="اختیاری خلاصہ…" 
//             className="mt-1.5 text-base"
//           />
//         </div>

//         {/* 2 Column Grid on Desktop, 1 Column on Mobile */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            
//             {/* Published At */}
//             <div>
//             <Label htmlFor="pubAt" className="text-base font-medium">شائع ہونے کی تاریخ</Label>
//             <Input
//                 id="pubAt" type="date" required
//                 value={pubAt} onChange={(e) => setPubAt(e.target.value)}
//                 className="mt-1.5 py-2.5" // Easy to tap
//             />
//             </div>

//             {/* Assign_T */}
//             <div>
//             <Label htmlFor="assignT" className="text-base font-medium">موضوع (Assign_T)</Label>
//             <Select
//                 value={assignT}
//                 onValueChange={setAssignT}
//             >
//                 <SelectTrigger className="mt-1.5 w-full py-2.5 h-11"> 
//                 {/* h-11 makes it taller for mobile touch */}
//                 <SelectValue placeholder="منتخب کریں…" />
//                 </SelectTrigger>
//                 <SelectContent>
//                 <SelectItem value="false">احکام و مسائل</SelectItem>
//                 <SelectItem value="true">تحقیق و تخریج</SelectItem>
//                 </SelectContent>
//             </Select>
//             </div>
//         </div>

//         {/* Subcategory */}
//         <div>
//           <Label htmlFor="subcat" className="text-base font-medium">ذیلی زمرہ (Subcat_ID)</Label>
//           <Select
//             value={subcatId}
//             onValueChange={setSubcatId}
//             disabled={fetching}
//           >
//             <SelectTrigger className="mt-1.5 w-full h-11">
//               <SelectValue placeholder={fetching ? 'لوڈ ہو رہا ہے…' : 'ذیلی زمرہ منتخب کریں'} />
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

//         {/* Submit Button Area - Sticky on mobile bottom if needed, currently normal */}
//         <div className="flex flex-col sm:flex-row justify-end pt-6 border-t mt-4 gap-3">
//           {/* Mobile: Cancel button also full width */}
//           <Button 
//             variant="ghost" 
//             type="button" 
//             onClick={() => router.back()}
//             className="w-full sm:w-auto order-2 sm:order-1"
//           >
//              منسوخ کریں
//           </Button>

//           <Button 
//             type="submit" 
//             disabled={loading || !isChanged}
//             className="w-full sm:w-auto min-w-[150px] order-1 sm:order-2 h-11 sm:h-10 text-base"
//           >
//             {loading ? 'محفوظ کیا جا رہا ہے…' : 'اپ ڈیٹ کریں'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }


// src/components/Admin/UpdateQuestion.jsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { toast } from 'sonner';
import { formatISO } from 'date-fns';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function UpdateQuestion() {
  const router = useRouter();
  const { id } = useParams();

  // Form States
  const [qid, setQid] = useState('');
  const [heading, setHeading] = useState('');
  const [detailed, setDetailed] = useState('');
  const [summary, setSummary] = useState('');
  const [pubAt, setPubAt] = useState(formatISO(new Date(), { representation: 'date' }));
  const [user, setUser] = useState('');
  const [assignT, setAssignT] = useState('false');
  const [subcatId, setSubcatId] = useState('not_select');
  
  // Helper States
  const [subcats, setSubcats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Original Data State (for comparing changes)
  const [originalData, setOriginalData] = useState(null);

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

  // 2) Fetch Question Data
  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const { data, error } = await supabaseAdmin
        .from('QnA')
        .select('*')
        .eq('Q_ID', id)
        .single();
      
      if (error) {
        console.error('Error fetching question:', error);
        toast.error('Failed to fetch question');
        return;
      }

      // Prepare values
      const _heading = data.Q_Heading || '';
      const _detailed = data.Ans_Detailed || '';
      const _summary = data.Ans_summary || '';
      const _pubAt = data.Published_At;
      const _user = data.Q_User || ''; 
      const _assignT = data.Assign_T ? 'true' : 'false';
      const _subcatId = data.Subcat_ID ? String(data.Subcat_ID) : 'not_select';

      // Set Form States
      setQid(data.Q_ID);
      setHeading(_heading);
      setDetailed(_detailed);
      setSummary(_summary);
      setPubAt(_pubAt);
      setUser(_user);
      setAssignT(_assignT);
      setSubcatId(_subcatId);

      // Set Original Data
      setOriginalData({
        heading: _heading,
        detailed: _detailed,
        summary: _summary,
        pubAt: _pubAt,
        user: _user,
        assignT: _assignT,
        subcatId: _subcatId
      });
    }

    fetchData();
  }, [id]);

  // 3) Check for Changes
  const isChanged = originalData && (
    heading !== originalData.heading ||
    detailed !== originalData.detailed ||
    summary !== originalData.summary ||
    pubAt !== originalData.pubAt ||
    user !== originalData.user ||
    assignT !== originalData.assignT ||
    subcatId !== originalData.subcatId
  );

  // 4) Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validation Check ---
    // نوٹ: یہاں ہم چیک کر رہے ہیں کہ لازمی فیلڈز خالی تو نہیں ہو گئیں
    if (!heading || !detailed || !pubAt) {
        toast.error(' براہ کرم وہ تمام خانے پر کریں جن پر (*) لگا ہوا ہے!');
        return;
    }

    setLoading(true);

    const payload = {
      Q_Heading: heading.trim(),
      Ans_Detailed: detailed.trim(),
      Ans_summary: summary.trim() || null,
      Published_At: pubAt,
      Q_User: user.trim() || null,
      Assign_T: assignT === 'true',
      Subcat_ID: subcatId === 'not_select' ? null : Number(subcatId),
    };

    const { data, error } = await supabaseAdmin
      .from('QnA')
      .update(payload)
      .eq('Q_ID', id)
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Update QnA error:', error);
      toast.error('Failed to update: ' + error.message);
    } else {
      toast.success('Question updated successfully!');
      setOriginalData({
        heading: heading,
        detailed: detailed,
        summary: summary,
        pubAt: pubAt,
        user: user,
        assignT: assignT,
        subcatId: subcatId
      });
    }
  };

  return (
    // Mobile: p-3, Desktop: p-6
    <div dir="rtl" className="w-full max-w-4xl mx-auto p-3 md:p-6 font-arabic pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            سوال اپ ڈیٹ کریں
          </h2>
          <span className="text-sm text-gray-500 block mt-1">
             ID: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{id}</span>
             <span className="mx-2">|</span>
             جن فیلڈز کے ساتھ <span className="text-red-500 font-bold">*</span> ہے، وہ لازمی ہیں۔
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
        
        {/* Q_ID (Read Only) */}
        <div>
          <Label htmlFor="qid" className="text-gray-500 text-sm">سلسلہ نمبر (Q_ID)</Label>
          <Input
            id="qid" 
            value={qid} 
            disabled 
            className="mt-1.5 bg-gray-50 border-gray-200 cursor-not-allowed font-mono text-left"
          />
        </div>

        {/* Heading */}
        <div>
          <Label htmlFor="heading" className="text-base font-medium">
            سوال کا عنوان (Q_Heading) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="heading" 
            value={heading} onChange={(e) => setHeading(e.target.value)}
            placeholder="عنوان درج کریں…" 
            className="mt-1.5 text-base py-3 md:py-2"
          />
        </div>

        {/* Q_User (Optional) */}
        <div>
          <Label htmlFor="user" className="text-base font-medium">
            سائل کا سوال (Q_User) <span className="text-xs text-gray-400">(اختیاری)</span>
          </Label>
          <Textarea
            id="user"
            rows={4}
            value={user} 
            onChange={(e) => setUser(e.target.value)}
            placeholder="سائل کا اصل سوال..." 
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
            value={detailed} onChange={(e) => setDetailed(e.target.value)}
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
            value={summary} onChange={(e) => setSummary(e.target.value)}
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
                value={pubAt} onChange={(e) => setPubAt(e.target.value)}
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

        {/* Submit Button Area */}
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
            // بٹن صرف تب فعال ہوگا جب لوڈنگ نہ ہو رہی ہو اور ڈیٹا میں تبدیلی ہوئی ہو
            disabled={loading || !isChanged}
            className="w-full sm:w-auto min-w-[150px] order-1 sm:order-2 h-11 sm:h-10 text-base"
          >
            {loading ? 'محفوظ کیا جا رہا ہے…' : 'اپ ڈیٹ کریں'}
          </Button>
        </div>
      </form>
    </div>
  );
}