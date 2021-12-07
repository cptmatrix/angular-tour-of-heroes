import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.less']
})
export class HeroDetailComponent implements OnInit {
  hero?: Hero
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private heroService: HeroService
  ) { }

  ngOnInit(): void {
    this.getHero()
  }
  getHero(): void
  {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10)
    this.heroService.getHero(id).subscribe( hero =>{
      this.hero = hero
    }
    )
  }
  goBack():void
  {
    this.location.back()
  }
  save():void
  {
    if(this.hero){
      this.heroService.updateHero(this.hero).subscribe(()=>{
        this.goBack()
      })
    }
  }
}
