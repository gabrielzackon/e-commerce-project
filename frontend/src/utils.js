import Axios from 'axios';

export const THIRTY_MINS_IN_MS = 30 * 60 * 1000;
export const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const reportATCActivity = async (name, email, product, token) => {
  try {
    const { data } = await Axios.post(
      '/api/activity/addToCartActivity',
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
