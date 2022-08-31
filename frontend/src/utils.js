import Axios from 'axios';

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const reportATCActivity = async (name, email, product, token) => {
  try {
    const { data } = await Axios.post(
      '/api/addToCartActivity/report',
      {
        name,
        email,
        product,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    alert(getError(err));
  }
};
