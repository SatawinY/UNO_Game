const { ccclass, property } = cc._decorator;

@ccclass
export default class About extends cc.Component {

    @property(cc.Button)
    playButton: cc.Button = null; // Assign the Play button in the inspector

    onLoad() {
        // Add a click event listener to the Play button
        this.playButton.node.on('click', this.onPlayButtonClicked, this);
    }

    onPlayButtonClicked() {
        cc.director.loadScene('Info'); // Replace 'GameScene' with the name of your target scene
    }
}