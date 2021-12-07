import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  
  constructor(
    private messageService: MessageService,
    private http:HttpClient
  ) { }
  getHeroes(): Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_=>this.log('fethed heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
    )
  }
  getHeroNo404<Data>(id:number): Observable<Hero>
  {
    const url = `${this.heroesUrl}/?id=${id}`
    return this.http.get<Hero[]>(url).pipe(
      map(heroes => heroes[0]),
      tap(h=>{
            const outcome = h ? 'fetched' : 'did not find'
            this.log(`${outcome} hero id=${id}`)
          }
        ),
      catchError(this.handleError<Hero>(`getHero id={id}`))
    )

  }
  getHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`
    return this.http.get<Hero>(url).pipe(
      tap(_=>this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }
  updateHero(hero:Hero):Observable<any>{
    return this.http.put(this.heroesUrl,hero,this.httpOptions).pipe
    (
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>(`updated hero`))
    )
  }
  addHero(hero:Hero):Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl,hero,this.httpOptions).pipe
    (
      tap((newHero:Hero) => this.log(`add hero w/ id = ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }
  deleteHero(id:number):Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`
    return this.http.delete<Hero>(url,this.httpOptions).pipe
    (
      tap(_=>this.log(`delete hero id=${id}`)),
      catchError(this.handleError<Hero>('delteHero'))
    )
  }
  searchHeroes(term:string):Observable<Hero[]>{
    console.log(term)
    if(!term.trim()){
      return of([])
    }
    const url = `${this.heroesUrl}/?name=${term}`
    return this.http.get<Hero[]>(url).pipe
    (
      tap(x => x.length? this.log(`found heroes matching "${term}"`) :
        this.log(`no hero matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes',[]))
    )
  }
  private log(message: string){
    this.messageService.add(`HeroService: ${message}`)
  }
  private heroesUrl =  '/api/heroes'
  httpOptions = {
    headers: new HttpHeaders({'Content-type':'application/json'})
  }
  private handleError<T>(operation='operation', value?:T){
    return (error:any) => {
        console.log(error)
        this.log(`${operation}: failed ${error.message}`)
        return of(value as T)
    }
  }
}
