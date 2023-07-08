import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getStockById, updateStockById } from 'apiSdk/stocks';
import { Error } from 'components/error';
import { stockValidationSchema } from 'validationSchema/stocks';
import { StockInterface } from 'interfaces/stock';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function StockEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<StockInterface>(
    () => (id ? `/stocks/${id}` : null),
    () => getStockById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: StockInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateStockById(id, values);
      mutate(updated);
      resetForm();
      router.push('/stocks');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<StockInterface>({
    initialValues: data,
    validationSchema: stockValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Stock
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="predicted_price" mb="4" isInvalid={!!formik.errors?.predicted_price}>
              <FormLabel>Predicted Price</FormLabel>
              <NumberInput
                name="predicted_price"
                value={formik.values?.predicted_price}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('predicted_price', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.predicted_price && <FormErrorMessage>{formik.errors?.predicted_price}</FormErrorMessage>}
            </FormControl>
            <FormControl id="buying_price" mb="4" isInvalid={!!formik.errors?.buying_price}>
              <FormLabel>Buying Price</FormLabel>
              <NumberInput
                name="buying_price"
                value={formik.values?.buying_price}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('buying_price', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.buying_price && <FormErrorMessage>{formik.errors?.buying_price}</FormErrorMessage>}
            </FormControl>
            <FormControl id="selling_price" mb="4" isInvalid={!!formik.errors?.selling_price}>
              <FormLabel>Selling Price</FormLabel>
              <NumberInput
                name="selling_price"
                value={formik.values?.selling_price}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('selling_price', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.selling_price && <FormErrorMessage>{formik.errors?.selling_price}</FormErrorMessage>}
            </FormControl>
            <FormControl id="valuation" mb="4" isInvalid={!!formik.errors?.valuation}>
              <FormLabel>Valuation</FormLabel>
              <Input type="text" name="valuation" value={formik.values?.valuation} onChange={formik.handleChange} />
              {formik.errors.valuation && <FormErrorMessage>{formik.errors?.valuation}</FormErrorMessage>}
            </FormControl>
            <FormControl id="timeframe" mb="4" isInvalid={!!formik.errors?.timeframe}>
              <FormLabel>Timeframe</FormLabel>
              <Input type="text" name="timeframe" value={formik.values?.timeframe} onChange={formik.handleChange} />
              {formik.errors.timeframe && <FormErrorMessage>{formik.errors?.timeframe}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'stock',
    operation: AccessOperationEnum.UPDATE,
  }),
)(StockEditPage);
