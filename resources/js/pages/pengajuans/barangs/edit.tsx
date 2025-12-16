import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem, Barang } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface BarangPengajuan {
    id: number;
    pengajuan_id: number;
    barang_id: number;
    jumlah: number;
}

interface Props {
    barang_pengajuan: BarangPengajuan;
    barangs: Barang[];
    pengajuan_id: number;
}

export default function BarangPengajuanEditPage({ barang_pengajuan, barangs, pengajuan_id }: Props) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pengajuan',
            href: '/pengajuans',
        },
        {
            title: pengajuan_id.toString(),
            href: `/pengajuans/${pengajuan_id}`,
        },
        {
            title: 'Edit',
            href: `/pengajuans/${pengajuan_id}/barangs/${barang_pengajuan.id}/edit`,
        },
    ];

    const handleDeleteClick = () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            router.delete(
                `/pengajuans/${pengajuan_id}/barangs/${barang_pengajuan.id}`,
                {
                    onSuccess: () => {
                        router.visit(`/pengajuans/${pengajuan_id}`);
                    }
                }
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Barang Pengajuan" />
            <Form
                method="put"
                action={`/pengajuans/${pengajuan_id}/barangs/${barang_pengajuan.id}`}
                disableWhileProcessing
                className="flex flex-col gap-6 p-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">

                                <Input id='pengajuan_id' type="hidden" name="pengajuan_id" value={pengajuan_id} />
                                <Label htmlFor="barang_id">Barang</Label>
                                <Select
                                    name="barang_id"
                                    required
                                    defaultValue={barang_pengajuan.barang_id.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Barang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {barangs.map((barang) => (
                                            <SelectItem key={barang.id} value={barang.id.toString()}>
                                                {barang.nama_barang}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.barang_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="jumlah">Jumlah</Label>
                                <Input
                                    id="jumlah"
                                    type="number"
                                    required
                                    tabIndex={1}
                                    autoComplete="jumlah"
                                    name="jumlah"
                                    defaultValue={barang_pengajuan.jumlah}
                                    placeholder="(e.g., 10)"
                                    min="1"
                                />
                                <InputError
                                    message={errors.jumlah}
                                    className="mt-2"
                                />
                            </div>

                            <div className='space-x-2'>
                                <Button type="submit" className="mt-2 w-fit">
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Barang Pengajuan'
                                    )}
                                </Button>
                                <Link href={`/pengajuans/${pengajuan_id}`}>
                                    <Button variant='outline' type="button" className="mt-2 w-fit">
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
