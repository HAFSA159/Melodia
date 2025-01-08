import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./features/home/home.component";

const routes: Routes = [
  {path: 'library', loadChildren: () => import('./features/library/library.module').then(m => m.LibraryModule)},
  {path: 'track', loadChildren: () => import('./features/track/track.module').then(m => m.TrackModule)},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
