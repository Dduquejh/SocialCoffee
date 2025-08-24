import { useState, useEffect, useCallback } from 'react';
import { client } from '../lib/contentfulClient';
import type { BlogContent } from '../types/BlogContent';
import type { Entry, Asset } from 'contentful';

interface UseBlogEntriesState {
    blogEntries: BlogContent[];
    loading: boolean;
    error: Error | null;
}

const isAsset = (value: unknown): value is Asset => {
    return (
        typeof value === 'object' &&
        value !== null &&
        'fields' in value &&
        typeof (value as any).fields?.file?.url === 'string'
    )
}

const transformBlogEntry = (entry: Entry<any>): BlogContent => {
    const fields = entry.fields;

    const mediaUrl =
        isAsset(fields?.media) && fields.media.fields.file?.url
            ? `https:${fields.media.fields.file.url}`
            : '';

    return {
        title: fields?.title?.toString() || '',
        slug: fields?.slug?.toString() || '',
        media: mediaUrl,
        content: fields?.content?.toString() || '',
        isActive: fields?.isActive === true || fields?.isActive?.toString().toLowerCase() === 'true',
        author: fields?.author?.toString() || '',
        publishedDate: fields?.publicationDate?.toString() || ''
    }
};

export const useBlogEntries = () => {
    const [state, setState] = useState<UseBlogEntriesState>({
        blogEntries: [],
        loading: false,
        error: null
    })

    const fetchBlogEntries = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            
            const response = await client.getEntries({
                content_type: 'blogModel',
                limit: 100
            })

            // Si no hay respuesta o no hay items, manejarlo como un estado válido pero vacío
            if (!response || response.items.length === 0) {
                console.log('No blog entries found');
                setState(prev => ({ 
                    ...prev, 
                    loading: false, 
                    blogEntries: [],
                    error: null // No es un error, simplemente no hay entradas
                }));
                return;
            }

            console.log('Blog entries fetched:', response.items.map(transformBlogEntry));
            const blogEntries = response.items.map(transformBlogEntry);
            setState(prev => ({ ...prev, loading: false, blogEntries, error: null }));

        } catch (error) {
            console.error('Error fetching blog entries:', error);
            setState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error as Error,
                blogEntries: [] // Limpiar entradas en caso de error
            }));
        }
    }

    useEffect(() => {
        fetchBlogEntries();
    }, []);

    const refetch = useCallback(() => {
        fetchBlogEntries();
    }, []);

    return {
        ...state,
        refetch
    }
}