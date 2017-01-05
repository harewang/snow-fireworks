var snowPs = new ParticleSystem(),
    frwPs = new ParticleSystem();
var dt = 0.05;
var WIDTH = 800, HEIGHT = 600;

var Color = function(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
};


function stepSnow(ps, ctx, particle) {
    if (Math.random() > 0.9) {
        ps.emit(particle);
    }
    
    ps.simulate(dt);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ps.render(ctx);
}

function stepFrw(ps, ctx, particle) {
    if (Math.random() > 0.2) {
        ps.emit(particle);
    }
    
    ps.simulate(dt);

    ctx.fillStyle = "rgba(30,30,37,0.2)";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle = '#4D4B6C'
    ctx.fillRect(375,545,50,55);
    ps.render(ctx);
}

function getSnowParticle() {
    var size = Math.random()>0.8 ? getRandom(8,11) : getRandom(3,8);
    function getDirection() {
        var t = getRandom(Math.PI*0.25, Math.PI*0.75);
        return new Vector2(Math.cos(t), Math.sin(t)).multiply(10).add(
                new Vector2(0, 3.1*size));
    }

    return new SnowParticle({
        position: new Vector2(getRandom(50, WIDTH-50), 0),
        size: size*0.7,
        color: '#fff',
        life: 4*size,
        velocity: getDirection()
    });
}

function getFrwParticle() {
    function getDirection() {
        var t = getRandom(Math.PI*1.65, Math.PI*1.35);
        return new Vector2(Math.cos(t), Math.sin(t)).multiply(130);
    }

    function getColor() {
        return new Color(255, Math.floor(getRandom(0,232)),0);
    }

    return new FrwParticle({
        position: new Vector2(getRandom(380,420), 550),
        size: 4,
        color: getColor(),
        life: 10,
        velocity: getDirection()
    });
}

window.addEventListener('load', function() {
    var snowCanvas = document.getElementById('snow'),
        sctx = snowCanvas.getContext('2d');
    var frwCanvas = document.getElementById('fireworks'),
        fctx = frwCanvas.getContext('2d');
    setInterval(function() {
        stepSnow(snowPs, sctx, getSnowParticle());
        stepFrw(frwPs, fctx, getFrwParticle());
    }, 20);
}, false);