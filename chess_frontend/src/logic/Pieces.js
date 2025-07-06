
class Piece {

    constructor(color, position, type, sprite, point) {
        this.color = color;
        this.position = position;
        this.type = type;
        this.sprite = sprite;
        this.point = point;
    }

    get getCurrPosition() {
        return this.position
    }  
}

export default Piece

