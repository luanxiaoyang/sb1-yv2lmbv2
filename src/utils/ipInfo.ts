export interface IpInfo {
  ip: string;
  city?: string;
  country?: string;
  region?: string;
}

export const getIpInfo = async (): Promise<IpInfo> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const { ip } = await response.json();
    
    // Get location information
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoResponse.json();
    
    return {
      ip,
      city: geoData.city,
      country: geoData.country_name,
      region: geoData.region,
    };
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return { ip: 'Unknown' };
  }
};