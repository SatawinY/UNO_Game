const { ccclass, property } = cc._decorator;

@ccclass
export default class PauseToggle extends cc.Component {

    private isPaused: boolean = false; // To track the pause state

    onLoad() {
        // Add click event listener to the button
        this.node.on('click', this.togglePause, this);
    }

    togglePause() {
        if (this.isPaused) {
            // Resume the game if it's currently paused
            cc.director.resume();
            this.isPaused = false;
            cc.log("Game Resumed");
            // Optionally change button text to "Pause"
            this.node.getComponentInChildren(cc.Label).string = "Pause";
        } else {
            // Pause the game
            cc.director.pause();
            this.isPaused = true;
            cc.log("Game Paused");
            // Optionally change button text to "Unpause"
            this.node.getComponentInChildren(cc.Label).string = "Unpause";
        }
    }
}