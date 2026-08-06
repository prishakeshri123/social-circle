import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Textarea } from '@/shared/components/ui/Textarea';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { MAX_BIO_LENGTH } from '@/shared/constants/app.constants';
import { profileSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAuthStore } from '@/store/authSlice';
import { useAuth } from '@/shared/hooks/useAuth';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useInvitations } from '@/features/clubs/hooks/useInvitations';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useUpdateProfile } from '@/features/onboarding/hooks/useUpdateProfile';
import { AvatarUploadField } from '@/features/onboarding/components/AvatarUploadField';
import { CityAutocomplete } from '@/features/onboarding/components/CityAutocomplete';
import { InterestChips } from '@/features/onboarding/components/InterestChips';
import { CoverPhotoUploadField } from '@/features/profile/components/CoverPhotoUploadField';
import type { z } from 'zod';

type FormValues = z.infer<typeof profileSchema>;

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const updateUser = useAuthStore((state) => state.updateUser);
  const updateProfile = useUpdateProfile();

  const conversationsQuery = useConversations();
  const notificationsQuery = useNotifications();
  const invitationsQuery = useInvitations();

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(user?.coverPhotoUrl ?? '');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      bio: user?.bio ?? '',
      city: user?.city ?? '',
      websiteUrl: user?.websiteUrl ?? '',
      interests: user?.interests ?? [],
      socialLinks: {
        twitter: user?.socialLinks?.twitter ?? '',
        linkedin: user?.socialLinks?.linkedin ?? '',
        instagram: user?.socialLinks?.instagram ?? '',
      },
    },
  });

  const bio = watch('bio') ?? '';
  const city = watch('city') ?? '';
  const interests = watch('interests');

  function toggleInterest(slug: string) {
    const next = interests.includes(slug)
      ? interests.filter((i) => i !== slug)
      : [...interests, slug];
    setValue('interests', next, { shouldValidate: true });
  }

  const unreadChatsCount = (conversationsQuery.data ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );
  const unreadNotificationsCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;
  const pendingInvitationsCount = invitationsQuery.data?.length ?? 0;

  const onSubmit = handleSubmit((values) => {
    updateProfile.mutate(
      { ...values, avatarUrl, coverPhotoUrl },
      {
        onSuccess: (data) => {
          updateUser(data);
          toast.success(en.success.profileSaved);
          navigate(ROUTES.profile(data.id));
        },
      },
    );
  });

  const busy = updateProfile.isPending;

  return (
    <div className="flex items-start">
      <Helmet>
        <title>{en.profile.editTitle} | Social Circle</title>
      </Helmet>

      <Sidebar
        unreadChatsCount={unreadChatsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingInvitationsCount={pendingInvitationsCount}
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 md:flex"
      />

      <div className="min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{en.profile.editTitle}</h1>
          <p className="mt-1 text-sm text-text-secondary">{en.profile.editSubtitle}</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{en.profile.photosSectionTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <CoverPhotoUploadField value={coverPhotoUrl} onChange={setCoverPhotoUrl} />
              <AvatarUploadField
                value={avatarUrl}
                fullNameForFallback={user?.fullName ?? ''}
                onChange={setAvatarUrl}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{en.profile.basicInfoTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">{en.labels.fullName}</Label>
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder={en.placeholders.fullName}
                  disabled={busy}
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-xs text-error-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio">{en.labels.bio}</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  placeholder={en.placeholders.bio}
                  disabled={busy}
                  {...register('bio')}
                />
                <p className="text-right text-xs text-text-muted" aria-live="polite">
                  {en.onboarding.bioCharCount(bio.length, MAX_BIO_LENGTH)}
                </p>
                {errors.bio && <p className="text-xs text-error-500">{errors.bio.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">{en.labels.city}</Label>
                <CityAutocomplete value={city} onChange={(next) => setValue('city', next)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="websiteUrl">{en.labels.website}</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder={en.placeholders.website}
                  disabled={busy}
                  {...register('websiteUrl')}
                />
                {errors.websiteUrl && (
                  <p className="text-xs text-error-500">{errors.websiteUrl.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{en.profile.interestsSectionTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InterestChips selected={interests} onToggle={toggleInterest} />
              {errors.interests && (
                <p className="text-center text-xs text-error-500">{errors.interests.message}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{en.profile.socialLinksTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="twitter">{en.labels.twitterHandle}</Label>
                <Input
                  id="twitter"
                  placeholder={en.placeholders.twitterHandle}
                  disabled={busy}
                  {...register('socialLinks.twitter')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkedin">{en.labels.linkedinUrl}</Label>
                <Input
                  id="linkedin"
                  placeholder={en.placeholders.linkedinUrl}
                  disabled={busy}
                  {...register('socialLinks.linkedin')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="instagram">{en.labels.instagramHandle}</Label>
                <Input
                  id="instagram"
                  placeholder={en.placeholders.instagramHandle}
                  disabled={busy}
                  {...register('socialLinks.instagram')}
                />
              </div>
            </CardContent>
          </Card>

          {updateProfile.isError && (
            <p role="alert" className="text-sm text-error-500">
              {getApiErrorMessage(updateProfile.error)}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => navigate(ROUTES.profile(user?.id ?? ''))}
            >
              {en.actions.cancel}
            </Button>
            <Button type="submit" disabled={busy}>
              {en.actions.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
