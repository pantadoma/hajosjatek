function hajo_letrehozas (hossz: number) {
    let kezdoPont: Pont = new Pont(randint(0, 5 - hossz), randint(0, 5 - hossz))
    // console.log("kezdoPont: " + kezdoPont.toStr())
    // console.log("==========")
    let pontok: Pont[] = []
    pontok.push(kezdoPont)
    let irany: number = randint(1, 2)
    for(let m = 1; m < hossz; m++) {
        let utolso_pont: Pont = pontok[pontok.length - 1]
        let uj_pont: Pont = null
        let siker2: boolean = true        

        do {            
            let pont_x = utolso_pont.x
            let pont_y = utolso_pont.y

            switch (irany) {
                case 1:
                    pont_x++;
                    break;
                case 2:
                    pont_y++;
                    break;
            }
            uj_pont = new Pont(pont_x, pont_y)            
            let valos: boolean = uj_pont.is_valos()            
            let egyedi: boolean = !pontok.some((pont) => pont.is_ugyanaz(uj_pont))
            siker2 = valos && egyedi

            //console.log("utolso_pont: " + utolso_pont.toStr())
            //console.log("uj_pont: " + uj_pont.toStr())
            //console.log("valos: " + valos)            
            //console.log("siker: " + siker)            
            //control.waitMicros(1000)
        } while (!siker2)
        pontok.push(uj_pont)
    }
    let hajo:Hajo = new Hajo()
    for (let n = 0; n <= pontok.length - 1; n++) {
            hajo.pontot_hozzaad(pontok[n])
    }
    return hajo
}

class Pont {
    public x: number;
    public y: number;
    public constructor(x: number, y: number) { this.x = x; this.y = y; }
    /*
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
    */

    public is_ugyanaz(pont2: Pont) {
        return this.x === pont2.x && this.y === pont2.y
    }

    public is_szomszedos(pont2: Pont) {
        return Math.abs(this.x - pont2.x) <= 1 && Math.abs(this.y - pont2.y) <= 1
    }

    public is_valos() {
        return this.x >= 0 && this.x <= 4 && this.y >= 0 && this.y <= 4
    }   

    public toStr() {
        return "Point(x=" + this.x + ", y=" + this.y + ")"
    } 
}

class Hajo {
    public pontok: Pont[]
    public constructor() { 
        this.pontok = []; 
    }
    public pontot_hozzaad(pont: Pont) {
        this.pontok.push(pont)
    }
    public hossz() {
        return this.pontok.length
    }
    public is_szomszedos(hajo2: Hajo) {        
        let pontok2: Pont[] = hajo2.pontok
        
        for (let i = 0; i < this.pontok.length; i++) {
            let pont: Pont = this.pontok[i]
            for (let j = 0; j < pontok2.length; j++) {
                let pont2: Pont = pontok2[j]                                
                if (pont2.is_ugyanaz(pont) || pont2.is_szomszedos(pont)) {
                    return true
                }
            }
        }
        return false
    }    
    public toStr() {
        let str:string[] = [];
        str.push("Hajo(")
        for (let k = 0; k < this.pontok.length; k++) {
            str.push(this.pontok[k].toStr() + ",")
        }
        str.push(")")
        return str.join("");        
    }

}
class Tabla {
    public hajok: Hajo[]
    public constructor() { 
        this.hajok = []
    }
    public hajot_elhelyez(hossz: number) {
        let siker: boolean
        let uj_hajo: Hajo
        do {
            siker = true
            uj_hajo = hajo_letrehozas(hossz)            
            for (let l = 0; l < this.hajok.length; l++) {
                let hajo: Hajo = this.hajok[l];                   
                if (hajo.is_szomszedos(uj_hajo)) {                    
                    siker = false                    
                }
            }
        } while (!siker)
        this.hajok.push(uj_hajo)
    }
}
function tabla_kirajzolas(tabla: Tabla) {
    for (let o = 0; o < tabla.hajok.length; o++) {
        let hajo3: Hajo = tabla.hajok[o];
        hajo_kirajzolas(hajo3)
    }
}
function hajo_kirajzolas (hajo: Hajo ) {    
    for (let p = 0; p < hajo.hossz(); p++) {
        let pont22: Pont = hajo.pontok[p];
        pont_kirajzolas(pont22)
    }
}
function pont_kirajzolas(pont: Pont) {
    led.plot(pont.x, pont.y)
}
let tabla : Tabla = new Tabla()
let formak = [3,2,1,1]
for (let i = 0; i <= formak.length - 1; i++) {
    tabla.hajot_elhelyez(formak[i])
}

basic.forever(function () {
    tabla_kirajzolas(tabla)
})
