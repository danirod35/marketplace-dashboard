'use client';

import { useState, useCallback, useEffect } from 'react';

import { StorefrontPhotoProvider } from "../../../context/storefront-context";

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
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
import axios from "axios";
import {useSnackbar} from "../../../components/snackbar";

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

  // const store = {
  //   id: 1,
  //   storeName: "Pets Project",
  //   store_banner_image: '',
  //   store_logo: '/assets/images/faqs/HeyBuddyShopLogo.png',
  //   city: 'Miami',
  //   state: 'Florida'
  // };
  const [store, setStore] = useState({});

  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState('storeInfo');
  const [avatarUrl, setAvatarUrl] = useState(store.store_logo);
  const [bannerUrl, setBannerUrl] = useState(store.store_banner_image); // Initial avatar URL

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleAvatarChange = (file) => {
    const newAvatarUrl = URL.createObjectURL(file);
    console.log('newAvatarURL', newAvatarUrl);
    setAvatarUrl(newAvatarUrl);
  };

  const handleBannerChange = (file) => {
    const newBannerUrl = URL.createObjectURL(file);
    console.log('newbannerurl', newBannerUrl);
    setBannerUrl(newBannerUrl);
  };

  useEffect(() => {
    const storeId = 1; // Replace 1 with the variable or parameter holding the store ID
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/store/get/${storeId}`);
        setStore(response.data[0]);
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };

    fetchStoreData();
  }, []);

  useEffect(() => {
    setAvatarUrl(store.store_logo);
    setBannerUrl(store.store_banner_image)
    console.log('mystore', store)
  }, [store]);


  useEffect(() => {
    // Make a post request to update the image URL in the database
    // This will run whenever the avatarUrl changes
    const data = {
      store_logo: avatarUrl
    }
    axios.put(`http://localhost:3000/store/update/${store.id}`, { store: data })
        .then(response => {
          enqueueSnackbar('Update success!');
        })
        .catch(error => {
          console.error('Error updating avatar URL:', error);
        });
  }, [avatarUrl]); // Run this effect whenever avatarUrl changes

  useEffect(() => {
    // Make a post request to update the image URL in the database
    // This will run whenever the avatarUrl changes
    const data = {
      store_banner_image: bannerUrl
    }
    axios.put(`http://localhost:3000/store/update/${store.id}`, { store: data })
        .then(response => {
          enqueueSnackbar('Update success!');
        })
        .catch(error => {
          console.error('Error updating banner URL:', error);
        });
  }, [bannerUrl]); // Run this effect whenever avatarUrl changes

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
          name={store.store_name}
          avatarUrl={avatarUrl}
          coverUrl={bannerUrl}
          city={store.city}
          state={store.state}
          onAvatarChange={handleAvatarChange}
          onBannerChange={handleBannerChange}
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
