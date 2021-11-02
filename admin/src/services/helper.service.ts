import { ConstantsService } from '@app/shared/services/constants.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Injectable } from '@angular/core';
import differenceInDays from 'date-fns/differenceInDays';
import addDays from 'date-fns/addDays';
import { subDays, format, parse, areIntervalsOverlapping, addSeconds } from 'date-fns';
import { take } from 'rxjs/operators';


import { enGB,tr,de,enUS } from 'date-fns/locale'
const locales = {enGB, tr, de,enUS};

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private firestore:FirestoreService,private myConst:ConstantsService) { }



groupBy(array, property) {
    var hash = {};
    for (var i = 0; i < array.length; i++) {
        if (!hash[array[i][property]]) hash[array[i][property]] = [];
        hash[array[i][property]].push(array[i]);
    }
    return hash;
}


dateRange(startDate, endDate) {
 const start= startDate.setHours(0,0,0,0);
 const end=endDate.setHours(0,0,0,0);
    const days = differenceInDays(end, start);
    return [...Array(days+1).keys()].map((i) => addDays(startDate, i));
  
}

 numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
 // console.log(event)
 
  if (charCode > 31 && (charCode < 48 || charCode > 57) ) {
    if(charCode==46  ) {
      return true;
    }
    return false;
  }

  return true;

}

 calculateDayPrice(start,end,priceList) {

  let toggleDateSelected=true
  const diff= differenceInDays(end,start);

  let totalNights=diff;

  const dates=this.dateRange(start,subDays(end,1));

  
  const datePrices=dates.map(d=>{
  
    const day = priceList.find(r=>{
  

     return  r.date === format(d,'M/d/yyyy')
    })
   
    return day.price;
   
  })
 
  let totalPrice=datePrices.reduce((a,b)=>parseInt(a)+parseInt(b),0);

   let averagePrice= totalPrice/diff;

   return {toggleDateSelected,totalNights,totalPrice,averagePrice}


}

 calculatePrice(event,priceList,property,locale?) {
 // console.log(priceList);

  if(locale=='tr' || locale==null ) {
    console.log('calculating TRY');
    let cleaningFee=0;
    let totalNights;
    let totalPrice=0;
    let rentPrice;
    let averagePrice;
    let revenue;
    let restAmount;
    if(!event.from && !event.start ) return; 
    if(!event.to && !event.end) return; 
   
    
   const dates=this.dateRange(event.from || event.start,subDays(event.to || addDays(event.end,1) ,1)) ; 
  
   
   const dayMin = priceList.find(r=>r.date ==  format(event.from || event.start ,'M/dd/yyyy'));
   if(dayMin) {
     if(dayMin.mindayCleaning >dates.length) {
     //  console.log(property);
      cleaningFee = property.info.cleaningFee.TRY;
     }else {  cleaningFee=0}
     
    
   } else {
     cleaningFee=0;
   }
  
   totalNights=dates.length;
  
   dates.map(date=> {
     //console.log(format(date,'M/dd/yyyy'));
    // console.log(priceList);
    const dayMin = priceList.find(r=>r.date == format(date,'M/dd/yyyy'));
    // console.log(dayMin,date,property);
    if(dayMin)
    totalPrice += parseInt(dayMin.priceTry);
  
   })
   rentPrice=totalPrice;
  
   averagePrice = totalPrice/totalNights;
  
   if(cleaningFee) {
    totalPrice = totalPrice+cleaningFee;
   }else {
    totalPrice = totalPrice;
   }
  
   revenue = rentPrice*15/100
   restAmount = rentPrice*85/100
  
  // console.log(cleaningFee);
  return {cleaningFee,totalNights,totalPrice,rentPrice,averagePrice,revenue,restAmount,exchangeUnit:'try'};

  }else {
    console.log('calculating GBP');
    const result= this.calculatePriceGBP(event,priceList,property)
     return result;
  }
 
}
calculatePriceGBP(event,priceList,property) {
 // console.log(priceList);
  let cleaningFee;
  let totalNights;
  let totalPrice=0;
  let rentPrice;
  let averagePrice;
  let revenue;
  let restAmount;
  if(!event.from && !event.start ) return; 
  if(!event.to && !event.end) return; 
 
  
  
 const dates=this.dateRange(event.from || event.start,subDays(event.to || addDays(event.end,1) ,1)) ; 

 
 const dayMin = priceList.find(r=>r.date ==  format(event.from || event.start ,'M/dd/yyyy'));
 if(dayMin) {
   if(dayMin.mindayCleaning >dates.length) {
   //  console.log(property);
    cleaningFee = property.info.cleaningFee.GBP;
   // console.log(property)
   }else {  cleaningFee=null}
   
  
 } else {
   cleaningFee=null;
 }

 totalNights=dates.length;

 dates.map(date=> {
   //console.log(format(date,'M/dd/yyyy'));
  // console.log(priceList);
  const dayMin = priceList.find(r=>r.date == format(date,'M/dd/yyyy'));
  // console.log(dayMin,date,property);
  console.log(parseFloat(dayMin.price));
  
  if(dayMin) totalPrice += parseFloat(dayMin.price);

 })

 rentPrice=totalPrice;

 averagePrice = totalPrice/totalNights;

 if(cleaningFee) {
  totalPrice = totalPrice+parseFloat(cleaningFee);
 }else {
  totalPrice = totalPrice;
 }

 revenue = rentPrice*15/100
 restAmount = rentPrice*85/100

// console.log(cleaningFee);
 //console.log(totalPrice);
return {cleaningFee,totalNights,totalPrice,rentPrice,averagePrice,revenue,restAmount,exchangeUnit:'gbp'};
}

