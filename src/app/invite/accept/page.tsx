// app/invite/accept/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface InvitationData {
  id: string;
  email: string;
  role: string;
  organization: {
    name: string;
    slug: string;
  };
  inviter: {
    name: string;
    email: string;
  };
  expires_at: string;
}

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  
  // Form state for new users
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });

  const fetchInvitationDetails = async () => {
    try {
      const response = await fetch(`/api/invitations/validate?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid or expired invitation');
        return;
      }

      setInvitation(data.invitation);
      setUserExists(data.userExists);
    } catch (err) {
      setError('Failed to validate invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    setIsProcessing(true);
    setError('');

    try {
      // If user doesn't exist, validate form
      if (!userExists) {
        if (!formData.name || !formData.password) {
          setError('Name and password are required');
          setIsProcessing(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsProcessing(false);
          return;
        }

        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          setIsProcessing(false);
          return;
        }
      }

      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          ...(userExists ? {} : formData)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to accept invitation');
        return;
      }

      // If new user was created, sign them in
      if (!userExists) {
        const signInResult = await signIn('credentials', {
          email: invitation.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError('Account created but failed to sign in. Please try signing in manually.');
          return;
        }
      } else {
        // For existing users, refresh their session
        await getSession();
      }

      // Redirect to dashboard
      toast.success('Invitation accepted successfully!');
      router.push('/dashboard');
      toast.loading('Loading your dashboard...',{
        duration: 4000,
      });
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

   useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    // Fetch invitation details
    fetchInvitationDetails();
  }, [token]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            You&apos;re Invited!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join {invitation?.organization.name}
          </p>
        </div>

        {invitation && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invitation Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Organization:</span> {invitation.organization.name}</p>
                <p><span className="font-medium">Role:</span> {invitation.role.replace('_', ' ')}</p>
                <p><span className="font-medium">Invited by:</span> {invitation.inviter.name || invitation.inviter.email}</p>
                <p><span className="font-medium">Email:</span> {invitation.email}</p>
                <p><span className="font-medium">Expires:</span> {new Date(invitation.expires_at).toLocaleDateString()}</p>
              </div>
            </div>

            {!userExists && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Complete Your Profile</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>
            )}

            {userExists && (
              <div className="mb-6 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  We found your existing account. Accepting this invitation will add you to <strong>{invitation.organization.name}</strong> with the role of <strong>{invitation.role.replace('_', ' ')}</strong>.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleAcceptInvitation}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Accept Invitation'}
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}