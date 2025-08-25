import ReactGA from 'react-ga4';

const MEASUREMENT_ID = 'G-R21JLZ3B9E';

export const initAnalytics = () => {
    ReactGA.initialize(MEASUREMENT_ID);
};

export const trackPageView = (page: string) => {
    ReactGA.send({ hitType: 'pageview', page });
};

export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    params?: Record<string, any>
) => {
    ReactGA.event({
        action,
        category,
        label,
        ...params,
    });
};
