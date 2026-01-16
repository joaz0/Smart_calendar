PROIBIDO:
❌ any

❌ Object

❌ Function

OBRIGATÓRIO:
✅ Interfaces para objetos complexos

✅ Tipos específicos para parâmetros

✅ Tipos de retorno explícitos

✅ Generics quando aplicável

EXEMPLO:

// ❌ RUIM
processData(data: any): any {}

// ✅ BOM
processData<T>(data: T): ProcessedData<T> {}

interface ProcessedData<T> {
  original: T;
  processed: unknown;
}
