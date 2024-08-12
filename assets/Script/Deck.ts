const {ccclass, property} = cc._decorator;

@ccclass
export class Deck extends cc.Component {
    @property([cc.SpriteFrame])
    private cardImages: cc.SpriteFrame[] = []; 

    @property(cc.Sprite)
    private displayCardSprite: cc.Sprite = null; 

    onLoad() {
        
        this.node.on(cc.Node.EventType.TOUCH_END, this.drawCard, this);
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
    }
}
