import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



/*
import { GameMachine, GameModel } from './machine/gameMachine.js'
import { interpret } from 'xstate'

// interpret est une methode de xstate permettant de créer une nouvelle instance de la machine.
// .start() permet de démarer cette instance
const machine = interpret(GameMachine).start()
// .changed permet de véfifier si une transition a bien eu lieu.
console.log(machine.send(GameModel.events.join('1', 'Jaune Lacouleur')).changed)
// On console log une seconde fois pour vérifier si le guard qui évite à un joueur de se connecter deux fois a fonctionner
console.log(machine.send(GameModel.events.join('1', 'Jaune Lacouleur')).changed)
 */