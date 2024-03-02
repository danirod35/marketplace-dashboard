'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetProducts } from 'src/api/product';
import {PRODUCT_PUBLISH_OPTIONS, PRODUCT_STOCK_OPTIONS} from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductTableToolbar from '../product-table-toolbar';
import ProductTableFiltersResult from '../product-table-filters-result';
import {
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellCreatedAt, RenderCategorySelect,
} from '../product-table-row';
import axios from "axios";

// ----------------------------------------------------------------------

// const mockProducts = [
//   {
//     id: 1,
//     title: 'Product A',
//     editCategory: 'Accessories',
//     available: 75,
//     inventoryType: 'In Stock',
//     price: 49.99,
//     status: 'active',
//   },
// ];

const PUBLISH_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'hehe', label: 'hehe' },
];

const defaultFilters = {
  publish: [],
  stock: [],
};

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function ProductImportView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const router = useRouter();

  const settings = useSettingsContext();

  const { products, productsLoading } = useGetProducts();

  const [productsResponse, setProductsResponse] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [importRows, setImportRows] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const fetchProductsData = async () => {
    try {
      // Make API call to fetch products with query parameters
      const response = await axios.get('http://localhost:3000/products', {
        params: {
          importStatus: false, // or false depending on your requirement
        },
      });
      // Extract products data from the response
      const productsData = response.data;
      // Set products state with fetched data
      setProductsResponse(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // const checkIfCategorySelected = () => {
  //   const selectedImportRows = importRows.filter((row) => selectedRowIds.includes(row.id));
  //   console.log('Selected Import Rows', selectedImportRows);
  //   const missingCategory = selectedRowIds.filter((row) => !importRows.includes(row.id));
  //   console.log('Missing Category', missingCategory);
  //
  //   if (missingCategory.length > 0) {
  //     enqueueSnackbar('Error: Please Select A Category to Import', {
  //       variant: 'error',
  //     })
  //   }
  // }

  const postImportData = async (importRows) => {
    try {
      const selectedImportRows = importRows.filter((row) => selectedRowIds.includes(row.id));
      // Make POST request with importRows data as the request body
      const response = await axios.post('http://localhost:3000/import', selectedImportRows);
      // Handle response if necessary
      console.log('Import data posted successfully:', response.data);

      handleDeleteRows();

      // Show a success message
      enqueueSnackbar('Products Successfully imported!');
    } catch (error) {
      console.error('Error posting import data:', error);
    }
  };

  // Fetch products data when the component mounts
  useEffect(() => {
    fetchProductsData();
  }, []);

  useEffect(() => {
    if (productsResponse?.length) {
      setTableData(productsResponse);
    }
  }, [productsResponse]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRows = useCallback(() => {
    // Filter out the rows that are selected for deletion
    const remainingRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    console.log('remainingRows', remainingRows);

    // Update the table data with the remaining rows
    setTableData(remainingRows);

    // Clear the selected row IDs
    setSelectedRowIds([]);
  }, [enqueueSnackbar, selectedRowIds, tableData]);


  const handleNewRowChange = (newRow) => {
    // Check if the row already exists in importRows based on its id
    const existingRowIndex = importRows.findIndex(row => row.id === newRow.id);

    // If the row already exists, update its category
    if (existingRowIndex !== -1) {
      const updatedArray = [...importRows];
      updatedArray[existingRowIndex] = newRow;
      setImportRows(updatedArray);
    } else {
      // If the row does not exist, add it to the importRows array
      setImportRows(prevRows => [...prevRows, newRow]);
    }

  };

  const columns = [
    {
      field: 'name',
      headerName: 'Product',
      width: 360,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'editCategory',
      headerName: 'Edit Category',
      width: 360,
      renderCell: (params) => <RenderCategorySelect params={params} onNewRowChange={handleNewRowChange} />,
    },
    {
      field: '',
      headerName: '',
      flex: 1,
      width: 160,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Import Products"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Product',
              href: paths.dashboard.product.import,
            },
            { name: 'Import Product' },
          ]}
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card
          sx={{
            height: 'xl',
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={tableData}
            columns={columns}
            loading={productsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: () => (
                <>
                  <GridToolbarContainer>
                    {/*<ProductTableToolbar*/}
                    {/*  filters={filters}*/}
                    {/*  onFilters={handleFilters}*/}
                    {/*  stockOptions={PRODUCT_STOCK_OPTIONS}*/}
                    {/*  publishOptions={PUBLISH_OPTIONS}*/}
                    {/*/>*/}

                    <GridToolbarQuickFilter />

                    <Stack
                      spacing={1}
                      flexGrow={1}
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      {/*Possibly where Apply to all will be added*/}
                      {/*{!!selectedRowIds.length && (*/}
                      {/*  <Button*/}
                      {/*    size="small"*/}
                      {/*    color="error"*/}
                      {/*    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}*/}
                      {/*    onClick={confirmRows.onTrue}*/}
                      {/*  >*/}
                      {/*    Delete ({selectedRowIds.length})*/}
                      {/*  </Button>*/}
                      {/*)}*/}
                      <Button
                          component={RouterLink}
                          href={paths.dashboard.product.root}
                      >
                        Back to Listings
                      </Button>

                      <Button
                          disabled={!selectedRowIds.length}
                          onClick={() => {
                            const missingCategory = selectedRowIds.filter((rowId) => !importRows.some((row) => row.id === rowId));
                            console.log('selected rowIds', selectedRowIds);
                            console.log('missingCategory', missingCategory);
                            console.log('importRows', importRows);

                            if (missingCategory.length > 0) {
                              enqueueSnackbar('Error: Please select a category to import', { variant: 'error' });
                            } else {
                              confirmRows.onTrue();
                            }
                          }}
                          variant="contained"
                          startIcon={<Iconify icon="mingcute:add-line" />}
                      >
                        Confirm Import
                      </Button>

                    </Stack>
                  </GridToolbarContainer>

                  {canReset && (
                    <ProductTableFiltersResult
                      filters={filters}
                      onFilters={handleFilters}
                      onResetFilters={handleResetFilters}
                      results={dataFiltered.length}
                      sx={{ p: 2.5, pt: 0 }}
                    />
                  )}
                </>
              ),
              noRowsOverlay: () => <EmptyContent title="Import products to get started." />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              columnsPanel: {
                getTogglableColumns,
              },
            }}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Import Products"
        content={
          <>
            Are you sure want to import <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              confirmRows.onFalse();
              postImportData(importRows);
            }}
          >
            Import
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.publish));
  }

  return inputData;
}
