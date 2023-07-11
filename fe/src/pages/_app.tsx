import '@/styles/globals.scss';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserContextProvider } from '@/context/UserContext';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 3,
		}
	}
});

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.tz.setDefault("Asia/Shanghai")

	return (
		<QueryClientProvider client={queryClient}>
			<UserContextProvider>
				<Component {...pageProps} />
			</UserContextProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	)
}
