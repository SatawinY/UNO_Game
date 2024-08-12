const { ccclass, property } = cc._decorator;

@ccclass('StartGame')
export class RandomCardSpawner extends cc.Component {
    @property([cc.SpriteFrame])
    cardSprites: cc.SpriteFrame[] = []; // Array of card sprite frames to choose from

    @property(cc.Node)
    middleNode: cc.Node = null; // Assign your Middle_node in the editor

    @property
    spawnOffsetX: number = 460; // Offset for X coordinate

    @property
    spawnOffsetY: number = 300; // Offset for Y coordinate

    start() {
        this.spawnRandomCard();
    }

    spawnRandomCard() {
        // Check if card sprites array is empty
        if (this.cardSprites.length === 0) {
            cc.error('No card sprites assigned!');
            return;
        }
        
        // Check if middleNode is assigned
        if (!this.middleNode) {
            cc.error('Middle_node is not assigned!');
            return;
        }

        // Choose a random card sprite frame from the array
        const randomIndex = Math.floor(Math.random() * this.cardSprites.length);
        const cardSpriteFrame = this.cardSprites[randomIndex];

        // Create a new Node for the card
        const cardNode = new cc.Node('Card');
        const sprite = cardNode.addComponent(cc.Sprite);

        // Set the sprite frame of the card
        sprite.spriteFrame = cardSpriteFrame;

        // Set the card's position using the middleNode's position and offsets
        cardNode.setPosition(this.middleNode.position.x + this.spawnOffsetX, 
                             this.middleNode.position.y + this.spawnOffsetY);
        
        // Set the zIndex of the cardNode to be lower than the middleNode
        cardNode.zIndex = -1; // This ensures the card is rendered behind the middleNode

        // Add the card to the Middle_node
        this.middleNode.addChild(cardNode);
    }
}