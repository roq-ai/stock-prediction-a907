import * as yup from 'yup';

export const stockValidationSchema = yup.object().shape({
  name: yup.string().required(),
  predicted_price: yup.number().integer().required(),
  buying_price: yup.number().integer().required(),
  selling_price: yup.number().integer().required(),
  valuation: yup.string().required(),
  timeframe: yup.string().required(),
  organization_id: yup.string().nullable(),
});
