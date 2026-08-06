import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { OtpInput } from '@/features/auth/components/OtpInput';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { OTP_LENGTH } from '@/shared/constants/app.constants';
import { changeEmailSchema, changePhoneSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useChangeEmail } from '@/features/settings/hooks/useChangeEmail';
import { useVerifyEmailChange } from '@/features/settings/hooks/useVerifyEmailChange';
import { useChangePhone } from '@/features/settings/hooks/useChangePhone';
import { useVerifyPhoneChange } from '@/features/settings/hooks/useVerifyPhoneChange';
import type { z } from 'zod';

interface ChangeContactDialogProps {
  mode: 'email' | 'phone';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type EmailValues = z.infer<typeof changeEmailSchema>;
type PhoneValues = z.infer<typeof changePhoneSchema>;

export function ChangeContactDialog({ mode, open, onOpenChange }: ChangeContactDialogProps) {
  const isEmail = mode === 'email';
  const [step, setStep] = useState<'value' | 'otp'>('value');
  const [otp, setOtp] = useState('');
  const [target, setTarget] = useState('');

  const changeEmail = useChangeEmail();
  const verifyEmail = useVerifyEmailChange();
  const changePhone = useChangePhone();
  const verifyPhone = useVerifyPhoneChange();

  const initiateMutation = isEmail ? changeEmail : changePhone;
  const verifyMutation = isEmail ? verifyEmail : verifyPhone;

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: '' },
  });
  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(changePhoneSchema),
    defaultValues: { phone: '' },
  });

  function resetAll() {
    setStep('value');
    setOtp('');
    setTarget('');
    emailForm.reset();
    phoneForm.reset();
    initiateMutation.reset();
    verifyMutation.reset();
  }

  function handleClose(next: boolean) {
    if (!next) resetAll();
    onOpenChange(next);
  }

  const onSubmitValue = isEmail
    ? emailForm.handleSubmit((values) => {
        setTarget(values.email);
        changeEmail.mutate(values.email, { onSuccess: () => setStep('otp') });
      })
    : phoneForm.handleSubmit((values) => {
        setTarget(values.phone);
        changePhone.mutate(values.phone, { onSuccess: () => setStep('otp') });
      });

  function handleVerify(code: string) {
    verifyMutation.mutate(code, {
      onSuccess: () => {
        toast.success(isEmail ? en.success.emailChanged : en.success.phoneChanged);
        handleClose(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEmail ? en.settings.changeEmailDialogTitle : en.settings.changePhoneDialogTitle}
          </DialogTitle>
          <DialogDescription>
            {step === 'value'
              ? en.settings.changeContactStep1Body
              : en.settings.changeContactStep2Body(target)}
          </DialogDescription>
        </DialogHeader>

        {step === 'value' && (
          <form onSubmit={onSubmitValue} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-value">
                {isEmail ? en.settings.newEmailLabel : en.settings.newPhoneLabel}
              </Label>
              {isEmail ? (
                <Input
                  id="contact-value"
                  type="email"
                  placeholder={en.placeholders.email}
                  {...emailForm.register('email')}
                />
              ) : (
                <Input
                  id="contact-value"
                  type="tel"
                  placeholder={en.placeholders.phone}
                  {...phoneForm.register('phone')}
                />
              )}
              {isEmail && emailForm.formState.errors.email && (
                <p className="text-xs text-error-500">{emailForm.formState.errors.email.message}</p>
              )}
              {!isEmail && phoneForm.formState.errors.phone && (
                <p className="text-xs text-error-500">{phoneForm.formState.errors.phone.message}</p>
              )}
            </div>
            {initiateMutation.isError && (
              <p role="alert" className="text-sm text-error-500">
                {getApiErrorMessage(initiateMutation.error)}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                {en.actions.cancel}
              </Button>
              <Button type="submit" disabled={initiateMutation.isPending}>
                {en.auth.otpSendCta}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <OtpInput
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
              disabled={verifyMutation.isPending}
              error={verifyMutation.isError}
              autoFocus
            />
            <p className="text-center text-xs text-text-muted">{en.auth.otpDevHint}</p>
            {verifyMutation.isError && (
              <p role="alert" className="text-center text-sm text-error-500">
                {getApiErrorMessage(verifyMutation.error)}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep('value')}>
                {en.actions.back}
              </Button>
              <Button
                type="button"
                disabled={otp.length !== OTP_LENGTH || verifyMutation.isPending}
                onClick={() => handleVerify(otp)}
              >
                {en.auth.otpVerifyCta}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
