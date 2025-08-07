export const secureApiRequest = async (url, options = {}) => {
  const secureOptions = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, secureOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const validateInput = (value, type = 'text') => {
  if (typeof value !== 'string') return false;
  
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[a-zA-Z0-9_]{3,30}$/,
    password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,128}$/,
    text: /^[^<>'"&]*$/
  };
  
  return patterns[type]?.test(value) ?? patterns.text.test(value);
};

export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};