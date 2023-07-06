function hajo_letrehozas (hossz: number) {
    let kezdoPont: Pont = new Pont(randint(0, 5 - hossz), randint(0, 5 - hossz))    
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
        let probalkozas: number = 0;
        do {
            siker = true
            uj_hajo = hajo_letrehozas(hossz)            
            for (let l = 0; l < this.hajok.length; l++) {
                let hajo: Hajo = this.hajok[l];                   
                if (hajo.is_szomszedos(uj_hajo)) {                    
                    siker = false  
                    break;                  
                }
            }
            probalkozas++            
        } while (!siker && probalkozas < 100)
        if (!siker) {
            return null
        }
        this.hajok.push(uj_hajo)
        return uj_hajo
    }

    public hajot_eltavolit(hajo: Hajo) {
        this.hajok = this.hajok.filter(h => h !== hajo)
    }

}
function tabla_kirajzolas(tabla: Tabla) {
    for (let i = 0; i < tabla.hajok.length; i++) {
        let hajo: Hajo = tabla.hajok[i];
        hajo_kirajzolas(hajo)
    }
}
function hajo_kirajzolas (hajo: Hajo ) {    
    for (let i = 0; i < hajo.hossz(); i++) {
        let pont: Pont = hajo.pontok[i];
        pont_kirajzolas(pont)
    }
}
function pont_kirajzolas(pont: Pont) {
    led.plot(pont.x, pont.y)
}

let tabla : Tabla = new Tabla()
let formak: number[] = [3, 2, 1, 1]
let lerakott_formak:number[] = []
do {
    let forma_index:number = lerakott_formak.length
    let forma = formak[forma_index]
    console.log("forma_index:" + forma_index)
    console.log("forma:" + forma)
    let uj_hajo:Hajo = tabla.hajot_elhelyez(forma)        
    if (uj_hajo != null) {
        console.log("TOVÁBB")
        lerakott_formak.push(forma)
    } else {
        console.log("VISSZA")
        lerakott_formak = []
        tabla.hajok = []
    }
    

} while (lerakott_formak.length != formak.length) 

basic.forever(function () {
    tabla_kirajzolas(tabla)
})
