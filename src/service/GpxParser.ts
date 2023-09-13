import { Point, TrackData } from "../model/TrackData";

export class GpxParser {

    private xmlParser: DOMParser;

    constructor() {
        this.xmlParser = new DOMParser();
    }

    public parse(fileString: string) {
        const xmlGpx = this.xmlParser.parseFromString(fileString, "text/xml");
        const metadata = this.getMetadata(xmlGpx);

        let trk = xmlGpx.querySelector('trk');
        let trkpts = Array.from(trk.querySelectorAll('trkpt'));
        let points: Point[] = trkpts.map(trkpt => this.getPoint(trkpt));

        const trackData = new TrackData(points);
        trackData.name = this.getElementValue(metadata, 'name');
        return trackData;
    }

    private getPoint(trkpt: Element) {
        let lat = parseFloat(trkpt.getAttribute("lat"));
        let lon = parseFloat(trkpt.getAttribute("lon"));
        let elevation = parseFloat(this.getElementValue(trkpt, 'ele'));
        let time = this.getElementValue(trkpt, 'time');
        return {
            lat,
            lon,
            elevation,
            time
        } as Point;
    }

    private getMetadata(xmlGpx: Document) {
        let metadataNode = xmlGpx.querySelector('metadata');
        return metadataNode;
    }

    private getElementValue(parent: Element, element: string) {
        let elem = parent.querySelector(element);
        if (elem != null) {
            return elem.innerHTML != undefined ? elem.innerHTML : (elem.childNodes[0] as any).data;
        }
        return elem;
    };



}