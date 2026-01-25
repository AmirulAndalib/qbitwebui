export interface PeriodStats {
	instanceId: number
	instanceLabel: string
	uploaded: number
	downloaded: number
	hasData: boolean
	dataPoints: number
}

export async function getStats(period: string): Promise<PeriodStats[]> {
	const res = await fetch(`/api/stats?period=${period}`, { credentials: 'include' })
	if (!res.ok) throw new Error('Failed to fetch stats')
	return res.json()
}

export async function getPeriods(): Promise<string[]> {
	const res = await fetch('/api/stats/periods', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed to fetch periods')
	return res.json()
}
