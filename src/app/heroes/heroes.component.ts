import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../hero';
// import { HEROES } from '../mock.heroes';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  // 實例化 Hero interface
  // hero: Hero = {
  //   id: 1,
  //   name: 'Windstorm',
  // };

  // heroes = HEROES;
  // 變數名稱: 變數型態 = 值
  heroes: Hero[] = [];

  // selectedHero?: Hero;

  // 注入 HeroService、MessageService
  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  // onSelect(hero: Hero) {
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }

  getHeroes(): void {
    // this.heroes = this.heroService.getHeroes();
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  add(name: string): void {
    name = name.trim();
    if (!name) return;
    this.heroService
      // { name } as Hero => 將 name 封裝成 Hero
      .addHero({ name } as Hero)
      // 新增成功後將 hero push 到 heroes list
      .subscribe((hero) => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter((h) => h !== hero);
    // 雖然 subscribe() 沒有做事，但是一定要呼叫，否則不會發 request 到 server site
    // 因為 Observable 在執行 subscribe() 前什麼都不會做
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
