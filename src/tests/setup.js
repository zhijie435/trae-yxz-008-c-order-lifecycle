import { beforeEach } from 'vitest'

beforeEach(() => {
  if (typeof document !== 'undefined') {
    document.body.innerHTML = ''
  }
  vi.clearAllMocks()
  vi.useFakeTimers()
  if (navigator.clipboard) {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
  }
})
