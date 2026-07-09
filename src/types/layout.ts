export interface LayoutProps {
    title?: string;
    description?: string;
    isArticle?: boolean;
    currentPath?: string;
    openGraphImage?: string;
    lang?: string;
    alternateLinks?: { hreflang: string; pathname: string }[];
    structuredData?: Record<string, unknown> | Record<string, unknown>[];
}
