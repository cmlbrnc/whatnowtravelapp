export interface  HostCartInfo{
  
    id: String;
    userId: String;
    items: [Item];
    total:number;
   

   
}

export interface  Item{
  
  id: String;
  SKU: String;
  name: String;
  description:String;
  price:number;

 
}