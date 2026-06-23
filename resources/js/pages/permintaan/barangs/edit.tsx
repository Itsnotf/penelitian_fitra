import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Barang, BarangPermintaan, BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    barang_permintaan: BarangPermintaan;
    barangs: (Pick<Barang, 'id' | 'nama_barang' | 'satuan' | 'tipe_barang_id'> & {
        tipe_barang?: { id: number; nama_tipe: string };
    })[];
    permintaan_id: number;
}

export default function BarangPermintaanEditPage({ barang_permintaan, barangs, permintaan_id }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Permintaan', href: '/permintaan' },
        { title: permintaan_id.toString(), href: `/permintaan/${permintaan_id}` },
        { title: 'Ubah', href: `/permintaan/${permintaan_id}/barangs/${barang_permintaan.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        barang_id: barang_permintaan.barang_id.toString(),
        jumlah: barang_permintaan.jumlah,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/permintaan/${permintaan_id}/barangs/${barang_permintaan.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah Barang Permintaan" />
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

                    <div className="space-x-2">
                        <Button type="submit" disabled={processing} className="mt-2 w-fit">
                            {processing ? <><Spinner className="mr-2" />Menyimpan...</> : 'Perbarui Barang Permintaan'}
                        </Button>
                        <Link href={`/permintaan/${permintaan_id}`}>
                            <Button variant="outline" type="button" className="mt-2 w-fit">Kembali</Button>
                        </Link>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
