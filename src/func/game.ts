import { GameContext, GridState, Player, PlayerColor } from '../types'

export function freePositionY(grid: GridState, x: number): number {
    // on veut trouver la première case vide en commençant par le bas
    // on fait donc une incrémentation inversée.
  for (let y = grid.length - 1; y >= 0; y--) {
    // grid[y][x] => est ce qu'en collone y à la position x
    // si on tombe sur 'E' c'est que la case est vide
    if (grid[y][x] === 'E') {
      return y
    }
  }
  // on pourrait retourner un false out bien  null, mais l'avantage de -1 c'est qu'on  reste sur le type "number"
  return -1
}


// Winning position doit vérifier si le dernier pion mis est gaganant.
// Pour ça on va partir de la position du pion courrant qua l'on connait, et regarder dans toutes les directions s'il y a bien (4) le nombnre de pion de la même couleur nécessaire à la victoire. 
export function winingPositions (grid: GridState, color: PlayerColor, x: number, size: number) {
  const directions = [
    // VV 1 en x et 0 en y
    [1, 0],
    // VV  0 en x 1 en y
    [0, 1],
    // VV diag bas droite
    [1, 1],
    // VV diag bas gauche
    [1, -1]
  ]

  // position du vurseur
  const position = {
    y: freePositionY(grid, x),
    x: x
  }

  for (const direction of directions) {
    // on créer un tableau qui mémorise tout les pion avec la bonne couleur.
    const items = [position]
    // la sous boucle forcward permet d'inverser l'analyse (pour avoir les 8 directions) - 1 ne fait rien, -1 inverse (i * direction[0] * forward)
    for (const forward of [1, -1]) {
      // size c'est 4 dans un puissance4 : Donc avance de 4 fans la direction courante.
      for (let i = 1; i < size; i++) {
        // on multiplie i (ou l'on regarde) par la position y ou x pour faire avancer lanalyse au pion suivant
        const x = position.x + (i * direction[0] * forward)
        const y = position.y + (i * direction[1] * forward)

        // Si on tombe sur une couleur différente, on sort.
        // le ?. évite qu'on aille sur des cases hors grilles (undefined)
        if (grid?.[y]?.[x] !== color) {
          break;
        }

        // si on a la même couleur on ajoute certte position à la liste.
        items.push({ x, y })
      }
    }
    // a la fin de la boucle retourne les items si on en a {size} ou plus
    if (items.length >= size) {
      return items
    }
  }
// si non retourne un tableau vide.
  return []
// une fois qu'on a cette fonction on peut l'utiliser dans un guard pour savoir s'il faut arrêter la partie ou non. => isWinningMoveGuard.
}

export function currentPlayer (context: GameContext): Player {
  const player = context.players.find(p => p.id === context.currentPlayer)
  if (player === undefined) {
    throw new Error("Impossible de récupérer le joueur courant")
  }
  return player
}


export function countEmptyCells(grid: GridState): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell === 'E') {
        count++
      }
    }
  }
  return count
}
