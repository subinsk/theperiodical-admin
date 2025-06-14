"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"

interface DynamicBackButtonProps {
  fallbackUrl?: string
  showParentName?: boolean
}

export function DynamicBackButton({ 
  fallbackUrl = "/dashboard",
  showParentName = false
}: DynamicBackButtonProps) {
  const pathname = usePathname()
  const router = useRouter()
  
  // Function to format path segment into readable label
  const formatLabel = (segment: string): string => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  // Calculate the parent route and its name
  const getParentInfo = (): { route: string; name: string } => {
    const segments = pathname.split('/').filter(Boolean)
    
    // If we're at dashboard root, don't show back button
    if (segments.length <= 1 || pathname === '/dashboard') {
      return { route: '', name: '' }
    }
    
    // Remove the last segment to get parent route
    const parentSegments = segments.slice(0, -1)
    const parentRoute = '/' + parentSegments.join('/')
    
    // Get the parent page name (last segment of parent route)
    const parentPageSegment = parentSegments[parentSegments.length - 1]
    const parentName = formatLabel(parentPageSegment)
    
    return { route: parentRoute, name: parentName }
  }
  
  const { route: parentRoute, name: parentName } = getParentInfo()
  
  // Don't render if we're at the root dashboard
  if (!parentRoute) {
    return null
  }
  
  const handleBack = () => {
    const backUrl = parentRoute || fallbackUrl
    router.push(backUrl)
  }
  
  const buttonText = showParentName ? `Back to ${parentName}` : "Back"
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-fit"
      onClick={handleBack}
    >
       <Icon icon="mingcute:left-line" />
      {buttonText}
    </Button>
  )
}