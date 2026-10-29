import localDb from '../../db.json';

const BASE_URL = 'http://localhost:3000';

export async function fetchHomepageData() {
  try {
    const response = await fetch(`${BASE_URL}/homepage`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // در صورتی که json-server روشن نباشد، مستقیماً از فایل db.json محلی استفاده می‌کند
    console.warn('JSON Server فعال نیست؛ داده‌ها از فایل محلی db.json بارگذاری شدند.');
    return localDb.homepage;
  }
}