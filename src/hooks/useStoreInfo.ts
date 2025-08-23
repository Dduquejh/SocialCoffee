import { useState, useEffect, useCallback} from 'react';
import { client } from '../lib/contentfulClient';
import type { StoreInfo } from '../types/StoreInfo';
import type { Entry } from 'contentful';

interface UseStoreInfoState {
    storeInfo: StoreInfo | null;
    loading: boolean;
    error: Error | null;
}

const transformStoreInfo = (entry: Entry<any>): StoreInfo => {
    return {
        title: entry.fields.title?.toString() || '',
        details: entry.fields.details?.toString() || '',
        footerTitle: entry.fields.footerTitle?.toString() || '',
        footerDescription: entry.fields.footerDescription?.toString() || '',
        footerButtonText: entry.fields.footerButtonText?.toString() || '',
    };
};

export const useStoreInfo = () => {
    const [state, setState] = useState<UseStoreInfoState>({
        storeInfo: null,
        loading: true,
        error: null,
    });

    const fetchStoreInfo = async () => {
        let response;
        
        try{
            setState(prev => ({...prev, loading: true, error: null}));
            response = await client.getEntry("52Sxs3KB9uj4e9x9joxxvs");
        } catch (error) {
            console.error("Error fetching store info:", error);
            setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error : new Error('Failed to fetch store info') }));
        }

        if (!response) {
            throw new Error('No store info found');
        }

        const storeInfo = transformStoreInfo(response);
        setState(prev => ({ ...prev, storeInfo, loading: false }));
    };

    useEffect(() => {
        fetchStoreInfo();
    }, []);

    const refetch = useCallback(() => {
        fetchStoreInfo();
    }, []);

    return { ...state, refetch };
};
