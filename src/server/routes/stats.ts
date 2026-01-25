import { Hono } from 'hono'
import { db, type Instance } from '../db'
import { authMiddleware } from '../middleware/auth'
import { getStatsForPeriod, type PeriodStats } from '../utils/statsRecorder'
import { fetchInstanceTransferStats } from '../utils/qbt'

const stats = new Hono()

stats.use('*', authMiddleware)

const PERIODS: Record<string, number> = {
	'15m': 15 * 60,
	'30m': 30 * 60,
	'1h': 60 * 60,
	'4h': 4 * 60 * 60,
	'12h': 12 * 60 * 60,
	'1d': 24 * 60 * 60,
	'1w': 7 * 24 * 60 * 60,
	'1mo': 30 * 24 * 60 * 60,
	'6mo': 180 * 24 * 60 * 60,
	'1y': 365 * 24 * 60 * 60,
}

interface InstancePeriodStats extends PeriodStats {
	instanceId: number
	instanceLabel: string
}

stats.get('/', async (c) => {
	const user = c.get('user')
	const period = c.req.query('period') || '1d'

	const instances = db
		.query<Instance, [number]>('SELECT * FROM instances WHERE user_id = ? ORDER BY created_at')
		.all(user.id)

	if (period === 'all') {
		const results: InstancePeriodStats[] = []
		for (const instance of instances) {
			const live = await fetchInstanceTransferStats(instance)
			results.push({
				instanceId: instance.id,
				instanceLabel: instance.label,
				uploaded: live?.uploaded ?? 0,
				downloaded: live?.downloaded ?? 0,
				hasData: !!live,
				dataPoints: 0,
			})
		}
		return c.json(results)
	}

	const periodSeconds = PERIODS[period]
	if (!periodSeconds) {
		return c.json({ error: 'Invalid period' }, 400)
	}

	const results: InstancePeriodStats[] = instances.map((instance) => {
		const stats = getStatsForPeriod(instance.id, periodSeconds)
		return {
			instanceId: instance.id,
			instanceLabel: instance.label,
			...stats,
		}
	})

	return c.json(results)
})

stats.get('/periods', (c) => {
	return c.json(Object.keys(PERIODS).concat('all'))
})

export default stats
