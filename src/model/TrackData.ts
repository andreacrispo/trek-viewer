import { FeatureCollection } from "geojson";

export class TrackData {
    name?: string;
    time: string;

    points: Point[];
    cumulativePoints: CumulativePoint[];


    constructor(points: Point[]) {
        this.points = points;
    }

    private _cumulativeDistance: number[];
    private _totalDistane: number;



    /** Total distance in metres */
    public getTotalDistance() {

        if (!this._totalDistane) {
            const { total, cumulative } = this.calculateDistance();
            this._totalDistane = total;
            this._cumulativeDistance = cumulative;
        }
        return this._totalDistane;
    }

    public getCumulativeDistance() {
        if (!this._cumulativeDistance) {
            const { total, cumulative } = this.calculateDistance();
            this._totalDistane = total;
            this._cumulativeDistance = cumulative;
        }
        return this._cumulativeDistance;
    }



    public calculateDistance() {
        let total = 0;
        let cumulative = [];
        for (let i = 0; i < this.points.length - 1; i++) {
            const distance = this.calculateDistanceBetweenPoint(this.points[i], this.points[i + 1]);
            total += distance
            cumulative[i] = total;
        }
        cumulative[this.points.length - 1] = total;
        return { total, cumulative };
    }



    calculateElevationDiff(p1: Point, p2: Point) {
        return p2.elevation - p1.elevation;
    }

    private calculateDistanceBetweenPoint(p1: Point, p2: Point) {
        const φ1 = p1.lat * Math.PI / 180;
        const φ2 = p2.lat * Math.PI / 180;
        const Δλ = (p2.lon - p1.lon) * Math.PI / 180;
        const R = 6371e3;// metres
        const distance = Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R;
        return distance;
    }


    public toGeoJson(): FeatureCollection /*Feature*/ {
        const coordinates = this.points.map(p => [p.lon, p.lat, p.elevation]);

        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: coordinates
                    }
                }
            ]
        }
    }

}

export class Point {
    lat: number;
    lon: number;
    elevation: number;
    time: string;
}


export class CumulativePoint {
    elevavationDiff: number = 0;
    distance: number = 0;

    cumulativeElevationDiff: number = 0;

    cumulativeDistance: number = 0;

    slope: number;
}
