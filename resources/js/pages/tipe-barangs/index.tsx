import DeleteButton from '@/components/delete-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import hasAnyPermission from '@/lib/utils';
import { BreadcrumbItem, TipeBarang } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2Icon, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    tipeBarangs: { data: TipeBarang[]; links: any[] };
    filters: { search?: string };
    flash?: { success?: string; error?: string };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tipe Barang', href: '/tipe-barangs' }];

export default function TipeBarangPage({ tipeBarangs, filters, flash }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [shownMessages] = useState(new Set<string>());

    useEffect(() => {
        if (flash?.success && !shownMessages.has(flash.success)) {
            toast.success(flash.success);
            shownMessages.add(flash.success);
        }
        if (flash?.error && !shownMessages.has(flash.error)) {
            toast.error(flash.error);
            shownMessages.add(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/tipe-barangs', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tipe Barang" />
            <div className="p-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input placeholder="Cari nama tipe..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button variant="outline" type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(['tipe barangs create']) && (
                        <Link href="/tipe-barangs/create">
                            <Button variant="default" className="group flex items-center gap-1">
                                <PlusCircle className="group-hover:rotate-90 transition-all" />
                                Tambah Tipe Barang
                            </Button>
                        </Link>
                    )}
                </div>

                <p className="text-sm text-muted-foreground">
                    Tipe barang dipakai untuk mengelompokkan barang di halaman Inventaris, filter, dan laporan. Tambahkan tipe baru di sini —
                    tidak perlu lagi menunggu perubahan kode untuk menambah kategori baru.
                </p>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Tipe</TableHead>
                            <TableHead>Jml. Barang</TableHead>
                            <TableHead>Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tipeBarangs.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-[40vh] text-center">Belum ada data tipe barang.</TableCell>
                            </TableRow>
                        ) : (
                            tipeBarangs.data.map((tipeBarang) => (
                                <TableRow key={tipeBarang.id}>
                                    <TableCell className="font-medium">{tipeBarang.nama_tipe}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{tipeBarang.barangs_count ?? 0} barang</Badge>
                                    </TableCell>
                                    <TableCell className="space-x-1">
                                        {hasAnyPermission(['tipe barangs edit']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/tipe-barangs/${tipeBarang.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Ubah</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['tipe barangs delete']) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={tipeBarang.id} featured="tipe-barangs" />
                                                </TooltipTrigger>
                                                <TooltipContent>Hapus</TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="flex gap-1">
                    {tipeBarangs.links.map((link, i) => (
                        <Link key={i} href={link.url ?? '#'}
                            className={`px-3 py-1 flex justify-center items-center border rounded-md text-sm ${link.active ? 'bg-primary text-primary-foreground' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
