'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
// import RowActions from '@/components/ui/RowActions'; // Assuming you have a RowActions component
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';
import { Edit2, Trash2 } from 'lucide-react'
import { format } from 'date-fns';
import { supabaseAdmin } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import UpdateQuestions from './UpdateQuestions'; // Assuming you have an UpdateQuestions component


export default function QuestionsTable() {
    // ─── State Hooks ────────────────────────────────────────────────────────────
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
    const pageSize = 20;

    // dialog state
    // ─── Fetch Data ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const { data, error } = await supabaseAdmin
                .from('qna_view')
                .select('Q_ID, Q_Heading, Published_At, Assign_T, Subcat_Name')
                // Subcategory(Subcat_Name)
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

    // ─── Filter & Search Logic ───────────────────────────────────────────────────
    useEffect(() => {
        let temp = [...rows];

        // text search
        if (search) {
            const q = search.toLowerCase();
            temp = temp.filter((r) => r.Q_Heading.toLowerCase().includes(q));
        }
        if (searchQ) {
            const s = searchQ.toLowerCase();
            temp = temp.filter((t) => t.Q_ID.toString().toLowerCase().includes(s));
        }

        // assign filter
        if (assign !== 'all') {
            temp = temp.filter((r) => String(r.Assign_T) === assign);
        }

        // category filter
        if (category !== 'all') {
            temp = temp.filter((r) => r.Subcategory?.Subcat_Name === category);
        }

        // date range filter
        if (dateFrom) {
            temp = temp.filter((r) => new Date(r.Published_At) >= new Date(dateFrom));
        }
        if (dateTo) {
            temp = temp.filter((r) => new Date(r.Published_At) <= new Date(dateTo));
        }

        setFiltered(temp);
        setPage(1);
    }, [search, assign, category, dateFrom, dateTo, rows, searchQ]);

    // ─── Pagination Slice ────────────────────────────────────────────────────────
    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [page, filtered]);

    // ─── Unique Categories for filter ───────────────────────────────────────────
    const categories = useMemo(() => {
        return Array.from(
            new Set(
                rows
                    .map((r) => r.Subcategory?.Subcat_Name)
                    .filter((n) => typeof n === 'string')
            )
        );
    }, [rows]);

    // ─── Delete Handlers ─────────────────────────────────────────────────────────


    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 font-arabic">
            {/* ── Filters ─────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3">
                <Input
                    placeholder="Search Q_ID"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    className="max-w-[160px]"
                />
                <Input
                    placeholder="Search title…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />

                <Select value={assign} onValueChange={setAssign}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="All Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">تحقیق</SelectItem>
                        <SelectItem value="false">احکام</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-1">
                            <Calendar size={16} />
                            {dateFrom && dateTo
                                ? `${format(new Date(dateFrom), 'MM/dd/yyyy')} - ${format(
                                    new Date(dateTo),
                                    'MM/dd/yyyy'
                                )}`
                                : 'Date Range'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="border rounded px-2 py-1 w-full"
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="border rounded px-2 py-1 w-full"
                        />
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setDateFrom('');
                                setDateTo('');
                            }}
                        >
                            Clear
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>

            {/* ── Table ────────────────────────────────────────────── */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">Q No.</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5}>Loading…</TableCell>
                        </TableRow>
                    ) : paged.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>No records found</TableCell>
                        </TableRow>
                    ) : (
                        paged.map((r) => (
                            <TableRow key={r.Q_ID}>
                                <TableCell>{r.Q_ID}</TableCell>
                                <TableCell>{r.Q_Heading.slice(0, 50)}</TableCell>
                                <TableCell>
                                    {new Date(r.Published_At).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={r.Assign_T ? 'default' : 'secondary'}>
                                        {r.Assign_T ? 'تحقیق' : 'احکام'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="icon" variant="outline" onClick={() => {router.push(`/admin/updatequestion/${r.Q_ID}`)}}>
                                        <Edit2 />
                                    </Button>
                                    <RowActions
                                        id={r.Q_ID}
                                        onDeleted={(deletedId) => {
                                            setRows((rows) => rows.filter((x) => x.Q_ID !== deletedId));
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* ── Pagination ───────────────────────────────────────── */}
            <div className="flex justify-end items-center space-x-4">
                <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                    Previous
                </Button>
                <span>
                    Page {page} of {Math.ceil(filtered.length / pageSize) || 1}
                </span>
                <Button
                    variant="outline"
                    disabled={page === Math.ceil(filtered.length / pageSize)}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { FiTrash } from 'react-icons/fi'
import { toast } from 'sonner';

function RowActions({ id, onDeleted }) {
    const routers = useRouter();
    const [showDialog, setShowDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    
    const [confirmName, setConfirmName] = useState('') 

    const handleDelete = async () => {
        if (confirmName !== 'SAADIIS') {
            toast.error('Enter Correct Password to delete.');    
            return
        }

        setIsDeleting(true)
        
        const { error } = await supabaseAdmin 
            .from('QnA')
            .delete()
            .eq('Q_ID', id)

        if (error) {
            console.error('Delete error:', error)
            alert('Failed to delete.')
        } else {
            onDeleted(id)
            setShowDialog(false)
            setConfirmName('') // ڈائیلاگ بند ہونے پر نام صاف کر دی
        }

        setIsDeleting(false)
        routers.refresh();
    }

    return (
        <div className="inline-block">
            <Dialog open={showDialog} onOpenChange={(open) => {
                setShowDialog(open)
                if (!open) setConfirmName('') // ڈائیلاگ بند کرنے پر ان پٹ ریسٹ کریں
            }}>
                <DialogTrigger asChild>
                    <Button
                        onClick={() => setShowDialog(true)}
                        className="flex gap-1 items-center px-3 py-1.5 text-[14px] rounded-lg hover:text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                        <FiTrash size={16} />
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>کیا آپ واقعی حذف کرنا چاہتے ہیں؟</DialogTitle>
                        <DialogDescription>
                            یہ جواب ہٹا دیا جائے گا۔ اس عمل کو واپس نہیں کیا جا سکتا۔
                        </DialogDescription>
                    </DialogHeader>

                    {/* 3. یہاں ان پٹ فیلڈ کا اضافہ کیا گیا ہے */}
                    <div className="py-4">
                        <label className="text-sm text-gray-500 mb-2 block">
                            تصدیق کے لیے <strong>Password</strong> لکھیں:
                        </label>
                        <input
                            type="text"
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            placeholder="Password"
                            className="w-full border p-2 rounded-md outline-none focus:border-red-500"
                        />
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDialog(false)}
                            disabled={isDeleting}
                        >
                            منسوخ کریں
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            // 4. بٹن تب تک ڈس ایبل رہے گا جب تک نام SAAD نہ ہو
                            disabled={isDeleting || confirmName !== 'SAADIIS'}
                        >
                            {isDeleting ? 'حذف ہو رہا ہے...' : 'حذف کریں'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
