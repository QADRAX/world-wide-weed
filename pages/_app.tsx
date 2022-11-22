import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../client/config/theme';
import createEmotionCache from '../client/config/createEmotionCache';
import { ReduxProvider } from '../client/context/ReduxContext.component';
import { AuthProvider } from '../client/context/AuthContext.component';
import '../client/styles/globals.css';
import getConfig from 'next/config';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const { publicRuntimeConfig } = getConfig();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const version: string = publicRuntimeConfig?.version ?? '0.0.0';

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>World Wide Weed v{version}</title>
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AuthProvider>
          <ReduxProvider>
            <Component {...pageProps} />
          </ReduxProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
