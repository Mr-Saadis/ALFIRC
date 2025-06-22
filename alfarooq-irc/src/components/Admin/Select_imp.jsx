'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
    Search, Check, X, Save, RefreshCw,
    CheckSquare, Square,
} from 'lucide-react'
import clsx from 'clsx'
import { supabase } from '@/lib/supabase'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table'
// import { Check } from 'lucide-react'

/* ---------- tiny helpers ---------- */
const setsEqual = (a, b) =>
    a.size === b.size && [...a].every(x => b.has(x))

const Toast = ({ msg, type, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 2500)
        return () => clearTimeout(t)
    }, [onClose])

    return (
        <div className={clsx(
            'fixed top-4 right-4 z-50 flex items-center gap-2 rounded-md px-4 py-2 shadow',
            type === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-500 text-white'
        )}>
            {type === 'success' ? <Check size={16} /> : <X size={16} />}
            {msg}
        </div>
    )
}

/* -------------- page --------------- */
export default function AdminQASelector() {
    /* db data ------------------------- */
    const [qna, setQna] = useState([])
    const [subs, setSubs] = useState([])

    /* selections ---------------------- */
    const [selQ, setSelQ] = useState(new Set())
    const [selSub, setSelSub] = useState(new Set())
    const [origQ, setOrigQ] = useState(new Set())
    const [origS, setOrigS] = useState(new Set())

    /* ui ------------------------------ */
    const [toast, setToast] = useState(null)
    const [saving, setSaving] = useState(false)
    const [fq, setFQ] = useState({ id: '', q: '', sub: '', cat: '' })
    const [fs, setFS] = useState({ id: '', name: '' })

    /* fetch once ---------------------- */
    useEffect(() => {
        (async () => {
            const { data: q } = await supabase
                .from('qna_view')
                .select('Q_ID,Q_Heading,Cat_Name,Subcat_ID,Subcat_Name')

            const { data: s } = await supabase
                .from('Subcategory')
                .select('Subcat_ID,Subcat_Name')

            const { data: sq } = await supabase.from('Q_Select').select('Q_ID')
            const { data: ss } = await supabase.from('Subcat_Select').select('Subcat_ID')

            setQna(q ?? [])
            setSubs(s ?? [])

            const qSet = new Set(sq?.map(r => r.Q_ID))
            setSelQ(qSet); setOrigQ(new Set(qSet))
            const sSet = new Set(ss?.map(r => r.Subcat_ID))
            setSelSub(sSet); setOrigS(new Set(sSet))
        })()
    }, [])

    /* derived ------------------------- */
    const changed = !setsEqual(selQ, origQ) || !setsEqual(selSub, origS)

    const qFiltered = useMemo(
        () =>
            qna.filter(r => {
                const id = r.Q_ID?.toString() ?? '';
                const head = r.Q_Heading ?? '';
                const sub = r.Subcat_Name ?? '';
                const cat = r.Cat_Name ?? '';

                return (
                    (!fq.id || id.includes(fq.id)) &&
                    (!fq.q || head.toLowerCase().includes(fq.q.toLowerCase())) &&
                    (!fq.sub || sub.toLowerCase().includes(fq.sub.toLowerCase())) &&
                    (!fq.cat || cat.toLowerCase().includes(fq.cat.toLowerCase()))
                );
            }),
        [qna, fq]
    );


    const sFiltered = useMemo(() =>
        subs.filter(r =>
            (!fs.id || r.Subcat_ID.toString().includes(fs.id)) &&
            (!fs.name || r.Subcat_Name.toLowerCase().includes(fs.name.toLowerCase()))
        ), [subs, fs])

    /* togglers ------------------------ */
    const tQ = id => setSelQ(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
    const tSub = id => setSelSub(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

    const bulkToggle = (ids, sel, setter) => {
        const every = ids.every(id => sel.has(id))
        setter(new Set(
            every ? [...sel].filter(id => !ids.includes(id))
                : [...sel, ...ids]
        ))
    }

    /* save ---------------------------- */
    const save = async () => {
        setSaving(true)
        try {
            /* add / remove questions */
            const addQ = [...selQ].filter(x => !origQ.has(x)).map(id => ({ Q_ID: id }))
            const delQ = [...origQ].filter(x => !selQ.has(x))
            if (addQ.length) await supabase.from('Q_Select').insert(addQ)
            if (delQ.length) await supabase.from('Q_Select').delete().in('Q_ID', delQ)

            /* add / remove subcategories */
            const addS = [...selSub].filter(x => !origS.has(x)).map(id => ({ Subcat_ID: id }))
            const delS = [...origS].filter(x => !selSub.has(x))
            if (addS.length) await supabase.from('Subcat_Select').insert(addS)
            if (delS.length) await supabase.from('Subcat_Select').delete().in('Subcat_ID', delS)

            setOrigQ(new Set(selQ))
            setOrigS(new Set(selSub))
            setToast({ msg: 'Saved!', type: 'success' })

        } catch (e) {
            console.error(e)
            setToast({ msg: 'Error while saving', type: 'error' })
        }
        setSaving(false)
    }

    /* ---------------------- UI ---------------------- */
    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto text-[0.93rem] leading-tight">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-5">
                <h1 className="text-lg font-semibold text-gray-800">Q & A Selection</h1>
                <button
                    onClick={save}
                    disabled={!changed || saving}
                    className={clsx(
                        'mt-3 md:mt-0 inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm',
                        changed && !saving
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    )}
                >
                    {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    {saving ? 'Saving…' : 'Save'}
                </button>
            </header>

            {/* quick stats */}
            <div className="grid grid-cols-3 rounded-lg gap-4 mb-6">
                <Stat label="Questions" value={selQ.size} />
                <Stat label="Sub-categories" value={selSub.size} />
                <Stat label="Status"
                    value={changed ? 'Unsaved' : 'All saved'}
                    color={changed ? 'text-orange-600' : 'text-gray-500'} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Questions box */}
                <Box
                    title="Questions"
                    color="blue"
                    filtersComponent={<QFilters f={fq} setF={setFQ} />}
                    selectAll={() => bulkToggle(qFiltered.map(r => r.Q_ID), selQ, setSelQ)}
                    list={qFiltered.map(r => ({
                        id: r.Q_ID,
                        cols: [r.Q_ID, r.Q_Heading, r.Cat_Name, r.Subcat_Name],
                        selected: selQ.has(r.Q_ID)
                    }))}
                    toggle={tQ}
                />

                {/* Subcategory box */}
                <Box
                    title="Sub-categories"
                    color="green"
                    filtersComponent={<SubFilters f={fs} setF={setFS} />}
                    selectAll={() => bulkToggle(sFiltered.map(r => r.Subcat_ID), selSub, setSelSub)}
                    list={sFiltered.map(r => ({
                        id: r.Subcat_ID,
                        cols: [r.Subcat_ID, r.Subcat_Name],
                        selected: selSub.has(r.Subcat_ID)
                    }))}
                    toggle={tSub}
                />
            </div>
        </div>
    )
}

/* ---------- tiny reusable UI blocks --------- */

const Stat = ({ label, value, color = 'text-blue-600' }) => (
    <div className="bg-white border rounded p-3">
        <div className="text-[0.75rem] text-gray-500">{label}</div>
        <div className={clsx('text-lg font-semibold', color)}>{value}</div>
    </div>
)

const Box = ({
    title, filtersComponent, selectAll, list, toggle, color,
}) => {

    /* pre-declare exact classes so Tailwind keeps them */
    const colorBg = { blue: 'bg-blue-500', green: 'bg-green-500' }
    const colorRow = { blue: 'bg-blue-50', green: 'bg-green-50' }

    return (
        <div className="bg-white border rounded-lg">
            {/* header */}
            <div
                className={clsx(colorBg[color] || 'bg-blue-800', 'text-white', 'rounded-t-lg')}
            >
                <div className="flex items-center justify-between px-4 py-3  border-b">
                    <h2 className="font-medium">{title}</h2>
                    <button
                        onClick={selectAll}
                        className="text-xs flex items-center gap-1"
                    >
                        {list.every(r => r.selected)
                            ? <><CheckSquare size={14} /> Deselect</>
                            : <><Square size={14} /> Select</>}
                    </button>
                </div>
            </div>

            {/* filters */}
            <div className="px-4 py-3 border-b space-y-2">
                {filtersComponent}
            </div>

            <div className="max-h-[500px] overflow-y-auto">
                <Table className="w-full text-[0.8rem]">
                    <TableBody>
                        {list.map(item => (
                            <TableRow
                                key={item.id}
                                onClick={() => toggle(item.id)}
                                className={clsx(
                                    'cursor-pointer hover:bg-gray-50',
                                    'border-b',                    // keeps the row separator
                                    item.selected && colorRow[color]
                                )}
                            >
                                {/* checkbox */}
                                <TableCell className="w-10">
                                    <div
                                        className={clsx(
                                            'mx-auto flex h-4 w-4 items-center justify-center rounded border-2',
                                            item.selected ? colorBg[color] : 'border-gray-300'
                                        )}
                                    >
                                        {item.selected && <Check size={10} className="text-white" />}
                                    </div>
                                </TableCell>

                                {item.cols.map((c, i) => (
                                    <TableCell key={i} className="px-3 py-2 whitespace-nowrap">
                                        {c}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>




        </div>
    )
}

/* -------- filter input components -------- */
const Filter = ({ placeholder, val, onCh }) => (
    <label className="relative">
        <Search size={12} className="absolute left-2.5 top-2 text-gray-400" />
        <input
            value={val}
            onChange={e => onCh(e.target.value)}
            placeholder={placeholder}
            className="pl-7 pr-2 py-1.5 w-full border rounded text-[0.75rem]
                 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
    </label>
)

const QFilters = ({ f, setF }) => (
    <div className="grid grid-cols-2 gap-2">
        {[
            ['id', 'ID'], ['q', 'Question'],
            ['sub', 'Sub-cat'], ['cat', 'Cat'],
        ].map(([k, ph]) => (
            <Filter key={k}
                placeholder={ph}
                val={f[k]}
                onCh={v => setF({ ...f, [k]: v })} />
        ))}
    </div>
)

const SubFilters = ({ f, setF }) => (
    <div className="grid grid-cols-2 gap-2">
        <Filter placeholder="ID" val={f.id} onCh={v => setF({ ...f, id: v })} />
        <Filter placeholder="Name" val={f.name} onCh={v => setF({ ...f, name: v })} />
    </div>
)
