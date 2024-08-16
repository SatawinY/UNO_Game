const { ccclass, property } = cc._decorator;

@ccclass
export class Deck extends cc.Component {
    @property([cc.SpriteFrame])
    private cardImages: cc.SpriteFrame[] = []; 

    @property(cc.Sprite)
    private displayCardSprite: cc.Sprite = null; 

    @property(cc.Node)
    private playerNode: cc.Node = null; // Reference to the player node

    onLoad() {        
        // Assuming card_large_black is a child node of the deck
        const cardLargeBlack = this.node.getChildByName('card_large_black');
        if (cardLargeBlack) {
            cardLargeBlack.on(cc.Node.EventType.TOUCH_END, this.drawCard, this);
        } else {
            cc.error('Node "card_large_black" not found.');
        }
    }

    drawCard() { 
        if (this.cardImages.length === 0) {
            cc.log("No card images available!");
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.cardImages.length);
        const selectedCard = this.cardImages[randomIndex];

        if (this.displayCardSprite) {
            this.displayCardSprite.spriteFrame = selectedCard;
            cc.log("Drawn card:", selectedCard.name); 
        }

        // Assuming the Player script has a method to handle adding a card
        const playerScript = this.playerNode.getComponent('Player');
        if (playerScript && typeof playerScript.addCard === 'function') {
            playerScript.addCard(selectedCard); // Add the drawn card to the player's hand
            cc.log('Card added to player:', selectedCard.name);
        } else {
            cc.error('Player script or addCard method not found.');
        }
    }
}