import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock.heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';

// @Injectable 用於將 class 放進 Angular 的 injection system
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  // :base/:collectionName，heroes 是 InMemoryDataService.createDb 回傳的參數
  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // inject HttpClient, MessageService
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Observable<Hero[]> {
    // get heroes from local
    // const heroes = of(HEROES);
    // this.messageService.add('HeroService: fetched heroes');
    // return heroes;

    // get heroes from in-memory server
    // HttpClient 所有的 methods 都是回傳 Observable
    return (
      this.http
        .get<Hero[]>(this.heroesUrl)
        // 使用 pipe 處理
        .pipe(
          // 紀錄 log
          tap((_) => this.log('fetched heroes')),
          // 處理 remote server 錯誤
          catchError(this.handleError<Hero[]>('getHeroes', []))
        )
    );
  }

  getHero(id: number): Observable<Hero> {
    // 此處的驚嘆號(!)表示此變數(hero)可為 null 或 undefined
    // let hero = HEROES.find((h) => h.id === id)!;
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(hero);

    // :baseUrl/:id
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // 發送錯誤訊息到 log server（如果有），此處用 console.error() 代替
      console.error(error);
      // 轉換錯誤訊息讓使用者知道，此處用 log 代替
      this.log(`${operation} failed: ${error.message}`);
      // 回傳空陣列，讓系統保持正常運作
      return of(result as T);
    };
  }

  updateHero(hero: Hero): Observable<any> {
    // 練習範例中，會自動依 id(PK) 更新資料
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    // 練習範例中，id 由系統自動產生
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
