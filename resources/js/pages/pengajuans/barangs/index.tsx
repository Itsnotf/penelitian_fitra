import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import DeleteButton from '@/components/delete-button';
import { Edit2Icon, PlusCircle, WalletCards } from 'lucide-react';
import { BreadcrumbItem, SharedData } from '@/types';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import hasAnyPermission from '@/lib/utils';

interface BarangPengajuan {
    id: number;
    barang: { id: number; nama_barang: string };
    jumlah: number;
}

interface Pengajuan {
    id: number;
    deskripsi: string;
    status: string;
}

interface Props {
    pengajuan: Pengajuan;
    barangs: {
        data: BarangPengajuan[];
        links: any[];
    };
    filters: {
        search?: string;
    };
    flash?: {
        success?: string;
    };
}

export default function PengajuanBarangsPage({ barangs, pengajuan, filters, flash }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pengajuan',
            href: '/pengajuans',
        },
        {
            title: pengajuan.id.toString(),
            href: `/pengajuans/${pengajuan.id}`,
        },
        {
            title: 'Detail',
            href: `/pengajuans/${pengajuan.id}`,
        },
    ];

    const user = usePage<SharedData>().props.auth.user;

    const [search, setSearch] = useState(filters.search || '');
    const [shownMessages] = useState(new Set());

    useEffect(() => {
        if (flash?.success && !shownMessages.has(flash.success)) {
            toast.success(flash.success);
            shownMessages.add(flash.success);
        }
    }, [flash?.success]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(`/pengajuans/${pengajuan.id}`, { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pengajuan" />

            <div className="p-4 space-y-4">

                {/* Search Bar */}
                <div className='flex space-x-1'>
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input
                            placeholder="Search by Nama Barang..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant='outline' type="submit">Search</Button>
                    </form>
                    {hasAnyPermission(["pengajuans barang create"]) && pengajuan.status === 'pending' && (
                        <Link href={`/pengajuans/${pengajuan.id}/barangs/create`}>
                            <Button variant='default' className='group flex items-center'>
                                <PlusCircle className='group-hover:rotate-90 transition-all' />
                                Add Barang
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Barang Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Barang</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {barangs.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-[65vh]  text-center">
                                    Belum Ada Data Barang.
                                </TableCell>
                            </TableRow>
                        ) : (
                            barangs.data.map((barang) => (
                                <TableRow key={barang.id}>
                                    <TableCell>{barang.barang?.nama_barang}</TableCell>
                                    <TableCell>{barang.jumlah}</TableCell>
                                    <TableCell className="space-x-2">
                                        {hasAnyPermission(["pengajuans barang edit"]) && pengajuan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/pengajuans/${pengajuan.id}/barangs/edit/${barang.id}`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-blue-200 hover:text-blue-600'> <Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Ubah
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["pengajuans barang delete"]) && pengajuan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={barang.id} featured={`pengajuans/${pengajuan.id}/barangs`} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Hapus
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>

                <div className="flex gap-1">
                    {barangs.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`px-3 py-1 flex justify-center items-center border rounded-md ${link.active ? 'bg-primary text-primary-foreground text-sm' : 'text-sm'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

            </div>
        </AppLayout>
    );
}
