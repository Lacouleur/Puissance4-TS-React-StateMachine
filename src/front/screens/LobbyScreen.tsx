import { NameSelector } from "../component/NameSelector";
import { useGame } from "../hooks/useGame";
import { ColorSelector } from "../component/ColorSelector";
import { PlayerColor } from "../../types";
import { prevent } from "../../func/dom";

type LobbyScreenProps = {};

export function LobbyScreen({}: LobbyScreenProps) {
  const { send, context, can } = useGame();
  const colors = [PlayerColor.YELLOW, PlayerColor.RED];

  const joinGame = (name: string) =>
    send({ type: "join", name: name, playerId: name });
  const chooseColor = (color: PlayerColor) =>
    send({
      type: "chooseColor",
      color,
      playerId: color === PlayerColor.YELLOW ? "John" : "Marc"
    });
  const startGame = () => send({ type: "start" });

  // grace à la machine à état, le start ne peut fonctionner que si les conditions sont remplit : Les Joueur on un nom et une couleur
  const canStart = can({ type: "start" });

  return (
    <div>
      <NameSelector onSelect={joinGame} />
      <ColorSelector
        onSelect={chooseColor}
        players={context.players}
        colors={colors}
      />
      <p>
        <button
          disabled={!canStart}
          className="button"
          onClick={prevent(startGame)}
        >
          Démarrer
        </button>
      </p>
    </div>
  );
}
