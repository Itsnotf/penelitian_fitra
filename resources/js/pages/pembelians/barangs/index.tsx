import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import DeleteButton from '@/components/delete-button';
import { Edit2Icon, PlusCircle } from 'lucide-react';
import { Barang, BarangPembelian, BreadcrumbItem, Pembelian, SharedData } from '@/types';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import hasAnyPermission from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import pembelians from '@/routes/pembelians';


interface Props {
    pembelian: Pembelian;
    barangs: {
        data: BarangPembelian[];
        links: any[];
    };
    filters: {
        search?: string;
    };
    flash?: {
        success?: string;
    };
}



export default function PembelianPage({ barangs, pembelian, filters, flash }: Props) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pembelian',
            href: '/pembelians',
        },
        {
            title: pembelian.id.toString(),
            href: pembelians.show(pembelian.id).url,
        },
        {
            title: 'Detail',
            href: pembelians.show(pembelian.id).url,
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
        router.get(pembelians.show(pembelian.id), { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pembelian" />

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
                    {hasAnyPermission(["pembelians barang create"]) && pembelian.status === 'pending' && (
                        <Link href={pembelians.barangs.create(pembelian.id).url}>
                            <Button variant='default' className='group flex items-center'>
                                <PlusCircle className='group-hover:rotate-90 transition-all' />
                                Add Barang
                            </Button>
                        </Link>
                    )}
                </div>

                {/* User Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Barang</TableHead>
                            <TableHead>Harga</TableHead>
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
                                    <TableCell>{barang.harga}</TableCell>
                                    <TableCell>{barang.jumlah}</TableCell>
                                    <TableCell className="space-x-2">
                                        {hasAnyPermission(["pembelians barang edit"]) && pembelian.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/pembelians/${pembelian.id}/barangs/edit/${barang.id}`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-blue-200 hover:text-blue-600'> <Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Ubah
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["pembelians barang delete"]) && pembelian.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={barang.id} featured={`pembelians/${pembelian.id}/barangs`} />
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
