// les actions prennent un événement et retourne un contexte qui a changé. En ne revoyant que les propriétés du contexte qui ont changés.

import { GameAction, GameContext, PlayerColor } from "../types";
import { currentPlayer, freePositionY, winingPositions } from "../func/game";
import { GameModel } from "./gameMachine";

export const joinGameAction: GameAction<"join"> = (context, event) => ({
  players: [...context.players, { id: event.playerId, name: event.name }]
});

export const leaveGameAction: GameAction<"leave"> = (context, event) => ({
  players: context.players.filter((p) => p.id !== event.playerId)
});

export const chooseColorAction: GameAction<"chooseColor"> = (
  context,
  event
) => ({
  players: context.players.map((p) => {
    if (p.id === event.playerId) {
      return { ...p, color: event.color };
    }
    return p;
  })
});

// ici on est un peu plus spécifique sur ce qu'on veut en param {grid, players}, {x: eventX, playerId}, c'est pour éviter de récupérer tout context et tout event
export const dropTokenAction: GameAction<"dropToken"> = (
  { grid, players },
  { x: eventX, playerId }
) => {
  // le joueur exist ?  et le joueur a t'il une couleur : color!
  // le postfix ! retirre null ou undefined du type du résultat de l'expression, ce qui implicitement dit "c'est forcement définit"
  const playerColor = players.find((p) => playerId === p.id)!.color!;

  // Je répupère la position en y
  const eventY = freePositionY(grid, eventX);

  // On map sur tout le tableau pour trouver celle qui a un y et un x qui correspond a l'event, et dans ce cas là on lui donne la couleur du joueur si non je laisse la valeur initiale "v"
  const newGrid = grid.map((row, y) =>
    row.map((v, x) => (x === eventX && y === eventY ? playerColor : v))
  );

  // je retourne la nouvelle grille
  return {
    grid: newGrid
  };
};

export const switchPlayerAction = (context: GameContext) => ({
  currentPlayer: context.players.find((p) => p.id !== context.currentPlayer)!.id
});

export const saveWiningPositionsActions: GameAction<"dropToken"> = (
  context,
  event
) => ({
  winingPositions: winingPositions(
    context.grid,
    currentPlayer(context).color!,
    event.x,
    context.rowLength
  )
});

export const restartAction: GameAction<"restart"> = () => ({
  winingPositions: [],
  grid: GameModel.initialContext.grid,
  currentPlayer: null
});

export const setCurrentPlayerAction = (context: GameContext) => ({
  // le postfix ! retirre null ou undefined du type du résultat de l'expression, ce qui implicitement dit "c'est forcement définit"
  currentPlayer: context.players.find((p) => p.color === PlayerColor.YELLOW)!.id
});
