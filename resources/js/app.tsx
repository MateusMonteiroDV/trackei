import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { initializeTheme } from './hooks/use-appearance';
import './lib/i18n';
import { persistor, store } from './store';

configureEcho({ broadcaster: 'reverb' });

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <PersistGate
                    loading={<div>Loading...</div>}
                    persistor={persistor}
                >
                    {App.layout ? (
                        App.layout(<App {...props} />)
                    ) : (
                        <App {...props} />
                    )}
                </PersistGate>
            </Provider>,
        );
    },

    progress: { color: '#4b5563' },
});

initializeTheme();
