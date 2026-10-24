import { useEffect, useState } from 'react';
import Icon from './Icon';

type Notice = { id: number; message: string; type: 'success' | 'error' };

export function notify(message: string, type: Notice['type'] = 'success') {
	window.dispatchEvent(new CustomEvent('app:notice', { detail: { message, type } }));
}

export default function Notifications() {
	const [notices, setNotices] = useState<Notice[]>([]);
	useEffect(() => {
		const onNotice = (event: Event) => {
			const { message, type } = (event as CustomEvent<Omit<Notice, 'id'>>).detail;
			const id = Date.now() + Math.random();
			setNotices((current) => [...current, { id, message, type }]);
			window.setTimeout(() => setNotices((current) => current.filter((item) => item.id !== id)), 4000);
		};
		window.addEventListener('app:notice', onNotice);
		return () => window.removeEventListener('app:notice', onNotice);
	}, []);
	return (
		<div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite" aria-atomic="false">
			{notices.map((notice) => (
				<div key={notice.id} role={notice.type === 'error' ? 'alert' : 'status'} className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${notice.type === 'error' ? 'border-red-200 bg-white/95 text-red-700 dark:border-red-900 dark:bg-neutral-900/95 dark:text-red-300' : 'border-emerald-200 bg-white/95 text-neutral-800 dark:border-emerald-900 dark:bg-neutral-900/95 dark:text-neutral-100'}`}>
					<Icon name={notice.type === 'error' ? 'alert' : 'check'} className={notice.type === 'error' ? 'text-red-500' : 'text-emerald-600'} />
					<span>{notice.message}</span>
				</div>
			))}
		</div>
	);
}
