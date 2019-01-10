import loadable from 'loadable-components'

// const loader = () => <Loader loaderClass="central-loader"></Loader>
export const HomeContent = loadable(() => import('./components/HomeContent/HomeContent.jsx'))
export const DownloadsPage = loadable(() => import('./components/DownloadsPage/DownloadsContainer.jsx'))
export const WatchPage = loadable(() => import('./components/WatchPage/WatchContainer.jsx'))
export const SearchPage = loadable(() => import('./components/SearchPage/SearchContainer.jsx'))
export const InfoPage = loadable(() => import('./components/InfoPage/InfoContainer.jsx'))
export const IntegrationPage = loadable(() => import('./components/IntegrationPage/IntegrationContainer.jsx'))
export const SettingsPage = loadable(() => import('./components/SettingsPage/SettingsContainer.jsx'))
export const AboutPage = loadable(() => import('./components/AboutPage/AboutContainer.jsx'))
export const SeasonalPage = loadable(() => import('./components/SeasonalPage/SeasonalContainer.jsx'))