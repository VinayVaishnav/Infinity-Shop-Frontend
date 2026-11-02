import { authFetch } from './client'

export interface UserProfileUpdate {
  firstName?: string
  lastName?: string
}

export async function updateUserProfile(patch: UserProfileUpdate): Promise<void> {
  const res = await authFetch('/user/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) {
    throw new Error('Failed to update profile')
  }
}
