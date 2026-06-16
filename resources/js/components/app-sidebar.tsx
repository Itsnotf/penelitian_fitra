import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Box, Inbox, KeyIcon, LayoutGrid, PackagePlus, Store, User } from 'lucide-react';
import AppLogo from './app-logo';
import barangs from '@/routes/barangs';
import roles from '@/routes/roles';
import users from '@/routes/users';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permissions: ['dashboard'],
    },
];

const userManagement: NavItem[] = [
    {
        title: 'Pengguna',
        href: users.index(),
        icon: User,
        permissions: ['users index'],
    },
    {
        title: 'Peran',
        href: roles.index(),
        icon: KeyIcon,
        permissions: ['roles index'],
    },
];

const barangManagement: NavItem[] = [
    {
        title: 'Barang',
        href: barangs.index(),
        icon: Box,
        permissions: ['barangs index'],
    },
    {
        title: 'Vendor',
        href: '/vendors',
        icon: Store,
        permissions: ['vendors index'],
    },
    {
        title: 'Pengadaan',
        href: '/pengadaan',
        icon: PackagePlus,
        permissions: ['pengadaan index'],
    },
    {
        title: 'Permintaan',
        href: '/permintaan',
        icon: Inbox,
        permissions: ['permintaan index'],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain section="Main" items={mainNavItems} />
                <NavMain section="Management User" items={userManagement} />
                <NavMain section="Management Inventaris" items={barangManagement} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
