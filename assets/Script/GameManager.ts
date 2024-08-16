const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.Node)
    cpuNode: cc.Node = null;

    @property([cc.SpriteFrame])
    blueCardSprites: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    greenCardSprites: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    redCardSprites: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    yellowCardSprites: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    skipCardSprites: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    reverseCardSprites: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    drawTwoCardSprites: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    wildCardSprites: cc.SpriteFrame[] = []; // New property for wild cards

    @property([cc.SpriteFrame])
    wildDrawFourCardSprites: cc.SpriteFrame[] = []; // New property for wild draw four cards

    private deck: { color: string, number: number | string }[] = [];
    private currentZOrder: number = 0;
    private lastCpuCard: cc.Node = null;
    private lastPlayedCardWasSkip: boolean = false;

    onLoad() {
        this.initializeDeck();
        this.shuffleDeck();
        this.dealCards();
    }

    initializeDeck() {
        const colors = ['blue', 'green', 'red', 'yellow'];
        for (const color of colors) {
            for (let i = 0; i <= 9; i++) {
                this.deck.push({ color: color, number: i });
            }
            this.deck.push({ color: color, number: 'Skip' });
            this.deck.push({ color: color, number: 'Reverse' });
            this.deck.push({ color: color, number: 'Draw Two' });
        }

        // Adding wild cards and wild draw four cards
        for (let i = 0; i < 4; i++) {
            this.deck.push({ color: 'wild', number: 'Wild' });
            this.deck.push({ color: 'wild', number: 'Wild Draw Four' });
        }
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
        this.addCardsToNode(playerCards, this.playerNode, true);
        this.addCardsToNode(cpuCards, this.cpuNode, false);
    }

    getRandomCards(count: number): { color: string, number: number | string }[] {
        const randomCards: { color: string, number: number | string }[] = [];
        const drawCount = Math.min(count, this.deck.length);

        for (let i = 0; i < drawCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.deck.length);
            randomCards.push(this.deck[randomIndex]);
            this.deck.splice(randomIndex, 1);
        }

        return randomCards;
    }

    addCardsToNode(cards: { color: string, number: number | string }[], parentNode: cc.Node, clickable: boolean) {
        const cardSpacing = 100;
        const startX = -((cards.length - 1) * cardSpacing) / 2;

        cards.forEach((card, index) => {
            const cardNode = new cc.Node();
            const sprite = cardNode.addComponent(cc.Sprite);
            sprite.spriteFrame = this.getCardSprite(card);

            cardNode.setPosition(startX + index * cardSpacing, 0);
            cardNode.parent = parentNode;

            if (clickable) {
                cardNode.on(cc.Node.EventType.TOUCH_END, () => {
                    if (this.lastCpuCard) {
                        this.lastCpuCard.active = false; // Hide the last CPU card played
                    }

                    this.moveToCoordinates(cardNode, cc.v2(0, 250), () => {
                        cardNode.active = false; // Hide the player's card after moving
                        this.lastPlayedCardWasSkip = (card.number === 'Skip');
                        this.cpuTurn(); // Trigger CPU's turn
                    });
                });
            }
        });
    }

    moveToCoordinates(cardNode: cc.Node, targetPosition: cc.Vec2, callback?: Function) {
        const moveDuration = 0.5;

        this.currentZOrder++;
        cardNode.zIndex = this.currentZOrder;

        const moveTo = cc.moveTo(moveDuration, targetPosition).easing(cc.easeCubicActionInOut());
        cardNode.runAction(cc.sequence(moveTo, cc.callFunc(() => {
            if (callback) callback();
        })));
    }

    cpuTurn() {
        if (!this.lastPlayedCardWasSkip) {
            if (this.cpuNode.children.length === 0) {
                const cpuCards = this.getRandomCards(1);
                this.addCardsToNode(cpuCards, this.cpuNode, false);
            }

            const cpuCards = this.cpuNode.children;
            if (cpuCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * cpuCards.length);
                const cardNode = cpuCards[randomIndex];

                this.moveToCoordinates(cardNode, cc.v2(0, -250), () => {
                    this.lastCpuCard = cardNode;

                    if (this.playerNode.children.length === 0) {
                        const playerCards = this.getRandomCards(1);
                        this.addCardsToNode(playerCards, this.playerNode, true);
                    }
                });
            }
        } else {
            console.log("CPU skips its turn due to player's skip card.");
        }
    }

    getCardSprite(card: { color: string, number: number | string }) {
        if (card.color === 'wild') {
            if (card.number === 'Wild') {
                return this.wildCardSprites[0]; // Assuming you have at least one wild sprite
            } else if (card.number === 'Wild Draw Four') {
                return this.wildDrawFourCardSprites[0]; // Assuming you have at least one wild draw four sprite
            }
        } else if (typeof card.number === 'number') {
            switch (card.color) {
                case 'blue':
                    return this.blueCardSprites[card.number];
                case 'green':
                    return this.greenCardSprites[card.number];
                case 'red':
                    return this.redCardSprites[card.number];
                case 'yellow':
                    return this.yellowCardSprites[card.number];
            }
        } else {
            switch (card.number) {
                case 'Skip':
                    return this.skipCardSprites[this.getCardColorIndex(card.color)];
                case 'Reverse':
                    return this.reverseCardSprites[this.getCardColorIndex(card.color)];
                case 'Draw Two':
                    return this.drawTwoCardSprites[this.getCardColorIndex(card.color)];
            }
        }
    }

    getCardColorIndex(color: string): number {
        switch (color) {
            case 'blue':
                return 0;
            case 'green':
                return 1;
            case 'red':
                return 2;
            case 'yellow':
                return 3;
            default:
                return 0;
        }
    }
}