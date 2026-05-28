import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Barang, BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import barangs, { update } from '@/routes/barangs';

interface Props {
    barang: Barang;
}

export default function BarangEditPage({ barang }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inventaris', href: barangs.index().url },
        { title: 'Edit Barang', href: barangs.edit(barang.id).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Barang" />
            <Form {...update.form(barang.id)} disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="nama_barang">Nama Barang</Label>
                            <Input id="nama_barang" name="nama_barang" type="text" required defaultValue={barang.nama_barang} />
                            <InputError message={errors.nama_barang} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tipe">Tipe Barang</Label>
                            <Select name="tipe" defaultValue={barang.tipe} required>
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
                            <Input id="satuan" name="satuan" type="text" required defaultValue={barang.satuan} placeholder="contoh: Rim, Pcs, Box" />
                            <InputError message={errors.satuan} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="stock_awal">Stok Awal</Label>
                            <Input id="stock_awal" name="stock_awal" type="number" min="0" required defaultValue={barang.stock_awal} />
                            <InputError message={errors.stock_awal} />
                        </div>

                        {/* Info readonly */}
                        <div className="grid grid-cols-3 gap-3 rounded-md border bg-muted/30 p-3 text-sm">
                            <div><p className="text-muted-foreground text-xs">Stok Masuk</p><p className="font-medium">{barang.stock_masuk}</p></div>
                            <div><p className="text-muted-foreground text-xs">Stok Keluar</p><p className="font-medium">{barang.stock_keluar}</p></div>
                            <div><p className="text-muted-foreground text-xs">Stok Tersedia</p><p className="font-medium">{barang.stock_tersedia}</p></div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? <><Spinner className="mr-2" /> Menyimpan...</> : 'Perbarui Barang'}
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
