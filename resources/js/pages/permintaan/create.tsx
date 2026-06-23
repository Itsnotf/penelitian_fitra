import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Barang, BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    barangs: (Pick<Barang, 'id' | 'nama_barang' | 'satuan' | 'tipe_barang_id'> & {
        tipe_barang?: { id: number; nama_tipe: string };
    })[];
}

interface ItemRow {
    barang_id: string;
    jumlah: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Permintaan', href: '/permintaan' },
    { title: 'Buat', href: '/permintaan/create' },
];

export default function PermintaanCreatePage({ barangs }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        deskripsi: string;
        urgensi: string;
        items: ItemRow[];
    }>({
        deskripsi: '',
        urgensi: 'normal',
        items: [{ barang_id: '', jumlah: 1 }],
    });

    const [filterTipe, setFilterTipe] = useState<string>('_semua');

    const tipeOptions = Array.from(
        new Map(
            barangs.filter((b) => b.tipe_barang).map((b) => [b.tipe_barang!.id, b.tipe_barang!.nama_tipe]),
        ).entries(),
    ).sort((a, b) => a[1].localeCompare(b[1]));

    const getBarangsForRow = (currentBarangId: string) =>
        barangs.filter(
            (b) => filterTipe === '_semua' || b.tipe_barang_id.toString() === filterTipe || b.id.toString() === currentBarangId,
        );

    const addItem = () => setData('items', [...data.items, { barang_id: '', jumlah: 1 }]);

    const removeItem = (index: number) =>
        setData('items', data.items.filter((_, i) => i !== index));

    const updateItem = (index: number, field: keyof ItemRow, value: string | number) => {
        const updated = [...data.items];
        updated[index] = { ...updated[index], [field]: value };
        setData('items', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/permintaan');
    };

    const selectedBarangIds = data.items.map((item) => item.barang_id).filter(Boolean);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Permintaan" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
                <div className="grid gap-6 max-w-2xl">
                    <div className="grid gap-2">
                        <Label htmlFor="deskripsi">Deskripsi Kebutuhan</Label>
                        <Textarea
                            id="deskripsi"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            className="min-h-32"
                            placeholder="Jelaskan kebutuhan barang secara singkat..."
                            autoFocus
                        />
                        <InputError message={errors.deskripsi} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="urgensi">Urgensi</Label>
                        <Select value={data.urgensi} onValueChange={(v) => setData('urgensi', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih urgensi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="mendesak">Mendesak</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.urgensi} />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between max-w-3xl">
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

                    <div className="border rounded-md overflow-hidden max-w-3xl">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[45%]">Barang</TableHead>
                                    <TableHead className="w-[20%]">Jumlah</TableHead>
                                    <TableHead className="w-[25%]">Satuan</TableHead>
                                    <TableHead className="w-[10%]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((item, index) => {
                                    const selectedBarang = barangs.find((b) => b.id.toString() === item.barang_id);
                                    const rowBarangs = getBarangsForRow(item.barang_id);
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Select
                                                    value={item.barang_id}
                                                    onValueChange={(v) => updateItem(index, 'barang_id', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih barang..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {rowBarangs.length === 0 ? (
                                                            <div className="py-2 px-3 text-sm text-muted-foreground">
                                                                Tidak ada barang untuk tipe ini.
                                                            </div>
                                                        ) : (
                                                            rowBarangs.map((b) => (
                                                                <SelectItem
                                                                    key={b.id}
                                                                    value={b.id.toString()}
                                                                    disabled={
                                                                        selectedBarangIds.includes(b.id.toString()) &&
                                                                        item.barang_id !== b.id.toString()
                                                                    }
                                                                >
                                                                    {b.nama_barang}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={(errors as Record<string, string>)[`items.${index}.barang_id`]} />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={item.jumlah}
                                                    onChange={(e) => updateItem(index, 'jumlah', parseInt(e.target.value) || 1)}
                                                    className="w-24"
                                                />
                                                <InputError message={(errors as Record<string, string>)[`items.${index}.jumlah`]} />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {selectedBarang?.satuan ?? '—'}
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

                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing ? <><Spinner className="mr-2" /> Membuat...</> : 'Buat Permintaan'}
                    </Button>
                    <Link href="/permintaan">
                        <Button variant="outline" type="button">Kembali</Button>
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
