import {
  GameContext,
  GameEvent,
  GameEvents,
  GameStates,
  Player
} from "../../types";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext
} from "react";
import { useMachine } from "@xstate/react";
import { GameMachine } from "../../machine/gameMachine";

type GameContextType = {
  state: GameStates;
  context: GameContext;
  send: <T extends GameEvents["type"]>(
    event: { type: T; playerId?: string } & Omit<GameEvent<T>, "playerId">
  ) => void;
  can: <T extends GameEvents["type"]>(
    event: { type: T; playerId?: string } & Omit<GameEvent<T>, "playerId">
  ) => boolean;
  playerId: Player["id"];
};

const Context = createContext<GameContextType>({} as any);

//Permet de retourner un objet qui contient les infos states, context, send..
export function useGame(): GameContextType {
  return useContext(Context);
}

export function GameContextProvider({ children }: PropsWithChildren) {
  // use machine est un Hook react prévus par xstate (installer en faisant: pnpm add @xstate/react)
  // On importe useMachine de xstate/react et on lui passe la gamemachine crée au premier chapitre
  // useMachine retroune l'état de la machine "state", et send qui permet de passer des informations à la machine.
  const [state, send] = useMachine(GameMachine);
  const playerId = state.context.currentPlayer ?? "";
  const sendWithPlayer = useCallback<GameContextType["send"]>(
    (event) => send({ playerId, ...event } as GameEvents),
    [playerId]
  );
  // Pour la methode can, on va utiliser la methode changed pour savoir si un transition a effectué un changement d'état ou non
  // Le but serait par exmple de regarder si au moins un des deux joueurs à une couleur avant de lancer la partie
  // On prend en parametre un évenement de type GameEvents
  // on se base sur notre machine et on lui demande d'effectuer une transition en lui passant le state et l'event ==> GameMachine.transition(state, event)
  // on met !! decant pour avoir un resultat bool
  // Là la fonction va retourner true si on a un changement d'état avec l'événement envoyé.
  // Voir le composant lobbyscreen pour utilisation.
  const can = useCallback<GameContextType["can"]>(
    (event) =>
      !!GameMachine.transition(state, { playerId, ...event } as GameEvents)
        .changed,
    [state, playerId]
  );
  return (
    <Context.Provider
      value={{
        playerId,
        state: state.value as GameStates,
        context: state.context,
        send: sendWithPlayer,
        can: can
      }}
    >
      {children}
    </Context.Provider>
  );
}
