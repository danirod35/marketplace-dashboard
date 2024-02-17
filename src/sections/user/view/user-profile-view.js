'use client';

import { useState, useCallback } from 'react';

import { StorefrontPhotoProvider } from "../../../context/storefront-context";

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
import ProfileFollowers from '../profile-followers';
import AccountGeneral from "../../account/account-general";
import ShippingOperations from "../../account/shipping-operations";
import StorePolicies from "../../account/store-policies";
import AccountSocialLinks from "../../account/account-social-links";

import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FeedIcon from '@mui/icons-material/Feed';
import LinkIcon from '@mui/icons-material/Link';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Store Info',
    icon: <StoreIcon/>,
  },
  {
    value: 'followers',
    label: 'Shipping & Operations',
    icon: <LocalShippingIcon/>,
  },
  {
    value: 'policies',
    label: 'Store Policies',
    icon: <FeedIcon/>,
  },
  {
    value: 'gallery',
    label: 'Social Links',
    icon: <LinkIcon/>,
  },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const { user } = useMockedUser();

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  return (
      <StorefrontPhotoProvider>
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Storefront', href: paths.dashboard.user.root },
          { name: user?.displayName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={_userAbout.role}
          name={user?.displayName}
          avatarUrl={user?.photoURL}
          coverUrl={_userAbout.coverUrl}
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

      {currentTab === 'profile' && <AccountGeneral />}

      {currentTab === 'followers' && <ShippingOperations/>}

      {currentTab === 'policies' && <StorePolicies/>}

      {currentTab === 'gallery' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />}
    </Container>
      </StorefrontPhotoProvider>
  );
}
