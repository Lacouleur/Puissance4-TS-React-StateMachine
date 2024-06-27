import { Player, PlayerColor } from "../../types";
import { discColorClass } from "../../func/color";

type ColorSelectorProps = {
  onSelect: (color: PlayerColor) => void;
  players: Player[];
  colors: PlayerColor[];
};

export function ColorSelector({
  onSelect,
  players,
  colors
}: ColorSelectorProps) {
  return (
    <>
      <div className="players">
        {players.map((player) => (
          <div key={player.id} className="player">
            {player.name}
            {player.color && <div className={discColorClass(player.color)} />}
          </div>
        ))}
      </div>
      <h3>Sélectionnez une couleur</h3>
      <div className="selector">
        {colors.map((color) => (
          <button key={color} onClick={() => onSelect(color)}>
            <div className={discColorClass(color)}></div>
          </button>
        ))}
      </div>
    </>
  );
}
