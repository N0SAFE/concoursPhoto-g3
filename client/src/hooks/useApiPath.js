export default function useApiPath() {
    return path => new URL(path, import.meta.env.VITE_API_URL).toString();
}
