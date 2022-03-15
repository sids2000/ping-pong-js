const gameScreen = document.querySelector('.game-screen');
let interval;
class gameObject {
    constructor(object) {
        this.object = document.querySelector(`.${object}`);
    }
    left() {
        return this.object.offsetLeft;
    }
    right() {
        return this.left() + this.object.offsetWidth;
    }
    top() {
        return this.object.offsetTop;
    }
    bottom() {
        return this.top() + this.object.offsetHeight;
    }
    middle() {
        return (this.left() + this.right())/2;
    }
}

class User extends gameObject {
    constructor(object) {
        super(object);
    }
    move(e) {
        if(e.offsetX + this.object.offsetWidth > gameScreen.offsetWidth)
            return;
        this.object.style.left = `${e.offsetX}px`;
    }
}

class Ball extends gameObject {
    constructor(object) {
        super(object);
        this.vMove = 10;
        this.hMove = 0;
    }
    move() {
        if(this.top()<=0 || this.bottom()>=gameScreen.offsetHeight)
        {
            clearInterval(interval);   
            return;
        }
        this.object.style.top = `${this.top()+this.vMove}px`;
        this.object.style.left = `${this.left()+this.hMove}px`;
    }
}

class AI extends gameObject {
    constructor(object) {
        super(object);
        this.speed = 5;
    }
    moveLeft() {
        this.object.style.left = `${this.left()-this.speed}px`;
    }
    moveRight() {
        this.object.style.left = `${this.left()+this.speed}px`;
    }
}

let user = new User('user');
let ai = new AI('ai');
let ball = new Ball('ball');

const collision = () => {
    let aiCondition = ball.top()<=ai.bottom() && ball.right() >= ai.left() && ball.left() <= ai.right();
    let userCondition = ball.bottom()>=user.top() && ball.right() >= user.left() && ball.left() <= user.right();
    let wallCondition = ball.left() <= 0 || ball.right() >= gameScreen.offsetWidth;
    if(aiCondition || userCondition)
        ball.vMove *= -1;

    if(aiCondition) {
        ball.hMove = (ball.middle()-ai.middle())/5;
    }
    else if(userCondition) {
        ball.hMove = (ball.middle()-user.middle())/5;
    }
    if(wallCondition)
        ball.hMove *= -1;
}

const aiReturn = () => {
    if(ball.right()<ai.left())
        ai.moveLeft();
    else if(ball.left()>ai.right())
        ai.moveRight();
}

const renderGame = () => {
    if(ball.vMove<0)
        aiReturn();
    collision();
    ball.move();
}

gameScreen.addEventListener('mousemove',user.move.bind(user));
interval = setInterval(renderGame,16);