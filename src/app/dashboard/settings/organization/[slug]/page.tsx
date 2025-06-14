'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchOrganizationBySlug } from '@/services/organization.service';
import OrganizationView from '@/views/dashboard/settings/edit-organization';
import { Loader } from '@/components/ui/loader';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  // states
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // effects
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchOrganizationBySlug(params.slug);
        if (!response) {
          router.push('/404');
        } else {
          setOrganization(response.organization);
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        router.push('/500'); 
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [params.slug, router]);

  if (loading) {
    return <div className="p-4"><Loader/></div>;
  }

  if (!organization) {
    return null;
  }

  return <OrganizationView organization={organization} />;
}
