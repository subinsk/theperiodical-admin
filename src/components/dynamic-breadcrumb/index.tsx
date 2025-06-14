"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui"

interface BreadcrumbItem {
  label: string
  href: string
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // Function to format path segment into readable label
  const formatLabel = (segment: string): string => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Add home/dashboard as first item
    breadcrumbs.push({
      label: 'Dashboard',
      href: '/dashboard'
    })
    
    // Build breadcrumbs for each segment after dashboard
    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Skip the dashboard segment as it's already added
      if (segment === 'dashboard') return
      
      breadcrumbs.push({
        label: formatLabel(segment),
        href: currentPath
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  // Don't show breadcrumbs if we're on the dashboard root
  if (pathname === '/dashboard') {
    return null
  }
  
  // Function to render breadcrumb items with ellipsis for long paths
  const renderBreadcrumbs = () => {
    const maxVisible = 4 // Maximum visible breadcrumbs before showing ellipsis
    
    if (breadcrumbs.length <= maxVisible) {
      // Show all breadcrumbs if count is within limit
      return breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          <BreadcrumbItem>
            {index === breadcrumbs.length - 1 ? (
              <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
        </div>
      ))
    }
    
    // Show ellipsis dropdown for long paths
    const firstItems = breadcrumbs.slice(0, 2)
    const hiddenItems = breadcrumbs.slice(2, -1)
    const lastItem = breadcrumbs[breadcrumbs.length - 1]
    
    return (
      <>
        {/* First items */}
        {firstItems.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </div>
        ))}
        
        {/* Ellipsis dropdown for hidden items */}
        {hiddenItems.length > 0 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="size-4" />
                  <span className="sr-only">Show more breadcrumbs</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        
        {/* Last item (current page) */}
        <BreadcrumbItem>
          <BreadcrumbPage>{lastItem.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    )
  }
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {renderBreadcrumbs()}
      </BreadcrumbList>
    </Breadcrumb>
  )
}