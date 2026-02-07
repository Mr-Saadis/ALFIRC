// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import {
//     Table,
//     TableHeader,
//     TableRow,
//     TableHead,
//     TableBody,
//     TableCell,
// } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// // import RowActions from '@/components/ui/RowActions'; // Assuming you have a RowActions component
// import {
//     Select,
//     SelectTrigger,
//     SelectValue,
//     SelectContent,
//     SelectItem,
// } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// // import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
// import { Calendar } from 'lucide-react';
// import { Edit2, Trash2 } from 'lucide-react'
// import { format } from 'date-fns';
// import { supabaseAdmin } from '@/lib/supabase';
// import { Badge } from '@/components/ui/badge';
// import { useRouter } from 'next/navigation';
// import UpdateQuestions from './UpdateQuestions'; // Assuming you have an UpdateQuestions component


// export default function QuestionsTable() {
//     // ─── State Hooks ────────────────────────────────────────────────────────────
//     const [rows, setRows] = useState([]);
//     const [filtered, setFiltered] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();
    

//     const [search, setSearch] = useState('');
//     const [searchQ, setSearchQ] = useState('');
//     const [assign, setAssign] = useState('all');
//     const [category, setCategory] = useState('all');
//     const [dateFrom, setDateFrom] = useState('');
//     const [dateTo, setDateTo] = useState('');

//     const [page, setPage] = useState(1);
//     const pageSize = 20;

//     // dialog state
//     // ─── Fetch Data ─────────────────────────────────────────────────────────────
//     useEffect(() => {
//         const fetchQuestions = async () => {
//             setLoading(true);
//             const { data, error } = await supabaseAdmin
//                 .from('qna_view')
//                 .select('Q_ID, Q_Heading, Published_At, Assign_T, Subcat_Name')
//                 // Subcategory(Subcat_Name)
//                 .order('Q_ID', { ascending: false });

//             if (error) {
//                 console.error('Error loading questions:', error);
//                 setRows([]);
//             } else {
//                 setRows(data || []);
//             }
//             setLoading(false);
//         };

//         fetchQuestions();
//     }, []);

//     // ─── Filter & Search Logic ───────────────────────────────────────────────────
//     useEffect(() => {
//         let temp = [...rows];

//         // text search
//         if (search) {
//             const q = search.toLowerCase();
//             temp = temp.filter((r) => r.Q_Heading.toLowerCase().includes(q));
//         }
//         if (searchQ) {
//             const s = searchQ.toLowerCase();
//             temp = temp.filter((t) => t.Q_ID.toString().toLowerCase().includes(s));
//         }

//         // assign filter
//         if (assign !== 'all') {
//             temp = temp.filter((r) => String(r.Assign_T) === assign);
//         }

//         // category filter
//         if (category !== 'all') {
//             temp = temp.filter((r) => r.Subcategory?.Subcat_Name === category);
//         }

//         // date range filter
//         if (dateFrom) {
//             temp = temp.filter((r) => new Date(r.Published_At) >= new Date(dateFrom));
//         }
//         if (dateTo) {
//             temp = temp.filter((r) => new Date(r.Published_At) <= new Date(dateTo));
//         }

//         setFiltered(temp);
//         setPage(1);
//     }, [search, assign, category, dateFrom, dateTo, rows, searchQ]);

//     // ─── Pagination Slice ────────────────────────────────────────────────────────
//     const paged = useMemo(() => {
//         const start = (page - 1) * pageSize;
//         return filtered.slice(start, start + pageSize);
//     }, [page, filtered]);

//     // ─── Unique Categories for filter ───────────────────────────────────────────
//     const categories = useMemo(() => {
//         return Array.from(
//             new Set(
//                 rows
//                     .map((r) => r.Subcategory?.Subcat_Name)
//                     .filter((n) => typeof n === 'string')
//             )
//         );
//     }, [rows]);

//     // ─── Delete Handlers ─────────────────────────────────────────────────────────


//     // ─── Render ─────────────────────────────────────────────────────────────────
//     return (
//         <div className="space-y-6 font-arabic">
//             {/* ── Filters ─────────────────────────────────────────── */}
//             <div className="flex flex-wrap items-center gap-3">
//                 <Input
//                     placeholder="Search Q_ID"
//                     value={searchQ}
//                     onChange={(e) => setSearchQ(e.target.value)}
//                     className="max-w-[160px]"
//                 />
//                 <Input
//                     placeholder="Search title…"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="max-w-sm"
//                 />

