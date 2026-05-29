import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, ClipboardCheck, ClipboardList, PackageCheck } from 'lucide-react';
import {
    Bar, BarChart, CartesianGrid, Cell,
    Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const STATUS_COLORS: Record<string, string> = {
    pending: '#f59e0b', proses: '#3b82f6', selesai: '#22c55e', rejected: '#ef4444',
};
const statusLabel: Record<string, string> = { pending: 'Pending', proses: 'Diproses', selesai: 'Selesai', rejected: 'Ditolak' };

interface Props {
    stats: {
        pengajuanPending: number; pengajuanProses: number;
        pengajuanSelesaiBulanIni: number; pembelianSelesaiBulanIni: number;
    };
    pengajuanByStatus:  Record<string, number>;
    pengajuanByUrgensi: Record<string, number>;
    pengajuanMenunggu:  any[];
    recentSelesai:      any[];
}

export default function KepalaBidangDashboard({ stats, pengajuanByStatus, pengajuanByUrgensi, pengajuanMenunggu, recentSelesai }: Props) {
    const statusPieData = Object.entries(pengajuanByStatus).map(([status, total]) => ({
        name: statusLabel[status] ?? status, value: total, status,
    }));
    const urgensiData = [
        { name: 'Normal',   total: pengajuanByUrgensi['normal']   ?? 0, fill: '#64748b' },
        { name: 'Mendesak', total: pengajuanByUrgensi['mendesak'] ?? 0, fill: '#ef4444' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Kepala Bidang" />
            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Pengajuan Menunggu Approval', value: stats.pengajuanPending,         icon: ClipboardList,  color: 'text-yellow-500', bg: 'bg-yellow-50', urgent: stats.pengajuanPending > 0 },
                        { label: 'Pengajuan Sedang Diproses',   value: stats.pengajuanProses,          icon: ClipboardCheck, color: 'text-blue-500',   bg: 'bg-blue-50',   urgent: false },
                        { label: 'Pengajuan Selesai Bulan Ini', value: stats.pengajuanSelesaiBulanIni, icon: CheckCircle2,   color: 'text-green-500',  bg: 'bg-green-50',  urgent: false },
                        { label: 'Pembelian Selesai Bulan Ini', value: stats.pembelianSelesaiBulanIni, icon: PackageCheck,   color: 'text-teal-500',   bg: 'bg-teal-50',   urgent: false },
                    ].map(({ label, value, icon: Icon, color, bg, urgent }) => (
                        <Card key={label} className={`hover:shadow-md transition-shadow ${urgent ? 'border-yellow-300 bg-yellow-50/60' : ''}`}>
                            <CardContent className="flex items-center justify-between p-5">
                                <div>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className={`mt-1 text-2xl font-bold ${urgent ? 'text-yellow-700' : ''}`}>{value}</p>
                                </div>
                                <div className={`rounded-full p-3 ${bg}`}>
                                    <Icon className={`h-5 w-5 ${color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Pie — Status Pengajuan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Status Semua Pengajuan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={statusPieData} cx="50%" cy="50%" outerRadius={85} dataKey="value"
                                        label={({ name, value }) => `${name} (${value})`}>
                                        {statusPieData.map((e) => (
                                            <Cell key={e.status} fill={STATUS_COLORS[e.status] ?? '#94a3b8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Bar — Urgensi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Pengajuan per Urgensi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={urgensiData} margin={{ left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="total" name="Jumlah" radius={[6, 6, 0, 0]}>
                                        {urgensiData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Pengajuan Menunggu Persetujuan */}
                <Card className={pengajuanMenunggu.length > 0 ? 'border-yellow-200' : ''}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <ClipboardList className="h-4 w-4 text-yellow-500" />
                                    Pengajuan Menunggu Persetujuan
                                </CardTitle>
                                <CardDescription>Klik "Tindak Lanjut" untuk melihat detail dan menyetujui</CardDescription>
                            </div>
                            <Link href="/pengajuans"><Button size="sm" variant="ghost" className="text-xs">Lihat Semua</Button></Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pengajuanMenunggu.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-400" />
                                Tidak ada pengajuan yang menunggu persetujuan.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {pengajuanMenunggu.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between rounded-md border border-yellow-100 bg-yellow-50/40 p-3 text-sm hover:bg-yellow-50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate">{p.deskripsi}</p>
                                                <Badge className={p.urgensi === 'mendesak' ? 'bg-red-500 text-white' : 'bg-slate-500 text-white'}>
                                                    {p.urgensi === 'mendesak' ? 'Mendesak' : 'Normal'}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Oleh {p.user.name} · {new Date(p.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <Link href={`/pengajuans/${p.id}`} className="ml-3 shrink-0">
                                            <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-100">
                                                Tindak Lanjut
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Links + Recent Selesai */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Akses Cepat</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            {[
                                { label: 'Semua Pengajuan',  href: '/pengajuans',  className: 'border-blue-200 text-blue-700 hover:bg-blue-50' },
                                { label: 'Semua Pembelian',  href: '/pembelians',  className: 'border-green-200 text-green-700 hover:bg-green-50' },
                                { label: 'Data Barang',      href: '/barangs',     className: 'border-orange-200 text-orange-700 hover:bg-orange-50' },
                            ].map(({ label, href, className }) => (
                                <Link key={href} href={href}>
                                    <Button variant="outline" className={`w-full ${className}`}>{label}</Button>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Pengajuan Selesai Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {recentSelesai.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada pengajuan selesai.</p>
                            ) : recentSelesai.map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                                    <div>
                                        <p className="font-medium truncate max-w-[200px]">{p.deskripsi}</p>
                                        <p className="text-xs text-muted-foreground">{p.user.name}</p>
                                    </div>
                                    <Badge className="bg-green-500 text-white">Selesai</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
