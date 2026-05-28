import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import barangs, { store } from '@/routes/barangs';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventaris', href: barangs.index().url },
    { title: 'Tambah Barang', href: barangs.create().url },
];

export default function BarangCreatePage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Barang" />
            <Form {...store.form()} disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="nama_barang">Nama Barang</Label>
                            <Input id="nama_barang" name="nama_barang" type="text" required autoFocus placeholder="contoh: Kertas A4" />
                            <InputError message={errors.nama_barang} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tipe">Tipe Barang</Label>
                            <Select name="tipe" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ATK">Alat Tulis Kantor</SelectItem>
                                    <SelectItem value="ELEKTRONIK">Elektronik</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tipe} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="satuan">Satuan</Label>
                            <Input id="satuan" name="satuan" type="text" required placeholder="contoh: Rim, Pcs, Box, Unit" />
                            <InputError message={errors.satuan} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="stock_awal">Stok Awal</Label>
                            <Input id="stock_awal" name="stock_awal" type="number" min="0" required placeholder="contoh: 100" />
                            <InputError message={errors.stock_awal} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? <><Spinner className="mr-2" /> Menyimpan...</> : 'Tambah Barang'}
                            </Button>
                            <Link href="/barangs">
                                <Button variant="outline" type="button">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
