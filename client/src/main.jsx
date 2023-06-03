import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if (!import.meta.env.VITE_API_URL) {
    throw new Error('VITE_API_URL is not defined');
}

console.debug = () => {};

async function main() {
    if (import.meta.env.MODE === 'development') {
        console.warn('You are running the app in development mode');
        console.debug = console.log;
        const preApp = ReactDOM.createRoot(document.getElementById('root'));
        preApp.render(
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <h1>developement healthcheck...</h1>
            </div>
        );

        const data = await (async () => {
            try {
                return await fetch(
                    import.meta.env.VITE_API_URL + '/healthcheck',
                    {
                        method: 'GET',
                    }
                ).then(r => r.json());
            } catch (e) {
                return await e;
            }
        })();

        if (data.status === 'ok') {
            console.debug('healthcheck ok');
        } else {
            console.error('healthcheck failed');
            console.error(data);
            preApp.render(
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999,
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <h1>healthcheck failed</h1>
                    <div
                        style={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <pre
                            style={{
                                overflow: 'auto',
                                color: 'red',
                                backgroundColor: 'black',
                                padding: '1rem',
                                borderRadius: '1rem',
                            }}
                        >
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                </div>
            );
            throw new Error('healthcheck failed');
        }

        preApp.unmount();
    }

    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

main();
