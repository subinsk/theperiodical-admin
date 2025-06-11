import { Loader2 } from "lucide-react"
import { Stack } from "./stack"
import { Typography } from "./typography"

export const Loader = () => {
    return (
        <Stack align="center" justify="center" className="h-[70vh] w-full">
            <Stack direction="row" gap={4} align="center">
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                <Typography variant="h4">Loading...</Typography>
            </Stack>
        </Stack>
    )
}