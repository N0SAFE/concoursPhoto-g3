export default function useApiPath() {
    return path =>
        new URL(
            import.meta.env.VITE_API_URL +
                '/' +
                (path?.startsWith('/') ? path?.substring(1) : path)
        ).toString();
}
