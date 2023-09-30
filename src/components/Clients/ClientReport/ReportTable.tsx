import { ForwardedRef, forwardRef } from "react";
import {
  Client,
  FieldConfiguration,
  Process,
  ProcessStatus,
} from "../../../types/app.types";

export interface ReportTableProps {
  fieldConfiguration: FieldConfiguration[];
  client: Client;
  processes: Process[];
}

function getStatusDescription(status: ProcessStatus) {
  switch (status) {
    case ProcessStatus.InProgress:
      return "Em andamento";
    case ProcessStatus.Waiting:
      return "Aguardando";
    case ProcessStatus.Blocked:
      return "Bloqueado";
    case ProcessStatus.Done:
      return "Concluído";
  }
}

export const ReportTable = forwardRef(
  (props: ReportTableProps, ref: ForwardedRef<HTMLTableElement>) => {
    if (!props.fieldConfiguration || props.fieldConfiguration.length <= 0)
      return <></>;
    return (
      <table ref={ref}>
        <tbody>
          <tr className="title-row">
            <td colSpan={3}>
              <span>Cliente:</span>
              <span>
                {props.client.fieldValues[props.fieldConfiguration[0].name]}
              </span>
            </td>
          </tr>
          <tr className="client-infos">
            {props.fieldConfiguration.slice(1, 4).map((field, index) => {
              return <td key={field.name}>{field.name}</td>;
            })}
          </tr>
          <tr className="client-infos">
            {props.fieldConfiguration.slice(1, 4).map((field, index) => {
              return (
                <td key={`${field.name}-${field.order}`}>
                  {props.client.fieldValues[field.name]}
                </td>
              );
            })}
          </tr>
          {props.processes.map((process) => {
            return (
              <>
                <tr key={process.id} className="title-row">
                  <td colSpan={3}>
                    {process.title} - {getStatusDescription(process.status)}
                  </td>
                </tr>
                {process.additionalData && (
                  <>
                    <tr className="section title-row">
                      <td colSpan={3}>Informações</td>
                    </tr>
                    {process.additionalData &&
                      Object.keys(process.additionalData).map((key, index) => {
                        return (
                          <tr key={key}>
                            <td>{key}</td>
                            <td colSpan={2}>{process.additionalData[key]}</td>
                          </tr>
                        );
                      })}
                  </>
                )}

                {process.events && process.events.length > 0 && (
                  <>
                    <tr className="section title-row">
                      <td colSpan={3}>Eventos</td>
                    </tr>
                    <tr>
                      <td>Título</td>
                      <td>Status</td>
                      <td>Data</td>
                    </tr>
                    {process.events.map((event, index) => {
                      return (
                        <tr key={event.id}>
                          <td>{event.description}</td>
                          <td>{getStatusDescription(event.eventType)}</td>
                          <td>
                            {new Date(event.createdAt).toLocaleDateString() ??
                              ""}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    );
  }
);
