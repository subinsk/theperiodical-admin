"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";

import  { SettingsProfileView } from "@/views/dashboard/settings/profile";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/ui/loader";
import { SettingsUserView } from "./users";
import { SettingsOrganizationsView } from "./organizations";

export default function SettingsView() {
  // hooks
  const {
    data: session,
    status
  } = useSession();

  const isSuperAdmin = session?.user?.role === 'super_admin';

  // states
  return (
    <>
      {status === 'loading' && <Loader />}
      {
        status === 'authenticated' &&
        <>
          <Tabs defaultValue="profile">
            <TabsList className={`grid grid-cols-${session?.user.role === 'super_admin' ? '3' : '2'} mx-auto w-1/2`}>
              <TabsTrigger value="profile" className={`${session?.user.role === 'content_writer' ? 'col-span-2' : 'col-span-1'}`}>Profile</TabsTrigger>
              {
                session?.user.role === 'super_admin' &&
                <TabsTrigger value="organizations">Organizations</TabsTrigger>
              }
              {
                session?.user.role !== 'content_writer' &&
                <TabsTrigger value="users">Users</TabsTrigger>
              }
            </TabsList>
            <TabsContent value="profile">
              <SettingsProfileView />
            </TabsContent>
            <TabsContent value="organizations">
              <SettingsOrganizationsView/>
            </TabsContent>
            <TabsContent value="users">
              <SettingsUserView organizationId={session?.user.organization_id}/>
            </TabsContent>
          </Tabs>          
        </>
      }
    </>
  );
}
