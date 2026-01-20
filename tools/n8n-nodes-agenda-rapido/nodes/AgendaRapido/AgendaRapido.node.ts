import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class AgendaRapido implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'AgendaRapido',
    name: 'agendaRapido',
    icon: 'file:agendarapido.svg',
    group: ['productivity'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with AgendaRapido Smart Calendar API',
    defaults: {
      name: 'AgendaRapido',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'agendaRapidoApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Event',
            value: 'event',
          },
          {
            name: 'Task',
            value: 'task',
          },
        ],
        default: 'event',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['event'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create an event',
          },
          {
            name: 'Get',
            value: 'get',
            action: 'Get an event',
          },
          {
            name: 'Get All',
            value: 'getAll',
            action: 'Get all events',
          },
          {
            name: 'Update',
            value: 'update',
            action: 'Update an event',
          },
          {
            name: 'Delete',
            value: 'delete',
            action: 'Delete an event',
          },
        ],
        default: 'create',
      },
      {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['event'],
            operation: ['get', 'update', 'delete'],
          },
        },
        default: '',
        required: true,
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['event'],
            operation: ['create', 'update'],
          },
        },
        default: '',
        required: true,
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        displayOptions: {
          show: {
            resource: ['event'],
            operation: ['create', 'update'],
          },
        },
        default: '',
        required: true,
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        displayOptions: {
          show: {
            resource: ['event'],
            operation: ['create', 'update'],
          },
        },
        default: '',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('agendaRapidoApi');

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      let responseData;

      if (resource === 'event') {
        if (operation === 'create') {
          const title = this.getNodeParameter('title', i) as string;
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;

          const body = {
            title,
            start_date: startDate,
            end_date: endDate,
          };

          responseData = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'agendaRapidoApi',
            {
              method: 'POST',
              url: '/api/events',
              body,
              json: true,
            },
          );
        }

        if (operation === 'get') {
          const eventId = this.getNodeParameter('eventId', i) as string;

          responseData = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'agendaRapidoApi',
            {
              method: 'GET',
              url: `/api/events/${eventId}`,
              json: true,
            },
          );
        }

        if (operation === 'getAll') {
          responseData = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'agendaRapidoApi',
            {
              method: 'GET',
              url: '/api/events',
              json: true,
            },
          );
        }
      }

      returnData.push({
        json: responseData,
      });
    }

    return [returnData];
  }
}