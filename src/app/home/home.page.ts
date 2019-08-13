import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cities: any[] = ['BANGALORE', 'MUMBAI', 'CHENNAI'];
  banks: any;
  cityBanks: any;
  filterBanks: any;
  searchTerm: string = "";

  constructor(private httpService: HttpClient,public loadingController: LoadingController) {
    
  }

  onChange = async (e) => {
    this.searchTerm = '';
    var loading = await this.loadingController.create({
      message: 'Fetching '+e.target.value+'\'s Data...'
    });
    loading.present();
    this.httpService.get('https://vast-shore-74260.herokuapp.com/banks?city='+e.target.value).subscribe((resp) => {
      loading.dismiss();
      this.filterBanks = [];
      this.banks = [];
      this.cityBanks = resp;
      this.banks = this.cityBanks.slice(this.banks.length, (this.banks.length+20));
    });
  }

  filterItems = () => {
    this.banks = [];
    if(this.searchTerm){
      this.filterBanks = this.cityBanks.filter(item => {
        var isTrue = false;
        for(let key in item){
          if(item[key].toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1){
            isTrue = true;
            break;
          }
        }
        return isTrue;
      });

      this.banks = this.filterBanks.slice(this.banks.length, (this.banks.length+20));
    }else{
      this.filterBanks = [];
      this.banks = this.cityBanks.slice(this.banks.length, (this.banks.length+20));
    }
  }

  loadMore = (infiniteScroll) =>{
    setTimeout(()=>{
      if(this.searchTerm){
        this.banks = this.banks.concat(this.filterBanks.slice(this.banks.length, (this.banks.length+20)));
      }else{
        this.banks = this.banks.concat(this.cityBanks.slice(this.banks.length, (this.banks.length+20)));
      }
      infiniteScroll.target.complete();
    }, 500);
  }
}
