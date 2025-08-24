import { useState, useEffect, useCallback } from "react";
import { client } from "../lib/contentfulClient";
import type { BlogInfo } from "../types/BlogInfo";
import type { Entry } from "contentful";

interface UseBlogInfoState {
    blogInfo: BlogInfo | null;
    loading: boolean;
    error: string | null;
}

const transformsBlogInfo = (entry: Entry<any>): BlogInfo => {
    return {
        title: entry.fields.title?.toString() || '',
        description: entry.fields.description?.toString() || '',
        msgTitle: entry.fields.msgTitle?.toString() || '',
        msgText: entry.fields.msgText?.toString() || '',
        textButton: entry.fields.textButton?.toString() || '',
    };
};

export const useBlogInfo = () => {
    const [state, setState] = useState<UseBlogInfoState>({
        blogInfo: null,
        loading: true,
        error: null,
    });

    const fetchBlogInfo = async () => {
        let response;

        try{
            setState(prev => ({ ...prev, loading: true, error: null }));
            response = await client.getEntry("6zFtlBOS6fbIFGcWzkxh7l");
        } catch (error) {
            console.error("Error fetching store info:", error);
            setState(prev => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch BLOG info' }));
        }

        if (!response) {
            throw new Error('No blog info found');
        }

        const blogInfo = transformsBlogInfo(response);
        setState(prev => ({ ...prev, loading: false, blogInfo }));
    };

    useEffect(() => {
        fetchBlogInfo();
    }, []);

    const refetchBlogInfo = useCallback(() => {
        fetchBlogInfo();
    }, []);

    return { ...state, refetchBlogInfo };
};
