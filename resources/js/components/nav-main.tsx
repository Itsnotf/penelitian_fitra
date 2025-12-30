import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import hasAnyPermission, { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Fragment } from 'react';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ section, items = [] }: { items: NavItem[], section?: string }) {
    const page = usePage();
    
    // Filter items based on permissions
    const visibleItems = items.filter(item => {
        if (item.permissions?.length && !hasAnyPermission(item.permissions)) {
            return false;
        }
        return true;
    });

    // Don't render section if no items are visible
    if (visibleItems.length === 0) {
        return null;
    }

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{section}</SidebarGroupLabel>
            <SidebarMenu>
                {visibleItems.map((item) => {
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(
                                    resolveUrl(item.href),
                                )}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
