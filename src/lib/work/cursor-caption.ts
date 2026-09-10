export function cursorCaptionProps(caption: string | undefined) {
  const value = caption?.trim();
  if (!value) return undefined;
  return { "data-cursor-caption": value } as const;
}
