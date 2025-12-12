import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import barangs, { store } from '@/routes/barangs';
import { BreadcrumbItem } from '@/types';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'barangs',
        href: barangs.index().url,
    },
    {
        title: 'Create',
        href: barangs.create().url,
    },
];

export default function UserCreatePage() {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barang" />
            <Form
                {...store.form()}
                disableWhileProcessing
                className="flex flex-col gap-6 p-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="nama_barang">Nama Barang</Label>
                                <Input
                                    id="nama_barang"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="nama_barang"
                                    name="nama_barang"
                                    placeholder="(e.g., Pulpen)"
                                />
                                <InputError
                                    message={errors.nama_barang}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tipe">Tipe Barang</Label>
                                <Select name="tipe" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='atk'>
                                            Alat Tulis Kantor
                                        </SelectItem>
                                        <SelectItem value='elektronik'>
                                            Elektronik
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.tipe} />
                            </div>


                            <div className="grid gap-2">
                                <Label htmlFor="stock_awal">Stock Awal</Label>
                                <Input
                                    id="stock_awal"
                                    type="number"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="stock_awal"
                                    name="stock_awal"
                                    placeholder="(e.g., 100)"
                                />
                                <InputError
                                    message={errors.stock_awal}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="stock_masuk">Stock Masuk</Label>
                                <Input
                                    id="stock_masuk"
                                    type="number"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="stock_masuk"
                                    name="stock_masuk"
                                    placeholder="(e.g., 100)"
                                />
                                <InputError
                                    message={errors.stock_masuk}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="stock_keluar">Stock Keluar</Label>
                                <Input
                                    id="stock_keluar"
                                    type="number"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="stock_keluar"
                                    name="stock_keluar"
                                    placeholder="(e.g., 100)"
                                />
                                <InputError
                                    message={errors.stock_keluar}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="stock_tersedia">Stock Tersedia</Label>
                                <Input
                                    id="stock_tersedia"
                                    type="number"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="stock_tersedia"
                                    name="stock_tersedia"
                                    placeholder="(e.g., 100)"
                                />
                                <InputError
                                    message={errors.stock_keluar}
                                    className="mt-2"
                                />
                            </div>


                            <div className='space-x-2'>
                                <Button type="submit" className="mt-2 w-fit">
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create barang'
                                    )}
                                </Button>
                                <Link href={'/barangs'}>
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
