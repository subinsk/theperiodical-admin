"use client";

import {
  Stack,
  Separator,
  Typography
} from "@/components";
import { Organization } from '@prisma/client';
import { SettingsUserView } from "../users";

export default function EditOrganizationView({
  organization
}: {
  organization: Organization
}) {
  return (
    <Stack gap={8}>
      <div className="w-full flex justify-between">
        <Typography variant="h1">
          {organization.name}
        </Typography>
      </div>
      <Separator />
      <SettingsUserView organizationId={organization.id}/>
    </Stack>
  )
}