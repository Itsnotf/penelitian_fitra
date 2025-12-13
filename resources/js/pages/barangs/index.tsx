import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import DeleteButton from '@/components/delete-button';
import { Edit2Icon, PlusCircle } from 'lucide-react';
import { Barang, BreadcrumbItem, SharedData, User } from '@/types';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import hasAnyPermission from '@/lib/utils';


interface Props {
    barangs: {
        data: Barang[];
        links: any[];
    };
    filters: {
        search?: string;
    };
    flash?: {
        success?: string;
    };
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventaris',
        href: '/barangs',
    },
];

export default function BarangPage({ barangs, filters, flash }: Props) {
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
        router.get('/barangs', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barangs" />

            <div className="p-4 space-y-4">

                {/* Search Bar */}
                <div className='flex space-x-1'>
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input
                            placeholder="Cari berdasarkan Nama Barang..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant='outline' type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(["barangs create"]) && (
                        <Link href="/barangs/create">
                            <Button variant='default' className='group flex items-center'>
                                <PlusCircle className='group-hover:rotate-90 transition-all' />
                                Tambah Barang
                            </Button>
                        </Link>
                    )}
                </div>

                {/* User Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Stock Awal</TableHead>
                            <TableHead>Stock Keluar</TableHead>
                            <TableHead>Stock Masuk</TableHead>
                            <TableHead>Stock Tersedia</TableHead>
                            <TableHead>Tindakan</TableHead>
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
                                    <TableCell>{barang.nama_barang}</TableCell>
                                    <TableCell>{barang.tipe}</TableCell>
                                    <TableCell>{barang.stock_awal}</TableCell>
                                    <TableCell>{barang.stock_keluar}</TableCell>
                                    <TableCell>{barang.stock_masuk}</TableCell>
                                    <TableCell>{barang.stock_tersedia}</TableCell>
                                    <TableCell className="space-x-2">
                                        {hasAnyPermission(["barangs edit"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/barangs/${barang.id}/edit`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-blue-200 hover:text-blue-600'> <Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Ubah
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["barangs delete"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={barang.id} featured='barangs' />
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
