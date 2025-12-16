import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Package, Truck, FileText, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import pembelians from '@/routes/pembelians';
import pengajuans from '@/routes/pengajuans';
import barangs from '@/routes/barangs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Barang {
    id: number;
    nama_barang: string;
    stock_tersedia: number;
    stock_awal: number;
}

interface Pembelian {
    id: number;
    vendor: string;
    total_harga: number;
    status: 'pending' | 'finished';
    user: { name: string };
    created_at: string;
}

interface Pengajuan {
    id: number;
    deskripsi: string;
    status: 'pending' | 'approved' | 'rejected';
    user: { name: string };
    created_at: string;
}

interface DashboardData {
    stats: {
        totalBarangs: number;
        totalPembelians: number;
        totalPengajuans: number;
        totalStockAwal: number;
        totalStockMasuk: number;
        totalStockKeluar: number;
        totalStockTersedia: number;
    };
    recentPembelians: Pembelian[];
    recentPengajuans: Pengajuan[];
    lowStockBarangs: Barang[];
    pembeliansByStatus: Record<string, { status: string; total: number }>;
    pengajuansByStatus: Record<string, { status: string; total: number }>;
}

export default function Dashboard(props: DashboardData) {
    const { stats, recentPembelians, recentPengajuans, lowStockBarangs, pembeliansByStatus, pengajuansByStatus } = props;

    const getStatusBadge = (status: string) => {
        const statusStyles: Record<string, { bg: string; text: string }> = {
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            'finished': { bg: 'bg-green-100', text: 'text-green-800' },
            'approved': { bg: 'bg-green-100', text: 'text-green-800' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800' },
        };
        const style = statusStyles[status] || statusStyles['pending'];
        return <Badge className={`${style.bg} ${style.text}`}>{status}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                
                {/* Main Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    {/* Total Barang */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
                            <Package className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalBarangs}</div>
                            <p className="text-xs text-muted-foreground mt-1">Barang dalam inventaris</p>
                        </CardContent>
                    </Card>

                    {/* Total Pembelian */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pembelian</CardTitle>
                            <Truck className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPembelians}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pemesanan pembelian</p>
                        </CardContent>
                    </Card>

                    {/* Total Pengajuan */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
                            <FileText className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPengajuans}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pengajuan pinjaman</p>
                        </CardContent>
                    </Card>

                    {/* Stock Tersedia */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stock Tersedia</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalStockTersedia}</div>
                            <p className="text-xs text-muted-foreground mt-1">Stok tersedia</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Stock Masuk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-green-600">{stats.totalStockMasuk}</div>
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Goods received</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Stock Keluar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-red-600">{stats.totalStockKeluar}</div>
                                <TrendingDown className="h-5 w-5 text-red-500" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Goods borrowed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-amber-600">{lowStockBarangs.length}</div>
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Items below 10 units</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Low Stock Barangs Alert */}
                {lowStockBarangs.length > 0 && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                <CardTitle className="text-amber-900">Low Stock Items</CardTitle>
                            </div>
                            <CardDescription className="text-amber-800">Items with less than 10 units available</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {lowStockBarangs.map((barang) => (
                                    <div key={barang.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{barang.nama_barang}</p>
                                            <p className="text-xs text-muted-foreground">Stock: {barang.stock_tersedia} units</p>
                                        </div>
                                        <Link href={barangs.edit(barang.id).url}>
                                            <Button size="sm" variant="outline" className="text-amber-600 hover:bg-amber-100">
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Transactions */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Pembelians */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Pembelian Terbaru</CardTitle>
                                    <CardDescription>Pemesanan pembelian terbaru</CardDescription>
                                </div>
                                <Link href={pembelians.index().url}>
                                    <Button size="sm" variant="ghost">Lihat Semua</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentPembelians.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Belum ada pemesanan pembelian</p>
                                ) : (
                                    recentPembelians.map((pembelian) => (
                                        <div key={pembelian.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{pembelian.vendor}</p>
                                                <p className="text-xs text-muted-foreground">{pembelian.user.name}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{new Date(pembelian.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 ml-2">
                                                <div className="text-right">
                                                    <p className="font-medium text-sm">Rp {pembelian.total_harga.toLocaleString('id-ID')}</p>
                                                </div>
                                                {getStatusBadge(pembelian.status)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Pengajuans */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Pengajuan Terbaru</CardTitle>
                                    <CardDescription>Pengajuan pinjaman terbaru</CardDescription>
                                </div>
                                <Link href={pengajuans.index().url}>
                                    <Button size="sm" variant="ghost">Lihat Semua</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentPengajuans.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Belum ada pengajuan pinjaman</p>
                                ) : (
                                    recentPengajuans.map((pengajuan) => (
                                        <div key={pengajuan.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{pengajuan.deskripsi.substring(0, 30)}...</p>
                                                <p className="text-xs text-muted-foreground">{pengajuan.user.name}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{new Date(pengajuan.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 ml-2">
                                                {getStatusBadge(pengajuan.status)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Status Summary */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Pembelian Status Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Pembelian Status</CardTitle>
                            <CardDescription>Distribusi berdasarkan status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Object.entries(pembeliansByStatus).map(([status, data]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-3 w-3 rounded-full ${
                                                status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`} />
                                            <span className="text-sm font-medium capitalize">{status}</span>
                                        </div>
                                        <span className="text-sm font-bold">{data.total}</span>
                                    </div>
                                ))}
                                {Object.keys(pembeliansByStatus).length === 0 && (
                                    <p className="text-sm text-muted-foreground">No data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pengajuan Status Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Pengajuan Status</CardTitle>
                            <CardDescription>Distribusi berdasarkan status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Object.entries(pengajuansByStatus).map(([status, data]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-3 w-3 rounded-full ${
                                                status === 'pending' ? 'bg-yellow-500' : 
                                                status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                            <span className="text-sm font-medium capitalize">{status}</span>
                                        </div>
                                        <span className="text-sm font-bold">{data.total}</span>
                                    </div>
                                ))}
                                {Object.keys(pengajuansByStatus).length === 0 && (
                                    <p className="text-sm text-muted-foreground">No data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
