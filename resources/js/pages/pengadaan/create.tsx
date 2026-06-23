import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Barang, BreadcrumbItem, Vendor } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    vendors: Pick<Vendor, 'id' | 'nama_vendor'>[];
    barangs: (Pick<Barang, 'id' | 'nama_barang' | 'satuan' | 'tipe_barang_id'> & {
        tipe_barang?: { id: number; nama_tipe: string };
    })[];
    allVendorPrices: Record<string, Record<string, number>>;
}

interface ItemRow {
    barang_id: string;
    jumlah: number;
    harga: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengadaan', href: '/pengadaan' },
    { title: 'Buat', href: '/pengadaan/create' },
];

export default function PengadaanCreatePage({ vendors, barangs, allVendorPrices }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        vendor_id: string;
        deskripsi: string;
        dokumen: File | null;
        items: ItemRow[];
    }>({
        vendor_id: '',
        deskripsi: '',
        dokumen: null,
        items: [{ barang_id: '', jumlah: 1, harga: 0 }],
    });

    const [filterTipe, setFilterTipe] = useState<string>('_semua');

    const tipeOptions = Array.from(
        new Map(
            barangs.filter((b) => b.tipe_barang).map((b) => [b.tipe_barang!.id, b.tipe_barang!.nama_tipe]),
        ).entries(),
    ).sort((a, b) => a[1].localeCompare(b[1]));

    const getBarangsForRow = (currentBarangId: string) =>
        barangs.filter(
            (b) =>
                filterTipe === '_semua' ||
                b.tipe_barang_id.toString() === filterTipe ||
                b.id.toString() === currentBarangId,
        );

    const handleVendorChange = (vendorId: string) => {
        setData((prev) => ({
            ...prev,
            vendor_id: vendorId,
            items: prev.items.map((item) => ({
                ...item,
                harga: allVendorPrices[vendorId]?.[item.barang_id] ?? item.harga,
            })),
        }));
    };

    const addItem = () =>
        setData('items', [...data.items, { barang_id: '', jumlah: 1, harga: 0 }]);

    const removeItem = (index: number) =>
        setData('items', data.items.filter((_, i) => i !== index));

    const updateItem = (index: number, field: keyof ItemRow, value: string | number) => {
        const updated = [...data.items];
        if (field === 'barang_id' && data.vendor_id) {
            updated[index] = {
                ...updated[index],
                barang_id: value as string,
                harga: allVendorPrices[data.vendor_id]?.[value as string] ?? 0,
            };
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        setData('items', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pengadaan', { forceFormData: true });
    };

    const totalKeseluruhan = data.items.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    const selectedBarangIds = data.items.map((item) => item.barang_id).filter(Boolean);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengadaan" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
                <div className="grid gap-6 max-w-2xl">
                    <div className="grid gap-2">
                        <Label htmlFor="vendor_id">Vendor</Label>
                        <Select value={data.vendor_id} onValueChange={handleVendorChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih vendor (opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {vendors.length === 0 ? (
                                    <SelectItem value="0" disabled>Belum ada vendor terdaftar</SelectItem>
                                ) : (
                                    vendors.map((v) => (
                                        <SelectItem key={v.id} value={v.id.toString()}>{v.nama_vendor}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Opsional — dapat diisi setelah pengadaan dibuat.</p>
                        <InputError message={errors.vendor_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Textarea
                            id="deskripsi"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            className="min-h-32"
                            placeholder="Jelaskan keperluan pengadaan ini..."
                            autoFocus
                        />
                        <InputError message={errors.deskripsi} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="dokumen">Dokumen Bukti Pengadaan</Label>
                        <Input
                            id="dokumen"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                            onChange={(e) => setData('dokumen', e.target.files?.[0] ?? null)}
                        />
                        <p className="text-xs text-muted-foreground">Format: PDF, DOC, DOCX, JPG, PNG, GIF (Maks: 5MB)</p>
                        <InputError message={errors.dokumen} />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between max-w-4xl">
                        <Label>Daftar Barang</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Filter tipe:</span>
                            <Select value={filterTipe} onValueChange={setFilterTipe}>
                                <SelectTrigger className="w-44">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="_semua">Semua tipe</SelectItem>
                                    {tipeOptions.map(([id, nama]) => (
                                        <SelectItem key={id} value={id.toString()}>{nama}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {(errors as Record<string, string>).items && (
                        <InputError message={(errors as Record<string, string>).items} />
                    )}

                    <div className="border rounded-md overflow-hidden max-w-4xl">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[35%]">Barang</TableHead>
                                    <TableHead className="w-[12%]">Jumlah</TableHead>
                                    <TableHead className="w-[22%]">Harga (Rp)</TableHead>
                                    <TableHead className="w-[20%]">Total</TableHead>
                                    <TableHead className="w-[11%]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((item, index) => {
                                    const selectedBarang = barangs.find((b) => b.id.toString() === item.barang_id);
                                    const rowBarangs = getBarangsForRow(item.barang_id);
                                    const isVendorPrice =
                                        data.vendor_id &&
                                        item.barang_id &&
                                        allVendorPrices[data.vendor_id]?.[item.barang_id] !== undefined;

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Combobox
                                                    value={item.barang_id}
                                                    onValueChange={(v) => updateItem(index, 'barang_id', v)}
                                                    placeholder="Pilih barang..."
                                                    searchPlaceholder="Cari barang..."
                                                    emptyText="Tidak ada barang untuk tipe ini."
                                                    options={rowBarangs.map((b) => ({
                                                        value: b.id.toString(),
                                                        label: b.nama_barang,
                                                        disabled:
                                                            selectedBarangIds.includes(b.id.toString()) &&
                                                            item.barang_id !== b.id.toString(),
                                                    }))}
                                                />
                                                <InputError message={(errors as Record<string, string>)[`items.${index}.barang_id`]} />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={item.jumlah}
                                                    onChange={(e) => updateItem(index, 'jumlah', parseInt(e.target.value) || 1)}
                                                    className="w-20"
                                                />
                                                <InputError message={(errors as Record<string, string>)[`items.${index}.jumlah`]} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            value={item.harga}
                                                            onChange={(e) => updateItem(index, 'harga', parseInt(e.target.value) || 0)}
                                                            className="w-28"
                                                        />
                                                        {isVendorPrice && (
                                                            <Badge variant="secondary" className="text-xs whitespace-nowrap">Harga Vendor</Badge>
                                                        )}
                                                    </div>
                                                    <InputError message={(errors as Record<string, string>)[`items.${index}.harga`]} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {selectedBarang
                                                    ? `Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}`
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(index)}
                                                    disabled={data.items.length === 1}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <Button type="button" variant="outline" onClick={addItem} className="w-fit">
                        + Tambah Barang
                    </Button>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium">
                    <span>Total Keseluruhan:</span>
                    <span className="text-base font-semibold">Rp {totalKeseluruhan.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing ? <><Spinner className="mr-2" /> Membuat...</> : 'Buat Pengadaan'}
                    </Button>
                    <Link href="/pengadaan">
                        <Button variant="outline" type="button">Kembali</Button>
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
