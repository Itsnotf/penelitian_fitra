import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Box, PackageCheck, ShoppingCart, Store } from 'lucide-react';
import {
    Bar, BarChart, CartesianGrid, Cell, Legend,
    Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const STATUS_COLORS: Record<string, string> = {
    pending: '#f59e0b', proses: '#3b82f6', selesai: '#22c55e',
};

interface Props {
    stats: {
        totalBarangs: number; totalVendors: number; pembelianPending: number;
        pembelianProses: number; totalJumlahPermintaan: number; deficitCount: number;
    };
    stockVsPermintaan: { nama: string; stock_tersedia: number; jumlah_permintaan: number }[];
    pembelianByStatus: Record<string, number>;
    deficitBarangs:    { id: number; nama_barang: string; stock_tersedia: number; jumlah_permintaan: number; satuan: string }[];
    pembelianMenunggu: any[];
}

const statusLabel: Record<string, string> = { pending: 'Pending', proses: 'Diproses', selesai: 'Selesai' };

export default function TataKelolaDashboard({ stats, stockVsPermintaan, pembelianByStatus, deficitBarangs, pembelianMenunggu }: Props) {
    const pembelianPieData = Object.entries(pembelianByStatus).map(([status, total]) => ({
        name: statusLabel[status] ?? status, value: total, status,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Tata Kelola" />
            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        { label: 'Total Barang',         value: stats.totalBarangs,          icon: Box,          color: 'text-blue-500',   bg: 'bg-blue-50'   },
                        { label: 'Total Vendor',          value: stats.totalVendors,          icon: Store,        color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'Pembelian Pending',     value: stats.pembelianPending,      icon: ShoppingCart, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                        { label: 'Pembelian Diproses',    value: stats.pembelianProses,       icon: PackageCheck, color: 'text-blue-500',   bg: 'bg-blue-50'   },
                        { label: 'Total Permintaan',      value: stats.totalJumlahPermintaan, icon: Box,          color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Barang Defisit Stok',   value: stats.deficitCount,          icon: AlertTriangle,color: 'text-red-500',    bg: 'bg-red-50'    },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <Card key={label} className="hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center justify-between p-5">
                                <div>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className="mt-1 text-2xl font-bold">{value.toLocaleString('id-ID')}</p>
                                </div>
                                <div className={`rounded-full p-3 ${bg}`}>
                                    <Icon className={`h-5 w-5 ${color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bar Chart — Stok vs Permintaan */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stok Tersedia vs Jumlah Permintaan</CardTitle>
                        <CardDescription>Barang yang sedang ada permintaan (maks. 8 tertinggi)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stockVsPermintaan.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">Tidak ada permintaan aktif saat ini.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={stockVsPermintaan} margin={{ left: -10, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="nama" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" interval={0} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend verticalAlign="top" />
                                    <Bar dataKey="stock_tersedia"    name="Stok Tersedia"    fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="jumlah_permintaan" name="Jml. Permintaan"  fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Pie + Deficit */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Status Pembelian Pie */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Distribusi Status Pembelian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={pembelianPieData} cx="50%" cy="50%" outerRadius={85} dataKey="value"
                                        label={({ name, value }) => `${name} (${value})`}>
                                        {pembelianPieData.map((e) => (
                                            <Cell key={e.status} fill={STATUS_COLORS[e.status] ?? '#94a3b8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Deficit Barangs */}
                    <Card className={deficitBarangs.length > 0 ? 'border-red-200 bg-red-50/40' : ''}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className={`h-4 w-4 ${deficitBarangs.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
                                    <CardTitle className="text-sm">Barang Defisit Stok</CardTitle>
                                </div>
                                {deficitBarangs.length > 0 && (
                                    <Link href="/barangs">
                                        <Button size="sm" variant="outline" className="text-xs border-red-300 text-red-700">Kelola</Button>
                                    </Link>
                                )}
                            </div>
                            <CardDescription>Stok tersedia &lt; jumlah permintaan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {deficitBarangs.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Semua stok mencukupi permintaan.</p>
                            ) : (
                                <div className="space-y-2">
                                    {deficitBarangs.map((b) => {
                                        const deficit = b.jumlah_permintaan - b.stock_tersedia;
                                        const pct = Math.round((b.stock_tersedia / b.jumlah_permintaan) * 100);
                                        return (
                                            <div key={b.id} className="rounded-md bg-white p-3 shadow-sm text-sm">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium">{b.nama_barang}</span>
                                                    <Badge className="bg-red-500 text-white">-{deficit} {b.satuan}</Badge>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-red-100">
                                                    <div className="h-2 rounded-full bg-red-400" style={{ width: `${pct}%` }} />
                                                </div>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {b.stock_tersedia} tersedia / {b.jumlah_permintaan} diminta
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Pembelian Menunggu */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm">Pembelian Perlu Tindak Lanjut</CardTitle>
                                <CardDescription>Pending &amp; sedang diproses</CardDescription>
                            </div>
                            <Link href="/pembelians"><Button size="sm" variant="ghost" className="text-xs">Lihat Semua</Button></Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pembelianMenunggu.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Tidak ada pembelian yang menunggu.</p>
                        ) : (
                            <div className="space-y-2">
                                {pembelianMenunggu.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-accent transition-colors">
                                        <div>
                                            <p className="font-medium">{p.vendor?.nama_vendor ?? <span className="text-muted-foreground italic">Tanpa vendor</span>}</p>
                                            <p className="text-xs text-muted-foreground">{p.deskripsi} · {new Date(p.created_at).toLocaleDateString('id-ID')}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge style={{ backgroundColor: STATUS_COLORS[p.status] }} className="text-white">
                                                {statusLabel[p.status] ?? p.status}
                                            </Badge>
                                            <Link href={`/pembelians/${p.id}`}>
                                                <Button size="sm" variant="outline" className="text-xs">Detail</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
