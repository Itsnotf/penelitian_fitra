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
    [key: string]: unknown;
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

export interface Vendor {
    id: number;
    nama_vendor: string;
    alamat?: string | null;
    telepon?: string | null;
    email?: string | null;
    created_at: string;
    updated_at: string;
    barang_vendors_count?: number;
}

export interface BarangVendor {
    id: number;
    vendor_id: number;
    barang_id: number;
    harga: number;
    terakhir_update_harga?: string | null;
    created_at: string;
    updated_at: string;
    vendor?: Vendor;
    barang?: Barang;
}

export interface TipeBarang {
    id: number;
    nama_tipe: string;
    created_at: string;
    updated_at: string;
    barangs_count?: number;
}

export type JenisBarang = 'pendek' | 'sedang' | 'panjang';

export interface Barang {
    id: number;
    nama_barang: string;
    tipe_barang_id: number;
    jenis_barang: JenisBarang | null;
    satuan: string;
    stock_awal: number;
    stock_masuk: number;
    stock_keluar: number;
    stock_tersedia: number;
    jumlah_permintaan: number;
    created_at: string;
    updated_at: string;
    tipe_barang?: TipeBarang;
}

export interface Pengadaan {
    id: number;
    user_id: number;
    vendor_id?: number | null;
    permintaan_id?: number | null;
    total_harga: number;
    vendor?: Vendor | null;
    deskripsi: string;
    status: 'pending' | 'proses' | 'selesai';
    dokumen?: string | null;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface BarangPengadaan {
    id: number;
    pengadaan_id: number;
    barang_id: number;
    harga: number;
    jumlah: number;
    created_at: string;
    updated_at: string;
    barang?: Barang;
    pengadaan?: Pengadaan;
}

export interface Permintaan {
    id: number;
    user_id: number;
    deskripsi: string;
    urgensi: 'normal' | 'mendesak';
    status: 'pending' | 'proses' | 'selesai' | 'rejected';
    alasan_reject?: string | null;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface BarangPermintaan {
    id: number;
    permintaan_id: number;
    barang_id: number;
    jumlah: number;
    created_at: string;
    updated_at: string;
    barang?: Barang;
    permintaan?: Permintaan;
}
