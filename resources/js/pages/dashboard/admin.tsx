import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Box,
    ClipboardList,
    ShoppingCart,
    Store,
    TrendingDown,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const STATUS_COLORS: Record<string, string> = {
    pending: '#f59e0b',
    proses:  '#3b82f6',
    selesai: '#22c55e',
    rejected:'#ef4444',
};

const ROLE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

interface Props {
    stats: {
        totalBarangs: number; totalVendors: number; totalPembelians: number;
        totalPengajuans: number; totalUsers: number; totalStockTersedia: number;
        pembelianPending: number; pengajuanPending: number;
    };
    pembelianByStatus:  Record<string, number>;
    pengajuanByStatus:  Record<string, number>;
    pengajuanByUrgensi: Record<string, number>;
    pembelianBulanan:   { bulan: string; total: number; selesai: number }[];
    usersByRole:        { role: string; total: number }[];
    lowStockBarangs:    { id: number; nama_barang: string; stock_tersedia: number; satuan: string }[];
    recentPembelians:   any[];
    recentPengajuans:   any[];
}

const statusLabel: Record<string, string> = { pending: 'Pending', proses: 'Diproses', selesai: 'Selesai', rejected: 'Ditolak' };

export default function AdminDashboard({
    stats, pembelianByStatus, pengajuanByStatus, pengajuanByUrgensi,
    pembelianBulanan, usersByRole, lowStockBarangs, recentPembelians, recentPengajuans,
}: Props) {

    const pembelianPieData = Object.entries(pembelianByStatus).map(([status, total]) => ({
        name: statusLabel[status] ?? status, value: total, status,
    }));
    const pengajuanPieData = Object.entries(pengajuanByStatus).map(([status, total]) => ({
        name: statusLabel[status] ?? status, value: total, status,
    }));
    const urgensiData = [
        { name: 'Normal',   total: pengajuanByUrgensi['normal']   ?? 0 },
        { name: 'Mendesak', total: pengajuanByUrgensi['mendesak'] ?? 0 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Barang',     value: stats.totalBarangs,       icon: Box,           color: 'text-blue-500',   bg: 'bg-blue-50'   },
                        { label: 'Total Vendor',      value: stats.totalVendors,       icon: Store,         color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'Total Pembelian',   value: stats.totalPembelians,    icon: ShoppingCart,  color: 'text-green-500',  bg: 'bg-green-50'  },
                        { label: 'Total Pengajuan',   value: stats.totalPengajuans,    icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Total Pengguna',    value: stats.totalUsers,         icon: Users,         color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { label: 'Stok Tersedia',     value: stats.totalStockTersedia, icon: TrendingUp,    color: 'text-teal-500',   bg: 'bg-teal-50'   },
                        { label: 'Pembelian Pending', value: stats.pembelianPending,   icon: TrendingDown,  color: 'text-yellow-500', bg: 'bg-yellow-50' },
                        { label: 'Pengajuan Pending', value: stats.pengajuanPending,   icon: AlertTriangle, color: 'text-red-500',    bg: 'bg-red-50'    },
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

                {/* Line Chart — Pembelian 6 Bulan */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aktivitas Pembelian (6 Bulan Terakhir)</CardTitle>
                        <CardDescription>Total pembelian dibuat vs yang sudah selesai</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={pembelianBulanan} margin={{ left: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total"   name="Total Dibuat" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="selesai" name="Selesai"       stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie Charts Row */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Pembelian by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Status Pembelian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={pembelianPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                                        {pembelianPieData.map((entry) => (
                                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pengajuan by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Status Pengajuan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={pengajuanPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                                        {pengajuanPieData.map((entry) => (
                                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pengajuan by Urgensi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Urgensi Pengajuan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={urgensiData} margin={{ left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="total" name="Jumlah" radius={[4, 4, 0, 0]}>
                                        <Cell fill="#64748b" />
                                        <Cell fill="#ef4444" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Users by Role + Low Stock */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Pengguna per Peran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={usersByRole} layout="vertical" margin={{ left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <YAxis type="category" dataKey="role" tick={{ fontSize: 12 }} width={90} />
                                    <Tooltip />
                                    <Bar dataKey="total" name="Jumlah" radius={[0, 4, 4, 0]}>
                                        {usersByRole.map((_, i) => <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Low Stock Alert */}
                    <Card className={lowStockBarangs.length > 0 ? 'border-amber-200 bg-amber-50/50' : ''}>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className={`h-4 w-4 ${lowStockBarangs.length > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                                <CardTitle className="text-sm">Stok Menipis (&lt; 10)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {lowStockBarangs.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Semua stok dalam kondisi aman.</p>
                            ) : (
                                <div className="space-y-2">
                                    {lowStockBarangs.map((b) => (
                                        <div key={b.id} className="flex items-center justify-between rounded-md bg-white p-2 text-sm shadow-sm">
                                            <span className="font-medium">{b.nama_barang}</span>
                                            <Badge className="bg-amber-500 text-white">{b.stock_tersedia} {b.satuan}</Badge>
                                        </div>
                                    ))}
                                    <Link href="/barangs">
                                        <Button size="sm" variant="outline" className="mt-2 w-full text-amber-700 border-amber-300">Lihat Semua Barang</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm">Pembelian Terbaru</CardTitle>
                                <Link href="/pembelians"><Button size="sm" variant="ghost" className="text-xs">Lihat Semua</Button></Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {recentPembelians.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada pembelian.</p>
                            ) : recentPembelians.map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between rounded-md border p-2 text-sm hover:bg-accent transition-colors">
                                    <div>
                                        <p className="font-medium">{p.vendor?.nama_vendor ?? 'Tanpa vendor'}</p>
                                        <p className="text-xs text-muted-foreground">{p.user.name} · {new Date(p.created_at).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <Badge className={`text-white ${STATUS_COLORS[p.status] ? '' : 'bg-gray-400'}`} style={{ backgroundColor: STATUS_COLORS[p.status] }}>
                                        {statusLabel[p.status] ?? p.status}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm">Pengajuan Terbaru</CardTitle>
                                <Link href="/pengajuans"><Button size="sm" variant="ghost" className="text-xs">Lihat Semua</Button></Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {recentPengajuans.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada pengajuan.</p>
                            ) : recentPengajuans.map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between rounded-md border p-2 text-sm hover:bg-accent transition-colors">
                                    <div>
                                        <p className="font-medium truncate max-w-[180px]">{p.deskripsi}</p>
                                        <p className="text-xs text-muted-foreground">{p.user.name} · {p.urgensi}</p>
                                    </div>
                                    <Badge className="text-white" style={{ backgroundColor: STATUS_COLORS[p.status] ?? '#94a3b8' }}>
                                        {statusLabel[p.status] ?? p.status}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
