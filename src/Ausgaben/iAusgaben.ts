export interface IAusgabe {
    betrag: number,
    kategorie: string,
    unterkategorie: string,
    created : string,
    kaufzeitpunkt: string,
    day: number,
    month: number,
    year: number
}
var ausgabe: IAusgabe;


export class Ausgabe {

    getAusgabe(): IAusgabe {
        return ausgabe;
    }
}

