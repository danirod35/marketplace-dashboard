import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return <>{fCurrency(params.row.price)}</>;
}

RenderCellPrice.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellPublish({ params }) {
  return (
    <Label variant="soft" color={(params.row.approval_status === 'active' && 'success') || params.row.approval_status === 'pending' && 'info' || 'error'}>
        {params.row.approval_status}
    </Label>
  );
}

RenderCellPublish.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellCreatedAt({ params }) {
  return (
    <ListItemText
      primary={params.row.category}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCategorySelect({ params, onNewRowChange }) {
    const [selectedCategory, setSelectedCategory] = useState(params.row.editCategory || '');

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);

        // Only call onNewRowChange if the category has changed
        if (selectedValue !== '') {
            const newRow = {
                id: params.row.id,
                category: selectedValue,
                importStatus: true,
            };
            onNewRowChange(newRow);
        }
    };

    return (
        <FormControl required fullWidth>
            <Select
                value={selectedCategory}
                onChange={handleChange}
                displayEmpty
                renderValue={(selected) => selected || 'Select category'}
                input={<OutlinedInput />}
            >
                <MenuItem value="Grooming Supplies">Grooming Supplies</MenuItem>
                <MenuItem value="Pet Food">Pet Food</MenuItem>
                <MenuItem value="Treats">Treats</MenuItem>
                <MenuItem value="Collars & Leashes">Collars & Leashes</MenuItem>
                <MenuItem value="Toys & Accessories">Toys & Accessories</MenuItem>
                <MenuItem value="Beds & Bedding">Beds & Bedding</MenuItem>
                <MenuItem value="Health & Wellness Products">Health & Wellness Products</MenuItem>
                <MenuItem value="Training & Behavior Aids">Training & Behavior Aids</MenuItem>
                <MenuItem value="Travel Accessories">Travel Accessories</MenuItem>
                <MenuItem value="Cleaning & Waste Management Products">Cleaning & Waste Management Products</MenuItem>
            </Select>
        </FormControl>
    );
}

RenderCategorySelect.propTypes = {
    params: PropTypes.object.isRequired,
};




export function RenderCellStock({ params }) {
  return (
      <ListItemText
          primary={params.row.total_inventory}
          secondary={params.row.inventory_status}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
          }}
      />
  );
}

RenderCellStock.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellProduct({ params }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.title}
        src={params.row.image}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={params.row.onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.title}
          </Link>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

RenderCellProduct.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
