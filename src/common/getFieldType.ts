export function useFieldType() {
  function getFieldType(type: number) {
    switch (type) {
      case 0:
        return "Texto";
      case 1:
        return "Número";
      case 2:
        return "Data";
      default:
        return "Texto";
    }
  }

  return { getFieldType };
}
