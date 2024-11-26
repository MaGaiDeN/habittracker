import { Router, Request, Response, RequestHandler } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { 
  createTracker,
  getTrackers,
  updateDailyEntry,
  updateTracker,
  deleteTracker
} from '../controllers/tracker.controller'

const router = Router()

router.use(authMiddleware as RequestHandler)

router.post('/', (async (req: Request, res: Response) => {
  return await createTracker(req, res)
}) as RequestHandler)

router.get('/', async (req: Request, res: Response) => {
  return await getTrackers(req, res)
})
router.patch('/:trackerId/entries/:date', async (req: Request, res: Response) => {
  return await updateDailyEntry(req, res)
})
router.patch('/:id', async (req: Request, res: Response) => {
  return await updateTracker(req, res)
})
router.delete('/:id', async (req: Request, res: Response) => {
  return await deleteTracker(req, res)
})

export default router