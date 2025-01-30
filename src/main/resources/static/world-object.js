const worlds = [[]];

class blockObject{
    constructor(object, type) {
        this.type = type;
        this.object = object;
    }
}

/*
typeリスト
air:空気オブジェクト
floor:床ブロック
 */

export {worlds, blockObject};