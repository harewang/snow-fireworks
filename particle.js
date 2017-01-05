function inherit(Super, Sub) {
    var F = function() {};
    F.prototype = Super.prototype;
    Sub.prototype = new F();
}
function getRandom(a, b) {
    var t = Math.random();
    return a*t + b*(1-t);
}

//坐标系
var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
};
Vector2.prototype = {
    add: function(v) {return new Vector2(this.x+v.x, this.y+v.y)},
    multiply: function(c) {return new Vector2(this.x*c, this.y*c)}
};

//粒子
var Particle = function(options) {
    this.position = options.position;
    this.size = options.size;
    this.color = options.color;
    this.life = options.life;
    this.age = 0;
    this.velocity = options.velocity;
    this.acceleration = new Vector2(0, 0);
};

Particle.prototype = {
    applyForce: function () {},
    kinematics: function(dt) {
        dt = dt || 0.05;
        this.velocity = this.velocity.add(this.acceleration.multiply(dt));
        this.position = this.position.add(this.velocity.multiply(dt));
    },
    move: function(dt) {
        this.applyForce();
        this.kinematics(dt);
    }
};

//雪花粒子
var SnowParticle = function(options) {
    Particle.call(this, options);
};

inherit(Particle, SnowParticle);
SnowParticle.prototype.paint = function(ctx) {
    var grd = ctx.createRadialGradient(this.position.x, this.position.y, 
            this.size>6 ? this.size-6 : 1,
            this.position.x, this.position.y, this.size);
    grd.addColorStop(0, 'rgba(250, 250, 250, 1)');
    grd.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    ctx.fillStyle = grd;

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
};
SnowParticle.prototype.applyForce = function() {
    this.acceleration = new Vector2(0, 0.0005*this.size);
};

//烟花粒子
var FrwParticle = function(options) {
    Particle.call(this, options);
};

inherit(Particle, FrwParticle);
FrwParticle.prototype.paint = function(ctx) {

    ctx.fillStyle = 'rgba('+this.color.r+','+this.color.g+
            ','+this.color.b+','+(1-0.8*this.age/this.life)+')';

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
};
FrwParticle.prototype.applyForce = function() {
    this.acceleration = new Vector2(0, 30);
}


var ParticleSystem = function() {
    var particles = [];

    this.emit = function(particle) {
        particles.push(particle);
    };

    this.simulate = function(dt) {
        move(dt);
        aging(dt);
    };

    this.render = function(ctx) {
        for (var i = 0; i < particles.length; i++) {
            particles[i].paint(ctx);
        }
    };

    function move(dt) {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.move(dt);
        }
    }

    function aging(dt) {
        dt = dt || 0.05;
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.age += dt;

            if (p.age > p.life) {
                particles[i] = particles[particles.length-1];
                particles.pop();
                i--;
            }
        }
    }
};

