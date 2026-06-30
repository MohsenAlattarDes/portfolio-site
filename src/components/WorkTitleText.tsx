export default function WorkTitleText({ text }: { text: string }) {
  const parts = text.split("'");

  if (parts.length === 1) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? (
            <span className="work-t-apos">&apos;</span>
          ) : null}
        </span>
      ))}
    </>
  );
}
