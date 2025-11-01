import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class AgendaRapidoApi implements ICredentialType {
  name = 'agendaRapidoApi';
  displayName = 'AgendaRapido API';
  documentationUrl = 'https://agendarapido.com/api-docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API URL',
      name: 'apiUrl',
      type: 'string',
      default: 'https://your-backend-url.onrender.com',
      required: true,
    },
    {
      displayName: 'Email',
      name: 'email',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{$credentials.token}}',
      },
    },
  };

  test = {
    request: {
      baseURL: '={{$credentials.apiUrl}}',
      url: '/api/auth/me',
    },
  };
}