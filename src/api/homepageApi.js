export async function fetchHomepageData() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}db.json`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return data.homepage;
  } catch (error) {
    console.error('خطا در بارگذاری داده‌های صفحه اصلی:', error);
    return null;
  }
}