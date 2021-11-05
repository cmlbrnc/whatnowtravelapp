import { CarditemsComponent } from "./carditems/carditems.component";
import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { NbWindowService } from "@nebular/theme";
import { first, map } from "rxjs/operators";

interface Country {
  id: number;
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    id: 1,
    name: "Russia",
    flag: "f/f3/Flag_of_Russia.svg",
    area: 17075200,
    population: 146989754,
  },
  {
    id: 2,
    name: "Canada",
    flag: "c/cf/Flag_of_Canada.svg",
    area: 9976140,
    population: 36624199,
  },
  {
    id: 3,
    name: "United States",
    flag: "a/a4/Flag_of_the_United_States.svg",
    area: 9629091,
    population: 324459463,
  },
  {
    id: 4,
    name: "China",
    flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
    area: 9596960,
    population: 1409517397,
  },
];

export type SortColumn = keyof Country | "";
export type SortDirection = "asc" | "desc" | "";
const rotate: { [key: string]: SortDirection } = {
  asc: "desc",
  desc: "",
  "": "asc",
};

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: "th[sortable]",
  host: {
    "[class.asc]": 'direction === "asc"',
    "[class.desc]": 'direction === "desc"',
    "(click)": "rotate()",
  },
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = "";
  @Input() direction: SortDirection = "";
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: "app-carts",
  styleUrls: ["./carts.component.scss"],
  templateUrl: "./carts.component.html",
})
export class CartsComponent implements OnInit {
  countries = COUNTRIES;
  carts;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private firestore: AngularFirestore,
    private windowService: NbWindowService
  ) {}

  ngOnInit() {
    this.firestore
      .collection("host-card-infos")

      .snapshotChanges()
      .pipe(
        map((snaps) =>
          snaps.map((snap: any) => {
        
            return {
              id: snap.payload.doc.id,
              ...snap.payload.doc.data(),
            };
          })
        ),
        first()
      )
      .subscribe((r) => (this.carts = r));
  }

  openWindow(data) {
    this.windowService.open(CarditemsComponent, {
      title: `Window`,
      buttons: {
        minimize: false,
        maximize: false,
        fullScreen: true,
      },
      context: data,
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    // sorting countries
    if (direction === "" || column === "") {
      this.countries = COUNTRIES;
    } else {
      this.countries = [...COUNTRIES].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === "asc" ? res : -res;
      });
    }
  }
  ngOnDestroy(): void {}
}
