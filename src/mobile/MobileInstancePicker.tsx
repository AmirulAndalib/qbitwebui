import { useState } from 'react'
import type { Instance } from '../api/instances'

interface Props {
	instances: Instance[]
	current: Instance | 'all'
	onChange: (instance: Instance | 'all') => void
}

export function MobileInstancePicker({ instances, current, onChange }: Props) {
	const [open, setOpen] = useState(false)
	const currentLabel = current === 'all' ? 'All Instances' : current.label

	if (instances.length === 1) {
		return (
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
					{instances[0].label}
				</span>
			</div>
		)
	}

	return (
		<div className="relative">
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2 px-3 py-1.5 rounded-lg active:scale-98 transition-transform"
				style={{ backgroundColor: 'var(--bg-secondary)' }}
			>
				<span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
					{currentLabel}
				</span>
				<svg
					className="w-4 h-4 transition-transform"
					style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{open && (
				<>
					<div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
					<div
						className="absolute left-0 top-full mt-2 z-50 min-w-[200px] rounded-xl border shadow-xl overflow-hidden"
						style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
					>
						<button
							onClick={() => {
								onChange('all')
								setOpen(false)
							}}
							className="w-full text-left px-4 py-3 flex items-center justify-between active:bg-[var(--bg-tertiary)] transition-colors border-b"
							style={{ borderColor: 'var(--border)' }}
						>
							<div className="flex items-center gap-3">
								<div
									className="w-8 h-8 rounded-lg flex items-center justify-center"
									style={{ backgroundColor: 'var(--bg-tertiary)' }}
								>
									<svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
									</svg>
								</div>
								<div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
									All Instances
								</div>
							</div>
							{current === 'all' && (
								<svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							)}
						</button>
						{instances.map((instance) => (
							<button
								key={instance.id}
								onClick={() => {
									onChange(instance)
									setOpen(false)
								}}
								className="w-full text-left px-4 py-3 flex items-center justify-between active:bg-[var(--bg-tertiary)] transition-colors"
							>
								<div className="flex items-center gap-3">
									<div
										className="w-8 h-8 rounded-lg flex items-center justify-center"
										style={{ backgroundColor: 'var(--bg-tertiary)' }}
									>
										<svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
										</svg>
									</div>
									<div>
										<div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
											{instance.label}
										</div>
										<div className="text-xs" style={{ color: 'var(--text-muted)' }}>
											{instance.url}
										</div>
									</div>
								</div>
								{current !== 'all' && instance.id === current.id && (
									<svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								)}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	)
}
