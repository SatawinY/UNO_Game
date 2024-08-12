const { ccclass, property } = cc._decorator;

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null; // Assign the player node in the inspector

    @property(cc.Node)
    cpuNode: cc.Node = null; // Assign the CPU node in the inspector

    @property([cc.SpriteFrame])
    cardSprites: cc.SpriteFrame[] = []; // Assign your card sprite frames in the inspector

    private deck: { color: string, number: string | number }[] = [];

    onLoad() {
        this.initializeDeck();
        this.shuffleDeck();
        this.dealCards();
    }

    // Initialize the deck of Uno cards
    initializeDeck() {
        const colors = ['red', 'green', 'blue', 'yellow'];
        for (const color of colors) {
            for (let i = 0; i <= 9; i++) {
                this.deck.push({ color: color, number: i });
            }
            // Add action cards (Skip, Reverse, Draw Two)
            this.deck.push({ color: color, number: 'Skip' });
            this.deck.push({ color: color, number: 'Reverse' });
            this.deck.push({ color: color, number: 'Draw Two' });
        }
        // Add wild cards
        this.deck.push({ color: 'wild', number: 'Wild' });
        this.deck.push({ color: 'wild', number: 'Wild Draw Four' });
    }

    // Shuffle the deck
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    // Deal cards to players
    dealCards() {
        const playerCards = this.getRandomCards(7);
        const cpuCards = this.getRandomCards(7);

        // Display cards for each player
        this.addCardsToNode(playerCards, this.playerNode);
        this.addCardsToNode(cpuCards, this.cpuNode);
    }

    getRandomCards(count: number): { color: string, number: string | number }[] {
        const randomCards: { color: string, number: string | number }[] = [];
        const drawCount = Math.min(count, this.deck.length);

        for (let i = 0; i < drawCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.deck.length);
            randomCards.push(this.deck[randomIndex]);
            this.deck.splice(randomIndex, 1); // Remove the card from the deck
        }

        return randomCards;
    }

    // Create card nodes and add them to the specified parent node
    addCardsToNode(cards: { color: string, number: string | number }[], parentNode: cc.Node) {
        const cardSpacing = 100; // Adjust the spacing between cards
        const startX = -((cards.length - 1) * cardSpacing) / 2; // Start position based on the number of cards

        cards.forEach((card, index) => {
            const cardNode = new cc.Node();
            const sprite = cardNode.addComponent(cc.Sprite);
            sprite.spriteFrame = this.getCardSprite(card);
            
            // Set the position to spread out the cards
            cardNode.setPosition(startX + index * cardSpacing, 0); // Spread out horizontally
            cardNode.parent = parentNode;
        });
    }

    // Get the correct sprite frame for the card
    getCardSprite(card: { color: string, number: string | number }) {
        const index = this.getCardIndex(card);
        return this.cardSprites[index];
    }

    // Get the index of the card sprite frame
    getCardIndex(card: { color: string, number: string | number }): number {
        const colors = ['red', 'green', 'blue', 'yellow'];
        const colorIndex = colors.indexOf(card.color);
        
        if (colorIndex === -1) {
            // For wild cards
            return this.cardSprites.length - 1; // Assuming wild cards are at the end of the array
        }

        let numberIndex;
        if (typeof card.number === 'number') {
            numberIndex = card.number; // For numbered cards
        } else {
            // Map action cards to specific indices
            const actionCards = ['Skip', 'Reverse', 'Draw Two'];
            numberIndex = actionCards.indexOf(card.number) + 10; // Assuming action cards start from index 10
        }

        return colorIndex * 13 + numberIndex; // 13 cards per color (0-9 + 3 action cards)
    }
}