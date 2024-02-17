'use client';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import {CheckInIllustration, MotivationIllustration} from 'src/assets/illustrations';
import {
  _ecommerceNewProducts,
  _ecommerceBestSalesman,
  _ecommerceSalesOverview,
  _ecommerceLatestProducts,
  _analyticOrderTimeline,
  _bookingsOverview,
  _appInvoices,
  _appRelated,
  _analyticPosts,
  _appFeatured, _analyticTasks,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import EcommerceWelcome from '../ecommerce-welcome';
import EcommerceNewProducts from '../ecommerce-new-products';
import EcommerceYearlySales from '../ecommerce-yearly-sales';
import EcommerceBestSalesman from '../ecommerce-best-salesman';
import EcommerceSaleByGender from '../ecommerce-sale-by-gender';
import EcommerceSalesOverview from '../ecommerce-sales-overview';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';
import EcommerceLatestProducts from '../ecommerce-latest-products';
import EcommerceCurrentBalance from '../ecommerce-current-balance';
import AnalyticsOrderTimeline from "../../analytics/analytics-order-timeline";
import BookingBooked from "../../booking/booking-booked";
import AppNewInvoice from "../../app/app-new-invoice";
import AppTopRelated from "../../app/app-top-related";
import AnalyticsNews from "../../analytics/analytics-news";
import AppFeatured from "../../app/app-featured";
import Stack from "@mui/material/Stack";
import AppWidget from "../../app/app-widget";
import BookingWidgetSummary from "../../booking/booking-widget-summary";
import AnalyticsTasks from "../../analytics/analytics-tasks";

// ----------------------------------------------------------------------

export default function OverviewEcommerceView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <EcommerceWelcome
            title={`Welcome to the \n HeyBuddy Shop!`}
            description="Discover a new audience, sell more, and make pet parenthood easier!"
            img={<MotivationIllustration />}
            action={
              <Button variant="contained" color="primary">
                Learn More
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Sales"
            percent={2.6}
            total={76000}
            chart={{
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Orders"
            percent={-0.1}
            total={500}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Sessions"
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Orders Overview" list={_analyticOrderTimeline} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceYearlySales
            title="Sales Overview"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: 'Today',
                  data: [
                    {
                      name: 'Total Sales',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                  ],
                },
                {
                  year: 'Yesterday',
                  data: [
                    {
                      name: 'Total Sales',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} lg={4}>
          <AppNewInvoice
            title="Product Status"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'status', label: 'Status' },
              { id: 'category', label: 'Quantity' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTasks title="To-Do" list={_analyticTasks} />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary title="Shopify Connection" total='Connected' icon={<CheckInIllustration />} />
        </Grid>

      </Grid>
    </Container>
  );
}
