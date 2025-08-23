import { useState, useEffect, useCallback} from 'react';
import { client } from '../lib/contentfulClient';
import type { HomePage } from '../types/HomePage';
import type { Entry, Asset } from 'contentful';

interface UseHomePageState {
    homePage: HomePage | null;
    loading: boolean;
    error: string | null;
}

const isAsset = (value: unknown): value is Asset => {
    return (
        typeof value === 'object' &&
        value !== null &&
        'fields' in value &&
        typeof (value as any).fields?.file?.url === 'string'
    );
};

const transformHomePage = (entry: Entry<any>): HomePage => {
    const fields = entry.fields;

    const logoUrl =
    isAsset(fields.logo) && fields.logo.fields.file?.url
        ? `https:${fields.logo.fields.file.url}`
        : '';


    return {
        greeting: fields?.greeting?.toString() || '',
        logo: logoUrl,
        secondTitle: fields?.secondTitle?.toString() || '',
        infoBannerTitle: fields?.infoBannerTitle?.toString() || '',
        infoBannerDescription: fields?.infoBannerDescription?.toString() || '',
        secondBannerTitle: fields?.secondBannerTitle?.toString() || '',
        secondBannerDescription: fields?.secondBannerDescription?.toString() || '',
        textButton1: fields?.textButton1?.toString() || '',
        textButton2: fields?.textButton2?.toString() || '',
    };
};


export const useHomePage = () => {
    const [state, setState] = useState<UseHomePageState>({
        homePage: null,
        loading: true,
        error: null,
    });

    const fetchHomePage = async () => {
        let response;
        try{
            setState(prev => ({ ...prev, loading: true, error: null }));
            response = await client.getEntries({
                content_type: 'homePageModel',
                limit: 1,
            });
        }catch(error){
            console.log(error);
            setState(prev => ({ ...prev, loading: false, error: 'Failed to fetch home page content' }));
        }

        if (!response || response.items.length === 0) {
            throw new Error('Home page content not found');
        }
        console.log('Home page response:', response);

        const homePage = transformHomePage(response.items[0]);
        setState(prev => ({ ...prev, loading: false, homePage }));
    }

    useEffect(() => {
        fetchHomePage();
    }, []);

    const refetch = useCallback(() => {
        fetchHomePage();
    }, []);

    return { ...state, refetch };
}