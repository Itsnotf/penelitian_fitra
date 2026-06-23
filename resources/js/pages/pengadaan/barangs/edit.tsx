import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Barang, BarangPengadaan, BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    barang_pengadaan: BarangPengadaan;
    barangs: (Pick<Barang, 'id' | 'nama_barang' | 'satuan' | 'tipe_barang_id'> & {
        tipe_barang?: { id: number; nama_tipe: string };
    })[];
    pengadaan_id: number;
}

export default function BarangPengadaanEditPage({ barang_pengadaan, barangs, pengadaan_id }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pengadaan', href: '/pengadaan' },
        { title: pengadaan_id.toString(), href: `/pengadaan/${pengadaan_id}` },
        { title: 'Ubah', href: `/pengadaan/${pengadaan_id}/barangs/${barang_pengadaan.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        barang_id: barang_pengadaan.barang_id.toString(),
        jumlah: barang_pengadaan.jumlah,
        harga: barang_pengadaan.harga,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/pengadaan/${pengadaan_id}/barangs/${barang_pengadaan.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah Barang Pengadaan" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
                <div className="grid gap-6 max-w-lg">
                    <div className="grid gap-2">
                        <Label htmlFor="barang_id">Barang</Label>
                        <Combobox
                            value={data.barang_id}
                            onValueChange={(v) => setData('barang_id', v)}
                            placeholder="Pilih barang..."
                            searchPlaceholder="Cari barang..."
                            emptyText="Barang tidak ditemukan."
                            options={barangs.map((barang) => ({
                                value: barang.id.toString(),
                                label: `${barang.nama_barang} (${barang.satuan})`,
                            }))}
                        />
                        <InputError message={errors.barang_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="jumlah">Jumlah</Label>
                        <Input id="jumlah" type="number" required min="1" tabIndex={1}
                            value={data.jumlah} onChange={(e) => setData('jumlah', parseInt(e.target.value) || 1)} />
                        <InputError message={errors.jumlah} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="harga">Harga Satuan</Label>
                        <Input id="harga" type="number" required min="0" tabIndex={2}
                            value={data.harga} onChange={(e) => setData('harga', parseInt(e.target.value) || 0)} />
                        <InputError message={errors.harga} className="mt-2" />
                    </div>

                    <div className="space-x-2">
                        <Button type="submit" disabled={processing} className="mt-2 w-fit">
                            {processing ? <><Spinner className="mr-2" />Menyimpan...</> : 'Perbarui Barang Pengadaan'}
                        </Button>
                        <Link href={`/pengadaan/${pengadaan_id}`}>
                            <Button variant="outline" type="button" className="mt-2 w-fit">Kembali</Button>
                        </Link>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
