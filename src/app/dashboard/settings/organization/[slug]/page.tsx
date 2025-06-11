'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchOrganizationBySlug } from '@/services/organization.service';
import OrganizationView from '@/views/dashboard/settings/organization';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchOrganizationBySlug(params.slug);
        if (!response) {
          router.push('/404'); // or any custom not found route
        } else {
          setOrganization(response.organization);
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        router.push('/500'); // or show error UI
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [params.slug, router]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!organization) {
    return null; // or fallback UI
  }

  return <OrganizationView organization={organization} />;
}
