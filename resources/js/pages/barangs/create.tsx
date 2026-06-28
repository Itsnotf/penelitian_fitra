import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TipeBarang } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

interface Props {
    tipeBarangs: Pick<TipeBarang, 'id' | 'nama_tipe'>[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Barang', href: '/barangs' },
    { title: 'Tambah Barang', href: '/barangs/create' },
];

export default function BarangCreatePage({ tipeBarangs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Barang" />
            <Form method="post" action="/barangs" disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="nama_barang">Nama Barang</Label>
                            <Input id="nama_barang" name="nama_barang" type="text" required autoFocus placeholder="contoh: Kertas A4" />
                            <InputError message={errors.nama_barang} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tipe_barang_id">Tipe Barang</Label>
                            <Select name="tipe_barang_id" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tipeBarangs.length === 0 ? (
                                        <div className="py-2 px-3 text-sm text-muted-foreground">
                                            Belum ada tipe barang. Tambahkan dulu di menu Tipe Barang.
                                        </div>
                                    ) : (
                                        tipeBarangs.map((tipe) => (
                                            <SelectItem key={tipe.id} value={tipe.id.toString()}>{tipe.nama_tipe}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tipe_barang_id} />
                            <p className="text-xs text-muted-foreground">
                                Tidak menemukan tipe yang sesuai? Tambahkan di menu{' '}
                                <Link href="/tipe-barangs/create" className="underline">Tipe Barang</Link>.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="jenis_barang">Jenis Barang</Label>
                            <Select name="jenis_barang" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="habis_pakai">Habis Pakai</SelectItem>
                                    <SelectItem value="tidak_habis_pakai">Tidak Habis Pakai</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.jenis_barang} />
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