//                 <Select value={assign} onValueChange={setAssign}>
//                     <SelectTrigger className="w-36">
//                         <SelectValue placeholder="All Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="all">All</SelectItem>
//                         <SelectItem value="true">تحقیق</SelectItem>
//                         <SelectItem value="false">احکام</SelectItem>
//                     </SelectContent>
//                 </Select>

//                 <Select value={category} onValueChange={setCategory}>
//                     <SelectTrigger className="w-36">
//                         <SelectValue placeholder="All Categories" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="all">All</SelectItem>
//                         {categories.map((cat) => (
//                             <SelectItem key={cat} value={cat}>
//                                 {cat}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>

//                 <Popover>
//                     <PopoverTrigger asChild>
//                         <Button variant="outline" className="flex items-center gap-1">
//                             <Calendar size={16} />
//                             {dateFrom && dateTo
//                                 ? `${format(new Date(dateFrom), 'MM/dd/yyyy')} - ${format(
//                                     new Date(dateTo),
//                                     'MM/dd/yyyy'
//                                 )}`
//                                 : 'Date Range'}
//                         </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="space-y-2">
//                         <input
//                             type="date"
//                             value={dateFrom}
//                             onChange={(e) => setDateFrom(e.target.value)}
//                             className="border rounded px-2 py-1 w-full"
//                         />
//                         <input
//                             type="date"
//                             value={dateTo}
//                             onChange={(e) => setDateTo(e.target.value)}
//                             className="border rounded px-2 py-1 w-full"
//                         />
//                         <Button
//                             variant="ghost"
//                             onClick={() => {
//                                 setDateFrom('');
//                                 setDateTo('');
//                             }}
//                         >
//                             Clear
//                         </Button>
//                     </PopoverContent>
//                 </Popover>
//             </div>

//             {/* ── Table ────────────────────────────────────────────── */}
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead className="w-[50px]">Q No.</TableHead>
//                         <TableHead>Title</TableHead>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Type</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                     {loading ? (
//                         <TableRow>
//                             <TableCell colSpan={5}>Loading…</TableCell>
//                         </TableRow>
//                     ) : paged.length === 0 ? (
//                         <TableRow>
//                             <TableCell colSpan={5}>No records found</TableCell>
//                         </TableRow>
//                     ) : (
//                         paged.map((r) => (
//                             <TableRow key={r.Q_ID}>
//                                 <TableCell>{r.Q_ID}</TableCell>
//                                 <TableCell>{r.Q_Heading.slice(0, 50)}</TableCell>
//                                 <TableCell>
//                                     {new Date(r.Published_At).toLocaleDateString()}
//                                 </TableCell>
//                                 <TableCell>
//                                     <Badge variant={r.Assign_T ? 'default' : 'secondary'}>
//                                         {r.Assign_T ? 'تحقیق' : 'احکام'}
//                                     </Badge>
//                                 </TableCell>
//                                 <TableCell className="text-right space-x-2">
//                                     <Button size="icon" variant="outline" onClick={() => {router.push(`/admin/updatequestion/${r.Q_ID}`)}}>
//                                         <Edit2 />
//                                     </Button>
//                                     <RowActions
//                                         id={r.Q_ID}
//                                         onDeleted={(deletedId) => {
//                                             setRows((rows) => rows.filter((x) => x.Q_ID !== deletedId));
//                                         }}
//                                     />
//                                 </TableCell>
//                             </TableRow>
//                         ))
//                     )}
//                 </TableBody>
//             </Table>

//             {/* ── Pagination ───────────────────────────────────────── */}
//             <div className="flex justify-end items-center space-x-4">
//                 <Button
//                     variant="outline"
//                     disabled={page === 1}
//                     onClick={() => setPage((p) => Math.max(p - 1, 1))}
//                 >
//                     Previous
//                 </Button>
//                 <span>
//                     Page {page} of {Math.ceil(filtered.length / pageSize) || 1}
//                 </span>
//                 <Button
//                     variant="outline"
//                     disabled={page === Math.ceil(filtered.length / pageSize)}
//                     onClick={() => setPage((p) => p + 1)}
//                 >
//                     Next
//                 </Button>
//             </div>
//         </div>
//     );
// }

// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
// import { FiTrash } from 'react-icons/fi'
// import { toast } from 'sonner';

