cc.Class({
    extends: cc.Component,

    properties: {
        playerNode: {
            default: null,
            type: cc.Node // Reference to the player node
        },
        deck: {
            default: [],
            type: [cc.String] // Assuming the deck contains string identifiers for cards
        },
    },

    onLoad() {
        // Assuming card_large_black is the node you want to make clickable
        let card = this.node.getChildByName('card_large_black');
        if (card) {
            card.on(cc.Node.EventType.TOUCH_END, this.onCardClicked, this);
        } else {
            cc.error('Card node "card_large_black" not found.');
        }
    },

    onCardClicked() {
        // Check if there are cards left in the deck
        if (this.deck.length > 0) {
            // Draw a card from the deck
            const drawnCard = this.deck.pop(); // Remove the last card from the deck
            
            // Assuming the Player script has a method to handle adding a card
            const playerScript = this.playerNode.getComponent('Player');
            if (playerScript && typeof playerScript.addCard === 'function') {
                playerScript.addCard(drawnCard); // Add the drawn card to the player's hand
                cc.log('Card drawn:', drawnCard);
            } else {
                cc.error('Player script or addCard method not found.');
            }
        } else {
            cc.log('No cards left in the deck');
        }
    },
});