const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    @property(cc.Node)
    playerNode: cc.Node = null; 

    @property(cc.Node)
    cpuNode: cc.Node = null; 

    @property([cc.SpriteFrame])
    cardSprites: cc.SpriteFrame[] = []; 

    private deck: { color: string, number: string | number }[] = [];
    private currentZOrder: number = 0; // Track the current highest z-order

    onLoad() {
        this.initializeDeck();
        this.shuffleDeck();
        this.dealCards();
    }

    initializeDeck() {
        const colors = ['red', 'green', 'blue', 'yellow'];
        for (const color of colors) {
            for (let i = 0; i <= 9; i++) {
                this.deck.push({ color: color, number: i });
            }
            this.deck.push({ color: color, number: 'Skip' });
            this.deck.push({ color: color, number: 'Reverse' });
            this.deck.push({ color: color, number: 'Draw Two' });
        }
        this.deck.push({ color: 'wild', number: 'Wild' });
        this.deck.push({ color: 'wild', number: 'Wild Draw Four' });
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        const playerCards = this.getRandomCards(7);
        const cpuCards = this.getRandomCards(7);
        this.addCardsToNode(playerCards, this.playerNode);
        this.addCardsToNode(cpuCards, this.cpuNode);
    }

    getRandomCards(count: number): { color: string, number: string | number }[] {
        const randomCards: { color: string, number: string | number }[] = [];
        const drawCount = Math.min(count, this.deck.length);

        for (let i = 0; i < drawCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.deck.length);
            randomCards.push(this.deck[randomIndex]);
            this.deck.splice(randomIndex, 1);
        }

        return randomCards;
    }

    addCardsToNode(cards: { color: string, number: string | number }[], parentNode: cc.Node) {
        const cardSpacing = 100; 
        const startX = -((cards.length - 1) * cardSpacing) / 2; 

        cards.forEach((card, index) => {
            const cardNode = new cc.Node();
            const sprite = cardNode.addComponent(cc.Sprite);
            sprite.spriteFrame = this.getCardSprite(card);
            
            cardNode.setPosition(startX + index * cardSpacing, 0);
            cardNode.parent = parentNode;

            cardNode.on(cc.Node.EventType.TOUCH_END, () => {
                this.moveToCoordinates(cardNode, cc.v2(0, 250)); 
            });
        });
    }

    moveToCoordinates(cardNode: cc.Node, targetPosition: cc.Vec2) {
        const moveDuration = 0.5; 
        
        // Increase the z-order when a card is clicked
        this.currentZOrder++;
        cardNode.zIndex = this.currentZOrder;

        const moveTo = cc.moveTo(moveDuration, targetPosition);
        cardNode.runAction(moveTo);
    }

    getCardSprite(card: { color: string, number: string | number }) {
        const index = this.getCardIndex(card);
        return this.cardSprites[index];
    }

    getCardIndex(card: { color: string, number: string | number }): number {
        const colors = ['red', 'green', 'blue', 'yellow'];
        const colorIndex = colors.indexOf(card.color);
        
        if (colorIndex === -1) {
            return this.cardSprites.length - 1; 
        }

        let numberIndex;
        if (typeof card.number === 'number') {
            numberIndex = card.number; 
        } else {
            const actionCards = ['Skip', 'Reverse', 'Draw Two'];
            numberIndex = actionCards.indexOf(card.number) + 10; 
        }

        return colorIndex * 13 + numberIndex; 
    }
}