import { ClientNew, FieldConfiguration } from "../types/app.types";

export const useClient = () => {
  function displayFirstField(
    client: ClientNew,
    fieldsConfiguration: FieldConfiguration[]
  ): string {
    return `${fieldsConfiguration[0].name}: ${
      client.fieldValues[fieldsConfiguration[0].name]
    }`;
  }

  function displayFields(
    client: ClientNew,
    fieldsConfiguration: FieldConfiguration[]
  ): string[] {
    return fieldsConfiguration.map(
      (field) => `${field.name}: ${client.fieldValues[field.name] ?? ""}`
    );
  }

  return {
    displayFirstField,
    displayFields,
  }
};
