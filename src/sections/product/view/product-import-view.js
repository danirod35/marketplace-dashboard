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

// ----------------------------------------------------------------------

const mockProducts = [
  {
    id: 1,
    name: 'Product A',
    editCategory: 'Accessories',
    available: 75,
    inventoryType: 'In Stock',
    price: 49.99,
    status: 'active',
  },
  {
    id: 2,
    name: 'Product B',
    editCategory: 'Accessories',
    available: 75,
    inventoryType: 'Out of Stock',
    price: 29.99,
    status: 'pending',
  },
  {
    id: 3,
    name: 'Product C',
    editCategory: 'Accessories',
    available: 75,
    inventoryType: 'In Stock',
    price: 39.99,
    status: 'rejected',
  },
  {
    id: 4,
    name: 'Product D',
    editCategory: 'Accessories',
    available: 75,
    inventoryType: 'Out of Stock',
    price: 59.99,
    status: 'active',
  },
];

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

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);

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

  // const handleDeleteRow = useCallback(
  //   (id) => {
  //     const deleteRow = tableData.filter((row) => row.id !== id);
  //
  //     enqueueSnackbar('Import success!');
  //
  //     setTableData(deleteRow);
  //   },
  //   [enqueueSnackbar, tableData]
  // );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    enqueueSnackbar('Import success!');

    setTableData(deleteRows);
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const handleCategoryChange = (selectedCategory) => {
    // Update state or perform any necessary actions with the selected category
    console.log('Selected category:', selectedCategory);
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
      renderCell: (params) => <RenderCategorySelect params={{ row: { editCategory: 'Choose a category' } }} onChange={handleCategoryChange} />,
    },
    {
      field: '',
      headerName: '',
      flex: 1,
      width: 160,
    },
    // {
    //   field: 'price',
    //   headerName: 'Price',
    //   width: 140,
    //   editable: true,
    //   renderCell: (params) => <RenderCellPrice params={params} />,
    // },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 110,
    //   type: 'singleSelect',
    //   editable: true,
    //   valueOptions: PUBLISH_OPTIONS,
    //   renderCell: (params) => <RenderCellPublish params={params} />,
    // },
    // {
    //   type: 'actions',
    //   field: 'actions',
    //   headerName: 'Actions',
    //   align: 'center',
    //   headerAlign: 'left',
    //   width: 80,
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,
    //   getActions: (params) => [
    //     <GridActionsCellItem
    //       showInMenu
    //       icon={<Iconify icon="solar:eye-bold" />}
    //       label="View"
    //       onClick={() => handleViewRow(params.row.id)}
    //     />,
    //     <GridActionsCellItem
    //       showInMenu
    //       icon={<Iconify icon="solar:pen-bold" />}
    //       label="Edit"
    //       onClick={() => handleEditRow(params.row.id)}
    //     />,
    //     <GridActionsCellItem
    //       showInMenu
    //       icon={<Iconify icon="solar:trash-bin-trash-bold" />}
    //       label="Delete"
    //       onClick={() => {
    //         handleDeleteRow(params.row.id);
    //       }}
    //       sx={{ color: 'error.main' }}
    //     />,
    //   ],
    // },
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
            rows={mockProducts}
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
                          onClick={confirmRows.onTrue}
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
              handleDeleteRows();
              confirmRows.onFalse();
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
