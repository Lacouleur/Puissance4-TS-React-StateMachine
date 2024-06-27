import { InterpreterFrom, interpret } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  GameContext,
  GridState,
  Player,
  PlayerColor,
  Position
} from "../types";
import {
  canChooseColorGuard,
  canDropGuard,
  canJoinGuard,
  canLeaveGuard,
  canStartGameGuard,
  isDrawMoveGuard,
  isWiningMoveGuard
} from "./guards";
import {
  chooseColorAction,
  dropTokenAction,
  joinGameAction,
  leaveGameAction,
  restartAction,
  saveWiningPositionsActions,
  setCurrentPlayerAction,
  switchPlayerAction
} from "./actions";

enum GameStates {
  LOBBY = "LOBBY",
  PLAY = "PLAY",
  VICTORY = "VICTORY",
  DRAW = "DRAW"
}

export const GameModel = createModel(
  {
    players: [] as Player[],
    currentPlayer: null as null | Player["id"],
    // Nombre de pion à aligner pour la victoire
    rowLength: 4,
    winingPositions: [] as Position[],
    // On représente le jeu avec une grille, "E" pour empty
    grid: [
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"]
    ] as GridState
  },
  {
    events: {
      join: (playerId: Player["id"], name: Player["name"]) => ({
        playerId,
        name
      }),
      leave: (playerId: Player["id"]) => ({ playerId }),
      chooseColor: (playerId: Player["id"], color: PlayerColor) => ({
        playerId,
        color
      }),
      start: (playerId: Player["id"]) => ({ playerId }),
      dropToken: (playerId: Player["id"], x: number) => ({ playerId, x }),
      restart: (playerId: Player["id"]) => ({ playerId })
    }
  }
);

// function makeGame: Le but de cette fonction est de retourner une machine déjà construite (interprété)
// on se sert de ça nottament pour les testes
export function makeGame(
  state: GameStates = GameStates.LOBBY,
  context: Partial<GameContext> = {}
): InterpreterFrom<typeof GameMachine> {
  const machine = interpret(
    // ici on "clone" la machine pour lui passer un contexte particulier .withContext
    GameMachine.withContext({
      // base toi sur l'initialContext
      ...GameModel.initialContext,
      // et rajoute d'éventuelles propriétés qui ont été passés en partiel dans context
      ...context
    })
  ).start();
  machine.state.value = state;
  return machine;
}

export const GameMachine = GameModel.createMachine({
  id: "game",
  context: {
    ...GameModel.initialContext,
    players: [
      {
        id: "John",
        name: "John",
        color: PlayerColor.YELLOW
      },
      {
        id: "Marc",
        name: "Marc",
        color: PlayerColor.RED
      }
    ],
    currentPlayer: "John"
  },
  initial: GameStates.PLAY,
  states: {
    [GameStates.LOBBY]: {
      on: {
        join: {
          cond: canJoinGuard,
          actions: [GameModel.assign(joinGameAction)],
          target: GameStates.LOBBY
        },
        leave: {
          cond: canLeaveGuard,
          actions: [GameModel.assign(leaveGameAction)],
          target: GameStates.LOBBY
        },
        chooseColor: {
          cond: canChooseColorGuard,
          target: GameStates.LOBBY,
          actions: [GameModel.assign(chooseColorAction)]
        },
        start: {
          cond: canStartGameGuard,
          target: GameStates.PLAY,
          actions: [GameModel.assign(setCurrentPlayerAction)]
        }
      }
    },
    [GameStates.PLAY]: {
      after: {
        20000: {
          target: GameStates.PLAY,
          actions: [GameModel.assign(switchPlayerAction)]
        }
      },
      on: {
        dropToken: [
          {
            cond: isDrawMoveGuard,
            target: GameStates.DRAW,
            actions: [GameModel.assign(dropTokenAction)]
          },
          {
            cond: isWiningMoveGuard,
            target: GameStates.VICTORY,
            actions: [
              GameModel.assign(saveWiningPositionsActions),
              GameModel.assign(dropTokenAction)
            ]
          },
          {
            cond: canDropGuard,
            target: GameStates.PLAY,
            actions: [
              GameModel.assign(dropTokenAction),
              GameModel.assign(switchPlayerAction)
            ]
          }
        ]
      }
    },
    [GameStates.VICTORY]: {
      on: {
        restart: {
          target: GameStates.LOBBY,
          actions: [GameModel.assign(restartAction)]
        }
      }
    },
    [GameStates.DRAW]: {
      on: {
        restart: {
          target: GameStates.LOBBY,
          actions: [GameModel.assign(restartAction)]
        }
      }
    }
  }
});
