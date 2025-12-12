import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import pembelians from '@/routes/pembelians';
import { Barang, BarangPembelian, BreadcrumbItem } from '@/types';
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
import { update } from '@/routes/pembelians/barangs';


interface Props {
    barang_pembelian: BarangPembelian;
    barangs: Barang[];
    pembelian_id: number;
}

export default function BarangPembelianEditPage({ barang_pembelian, barangs, pembelian_id }: Props) {
   

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pembelian',
            href: pembelians.index().url,
        },
        {
            title: pembelian_id.toString(),
            href: pembelians.show(pembelian_id).url,
        },
        {
            title: 'Edit',
            href: pembelians.barangs.edit({pembelian_id: barang_pembelian.pembelian_id.toString(), barang_Pembelian_id: barang_pembelian.id}).url,
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Barang Pembelian" />
            <Form
                {...update.form({pembelian_id: barang_pembelian.pembelian_id, barang_Pembelian_id: barang_pembelian.id} )}
                disableWhileProcessing
                className="flex flex-col gap-6 p-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <Input type="hidden" name="pembelian_id" value={pembelian_id} />
                            <div className="grid gap-2">
                                <Label htmlFor="barang_id">Barang</Label>
                                <Select
                                    name="barang_id"
                                    required
                                    defaultValue={barang_pembelian.barang_id.toString()}
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
                                    type="text"
                                    required
                                    tabIndex={1}
                                    autoComplete="jumlah"
                                    name="jumlah"
                                    defaultValue={barang_pembelian.jumlah}
                                    placeholder="(e.g., 10)"
                                />
                                <InputError
                                    message={errors.jumlah}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="harga">Harga Satuan</Label>
                                <Input
                                    id="harga"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    autoComplete="harga"
                                    name="harga"
                                    defaultValue={barang_pembelian.harga}
                                    placeholder="(e.g., 5000)"
                                />
                                <InputError
                                    message={errors.harga}
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
                                        'Update Barang Pembelian'
                                    )}
                                </Button>
                                <Link href={pembelians.show(pembelian_id).url}>
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
