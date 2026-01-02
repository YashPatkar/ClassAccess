const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const isFormData = options.body instanceof FormData;

    const config = {
      method: options.method || 'GET',
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      body: options.body
        ? isFormData
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  },

  signup(email, password) {
    return this.request('/auth/signup/', {
      method: 'POST',
      body: { email, password },
    });
  },

  login(email, password) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: { email, password },
    });
  },

  uploadPDF(file, expiresAt) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('file_path', file);
    formData.append('expires_at', expiresAt);

    return this.request('/teacher/upload/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  accessPDF(code) {
    return this.request('/student/access/', {
      method: 'POST',
      body: { code },
    });
  },
};

api.getTeacherPDFs = function () {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  return this.request('/teacher/pdf-sessions/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

api.deleteTeacherPDF = function (id) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  return this.request(`/teacher/pdf-sessions/${id}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;
