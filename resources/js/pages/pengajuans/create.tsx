import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import pengajuans, { store } from '@/routes/pengajuans';
import { Barang, BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { Head, Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface Props {
    barangs: Pick<Barang, 'id' | 'nama_barang' | 'satuan' | 'tipe'>[];
}

interface ItemRow {
    barang_id: string;
    jumlah: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengajuan', href: pengajuans.index().url },
    { title: 'Buat', href: pengajuans.create().url },
];

export default function PengajuanCreatePage({ barangs }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        deskripsi: string;
        urgensi: string;
        items: ItemRow[];
    }>({
        deskripsi: '',
        urgensi: 'normal',
        items: [{ barang_id: '', jumlah: 1 }],
    });

    const addItem = () =>
        setData('items', [...data.items, { barang_id: '', jumlah: 1 }]);

    const removeItem = (index: number) =>
        setData('items', data.items.filter((_, i) => i !== index));

    const updateItem = (index: number, field: keyof ItemRow, value: string | number) => {
        const updated = [...data.items];
        updated[index] = { ...updated[index], [field]: value };
        setData('items', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    const selectedBarangIds = data.items.map((item) => item.barang_id).filter(Boolean);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengajuan" />
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

                <div className="flex flex-col gap-2">
                    <Label>Daftar Barang</Label>
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
                                                        {barangs.map((b) => (
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
                                                        ))}
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
                        {processing ? <><Spinner className="mr-2" /> Membuat...</> : 'Buat Pengajuan'}
                    </Button>
                    <Link href={pengajuans.index().url}>
                        <Button variant="outline" type="button">Kembali</Button>
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