// function RowActions({ id, onDeleted }) {
//     const routers = useRouter();
//     const [showDialog, setShowDialog] = useState(false)
//     const [isDeleting, setIsDeleting] = useState(false)
    
//     const [confirmName, setConfirmName] = useState('') 

//     const handleDelete = async () => {
//         if (confirmName !== 'SAADIIS') {
//             toast.error('Enter Correct Password to delete.');    
//             return
//         }

//         setIsDeleting(true)
        
//         const { error } = await supabaseAdmin 
//             .from('QnA')
//             .delete()
//             .eq('Q_ID', id)

//         if (error) {
//             console.error('Delete error:', error)
//             alert('Failed to delete.')
//         } else {
//             onDeleted(id)
//             setShowDialog(false)
//             setConfirmName('') // ڈائیلاگ بند ہونے پر نام صاف کر دی
//         }

//         setIsDeleting(false)
//         routers.refresh();
//     }

//     return (
//         <div className="inline-block">
//             <Dialog open={showDialog} onOpenChange={(open) => {
//                 setShowDialog(open)
//                 if (!open) setConfirmName('') // ڈائیلاگ بند کرنے پر ان پٹ ریسٹ کریں
//             }}>
//                 <DialogTrigger asChild>
//                     <Button
//                         onClick={() => setShowDialog(true)}
//                         className="flex gap-1 items-center px-3 py-1.5 text-[14px] rounded-lg hover:text-red-600 hover:bg-gray-100 cursor-pointer"
//                     >
//                         <FiTrash size={16} />
//                     </Button>
//                 </DialogTrigger>

//                 <DialogContent className="max-w-sm">
//                     <DialogHeader>
//                         <DialogTitle>کیا آپ واقعی حذف کرنا چاہتے ہیں؟</DialogTitle>
//                         <DialogDescription>
//                             یہ جواب ہٹا دیا جائے گا۔ اس عمل کو واپس نہیں کیا جا سکتا۔
//                         </DialogDescription>
//                     </DialogHeader>

//                     {/* 3. یہاں ان پٹ فیلڈ کا اضافہ کیا گیا ہے */}
//                     <div className="py-4">
//                         <label className="text-sm text-gray-500 mb-2 block">
//                             تصدیق کے لیے <strong>Password</strong> لکھیں:
//                         </label>
//                         <input
//                             type="text"
//                             value={confirmName}
//                             onChange={(e) => setConfirmName(e.target.value)}
//                             placeholder="Password"
//                             className="w-full border p-2 rounded-md outline-none focus:border-red-500"
//                         />
//                     </div>

//                     <DialogFooter className="flex justify-end gap-2">
//                         <Button
//                             variant="ghost"
//                             onClick={() => setShowDialog(false)}
//                             disabled={isDeleting}
//                         >
//                             منسوخ کریں
//                         </Button>
//                         <Button
//                             variant="destructive"
//                             onClick={handleDelete}
//                             // 4. بٹن تب تک ڈس ایبل رہے گا جب تک نام SAAD نہ ہو
//                             disabled={isDeleting || confirmName !== 'SAADIIS'}
//                         >
//                             {isDeleting ? 'حذف ہو رہا ہے...' : 'حذف کریں'}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     )
// }



'use client';

import { useState, useEffect, useMemo } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar, Edit2, Search, FilterX, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { supabaseAdmin } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FiTrash } from 'react-icons/fi';
import { toast } from 'sonner';

