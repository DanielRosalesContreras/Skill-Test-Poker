import React, { useState, useEffect } from "react"; 
import './styles/App.css';
import api from "./api/api.js"
import Card from "./components/Card"

const SUIT_SIZE = 13;

export default function App() {
  const [deck, setDeck] = useState(api.getDeck());
  const [drawnCards, setCards] = useState([]);
  const [board, setBoard] = useState([]);

  function newRound() {
    const { deck, board } = this.state;

    const newDeck = api.getDeck();
    this.setState(Object.assign({}, { board: [], deck: newDeck }));
  }

  const sortCards = () => {
    setTimeout(() => {
      const table = {
        H: [],
        C: [],
        D: [],
        S: [],
      }

      let rank = ''
      let suit = ''
      drawnCards.forEach(card => {
        rank = card.code.charAt(0);
        suit = card.code.charAt(1);

        switch (rank) {
          case 'J':
            table[suit][11] = card;
            break;
          case 'Q':
            table[suit][12] = card;
            break;
          case 'K':
            table[suit][13] = card;
            break;
          case 'A':
            table[suit][0] = card;
            break;
          case '0':
            table[suit][10] = card;
            break;       
          default:
            table[suit][rank] = card;
            break;
        }
      });
      
      const boardAux = [];
      table.H.forEach(e => {boardAux.push(<Card className="card-image" key={e.code} image={e.image} />)});
      table.S.forEach(e => {boardAux.push(<Card className="card-image" key={e.code} image={e.image} />)});
      table.D.forEach(e => {boardAux.push(<Card className="card-image" key={e.code} image={e.image} />)});
      table.C.forEach(e => {boardAux.push(<Card className="card-image" key={e.code} image={e.image} />)});

      setBoard([...boardAux]);

    }, 500);
  }

  const drawCards = async(deckId, qCount) => {
    setTimeout(async () => {
      const card = await api.getCard(deckId);
      setCards(drawnCards => [...drawnCards, card.cards[0]]);
      setBoard(board => [...board, <Card className="card-image" key={card.cards[0].code} image={card.cards[0].image} />]);
      if(card.cards[0].code.charAt(0) === 'Q') qCount++
      if(qCount === 4) {
        const dealButton = document.getElementById('deal-button');
        const sortButton = document.getElementById('sort-button');
        dealButton.disabled = false;
        sortButton.disabled = false;
        return;
      } else {
        drawCards(deckId, qCount, drawnCards);
      }
    }, 1000);
  }

  const startDeal = async () => {
    const dealButton = document.getElementById('deal-button');
    const sortButton = document.getElementById('sort-button');
    dealButton.disabled = true;
    sortButton.disabled = true;

    const deckAux = await deck;
    let qCount = 0;
    let card = null;

    card = await api.getCard(deckAux.deck_id);
    
    setCards(drawnCards => [...drawnCards, card.cards[0]]);
    setBoard(board => [...board, <Card className="card-image" key={card.cards[0].code} image={card.cards[0].image} />]);
    if(card.cards[0].code.charAt(0) === 'Q') qCount++
    drawCards(deckAux.deck_id, qCount);
  }

  return (
    <div className="table">
      <button id="deal-button" onClick={startDeal}> Deal </button>
      <button id="sort-button" onClick={sortCards}> Sort </button>
      <button onClick={() => window.location.reload()}> Restart </button>
      <Card className="back" image="https://media.istockphoto.com/photos/bicycle-rider-back-playing-card-design-picture-id157772536?k=20&m=157772536&s=170667a&w=0&h=46bM0a2wuwcddiOzNOHTfS9PcUzjXwNTTCy33SrkC_0=" />
      <div className="board">
        {board}
      </div>
    </div>
  );
}
