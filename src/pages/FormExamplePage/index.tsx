import { FormExample } from "@/components-custom/ui/form-example";

export function FormExamplePage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Exemplo de Formulário</h1>
      <div className="max-w-3xl mx-auto px-4">
        <FormExample />
      </div>
    </div>
  );
}
