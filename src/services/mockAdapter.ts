import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '@/services/apiClient';
import { registerMockHandlers } from '@/mock';
import { MOCK_API_DELAY_MS } from '@/shared/constants/app.constants';

const mock = new MockAdapter(apiClient, {
  delayResponse: MOCK_API_DELAY_MS,
  onNoMatch: 'throwException',
});

registerMockHandlers(mock);

export { mock };
