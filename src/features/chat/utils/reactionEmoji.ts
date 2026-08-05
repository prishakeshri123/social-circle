// Maps the semantic reaction keys stored on ChatMessage.reactions to the
// emoji glyph shown in the UI, and lists the quick-react options offered
// when a member reacts to a message.
export const REACTION_EMOJI: Record<string, string> = {
  thumbs_up: '👍',
  heart: '❤️',
  joy: '😂',
  raised_hands: '🙌',
  fire: '🔥',
  wow: '😮',
  sad: '😢',
};

export const QUICK_REACTIONS = ['thumbs_up', 'heart', 'joy', 'raised_hands', 'fire'] as const;

export function reactionGlyph(key: string): string {
  return REACTION_EMOJI[key] ?? '👍';
}
