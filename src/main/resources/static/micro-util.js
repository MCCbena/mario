//細かなプログラムをひとまとめにしたファイル

/*入力されているキーを取得*/
const inputKeys = [];
function isDown(key){//キーを押してるかの判定
    return inputKeys.includes(key);
}

function downKey(e){
    if(!inputKeys.includes(e.key)) inputKeys.push(e.key);
}
function upKey(e){
    for(let i = 0; i < inputKeys.length; i++){
        if(e.key === inputKeys[i])inputKeys.splice(i, 1);
    }
}

export {isDown, downKey, upKey};