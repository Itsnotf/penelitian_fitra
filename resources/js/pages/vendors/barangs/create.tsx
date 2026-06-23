import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Barang, BreadcrumbItem, Vendor } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    vendor: Vendor;
    barangs: Barang[];
}

export default function VendorBarangCreatePage({ vendor, barangs }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Vendor', href: '/vendors' },
        { title: vendor.nama_vendor, href: `/vendors/${vendor.id}/barangs` },
        { title: 'Tambah Barang', href: `/vendors/${vendor.id}/barangs/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        barang_id: '',
        harga: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/vendors/${vendor.id}/barangs`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tambah Barang — ${vendor.nama_vendor}`} />
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
                <div className="grid gap-6 max-w-lg">
                    <div className="rounded-md border bg-muted/30 p-3">
                        <p className="font-semibold">{vendor.nama_vendor}</p>
                        <p className="text-sm text-muted-foreground">{vendor.email ?? '—'} · {vendor.telepon ?? '—'}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="barang_id">Barang <span className="text-red-500">*</span></Label>
                        {barangs.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Semua barang sudah ditambahkan ke vendor ini.</p>
                        ) : (
                            <Combobox
                                value={data.barang_id}
                                onValueChange={(v) => setData('barang_id', v)}
                                placeholder="Pilih barang"
                                searchPlaceholder="Cari barang..."
                                emptyText="Barang tidak ditemukan."
                                options={barangs.map((b) => ({
                                    value: b.id.toString(),
                                    label: `${b.nama_barang} (${b.satuan}) — ${b.tipe_barang?.nama_tipe ?? 'Tanpa tipe'}`,
                                }))}
                            />
                        )}
                        <InputError message={errors.barang_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="harga">Harga Satuan (Rp) <span className="text-red-500">*</span></Label>
                        <Input id="harga" type="number" min="0" required placeholder="contoh: 15000"
                            value={data.harga} onChange={(e) => setData('harga', e.target.value)} />
                        <InputError message={errors.harga} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing || barangs.length === 0}>
                            {processing ? <><Spinner className="mr-2" /> Menyimpan...</> : 'Tambah Barang'}
                        </Button>
                        <Link href={`/vendors/${vendor.id}/barangs`}>
                            <Button variant="outline" type="button">Kembali</Button>
                        </Link>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
