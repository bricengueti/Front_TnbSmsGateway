import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface RefOperator {
  code: string;
  displayName: string;
}

export interface RefCountry {
  code: string;
  name: string;
  callingCode: string;
  operators: RefOperator[];
}

/**
 * Référentiel pays/opérateurs — alimente les formulaires (envoi de test,
 * pairing) sans coder de valeurs en dur côté frontend.
 * Vérifié contre le tag "Référentiel" du Swagger — intégration réelle.
 *
 *   GET /v1/reference/countries                  → Country[]
 *   GET /v1/reference/countries/{code}/operators  → Operator[]
 *   GET /v1/reference/countries/{code}/validate    → { [code]: boolean }
 *   GET /v1/reference/operators/{code}/validate    → { [code]: boolean }
 */
@Injectable({ providedIn: 'root' })
export class ReferenceService {

  private readonly base = `${environment.apiUrl}/v1/reference`;

  // Référentiel quasi-statique : un seul appel réseau partagé entre tous
  // les abonnés, quel que soit le nombre de composants qui le demandent.
  private countries$;

  constructor(private http: HttpClient) {
    this.countries$ = this.http.get<any[]>(`${this.base}/countries`).pipe(
      map(raw => raw.map(c => ({
        code: c.code, name: c.name, callingCode: c.callingCode,
        operators: (c.operators ?? []).map((o: any) => ({ code: o.code, displayName: o.displayName }))
      } as RefCountry))),
      shareReplay(1)
    );
  }

  countries(): Observable<RefCountry[]> {
    return this.countries$;
  }

  operatorsByCountry(countryCode: string): Observable<RefOperator[]> {
    return this.http.get<any[]>(`${this.base}/countries/${countryCode}/operators`).pipe(
      map(raw => raw.map(o => ({ code: o.code, displayName: o.displayName })))
    );
  }
}