export default function QuestionsTable() {
    const [rows, setRows] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [searchQ, setSearchQ] = useState('');
    const [assign, setAssign] = useState('all');
    const [category, setCategory] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [page, setPage] = useState(1);
    const pageSize = 15;

    // Fetch Data
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const { data, error } = await supabaseAdmin
                .from('qna_view')
                .select('Q_ID, Q_Heading, Published_At, Assign_T, Subcat_Name')
                .order('Q_ID', { ascending: false });

            if (error) {
                console.error('Error loading questions:', error);
                setRows([]);
            } else {
                setRows(data || []);
            }
            setLoading(false);
        };
        fetchQuestions();
    }, []);

    // Filters Logic
    useEffect(() => {
        let temp = [...rows];
        if (search) temp = temp.filter((r) => r.Q_Heading.toLowerCase().includes(search.toLowerCase()));
        if (searchQ) temp = temp.filter((t) => t.Q_ID.toString().toLowerCase().includes(searchQ.toLowerCase()));
        if (assign !== 'all') temp = temp.filter((r) => String(r.Assign_T) === assign);
        if (category !== 'all') temp = temp.filter((r) => r.Subcat_Name === category);
        if (dateFrom) temp = temp.filter((r) => new Date(r.Published_At) >= new Date(dateFrom));
        if (dateTo) temp = temp.filter((r) => new Date(r.Published_At) <= new Date(dateTo));

        setFiltered(temp);
        setPage(1);
    }, [search, assign, category, dateFrom, dateTo, rows, searchQ]);

    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [page, filtered]);

    const categories = useMemo(() => {
        return Array.from(new Set(rows.map((r) => r.Subcat_Name).filter((n) => typeof n === 'string')));
    }, [rows]);

    const clearFilters = () => {
        setSearch(''); setSearchQ(''); setAssign('all'); setCategory('all'); setDateFrom(''); setDateTo('');
    };

    return (
        <div className="font-arabic space-y-6">
            
            {/* ── Main Card Container ──────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                
                {/* ── Header & Filters ─────────────────────────────── */}
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">سوالات کی فہرست</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                کل سوالات: <span className="font-mono font-medium text-primary">{filtered.length}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                            {/* Search Inputs (Bug Fixed Here via autoComplete="off") */}
                            <div className="relative group">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-primary" />
                                <Input
                                    placeholder="ID..."
                                    name="search_qid_custom" // Unique Name
                                    autoComplete="off"       // Disable Autofill
                                    value={searchQ}
                                    onChange={(e) => setSearchQ(e.target.value)}
                                    className="pl-9 w-24 bg-white focus:border-[#3333cc] focus:ring-[#3333cc]/20 transition-all"
                                />
                            </div>
                            <div className="relative group flex-grow xl:flex-grow-0">
                                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-primary" />
                                <Input
                                    placeholder="عنوان تلاش کریں..."
                                    name="search_title_custom" // Unique Name
                                    autoComplete="off"         // Disable Autofill
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pr-9 w-full xl:w-64 bg-white focus:border-[#3333cc] focus:ring-[#3333cc]/20 transition-all text-right"
                                    dir="rtl"
                                />
                            </div>

                            {/* Dropdowns */}
                            <Select value={assign} onValueChange={setAssign}>
                                <SelectTrigger className="w-[110px] bg-white">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">سب (All)</SelectItem>
                                    <SelectItem value="true">تحقیق</SelectItem>
                                    <SelectItem value="false">احکام</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-[140px] bg-white">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">تمام زمرے</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Date Picker */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={`bg-white ${dateFrom ? 'border-[#3333cc] text-primary' : 'text-gray-600'}`}>
                                        <Calendar size={16} className="mr-2" />
                                        {dateFrom ? 'Date Selected' : 'Date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-4 space-y-3" align="end">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Start Date</label>
                                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border rounded px-2 py-1.5 w-full text-sm outline-none focus:border-[#3333cc]" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">End Date</label>
                                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border rounded px-2 py-1.5 w-full text-sm outline-none focus:border-[#3333cc]" />
                                    </div>
                                    <Button size="sm" variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { setDateFrom(''); setDateTo(''); }}>
                                        Clear Dates
                                    </Button>
                                </PopoverContent>
                            </Popover>

                            {/* Reset Button */}
                            {(search || searchQ || assign !== 'all' || category !== 'all' || dateFrom) && (
                                <Button size="icon" variant="ghost" onClick={clearFilters} className="text-red-500 hover:bg-red-50" title="Clear Filters">
                                    <FilterX size={18} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Table Content ────────────────────────────────── */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[80px] font-bold text-gray-600 text-center">ID</TableHead>
                                <TableHead className="text-right font-bold text-gray-600">عنوان (Title)</TableHead>
                                <TableHead className="text-right font-bold text-gray-600">زمرہ (Cat)</TableHead>
                                <TableHead className="text-center font-bold text-gray-600">تاریخ</TableHead>
                                <TableHead className="text-center font-bold text-gray-600">قسم</TableHead>
                                <TableHead className="text-center font-bold text-gray-600">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-gray-500 animate-pulse">
                                        ڈیٹا لوڈ ہو رہا ہے...
                                    </TableCell>
                                </TableRow>
                            ) : paged.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                        کوئی ریکارڈ موجود نہیں
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paged.map((r) => (
                                    <TableRow key={r.Q_ID} className="group hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-0">
                                        <TableCell className="text-center font-mono font-medium text-gray-500 group-hover:text-primary">
                                            {r.Q_ID}
                                        </TableCell>
                                        <TableCell className="text-right max-w-[300px]">
                                            <p className="truncate font-medium text-gray-800">{r.Q_Heading}</p>
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-gray-600">
                                            {r.Subcat_Name || '-'}
                                        </TableCell>
                                        <TableCell className="text-center text-sm font-mono text-gray-500">
                                            {format(new Date(r.Published_At), 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge 
                                                variant="outline" 
                                                className={`font-normal ${r.Assign_T ? 'border-purple-200 text-purple-700 bg-purple-50' : 'border-blue-200 text-blue-700 bg-blue-50'}`}
                                            >
                                                {r.Assign_T ? 'تحقیق' : 'احکام'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {/* 👇 تبدیلی 1: Opacity ہٹا دی گئی ہے */}
                                            <div className="flex items-center justify-center gap-1">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-blue-100 transition-all"
                                                    onClick={() => router.push(`/admin/updatequestion/${r.Q_ID}`)}
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                
                                                <RowActions 
                                                    id={r.Q_ID} 
                                                    onDeleted={(deletedId) => {
                                                        setRows((rows) => rows.filter((x) => x.Q_ID !== deletedId));
                                                    }} 
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* ── Pagination Footer ────────────────────────────── */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Page <span className="font-medium text-gray-900">{page}</span> of {Math.ceil(filtered.length / pageSize) || 1}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            className="bg-white hover:border-[#3333cc] hover:text-primary"
                        >
                            <ChevronLeft size={16} className="mr-1" /> Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= Math.ceil(filtered.length / pageSize)}
                            onClick={() => setPage((p) => p + 1)}
                            className="bg-white hover:border-[#3333cc] hover:text-primary"
                        >
                            Next <ChevronRight size={16} className="ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Row Actions Component ────────
function RowActions({ id, onDeleted }) {
    const routers = useRouter();
    const [showDialog, setShowDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmName, setConfirmName] = useState('') 

    const handleDelete = async () => {
        if (confirmName !== 'SAADIIS') {
            toast.error('غلط پاس ورڈ! براہ کرم درست پاس ورڈ درج کریں۔');    
            return
        }

        setIsDeleting(true)
        const { error } = await supabaseAdmin 
            .from('QnA')
            .delete()
            .eq('Q_ID', id)

        if (error) {
            console.error('Delete error:', error)
            toast.error('حذف کرنے میں ناکامی۔')
        } else {
            toast.success(`سوال # ${id} کامیابی سے حذف ہو گیا`)
            onDeleted(id)
            setShowDialog(false)
            setConfirmName('')
        }
        setIsDeleting(false)
        routers.refresh();
    }

    return (
        <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open)
            if (!open) setConfirmName('')
        }}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all">
                    <FiTrash size={16} />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md p-6 font-arabic" dir="rtl">
                <DialogHeader className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-center text-xl text-gray-900">سوال حذف کریں؟</DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        کیا آپ واقعی سوال نمبر <span className="font-mono font-bold text-gray-800">{id}</span> کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔
                    </DialogDescription>
                </DialogHeader>

                {/* 👇 تبدیلی 2: Password Autofill Fix */}
                <div className="py-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        تصدیق کے لیے پاس ورڈ لکھیں:
                    </label>
                    <input
                        type="text"
                        name="delete_confirm_password" // Unique Name
                        autoComplete="new-password"    // Prevent Autofill triggering other inputs
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        placeholder="Password"
                        className={`w-full border p-3 rounded-xl outline-none transition-all ${
                            confirmName === 'SAADIIS' 
                            ? 'border-green-500 ring-2 ring-green-100' 
                            : 'border-gray-200 focus:border-[#3333cc] focus:ring-2 focus:ring-[#3333cc]/10'
                        }`}
                    />
                </div>

                <DialogFooter className="flex gap-3 sm:justify-start">
                    <Button
                        variant="destructive"
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                        onClick={handleDelete}
                        disabled={isDeleting || confirmName !== 'SAADIIS'}
                    >
                        {isDeleting ? 'حذف ہو رہا ہے...' : 'ہاں، حذف کریں'}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => setShowDialog(false)}
                        disabled={isDeleting}
                    >
                        منسوخ کریں
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}