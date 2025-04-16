export const fetchUserByEmail = async (email: string, token: string) => {
  try {
    const res = await fetch(`https://intfinex.azurewebsites.net/api/User/GetByEmail/${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`API isteği başarısız oldu. Kod: ${res.status}`);
    }

    const responseData = await res.json();
    console.log('[fetchUserByEmail] API yanıtı:', responseData);

    if (responseData.isSuccess && responseData.data && responseData.data.length > 0) {
      return responseData.data[0];
    } else {
      console.log('[fetchUserByEmail] API yanıtında kullanıcı bulunamadı.');
      return null;
    }
  } catch (error) {
    console.error('[fetchUserByEmail] Hata:', error);
    return null;
  }
};