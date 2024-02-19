import sum from 'lodash/sum';
import { useEffect, useCallback, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';

import { fCurrency } from 'src/utils/format-number';

import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const values = watch();

  const totalOnRow = values.items.map((item) => item.quantity * item.price);

  const subTotal = sum(totalOnRow);

  const totalAmount = subTotal - values.discount - values.shipping + values.taxes;

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [setValue, totalAmount]);

  const handleAdd = () => {
    append({
      title: '',
      description: '',
      service: '',
      quantity: 1,
      price: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      resetField(`items[${index}].quantity`);
      resetField(`items[${index}].price`);
      resetField(`items[${index}].total`);
    },
    [resetField]
  );

  const handleSelectService = useCallback(
    (index, option) => {
      setValue(
        `items[${index}].price`,
        INVOICE_SERVICE_OPTIONS.find((service) => service.name === option)?.price
      );
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

  const handleChangeQuantity = useCallback(
    (event, index) => {
      setValue(`items[${index}].quantity`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

    const handleSelectRow = (index) => {
        const selectedIndex = selectedRows.indexOf(index);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRows, index);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1)
            );
        }

        setSelectedRows(newSelected);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = fields.map((_, index) => index);
            setSelectedRows(newSelecteds);
            setSelectAll(true);
        } else {
            setSelectedRows([]);
            setSelectAll(false);
        }
    };

    const isSelected = (index) => selectedRows.indexOf(index) !== -1;

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(subTotal) || '-'}</Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Shipping</Box>
        <Box
          sx={{
            width: 160,
            ...(values.shipping && { color: 'error.main' }),
          }}
        >
          {values.shipping ? `- ${fCurrency(values.shipping)}` : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Discount</Box>
        <Box
          sx={{
            width: 160,
            ...(values.discount && { color: 'error.main' }),
          }}
        >
          {values.discount ? `- ${fCurrency(values.discount)}` : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
        <Box sx={{ width: 160 }}>{values.taxes ? fCurrency(values.taxes) : '-'}</Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
                Products
            </Typography>

            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
                <Grid container alignItems="center">
                    <Grid item>
                        <Checkbox
                            color="primary"
                            indeterminate={selectedRows.length > 0 && selectedRows.length < fields.length}
                            checked={selectAll}
                            onChange={handleSelectAllClick}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">Select All</Typography>
                    </Grid>
                </Grid>

                {fields.map((item, index) => {
                    const isItemSelected = isSelected(index);
                    return (
                        <Stack
                            key={item.id}
                            alignItems="flex-end"
                            spacing={1.5}
                            sx={{ flexDirection: { xs: 'column', md: 'row' }, width: 1 }}
                        >
                            <Stack direction="row" alignItems="center"  spacing={2} sx={{ py: 1, width: 1 }}>
                                <Checkbox
                                    color="primary"
                                    checked={isItemSelected}
                                    onChange={() => handleSelectRow(index)}
                                />
                                <Avatar
                                    alt={item.name}
                                    src={item.coverUrl}
                                    variant="rounded"
                                    sx={{ width: 50, height: 50 }}
                                />
                                <RHFTextField
                                    size="small"
                                    name={`items[${index}].title`}
                                    label="Product Title"
                                    InputLabelProps={{ shrink: true }}
                                />

                                <RHFTextField
                                    size="small"
                                    name={`items[${index}].description`}
                                    label="Description"
                                    InputLabelProps={{ shrink: true }}
                                />

                                <RHFSelect
                                    name={`items[${index}].service`}
                                    size="small"
                                    label="Category"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        maxWidth: { md: 160 },
                                    }}
                                >
                                    <MenuItem
                                        value=""
                                        onClick={() => handleClearService(index)}
                                        sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                                    >
                                        None
                                    </MenuItem>

                                    <Divider sx={{ borderStyle: 'dashed' }} />

                                    {INVOICE_SERVICE_OPTIONS.map((service) => (
                                        <MenuItem
                                            key={service.id}
                                            value={service.name}
                                            onClick={() => handleSelectService(index, service.name)}
                                        >
                                            {service.name}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>

                                {/* Rest of your fields */}

                            </Stack>
                        </Stack>
                    );
                })}
            </Stack>

            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
        </Box>
    );

}
