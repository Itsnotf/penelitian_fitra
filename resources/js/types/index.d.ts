import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    permissions: Permission[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    permissions?: string[];
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role;
    [key: string]: unknown; // This allows for additional properties...
}

    export interface Permission {
        id: number;
        name: string;
        guard_name: string;
        created_at: string;
        updated_at: string;
        [key: string]: boolean;
    }

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
}


export interface Barang {
    id: number;
    nama_barang: string;
    tipe: string;
    stock_awal: string;
    stock_masuk: string;
    stock_keluar: string;
    stock_tersedia: string;
    created_at: string;
    updated_at: string;
}

export interface Pembelian {
    id: number;
    user_id: number;
    total_harga: string;
    vendor: string;
    deskripsi: string;
    status: string;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface BarangPembelian {
    id: number;
    pembelian_id: number;
    barang_id: number;
    harga: string;
    jumlah: string;
    created_at: string;
    updated_at: string;
    barang?: Barang;
    pembelian?: Pembelian;
}

export interface Pengajuan {
    id: number;
    user_id: number;
    deskripsi: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    user: User;
}

export interface BarangPengajuan {
    id: number;
    pengajuan_id: number;
    barang_id: number;
    jumlah: number;
    created_at: string;
    updated_at: string;
    barang?: Barang;
    pengajuan?: Pengajuan;
}