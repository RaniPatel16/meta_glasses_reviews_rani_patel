import toast from 'react-hot-toast';

export const handleApiError = (error, customMessage = null) => {
  let message = 'An unexpected error occurred';
  
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    message = data.message || data.error || `Server Error (${status})`;

    if (status === 401) {
      message = 'Session expired or unauthorized. Please log in again.';
      toast.error(message);
      return message;
    }
    
    if (status === 403) {
      message = 'You do not have permission to perform this action.';
      toast.error(message);
      return message;
    }

    if (status === 404) {
      message = customMessage || 'Resource not found.';
      toast.error(message);
      return message;
    }

    if (status === 422 || status === 400) {
      message = data.message || 'Validation error. Please check your input.';
      if (data.errors && Array.isArray(data.errors)) {
         message = data.errors.map(err => err.msg || err.message).join(', ');
      }
      toast.error(message);
      return message;
    }

    if (status >= 500) {
      message = 'Internal server error. Please try again later.';
      toast.error(message);
      return message;
    }
  } else if (error.request) {
    message = 'Network error. Please check your internet connection.';
    toast.error(message);
    return message;
  } else {
    message = error.message;
  }

  if (customMessage) message = customMessage;
  toast.error(message);
  
  return message;
};