datesAvailable(start:Date, end:Date, events) {

  let b = true;
 
  let dates=[];
  for (let d of events) {




   dates.push(...this.dateRange(addDays(d.from,1),subDays(d.to,1)));


  }
 //console.log(dates);
  const sEDates = this.dateRange(start,end);
  // console.log(sEDates);
   
   for(let date of dates) {

    for( let d of sEDates) {
      // console.log(res);
   if (d.toLocaleDateString() === date.toLocaleDateString() ) {
  //  console.log('Disable Dates false ,break');
     b = false;
     break;

   }

  }
   }

    

  

  
   
  
 
 
   
   return b;



}

async getNotAvailableDates(disableEvents,propId) {
  const notAvailableDates=[];
   let disP;
  if(disableEvents)
  disP=disableEvents.map(async (r)=>{
   // console.log()
  // console.log(r)
   const start= addDays(r.to,1); 
 
   const end= r.from;
 
   const day:any =  await this.firestore.getPriceListByDate(propId,format(start,'yyyyMMdd')).pipe(take(1)).toPromise().then(r=>r);
   


   const dayEnd:any =await this.firestore.getPriceListByDate(propId,format(end,'yyyyMMdd')).pipe(take(1)).toPromise().then(r=>r);

   if(day){
     
   const notAvailableDayStart= addDays(r.to,2); 
   const notAvailableDayEnd= addDays(r.to, parseInt(day.minday)  ); 
  // console.log(notAvailableDayStart)

   const dates=this.dateRange(notAvailableDayStart,notAvailableDayEnd);

   notAvailableDates.push(...dates);
  
  

   }
   if(dayEnd){
  
   const notAvailableDayEnd= subDays(end,2);
   const notAvailableDayStart= subDays(end, parseInt(dayEnd.minday));

   //console.log('check days',notAvailableDayStart.toLocaleDateString(),notAvailableDayEnd.toLocaleDateString());
   const dates= this.dateRange(notAvailableDayStart,notAvailableDayEnd)
   notAvailableDates.push(...dates);
  
  }

 })
  await Promise.all(disP);
  let result=[];
  if(notAvailableDates.length) result=this.removeDuplicates(notAvailableDates);
 //  console.log('RESR',result);
  return result;

}
async isDatesAvailable(disableEvents,propId,start:Date,end:Date) {
 const notAvaiableDates= await this.getNotAvailableDates(disableEvents,propId).then(r=>r);

 let b = true;
  
  for (let date of notAvaiableDates) {

  
   
   // console.log(res);
    if (start.toLocaleDateString() === date.toLocaleDateString() || end.toLocaleDateString() === date.toLocaleDateString()) {
     console.log('Not Available Datesfalse ,break',propId);
      b = false;
      break;

    }


  }
  return b;


}

