import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BookType, Calendar, ChartNoAxesColumn, GalleryThumbnails, Gauge, Home, ImageIcon, Inbox, Lightbulb, Search, Settings, User2 } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Thumbnail Generator",
        url: "/ai-thumbnail-generator",
        icon: ImageIcon,
    },
    {
        title: "Thumbnail Search",
        url: "/thumbnail-search",
        icon: GalleryThumbnails,
    },
    {
        title: "Keywords",
        url: "/trending-keywords",
        icon: BookType,
    },
  
    {
        title: "Outlier",
        url: "/outlier",
        icon: Gauge,
    },

    {
        title: "AI Content Generator",
        url: "/ai-content-generator",
        icon: Lightbulb,
    },
    {
        title: "Billing",
        url: "/billing",
        icon: Settings,
    },
    {
        title: "Profile",
        url: "/profile",
        icon: User2,
    },
]

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-4'>
                    <Image src={'/logo2.png'} alt='logo' width={400} height={400}
                        className='w-full ' />
                    <h2 className='text-sm text-gray-400 text-center'>Build Awesome</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className=''>
                            {items.map((item, index) => (
                                // <SidebarMenuItem key={item.title} className='p-2'>
                                //     <SidebarMenuButton asChild className=''>
                                <a href={item.url} key={index} className={`p-2 text-lg flex gap-2 items-center
                                 hover:bg-gray-100 rounded-lg ${path.includes(item.url) && 'bg-gray-200ß'}`}>
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                                //     </SidebarMenuButton>
                                // </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}