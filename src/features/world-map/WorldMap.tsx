import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/shared/store'

export function WorldMap() {
  const navigate = useNavigationStore((s) => s.navigate)

  return (
    <div>
      <h1>World Map</h1>
      <Button onClick={() => navigate('MainMenu')}>Back</Button>
    </div>
  )
}