removeDuplicates(array) {
  let a = []
  array=array.map(x=>format(x,'ddMMyyyy'));
  array.map(x => {
    if(!a.includes(x)) {
      
      a.push(x)
    }
    })
 return a.map(r=>parse(r,'ddMMyyyy',new Date()))
}


onDayCreate(event,minDate,notAllowClickOnFlatpick,disableEvents,notAvailableDates,priceList) {

  const date = parse(event.dayElement.getAttribute('aria-label'), 'MMMM dd, yyyy', new Date(),{locale: locales[this.myConst.locale]});
if(!event.instance.config.minDate)  
event.instance.config.minDate=minDate

if(notAllowClickOnFlatpick) {
  
  event.dayElement.style.cursor = "default";
  event.dayElement.classList.add('opacityDay');
  event.dayElement.addEventListener('pointermove',this.onClick.bind(this));
  event.dayElement.addEventListener('mousemove',this.onClick.bind(this));
  event.dayElement.addEventListener('pointerover',this.onClick.bind(this));
  event.dayElement.addEventListener('pointerenter',this.onClick.bind(this));
  event.dayElement.addEventListener('mouseenter',this.onClick.bind(this));
  event.dayElement.addEventListener('pointerout',this.onClick.bind(this));
  event.dayElement.addEventListener('pointerleave',this.onClick.bind(this));
  event.dayElement.addEventListener('mouseout',this.onClick.bind(this));
  event.dayElement.addEventListener('mouseleave',this.onClick.bind(this));
  event.dayElement.addEventListener('mouseover',this.onMouseOverDayDis.bind(this)); 
  event.dayElement.addEventListener('mousedown',this.onClick.bind(this));
}

//add firstday style
if (disableEvents) {
disableEvents.map(r => {

  const start= subDays(r.from,1);
  

  if (start.toLocaleDateString()==date.toLocaleDateString()) {
  // console.log(start.toLocaleDateString(),date.toLocaleDateString());
    
  
       event.dayElement.classList.add('startDate');
     

   
  


  }
});
}

// Not available dates
// console.log(this.notAvailableDays)
if(notAvailableDates) {

notAvailableDates.forEach(d=>{
 // console.log(d.toLocaleDateString(),date.toLocaleDateString())
 
 if(date.toLocaleDateString()==d.toLocaleDateString()) {

  const day=event.dayElement;

  day.style.cursor = "default";
  day.classList.add('opacityDay');
  day.addEventListener('pointermove',this.onClick.bind(this));
  day.addEventListener('mousemove',this.onClick.bind(this));
  day.addEventListener('pointerover',this.onClick.bind(this));
  day.addEventListener('pointerenter',this.onClick.bind(this));
  day.addEventListener('mouseenter',this.onClick.bind(this));
  day.addEventListener('pointerout',this.onClick.bind(this));
  day.addEventListener('pointerleave',this.onClick.bind(this));
  day.addEventListener('mouseout',this.onClick.bind(this));
  day.addEventListener('mouseleave',this.onClick.bind(this));
  day.addEventListener('mouseover',this.onMouseOverDayDis.bind(this)); 
  day.addEventListener('mousedown',this.onClick.bind(this));

 }
})
}

/// Min Days add selected dates 
if(event.selectedDates[0]) {
//console.log(event)
//console.log(event.selectedDates[0]);
const day =event.selectedDates[0];
let dayMin;
if(priceList)
 dayMin = priceList.find(r=>r.date == format(day,'M/dd/yyyy'));
//console.log(dayMin)

if(day && dayMin){

    


const notAvailableDayStart= addDays(day,1); 

const notAvailableDayEnd= addDays(day, parseInt(dayMin.minday)-1 );

const notAvailableDayEndBefore= day
const notAvailableDayStartBefore= subDays(day, parseInt(dayMin.minday)-1); 


//console.log('check days',notAvailableDayStart.toLocaleDateString(),notAvailableDayEnd.toLocaleDateString());
const datesAfter= this.dateRange(notAvailableDayStart,notAvailableDayEnd) ; 
const datesBefore= this.dateRange(notAvailableDayStartBefore,notAvailableDayEndBefore) ; 

// console.log(dates)

datesAfter.forEach(d=>{
// console.log(d.toLocaleDateString(),date.toLocaleDateString())

if(date.toLocaleDateString()==d.toLocaleDateString()) {

 const day=event.dayElement;

 day.style.cursor = "default";
 day.classList.add('opacityDay');
 day.addEventListener('pointermove',this.onClick.bind(this));
 day.addEventListener('mousemove',this.onClick.bind(this));
 day.addEventListener('pointerover',this.onClick.bind(this));
 day.addEventListener('pointerenter',this.onClick.bind(this));
 day.addEventListener('mouseenter',this.onClick.bind(this));
 day.addEventListener('pointerout',this.onClick.bind(this));
 day.addEventListener('pointerleave',this.onClick.bind(this));
 day.addEventListener('mouseout',this.onClick.bind(this));
 day.addEventListener('mouseleave',this.onClick.bind(this));
 day.addEventListener('mouseover',this.onMouseOverDayDis.bind(this)); 
 day.addEventListener('mousedown',this.onClick.bind(this));

}
})
datesBefore.forEach(d=>{
// console.log(d.toLocaleDateString(),date.toLocaleDateString())

if(date.toLocaleDateString()==d.toLocaleDateString()) {

 const day=event.dayElement;

 day.style.cursor = "default";
 day.classList.add('opacityDay');
 day.addEventListener('pointermove',this.onClick.bind(this));
 day.addEventListener('mousemove',this.onClick.bind(this));
 day.addEventListener('pointerover',this.onClick.bind(this));
 day.addEventListener('pointerenter',this.onClick.bind(this));
 day.addEventListener('mouseenter',this.onClick.bind(this));
 day.addEventListener('pointerout',this.onClick.bind(this));
 day.addEventListener('pointerleave',this.onClick.bind(this));
 day.addEventListener('mouseout',this.onClick.bind(this));
 day.addEventListener('mouseleave',this.onClick.bind(this));
 day.addEventListener('mouseover',this.onMouseOverDayDis.bind(this)); 
 day.addEventListener('mousedown',this.onClick.bind(this));

}
})



}


}
}

onClick(e) {

  e.stopPropagation();
  e.preventDefault();
}


 //
onMouseOverDayDis(e) {
// console.log('on day disable')
// e.target.classList.add('minDateRange');
e.stopPropagation();
e.preventDefault();
}


toSeoUrl(url) {
  return url.toString()               // Convert to string
      .normalize('NFD')               // Change diacritics
      .replace(/[\u0300-\u036f]/g,'') // Remove illegal characters
      .replace(/\s+/g,'-')            // Change whitespace to dashes
      .toLowerCase()                  // Change to lowercase
      .replace(/&/g,'-and-')          // Replace ampersand
      .replace(/[^a-z0-9\-]/g,'')     // Remove anything that is not a letter, number or dash
      .replace(/-+/g,'-')             // Remove duplicate dashes
      .replace(/^-*/,'')              // Remove starting dashes
      .replace(/-*$/,'');             // Remove trailing dashes
}

}
