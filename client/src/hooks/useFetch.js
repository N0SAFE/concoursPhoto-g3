import { useAuth } from "../context/AuthContexts.jsx";

function useFetch(url, options) {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { token } = useAuth();
    // set the token in the header Authorization
    
    if (token) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        };
    }

    useEffect(
        () => {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(url, options);
                    const json = await res.json();
                    setResponse(json);
                } catch (error) {
                    setError(error);
                }
            };
            fetchData();
        },
        [url, options]
    );

    return { response, error, isLoading };
}

export default useFetch;