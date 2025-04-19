type JSONValue = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

interface JsonViewerProps {
  data: Record<string, JSONValue>;
}

export function JsonViewer({ data }: JsonViewerProps) {

  if (Object.keys(data).length === 0) {
    return <div className="text-muted-foreground italic">Nenhum dado disponível</div>;
  }

  return (
    <pre className="bg-muted p-4 rounded-md overflow-auto max-h-80 w-[718px] text-xs">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
