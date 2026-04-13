interface SchemaLDProps {
  schema: Record<string, unknown>;
}

export function SchemaLD({ schema }: SchemaLDProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
