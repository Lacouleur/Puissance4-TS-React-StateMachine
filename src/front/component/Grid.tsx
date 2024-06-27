import { CellState, GridState, PlayerColor, Position } from "../../types";
import { CSSProperties } from "react";
import { discColorClass } from "../../func/color";
import { prevent } from "../../func/dom";

type GridProps = {
  grid: GridState;
  color?: PlayerColor;
  onDrop?: (x: number) => void;
  winingPositions: Position[];
};

export function Grid({ grid, color, onDrop, winingPositions }: GridProps) {
  // Nombre de colones grid[0].length (On regarde la taille de la première ligne)
  const cols = grid[0].length;
  const showColumns = color && onDrop;
  const isWining = (x: number, y: number) =>
    !!winingPositions.find((p) => p.x === x && y === p.y);
  // on map sur la grille pour trouver la collonne et directement on map sur la collone pour trouver la case, ensuite on passe l'élément JSX <Cell> avec l'emplacement x & y et la couleur.
  // CSSProperties permet de donner un type au propriétés css de react {'--rows': grid.length, '--cols': cols}
  // les CSS properties de react permettent d'envoyer de l'info au CSS

  return (
    <div
      className="grid"
      style={{ "--rows": grid.length, "--cols": cols } as CSSProperties}
    >
      {grid.map((row, y) =>
        row.map((c, x) => (
          <Cell
            active={isWining(x, y)}
            x={x}
            y={y}
            color={c}
            key={`${x}-${y}`}
          />
        ))
      )}
      {showColumns && (
        <div className="columns">
          {new Array(cols).fill(1).map((_, k) => (
            <Column onDrop={() => onDrop(k)} color={color} key={k} />
          ))}
        </div>
      )}
    </div>
  );
  //new Array(cols).fill(1).map((_, k) <<<< Je créer u nouveau tableau, je le remplis de 1, Je map dessus et je rècupére l'index k
}

type CellProps = {
  x: number;
  y: number;
  color: CellState;
  active: boolean;
};

function Cell({ x, y, color, active }: CellProps) {
  return (
    <div
      style={{ "--row": y } as CSSProperties}
      className={discColorClass(color) + (active ? " disc-active" : "")}
    />
  );
}

type ColumnProps = {
  color: PlayerColor;
  onDrop: () => void;
};

function Column({ color, onDrop }: ColumnProps) {
  return (
    <button onClick={prevent(onDrop)} className="column">
      <div className={discColorClass(color)}></div>
    </button>
  );
}
