'use client';

import { useState, useCallback } from 'react';

import { StorefrontPhotoProvider } from "../../../context/storefront-context";

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { _userAbout } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileCover from '../profile-cover';
import StoreInfoForm from "../storefront-components/store-info-form";
import ShippingOperationsForm from "../storefront-components/shipping-operations-form";
import StorePoliciesForm from "../storefront-components/store-policies-form";
import SocialLinksForm from "../storefront-components/social-links";

import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FeedIcon from '@mui/icons-material/Feed';
import LinkIcon from '@mui/icons-material/Link';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'storeInfo',
    label: 'Store Info',
    icon: <StoreIcon/>,
  },
  {
    value: 'shippingAndOperations',
    label: 'Shipping & Operations',
    icon: <LocalShippingIcon/>,
  },
  {
    value: 'policies',
    label: 'Store Policies',
    icon: <FeedIcon/>,
  },
  {
    value: 'socialLinks',
    label: 'Social Links',
    icon: <LinkIcon/>,
  },
];

// ----------------------------------------------------------------------

export default function StorefrontView() {

  const store = {
    storeName: "Pets Project",
    store_banner_image: '',
    store_logo: '/assets/images/faqs/HeyBuddyShopLogo.png',
    city: 'Miami',
    state: 'Florida'
  };

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('storeInfo');
  const [avatarUrl, setAvatarUrl] = useState(store.store_logo); // Initial avatar URL

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleAvatarChange = (file) => {
    const newAvatarUrl = URL.createObjectURL(file);
    console.log('newAvatarURL', newAvatarUrl);
    setAvatarUrl(newAvatarUrl);
  };


  return (
      <StorefrontPhotoProvider>
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Storefront"
        sx={{
          mb: 2,
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          name={store.storeName}
          avatarUrl={avatarUrl}
          coverUrl={store.store_banner_image}
          city={store.city}
          state={store.state}
          onAvatarChange={handleAvatarChange} // Pass the handleAvatarChange function as a prop
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'storeInfo' && <StoreInfoForm />}

      {currentTab === 'shippingAndOperations' && <ShippingOperationsForm/>}

      {currentTab === 'policies' && <StorePoliciesForm/>}

      {currentTab === 'socialLinks' && <SocialLinksForm/>}
    </Container>
      </StorefrontPhotoProvider>
  );
}
