import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserContextProvider } from '@/context/UserContext';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	const queryClient = new QueryClient();

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
