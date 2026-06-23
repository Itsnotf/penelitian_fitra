import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Barang, BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface Props {
    barangs: (Pick<Barang, 'id' | 'nama_barang' | 'satuan' | 'tipe_barang_id'> & {
        tipe_barang?: { id: number; nama_tipe: string };
    })[];
    permintaan_id: number;
}

interface ItemRow {
    barang_id: string;
    jumlah: number;
}

export default function BarangPermintaanCreatePage({ barangs, permintaan_id }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Permintaan', href: '/permintaan' },
        { title: permintaan_id.toString(), href: `/permintaan/${permintaan_id}` },
        { title: 'Tambah Barang', href: `/permintaan/${permintaan_id}/barangs/create` },
    ];

    const { data, setData, post, processing, errors } = useForm<{ items: ItemRow[] }>({
        items: [{ barang_id: '', jumlah: 1 }],
    });

    const addItem = () => setData('items', [...data.items, { barang_id: '', jumlah: 1 }]);
    const removeItem = (index: number) => setData('items', data.items.filter((_, i) => i !== index));
    const updateItem = (index: number, field: keyof ItemRow, value: string | number) => {
        const updated = [...data.items];
        updated[index] = { ...updated[index], [field]: value };
        setData('items', updated);
    };

    const selectedBarangIds = data.items.map((item) => item.barang_id).filter(Boolean);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/permintaan/${permintaan_id}/barangs`);
    };

    if (barangs.length === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Tambah Barang Permintaan" />
                <div className="p-4">
                    <p className="text-sm text-muted-foreground">Semua barang yang tersedia sudah ditambahkan ke permintaan ini.</p>
                    <Link href={`/permintaan/${permintaan_id}`}>
                        <Button variant="outline" type="button" className="mt-4">Kembali</Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Barang Permintaan" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
                {(errors as Record<string, string>).items && (
                    <InputError message={(errors as Record<string, string>).items} />
                )}

                <div className="border rounded-md overflow-hidden max-w-2xl">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60%]">Barang</TableHead>
                                <TableHead className="w-[25%]">Jumlah</TableHead>
                                <TableHead className="w-[15%]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.items.map((item, index) => {
                                const rowBarangs = barangs.filter(
                                    (b) => !selectedBarangIds.includes(b.id.toString()) || b.id.toString() === item.barang_id,
                                );

                                return (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Combobox
                                                value={item.barang_id}
                                                onValueChange={(v) => updateItem(index, 'barang_id', v)}
                                                placeholder="Pilih barang..."
                                                searchPlaceholder="Cari barang..."
                                                emptyText="Barang tidak ditemukan."
                                                options={rowBarangs.map((b) => ({
                                                    value: b.id.toString(),
                                                    label: `${b.nama_barang} (${b.satuan})`,
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
                                            />
                                            <InputError message={(errors as Record<string, string>)[`items.${index}.jumlah`]} />
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

                <Button type="button" variant="outline" onClick={addItem} className="w-fit" disabled={data.items.length >= barangs.length}>
                    + Tambah Baris
                </Button>

                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing ? <><Spinner className="mr-2" />Menyimpan...</> : 'Tambah Barang'}
                    </Button>
                    <Link href={`/permintaan/${permintaan_id}`}>
                        <Button variant="outline" type="button">Kembali</Button>
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
