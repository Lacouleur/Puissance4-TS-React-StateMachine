// les guards sont des fonctions qui permettent d'empêcher une transition dans xstate (exemple: empêcher un joueur de rejoindre la pârtie s'il y a déjà 2 joueurs)

import { countEmptyCells, currentPlayer, freePositionY, winingPositions } from "../func/game";
import {GameGuard, PlayerColor } from "../types";

export const canJoinGuard: GameGuard<'join'> = (context, event) => {
    // On vérifie que le nombre de joueur est inférieur à 2
    // && que le joueur voulant rejoindre n'est pas déjà dans la liste des joueurs.
 return context.players.length < 2 && context.players.find(p => p.id === event.playerId) === undefined
}

export const canLeaveGuard: GameGuard<'leave'> = (context, event) => {
    // On, vérifie que le joueur est bien dans la partie avant de le faire quitter.
 return !!context.players.find(p => p.id === event.playerId)
}

export const canChooseColorGuard: GameGuard<"chooseColor"> = (context, event) => {
    // La couleur existe elle ?
    // as t'on un joueur ?
    // Alors on cherche un joueur qui n'ai pas la forme demandée
    return [PlayerColor.RED, PlayerColor.YELLOW].includes(event.color) &&
      context.players.find(p => p.id === event.playerId) !== undefined &&
      context.players.find(p => p.color === event.color) === undefined
  }


  export const canStartGameGuard: GameGuard<"start"> = (context) => {
    // Je regarde si le nombre de joueur qui ont une couleur est supérieur à deux.
    // Si c'est le cas trout les joueurs ont une couleur et on peut lancer la partie. 
    return context.players.filter(p => p.color).length === 2
  }

  export const canDropGuard: GameGuard<"dropToken"> = (context, event) => {
    // ici l'event sera => dropToken: (playerId: Player['id'], x: number) => ({playerId, x}),
    // x correspond à la position dans la grille (dans le puissance 4 on ne peut que drop sur une des collones)
    // Est ce que le pion est laché (event.x) dans une des collones de la grilles, c'est a dire dans une colon strictement inférieur à la taille de grid[0] (la premiere ligne) => context.grid[0].length
    return event.x < context.grid[0].length &&
    // && que que le drop ne se fasse pas à -1 par exemple
      event.x >= 0 &&
      // && Est ce que le joueur courrant est égale au player id passé en paramètre
      context.currentPlayer === event.playerId &&
      // Est ce que la collone n'est pas remplie ?
      // il faut que la free position en collone Y soit suppérieur à 0, par rapport à la grille que j'ai dans le contexte
      // Pour la position de mon jeton que je veux déposer qui est x
        // On utilise supérieur ou égale à zéro car la fonction retourne -1 s'il n'y a pas de place dispo
      freePositionY(context.grid, event.x) >= 0
  }

  export const isWiningMoveGuard: GameGuard<"dropToken"> = (context, event) => {
    // est ce qu'on peut poser un pion && et on vérifie les winning position
    return canDropGuard(context, event) && winingPositions(
      context.grid,
          // le postfix ! retirre null ou undefined du type du résultat de l'expression, ce qui implicitement dit "c'est forcement définit"
      currentPlayer(context).color!,
      event.x,
      context.rowLength
      ).length > 0
  }

// Drawmove c'est le dernier movement quand la grille est pleine
export const isDrawMoveGuard: GameGuard<"dropToken"> = (context, event) => {
  // On regarde si on peut poser la pièce et on regarde le nombe de cases vide (countEmptyCells)
  return canDropGuard(context, event) && countEmptyCells(context.grid) <= 1
}
