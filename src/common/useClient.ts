import { Client, FieldConfiguration } from "../types/app.types";

export const useClient = () => {
  function displayFirstField(
    client: Client,
    fieldsConfiguration: FieldConfiguration[]
  ): string {
    return `${fieldsConfiguration[0].name}: ${
      client.fieldValues[fieldsConfiguration[0].name]
    }`;
  }

  function displayFields(
    client: Client,
    fieldsConfiguration: FieldConfiguration[]
  ): string[] {
    if(!fieldsConfiguration || !client) return [];
    return fieldsConfiguration.map(
      (field) => `${field.name}: ${client.fieldValues[field.name] ?? ""}`
    );
  }

  function inferConfigurationFromClient(client: Client): FieldConfiguration[] {
    const fieldsConfiguration: FieldConfiguration[] = [];
    for (const key in client.fieldValues) {
      fieldsConfiguration.push({
        name: key,
        type: 0,
        defaultValue: "",
        order: 0,
        possibleValues: [],
        required: false,
      });
    }
    return fieldsConfiguration;
  }

  return {
    displayFirstField,
    displayFields,
    inferConfigurationFromClient
  }
};
