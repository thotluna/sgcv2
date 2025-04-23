import { userSaveAction } from '../_auth/user-save.action'
import { LoadUserStore } from './dashboard/loadUserStore'

export default async function PrivatePage() {
  const user = await userSaveAction()

  return user && <LoadUserStore user={user!} />
}
