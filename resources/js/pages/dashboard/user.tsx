import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Circle, ClipboardList, PlusCircle, XCircle } from 'lucide-react';
import type { SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface BarangPengajuan { id: number; barang?: { nama_barang: string }; jumlah: number }
interface PembelianLinked { id: number; status: string; deskripsi: string }
interface Pengajuan {
    id: number; deskripsi: string; urgensi: string; status: string;
    alasan_reject?: string | null; created_at: string; updated_at: string;
    barang_pengajuans: BarangPengajuan[];
    pembelians: PembelianLinked[];
}
interface Props {
    myPengajuans: Pengajuan[];
    summary: { total: number; pending: number; proses: number; selesai: number; rejected: number };
}

const STEPS = ['pending', 'proses', 'selesai'] as const;
const STEP_LABEL: Record<string, string> = { pending: 'Dibuat', proses: 'Diproses', selesai: 'Selesai' };
const PEMBELIAN_STEPS = ['pending', 'proses', 'selesai'] as const;
const PEMBELIAN_LABEL: Record<string, string> = { pending: 'Dibuat', proses: 'Diproses', selesai: 'Selesai' };

function stepIndex(status: string, steps: readonly string[]): number {
    const i = steps.indexOf(status);
    return i === -1 ? 0 : i;
}

function ProgressSteps({ status, steps, labels, isRejected }: { status: string; steps: readonly string[]; labels: Record<string, string>; isRejected: boolean }) {
    const current = isRejected ? -1 : stepIndex(status, steps);

    return (
        <div className="flex items-center gap-0">
            {steps.map((step, i) => {
                const done    = !isRejected && i < current;
                const active  = !isRejected && i === current;
                const rejected = isRejected && i === 0;

                return (
                    <div key={step} className="flex items-center">
                        {/* Circle */}
                        <div className="flex flex-col items-center gap-1">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors
                                ${done    ? 'border-green-500 bg-green-500 text-white' :
                                  active  ? 'border-blue-500 bg-blue-500 text-white' :
                                  rejected && i === 0 ? 'border-red-500 bg-red-500 text-white' :
                                  'border-muted-foreground/30 bg-background text-muted-foreground/50'}`}>
                                {done ? <CheckCircle2 className="h-4 w-4" /> : isRejected && i === 0 ? <XCircle className="h-4 w-4" /> : i + 1}
                            </div>
                            <span className={`text-[10px] whitespace-nowrap ${done || active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                {labels[step]}
                            </span>
                        </div>
                        {/* Connector */}
                        {i < steps.length - 1 && (
                            <div className={`mb-4 h-0.5 w-10 sm:w-16 ${done ? 'bg-green-500' : 'bg-muted-foreground/20'}`} />
                        )}
                    </div>
                );
            })}
            {isRejected && (
                <div className="mb-4 ml-3 flex items-center gap-1 text-xs text-red-500 font-medium">
                    <XCircle className="h-4 w-4" /> Ditolak
                </div>
            )}
        </div>
    );
}

export default function UserDashboard({ myPengajuans, summary }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* Greeting */}
                <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
                    <h2 className="text-lg font-semibold text-indigo-800">Selamat datang, {auth.user.name} 👋</h2>
                    <p className="mt-1 text-sm text-indigo-600">Pantau status pengajuan Anda di sini.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                    {[
                        { label: 'Total Pengajuan', value: summary.total,    color: 'text-foreground',    bg: 'bg-muted/40'        },
                        { label: 'Pending',          value: summary.pending,  color: 'text-yellow-600',   bg: 'bg-yellow-50'       },
                        { label: 'Diproses',         value: summary.proses,   color: 'text-blue-600',     bg: 'bg-blue-50'         },
                        { label: 'Selesai',          value: summary.selesai,  color: 'text-green-600',    bg: 'bg-green-50'        },
                    ].map(({ label, value, color, bg }) => (
                        <Card key={label} className={`${bg} border-0 shadow-sm`}>
                            <CardContent className="p-4 text-center">
                                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Action */}
                <div className="flex gap-2">
                    <Link href="/pengajuans/create">
                        <Button className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Buat Pengajuan Baru
                        </Button>
                    </Link>
                    <Link href="/pengajuans">
                        <Button variant="outline">Lihat Semua Pengajuan</Button>
                    </Link>
                </div>

                {/* Pengajuan List with Progress */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pengajuan Saya</h3>

                    {myPengajuans.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground/40" />
                                <p className="font-medium text-muted-foreground">Belum ada pengajuan</p>
                                <p className="mt-1 text-sm text-muted-foreground">Buat pengajuan pertama Anda sekarang.</p>
                                <Link href="/pengajuans/create" className="mt-4">
                                    <Button size="sm"><PlusCircle className="mr-1.5 h-4 w-4" />Buat Pengajuan</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        myPengajuans.map((pengajuan) => {
                            const isRejected = pengajuan.status === 'rejected';

                            return (
                                <Card key={pengajuan.id} className={`transition-shadow hover:shadow-md ${
                                    isRejected ? 'border-red-200 bg-red-50/30' :
                                    pengajuan.status === 'selesai' ? 'border-green-200 bg-green-50/30' :
                                    pengajuan.status === 'proses' ? 'border-blue-200' : ''
                                }`}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <CardTitle className="text-sm font-semibold truncate max-w-xs">
                                                        {pengajuan.deskripsi}
                                                    </CardTitle>
                                                    <Badge className={pengajuan.urgensi === 'mendesak' ? 'bg-red-500 text-white' : 'bg-slate-500 text-white'}>
                                                        {pengajuan.urgensi === 'mendesak' ? 'Mendesak' : 'Normal'}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="mt-0.5 text-xs">
                                                    #{pengajuan.id} · Dibuat {new Date(pengajuan.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </CardDescription>
                                            </div>
                                            <Link href={`/pengajuans/${pengajuan.id}`}>
                                                <Button size="sm" variant="ghost" className="shrink-0 text-xs">Detail</Button>
                                            </Link>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 pt-0">
                                        {/* Progress Steps */}
                                        <div className="overflow-x-auto">
                                            <ProgressSteps
                                                status={pengajuan.status}
                                                steps={STEPS}
                                                labels={STEP_LABEL}
                                                isRejected={isRejected}
                                            />
                                        </div>

                                        {/* Alasan reject */}
                                        {isRejected && pengajuan.alasan_reject && (
                                            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                                <strong>Alasan:</strong> {pengajuan.alasan_reject}
                                            </div>
                                        )}

                                        {/* Barang list (compact) */}
                                        {pengajuan.barang_pengajuans.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {pengajuan.barang_pengajuans.map((bp) => (
                                                    <span key={bp.id} className="rounded-full border bg-muted/60 px-2 py-0.5 text-xs">
                                                        {bp.barang?.nama_barang} ×{bp.jumlah}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Linked Pembelian (for mendesak) */}
                                        {pengajuan.urgensi === 'mendesak' && pengajuan.pembelians.length > 0 && (
                                            <div className="space-y-2 border-t pt-3">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pembelian Terkait</p>
                                                {pengajuan.pembelians.map((pem) => (
                                                    <div key={pem.id} className="rounded-md border bg-background p-3">
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <p className="text-xs font-medium">Pembelian #{pem.id}</p>
                                                            <Badge className={`text-white text-[10px] ${
                                                                pem.status === 'selesai' ? 'bg-green-500' :
                                                                pem.status === 'proses'  ? 'bg-blue-500'  : 'bg-yellow-500'
                                                            }`}>
                                                                {PEMBELIAN_LABEL[pem.status] ?? pem.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="overflow-x-auto">
                                                            <ProgressSteps
                                                                status={pem.status}
                                                                steps={PEMBELIAN_STEPS}
                                                                labels={PEMBELIAN_LABEL}
                                                                isRejected={false}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
