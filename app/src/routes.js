import loadable from 'loadable-components';
import Loader from './components/Loader/Loader.jsx'
import React from 'react'

// const loader = () => <Loader loaderClass="central-loader"></Loader>
const loader = () => <div>loading...</div>


export const HomeContent = loadable(() => import('./components/HomeContent/HomeContent.jsx'), { LoadingComponent: loader })
export const DownloadsPage = loadable(() => import('./components/DownloadsPage/DownloadsContainer.jsx'), { LoadingComponent: loader })
export const WatchPage = loadable(() => import('./components/WatchPage/WatchContainer.jsx'), { LoadingComponent: loader })
export const SearchPage = loadable(() => import('./components/SearchPage/SearchContainer.jsx'), { LoadingComponent: loader })
export const InfoPage = loadable(() => import('./components/InfoPage/InfoContainer.jsx'), { LoadingComponent: loader })
export const IntegrationPage = loadable(() => import('./components/IntegrationPage/IntegrationContainer.jsx'), { LoadingComponent: loader })
export const SettingsPage = loadable(() => import('./components/SettingsPage/SettingsContainer.jsx'), { LoadingComponent: loader })
export const AboutPage = loadable(() => import('./components/AboutPage/AboutContainer.jsx'), { LoadingComponent: loader })