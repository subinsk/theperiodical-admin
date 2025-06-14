import {Stack} from '@/components'
import { Icon } from '@iconify/react/dist/iconify.js'

export const DesktopOnlyView = () => {
    return (
        <Stack className='h-screen w-full items-center justify-center'>
            <Icon icon="famicons:desktop-outline" className="text-6xl text-gray-400" />
            <Stack className='text-lg font-bold text-gray-500 text-center'>
                This page is only available on desktop devices.
            </Stack>
            <Stack className='text-xs text-gray-400 mt-2 text-center'>
                Please switch to a desktop device to view this content.
            </Stack>
        </Stack>
    );
}