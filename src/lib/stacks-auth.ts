import { AppConfig, UserSession, showConnect } from '@stacks/connect';
const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });
export const authenticate = () => {
  showConnect({
    appDetails: { name: 'R-blaze', icon: '/logo.png' },
