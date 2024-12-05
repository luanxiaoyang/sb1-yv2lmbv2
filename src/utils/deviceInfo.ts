import UAParser from 'ua-parser-js';

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

export const getDeviceInfo = (): DeviceInfo => {
  const parser = new UAParser();
  const result = parser.getResult();

  return {
    browser: `${result.browser.name} ${result.browser.version}`,
    os: `${result.os.name} ${result.os.version}`,
    device: result.device.type || 'Desktop',
  };
};