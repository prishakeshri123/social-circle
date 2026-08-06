import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Switch } from '@/shared/components/ui/Switch';
import { en } from '@/shared/constants/locales/en';
import { MIN_POLL_OPTIONS, MAX_POLL_OPTIONS } from '@/shared/constants/app.constants';
import { toast } from '@/shared/components/ui/Toast';
import type { ChatPoll } from '@/types/chat.types';

interface PollComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (poll: Omit<ChatPoll, 'closed'>) => void;
}

function emptyOptions(): string[] {
  return Array.from({ length: MIN_POLL_OPTIONS }, () => '');
}

export function PollComposer({ open, onOpenChange, onSubmit }: PollComposerProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(emptyOptions());
  const [allowMultiple, setAllowMultiple] = useState(false);

  function reset() {
    setQuestion('');
    setOptions(emptyOptions());
    setAllowMultiple(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  function addOption() {
    setOptions((prev) => (prev.length >= MAX_POLL_OPTIONS ? prev : [...prev, '']));
  }

  function removeOption(index: number) {
    setOptions((prev) =>
      prev.length <= MIN_POLL_OPTIONS ? prev : prev.filter((_, i) => i !== index),
    );
  }

  function handleSubmit() {
    const trimmedQuestion = question.trim();
    const trimmedOptions = options.map((o) => o.trim()).filter(Boolean);

    if (!trimmedQuestion || trimmedOptions.length < MIN_POLL_OPTIONS) {
      toast.error(en.hub.sendMessageFailed);
      return;
    }

    onSubmit({
      question: trimmedQuestion,
      options: trimmedOptions.map((text, i) => ({
        id: `opt_${i}_${Date.now()}`,
        text,
        voteCount: 0,
      })),
      allowMultiple,
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{en.chat.createPoll}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="poll-question">{en.chat.pollQuestion}</Label>
            <Input
              id="poll-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={en.chat.pollQuestionPlaceholder}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={en.chat.pollOption(index + 1)}
                />
                {options.length > MIN_POLL_OPTIONS && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeOption(index)}
                    aria-label={en.actions.remove}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            ))}
            {options.length < MAX_POLL_OPTIONS && (
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="size-4" aria-hidden="true" />
                {en.chat.addPollOption}
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="poll-allow-multiple">{en.chat.allowMultipleAnswers}</Label>
            <Switch
              id="poll-allow-multiple"
              checked={allowMultiple}
              onCheckedChange={setAllowMultiple}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            {en.actions.cancel}
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {en.chat.createPoll}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
