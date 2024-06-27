import { useGame } from '../hooks/useGame'
import { Draw } from '../component/Draw'

type DrawScreenProps = {}

export function DrawScreen ({}: DrawScreenProps) {
  const {send} = useGame()
  const restart = () => send({type: 'restart'})
  return <div>
    <Draw onRestart={restart}/>
  </div>
}
