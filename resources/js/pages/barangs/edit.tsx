import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Barang, BreadcrumbItem, TipeBarang } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

interface Props {
    barang: Barang;
    tipeBarangs: Pick<TipeBarang, 'id' | 'nama_tipe'>[];
}

export default function BarangEditPage({ barang, tipeBarangs }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Barang', href: '/barangs' },
        { title: 'Edit Barang', href: `/barangs/${barang.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Barang" />
            <Form method="put" action={`/barangs/${barang.id}`} disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="nama_barang">Nama Barang</Label>
                            <Input id="nama_barang" name="nama_barang" type="text" required defaultValue={barang.nama_barang} />
                            <InputError message={errors.nama_barang} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tipe_barang_id">Tipe Barang</Label>
                            <Select name="tipe_barang_id" defaultValue={barang.tipe_barang_id.toString()} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tipeBarangs.map((tipe) => (
                                        <SelectItem key={tipe.id} value={tipe.id.toString()}>{tipe.nama_tipe}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tipe_barang_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="jenis_barang">Jenis Barang</Label>
                            <Select name="jenis_barang" defaultValue={barang.jenis_barang ?? undefined} required>
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
