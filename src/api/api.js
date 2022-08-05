import axios from "axios";

const api = 'https://deckofcardsapi.com/api'

export default {
    async getDeck() {
        const response = await axios.get(`${api}/deck/new/shuffle`);
        return response.data;
    },
    async getCard(deckId) {
        const response = await axios.get(`${api}/deck/${deckId}/draw`);
        return response.data;
    },
}