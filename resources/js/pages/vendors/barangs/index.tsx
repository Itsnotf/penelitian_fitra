import DeleteButton from '@/components/delete-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import hasAnyPermission from '@/lib/utils';
import { BarangVendor, BreadcrumbItem, Vendor } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2Icon, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    vendor: Vendor;
    barangVendors: { data: BarangVendor[]; links: any[] };
    filters: { search?: string };
    flash?: { success?: string };
}

export default function VendorBarangPage({ vendor, barangVendors, filters, flash }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [shownMessages] = useState(new Set<string>());

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Vendor', href: '/vendors' },
        { title: vendor.nama_vendor, href: `/vendors/${vendor.id}/barangs` },
    ];

    useEffect(() => {
        if (flash?.success && !shownMessages.has(flash.success)) {
            toast.success(flash.success);
            shownMessages.add(flash.success);
        }
    }, [flash?.success]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(`/vendors/${vendor.id}/barangs`, { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Barang — ${vendor.nama_vendor}`} />
            <div className="p-4 space-y-4">
                <div className="rounded-md border bg-muted/30 p-3 text-sm">
                    <p className="font-semibold">{vendor.nama_vendor}</p>
                    <p className="text-muted-foreground">{vendor.email ?? '—'} · {vendor.telepon ?? '—'}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input placeholder="Cari nama barang..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button variant="outline" type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(['vendors barang create']) && (
                        <Link href={`/vendors/${vendor.id}/barangs/create`}>
                            <Button variant="default" className="group flex items-center gap-1">
                                <PlusCircle className="group-hover:rotate-90 transition-all" />
                                Tambah Barang
                            </Button>
                        </Link>
                    )}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Barang</TableHead>
                            <TableHead>Satuan</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Harga (Rp)</TableHead>
                            <TableHead>Terakhir Update Harga</TableHead>
                            <TableHead>Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {barangVendors.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[50vh] text-center">Belum ada barang untuk vendor ini.</TableCell>
                            </TableRow>
                        ) : (
                            barangVendors.data.map((bv) => (
                                <TableRow key={bv.id}>
                                    <TableCell className="font-medium">{bv.barang?.nama_barang}</TableCell>
                                    <TableCell>{bv.barang?.satuan}</TableCell>
                                    <TableCell>{bv.barang?.tipe}</TableCell>
                                    <TableCell>{Number(bv.harga).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        {bv.terakhir_update_harga
                                            ? new Date(bv.terakhir_update_harga).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                                            : <span className="text-muted-foreground text-xs">—</span>}
                                    </TableCell>
                                    <TableCell className="space-x-1">
                                        {hasAnyPermission(['vendors barang edit']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/vendors/${vendor.id}/barangs/${bv.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Ubah Harga</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['vendors barang delete']) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={bv.id} featured={`vendors/${vendor.id}/barangs`} />
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
                    {barangVendors.links.map((link, i) => (
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
